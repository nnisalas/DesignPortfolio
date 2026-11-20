/**
 * Sticky notes: data model, palette, and the client half of persistence.
 *
 * Notes are SHARED -- they live server-side (see stickies-store.ts) and
 * everyone sees the same wall. The only thing kept in this browser is the
 * set of owner tokens handed back at creation, which is what lets someone
 * delete a note they wrote without being able to touch anyone else's.
 */

/**
 * The four cups, and only the four cups. Visitor-uploaded pictures were
 * dropped deliberately: on a wall this shared, an upload is arbitrary
 * third-party imagery published under the site owner's name with no
 * review step, and no validation can judge the content of a file that is
 * a perfectly well-formed image.
 */
export type StampId = "blue" | "amber" | "pink" | "green";

export type StickyNote = {
  id: string;
  /** key into PALETTE */
  color: string;
  stamp: StampId;
  name: string;
  message: string;
  /** ISO timestamp; rendered as MM-DD-YY */
  created: string;
};

/**
 * Taken from the picker artwork (Frame 2147242465.svg): each swatch is a
 * filled circle with a darker ring, and a note reuses the same pair as its
 * background and border.
 */
export const PALETTE = [
  { key: "white", fill: "#FFFFFF", ring: "#E5E5E5" },
  { key: "gray", fill: "#E6E6E6", ring: "#CFCFCF" },
  { key: "coral", fill: "#FFB0A3", ring: "#E69E92" },
  { key: "yellow", fill: "#F9F6B7", ring: "#E5DF76" },
  { key: "green", fill: "#AFEE9A", ring: "#53C953" },
  { key: "teal", fill: "#B3F4F0", ring: "#57BDB7" },
  { key: "blue", fill: "#A8DAFF", ring: "#63A9DC" },
  { key: "purple", fill: "#E6BBFC", ring: "#AE60D5" },
  { key: "pink", fill: "#FEC0F8", ring: "#E862EA" },
] as const;

export const STAMPS: { id: StampId; src: string; label: string }[] = [
  { id: "blue", src: "/assets/stickies/cup-blue.webp", label: "Blue cat in a teacup" },
  { id: "amber", src: "/assets/stickies/cup-amber.webp", label: "Amber bear in a teacup" },
  { id: "pink", src: "/assets/stickies/cup-pink.webp", label: "Pink bunny in a teacup" },
  { id: "green", src: "/assets/stickies/cup-green.webp", label: "Green bear in a teacup" },
];

export function paletteFor(key: string) {
  return PALETTE.find((p) => p.key === key) ?? PALETTE[0];
}

/** null for anything unrecognised, so an old note just renders stampless. */
export function stampSrc(note: StickyNote): string | null {
  return STAMPS.find((s) => s.id === note.stamp)?.src ?? null;
}

/** Caps, enforced on input AND clamped in CSS so neither can overflow. */
export const NAME_MAX = 18;
export const MESSAGE_MAX = 90;

/** MM-DD-YY, matching the design. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(d.getFullYear() % 100)}`;
}

/** What the composer hands up; the server assigns id and timestamp. */
export type NoteDraft = Pick<StickyNote, "color" | "stamp" | "name" | "message">;

/* ---------- owner tokens (the only thing stored locally) ---------- */

const OWNER_KEY = "nnisalas.stickies.owners.v1";

/** Wrapped: localStorage throws outright in private mode / blocked data. */
function readOwners(): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(OWNER_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeOwners(map: Record<string, string>): void {
  try {
    window.localStorage.setItem(OWNER_KEY, JSON.stringify(map));
  } catch {
    // Losing the token only costs the ability to delete; the note is safe.
  }
}

export function ownsNote(id: string): boolean {
  return Boolean(readOwners()[id]);
}

function rememberOwner(id: string, token: string): void {
  const map = readOwners();
  map[id] = token;
  writeOwners(map);
}

function forgetOwner(id: string): void {
  const map = readOwners();
  delete map[id];
  writeOwners(map);
}

/* ---------- the wall ---------- */

export async function fetchNotes(): Promise<StickyNote[]> {
  const res = await fetch("/api/stickies", { cache: "no-store" });
  if (!res.ok) throw new Error("Couldn't load the wall.");
  const data = (await res.json()) as { notes?: StickyNote[] };
  return data.notes ?? [];
}

export async function postNote(draft: NoteDraft): Promise<StickyNote> {
  const res = await fetch("/api/stickies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });
  const data = (await res.json()) as { note?: StickyNote; ownerToken?: string; error?: string };
  if (!res.ok || !data.note) throw new Error(data.error ?? "Couldn't save your note.");
  if (data.ownerToken) rememberOwner(data.note.id, data.ownerToken);
  return data.note;
}

export async function removeNote(id: string): Promise<void> {
  const token = readOwners()[id];
  const res = await fetch(`/api/stickies/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: token ? { "x-owner-token": token } : undefined,
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Couldn't delete that note.");
  }
  forgetOwner(id);
}
