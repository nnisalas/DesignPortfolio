/**
 * SERVER-SIDE sticky storage. Never import this from a client component.
 *
 * Speaks the Redis wire protocol over TCP via ioredis, driven by
 * REDIS_URL. This started out as plain fetch against Upstash's REST API
 * so the project would gain no dependency, but the Redis store Vercel
 * actually provisions injects only REDIS_URL -- a rediss:// connection
 * string -- and no REST credentials, so there was nothing for fetch to
 * talk to. A connection string needs a real client.
 *
 * With no Redis configured it falls back to a JSON file under .next/cache
 * so `npm run dev` works before anything is provisioned. That fallback is
 * refused in production (see isConfigured, enforced in the POST route):
 * on Vercel the filesystem is read-only and per-instance, so it would
 * silently lose notes.
 */
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import Redis from "ioredis";

export type StoredNote = {
  id: string;
  color: string;
  stamp: string;
  name: string;
  message: string;
  created: string;
};

/**
 * The only stamps a note may carry. Visitor-uploaded pictures were
 * dropped on purpose: this endpoint is public and unauthenticated, and a
 * well-formed image can still be something the site owner would never
 * publish under their own name. Keeping the set closed means nothing
 * arbitrary can be stored or served from here at all.
 */
const ALLOWED_STAMPS = ["blue", "amber", "pink", "green"] as const;

/** What a visitor is allowed to send. */
export const LIMITS = {
  name: 18,
  message: 90,
  /** Oldest notes fall off the end of the list beyond this. */
  maxNotes: 500,
  /** Per IP, per window. */
  rateLimit: 5,
  rateWindowSec: 600,
} as const;

const KEY = "stickies:v1";
const OWNER_KEY = "stickies:owner:v1";

/** Whatever the connected store called it. rediss:// implies TLS. */
function redisUrl(): string | null {
  return (
    process.env.REDIS_URL ??
    process.env.KV_URL ??
    process.env.UPSTASH_REDIS_URL ??
    null
  );
}

export function isConfigured(): boolean {
  return redisUrl() !== null || process.env.NODE_ENV !== "production";
}

export function isShared(): boolean {
  return redisUrl() !== null;
}

/**
 * One client per warm lambda. ioredis reconnects on its own, so this is
 * reused across invocations rather than dialled per request.
 */
let client: Redis | null = null;

function redis(): Redis {
  if (client) return client;
  const url = redisUrl();
  if (!url) throw new Error("redis not configured");
  client = new Redis(url, {
    // A guestbook must never hold a request open waiting on a dead
    // socket; better to fail fast and let the route return its error.
    connectTimeout: 5_000,
    commandTimeout: 5_000,
    maxRetriesPerRequest: 2,
  });
  // Without a listener ioredis treats a connection error as an unhandled
  // 'error' event and takes the process down with it.
  client.on("error", (e: Error) => console.error("[stickies] redis:", e.message));
  return client;
}

/* ---------- dev-only file fallback ---------- */

const devFile = path.join(process.cwd(), ".next", "cache", "stickies-dev.json");

type DevShape = { notes: StoredNote[]; owners: Record<string, string> };

async function devRead(): Promise<DevShape> {
  try {
    return JSON.parse(await fs.readFile(devFile, "utf8")) as DevShape;
  } catch {
    return { notes: [], owners: {} };
  }
}

async function devWrite(data: DevShape): Promise<void> {
  await fs.mkdir(path.dirname(devFile), { recursive: true });
  await fs.writeFile(devFile, JSON.stringify(data), "utf8");
}

/* ---------- public API ---------- */

export async function listNotes(): Promise<StoredNote[]> {
  if (!redisUrl()) return (await devRead()).notes;
  const raw = await redis().lrange(KEY, 0, LIMITS.maxNotes - 1);
  const out: StoredNote[] = [];
  for (const s of raw ?? []) {
    try {
      out.push(JSON.parse(s) as StoredNote);
    } catch {
      // A single malformed entry shouldn't take down the whole wall.
    }
  }
  return out;
}

/**
 * Returns an owner token. The client keeps it so the person who wrote a
 * note can delete it again; without it, a public DELETE endpoint would let
 * anybody wipe the wall.
 */
