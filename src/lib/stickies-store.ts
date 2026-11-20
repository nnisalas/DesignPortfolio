/**
 * SERVER-SIDE sticky storage. Never import this from a client component.
 *
 * Backed by Redis over Upstash's REST API, reached with plain fetch so the
 * project gains no dependency. Vercel KV was retired as a first-party
 * product and Redis now comes from the Vercel Marketplace (Upstash), which
 * injects either the legacy KV_REST_API_* names or the UPSTASH_REDIS_REST_*
 * ones depending on when the store was created -- both are accepted.
 *
 * With no Redis configured it falls back to a JSON file under .next/cache
 * so `npm run dev` works before anything is provisioned. That fallback is
 * refused in production: on Vercel the filesystem is read-only and
 * per-instance, so it would silently lose notes.
 */
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

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

function redisConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

export function isConfigured(): boolean {
  return redisConfig() !== null || process.env.NODE_ENV !== "production";
}

export function isShared(): boolean {
  return redisConfig() !== null;
}

async function redis<T = unknown>(command: (string | number)[]): Promise<T> {
  const cfg = redisConfig();
  if (!cfg) throw new Error("redis not configured");
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command.map(String)),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`redis ${command[0]} failed: ${res.status}`);
  }
  const json = (await res.json()) as { result?: T; error?: string };
  if (json.error) throw new Error(`redis ${command[0]}: ${json.error}`);
  return json.result as T;
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
  if (!redisConfig()) return (await devRead()).notes;
  const raw = await redis<string[]>(["LRANGE", KEY, 0, LIMITS.maxNotes - 1]);
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

  if (!redisConfig()) {
    const data = await devRead();
    data.notes.unshift(note);
    data.notes = data.notes.slice(0, LIMITS.maxNotes);
    data.owners[note.id] = ownerHash;
    await devWrite(data);
    return ownerToken;
  }

  await redis(["LPUSH", KEY, JSON.stringify(note)]);
  await redis(["LTRIM", KEY, 0, LIMITS.maxNotes - 1]);
  await redis(["HSET", OWNER_KEY, note.id, ownerHash]);
  return ownerToken;
}

export async function deleteNote(id: string, ownerToken: string | null, isAdmin: boolean): Promise<boolean> {
  if (!redisConfig()) {
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
    const stored = await redis<string | null>(["HGET", OWNER_KEY, id]);
    if (!ownerToken || !stored || !safeEqual(stored, hashToken(ownerToken))) return false;
  }

  // Redis lists have no delete-by-field, so the matching element is found
  // and removed by value.
  const raw = await redis<string[]>(["LRANGE", KEY, 0, LIMITS.maxNotes - 1]);
  const match = (raw ?? []).find((s) => {
    try {
      return (JSON.parse(s) as StoredNote).id === id;
    } catch {
      return false;
    }
  });
  if (!match) return false;
  await redis(["LREM", KEY, 1, match]);
  await redis(["HDEL", OWNER_KEY, id]);
  return true;
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
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
  if (!redisConfig()) return true;
  try {
    const key = `stickies:rl:${ip}`;
    const n = await redis<number>(["INCR", key]);
    if (n === 1) await redis(["EXPIRE", key, LIMITS.rateWindowSec]);
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
