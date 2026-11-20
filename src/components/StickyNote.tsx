"use client";

import { formatDate, paletteFor, stampSrc, type StickyNote as Note } from "@/lib/stickies";

/**
 * One note. Square by construction (aspect-ratio 1) and laid out as a
 * column: date, message, stamp in the slack, name pinned to the bottom.
 * The message region is the only thing allowed to grow, and it is
 * line-clamped -- together with MESSAGE_MAX on the input that is the
 * "must not exceed the note" guarantee, held from both ends.
 */
export default function StickyNote({ note, onDelete }: { note: Note; onDelete?: (id: string) => void }) {
  const pal = paletteFor(note.color);
  const stamp = stampSrc(note);

  return (
    <figure
      className="sticky-note"
      style={{ background: pal.fill, borderColor: pal.ring }}
    >
      <p className="sticky-date t-label">{formatDate(note.created)}</p>

      <p className="sticky-message t-body">{note.message}</p>

      <div className="sticky-stamp-slot">
        {stamp ? (
          <img
            src={stamp}
            alt=""
            aria-hidden="true"
            className="sticky-stamp"
            draggable={false}
          />
        ) : null}
      </div>

      <figcaption className="sticky-name t-body">{note.name}</figcaption>

      {onDelete ? (
        <button
          type="button"
          className="sticky-delete"
          onClick={() => onDelete(note.id)}
          aria-label={`Delete the note from ${note.name}`}
          title="Delete this note"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      ) : null}
    </figure>
  );
}