export async function addNote(note: StoredNote): Promise<string> {
  const ownerToken = crypto.randomBytes(16).toString("hex");
  const ownerHash = hashToken(ownerToken);

  if (!redisUrl()) {
    const data = await devRead();
    data.notes.unshift(note);
    data.notes = data.notes.slice(0, LIMITS.maxNotes);
    data.owners[note.id] = ownerHash;
    await devWrite(data);
    return ownerToken;
  }

  // One round trip instead of three.
  await execAll(
    redis()
      .multi()
      .lpush(KEY, JSON.stringify(note))
      .ltrim(KEY, 0, LIMITS.maxNotes - 1)
      .hset(OWNER_KEY, note.id, ownerHash)
  );
  return ownerToken;
}

/**
 * exec() RESOLVES even when a queued command failed -- the per-command
 * error is buried in the reply tuples. Left unchecked, a write that never
 * landed would still return 201 and the note would vanish on the next
 * read, so the errors are surfaced here.
 */
async function execAll(pipeline: ReturnType<Redis["multi"]>): Promise<void> {
  const replies = await pipeline.exec();
  if (!replies) throw new Error("redis transaction aborted");
  for (const [err] of replies) {
    if (err) throw err;
  }
}

export async function deleteNote(id: string, ownerToken: string | null, isAdmin: boolean): Promise<boolean> {
  if (!redisUrl()) {
    const data = await devRead();
    const stored = data.owners[id];
    if (!isAdmin && (!ownerToken || !stored || !safeEqual(stored, hashToken(ownerToken)))) return false;
    const before = data.notes.length;
    data.notes = data.notes.filter((n) => n.id !== id);
    delete data.owners[id];
    await devWrite(data);
    return data.notes.length < before;
  }

  if (!isAdmin) {
    const stored = await redis().hget(OWNER_KEY, id);
    if (!ownerToken || !stored || !safeEqual(stored, hashToken(ownerToken))) return false;
  }

  // Redis lists have no delete-by-field, so the matching element is found
  // and removed by value.
  const raw = await redis().lrange(KEY, 0, LIMITS.maxNotes - 1);
  const match = (raw ?? []).find((s) => {
    try {
      return (JSON.parse(s) as StoredNote).id === id;
    } catch {
      return false;
    }
  });
  if (!match) return false;
  await execAll(redis().multi().lrem(KEY, 1, match).hdel(OWNER_KEY, id));
  return true;
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Does this request carry the site owner's admin token?
 *
 * Both sides are hashed before comparing: it makes them a fixed equal
 * length (so timingSafeEqual can't throw, and the comparison leaks
 * nothing about the real token's length) and keeps the compare constant
 * time. Returns false when no admin token is configured at all, so an
 * absent env var can never be matched by an absent header.
 */
export function isAdminRequest(req: Request): boolean {
  const admin = process.env.STICKIES_ADMIN_TOKEN;
  if (!admin) return false;
  const header = req.headers.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return false;
  const bearer = header.slice(7).trim();
  if (!bearer) return false;
  return safeEqual(hashToken(bearer), hashToken(admin));
}

export function adminConfigured(): boolean {
  return Boolean(process.env.STICKIES_ADMIN_TOKEN);
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/**
 * Fixed-window counter per IP. Crude, but this is a guestbook, and the
 * alternative is an unauthenticated public write endpoint with no ceiling.
 * Fails OPEN: a Redis blip shouldn't stop people leaving notes.
 */
export async function rateLimitOk(ip: string): Promise<boolean> {
  if (!redisUrl()) return true;
  try {
    const key = `stickies:rl:${ip}`;
    const n = await redis().incr(key);
    if (n === 1) await redis().expire(key, LIMITS.rateWindowSec);
    return n <= LIMITS.rateLimit;
  } catch {
    return true;
  }
}

/** Trims and validates whatever arrived over the wire. */
export function sanitise(body: unknown): { ok: true; note: StoredNote } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Bad request." };
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim().slice(0, LIMITS.name) : "";
  const message = typeof b.message === "string" ? b.message.trim().slice(0, LIMITS.message) : "";
  if (!name || !message) return { ok: false, error: "Add your name and a short message." };

  const color = typeof b.color === "string" ? b.color : "white";
  if (!/^[a-z]{3,10}$/.test(color)) return { ok: false, error: "Bad request." };

  const stamp = typeof b.stamp === "string" ? b.stamp : "blue";
  if (!(ALLOWED_STAMPS as readonly string[]).includes(stamp)) {
    return { ok: false, error: "Bad request." };
  }

  return {
    ok: true,
    note: {
      id: crypto.randomUUID(),
      color,
      stamp,
      name,
      message,
      created: new Date().toISOString(),
    },
  };
}
