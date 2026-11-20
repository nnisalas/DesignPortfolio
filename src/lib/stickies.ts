/**
 * Sticky notes: data model, palette, and persistence.
 *
 * STORAGE IS PER-VISITOR. Notes live in this browser's localStorage and
 * nowhere else -- they are not shared between visitors, do not survive a
 * cleared cache, and never reach the site owner. Making this a real
 * guestbook needs server-side storage; everything above the `loadNotes` /
 * `saveNote` / `deleteNote` boundary is storage-agnostic, so swapping in
 * an API route is a change to this file only.
 */

export type StampId = "blue" | "amber" | "pink" | "green" | "custom";

export type StickyNote = {
  id: string;
  /** key into PALETTE */
  color: string;
  stamp: StampId;
  /** data URI, only when stamp === "custom" */
  customStamp?: string;
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

export const STAMPS: { id: Exclude<StampId, "custom">; src: string; label: string }[] = [
  { id: "blue", src: "/assets/stickies/cup-blue.webp", label: "Blue cat in a teacup" },
  { id: "amber", src: "/assets/stickies/cup-amber.webp", label: "Amber bear in a teacup" },
  { id: "pink", src: "/assets/stickies/cup-pink.webp", label: "Pink bunny in a teacup" },
  { id: "green", src: "/assets/stickies/cup-green.webp", label: "Green bear in a teacup" },
];

export function paletteFor(key: string) {
  return PALETTE.find((p) => p.key === key) ?? PALETTE[0];
}

export function stampSrc(note: StickyNote): string | null {
  if (note.stamp === "custom") return note.customStamp ?? null;
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

const KEY = "nnisalas.stickies.v1";

function isNote(v: unknown): v is StickyNote {
  if (!v || typeof v !== "object") return false;
  const n = v as Record<string, unknown>;
  return (
    typeof n.id === "string" &&
    typeof n.color === "string" &&
    typeof n.stamp === "string" &&
    typeof n.name === "string" &&
    typeof n.message === "string" &&
    typeof n.created === "string"
  );
}

/**
 * Every accessor is wrapped: localStorage throws outright in Safari's
 * private mode and when site data is blocked, and the page has to render
 * either way.
 */
export function loadNotes(): StickyNote[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isNote);
  } catch {
    return [];
  }
}

function persist(notes: StickyNote[]): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(notes));
    return true;
  } catch {
    // Most likely QuotaExceededError from a run of uploaded stamps.
    return false;
  }
}

/** Newest first, so a new note lands next to the "Add a note" tile. */
export function saveNote(note: StickyNote): { notes: StickyNote[]; persisted: boolean } {
  const notes = [note, ...loadNotes()];
  return { notes, persisted: persist(notes) };
}

export function deleteNote(id: string): StickyNote[] {
  const notes = loadNotes().filter((n) => n.id !== id);
  persist(notes);
  return notes;
}

export function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `n_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}

/**
 * Downscale a user-picked image to a small square-ish stamp and return a
 * data URI. Keeps what goes into localStorage to a few KB, and means the
 * file itself is never uploaded anywhere.
 */
export const UPLOAD_MAX_BYTES = 8 * 1024 * 1024;

export async function fileToStamp(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("That file isn't an image.");
  if (file.size > UPLOAD_MAX_BYTES) throw new Error("That image is larger than 8MB.");

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("That image couldn't be read."));
      el.src = url;
    });

    const MAX = 288;
    const scale = Math.min(1, MAX / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("That image couldn't be processed.");
    ctx.drawImage(img, 0, 0, w, h);

    // WebP keeps transparency and is far smaller than PNG; toDataURL falls
    // back to PNG on its own if a browser can't encode WebP.
    return canvas.toDataURL("image/webp", 0.9);
  } finally {
    URL.revokeObjectURL(url);
  }
}
