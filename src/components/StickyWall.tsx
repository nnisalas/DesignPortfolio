"use client";

import { useEffect, useState } from "react";
import StickyComposer from "./StickyComposer";
import StickyNoteCard from "./StickyNote";
import { deleteNote, loadNotes, saveNote, type StickyNote } from "@/lib/stickies";

export default function StickyWall() {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [open, setOpen] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  // Notes come from localStorage, which does not exist during the server
  // render -- so the first client render has to match the server's empty
  // list, and the real list arrives in an effect. Rendering them straight
  // away would be a hydration mismatch.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setNotes(loadNotes());
    setReady(true);
  }, []);

  const add = (note: StickyNote) => {
    const { notes: next, persisted } = saveNote(note);
    setNotes(next);
    setWarning(
      persisted
        ? null
        : "This note is on screen but couldn't be saved — your browser's storage for this site is full or blocked."
    );
  };

  const remove = (id: string) => setNotes(deleteNote(id));

  return (
    <>
      <div className="sticky-grid">
        <button type="button" className="sticky-add" onClick={() => setOpen(true)}>
          <span className="t-body">Add a Note!</span>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>

        {ready
          ? notes.map((n) => <StickyNoteCard key={n.id} note={n} onDelete={remove} />)
          : null}
      </div>

      {ready && notes.length === 0 ? (
        <p className="sticky-empty t-body">No notes yet — yours would be the first!</p>
      ) : null}

      {warning ? (
        <p className="sticky-warning t-label" role="status">
          {warning}
        </p>
      ) : null}

      <StickyComposer open={open} onClose={() => setOpen(false)} onSubmit={add} />
    </>
  );
}
