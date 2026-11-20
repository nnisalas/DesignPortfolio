"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import StickyComposer from "./StickyComposer";
import StickyNoteCard from "./StickyNote";
import {
  fetchNotes,
  ownsNote,
  postNote,
  removeNote,
  type NoteDraft,
  type StickyNote,
} from "@/lib/stickies";

// useLayoutEffect warns when a component is rendered on the server; the
// wall is, even though its contents only arrive on the client.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const EASE = "cubic-bezier(.22,.9,.32,1)";

export default function StickyWall() {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  // ownsNote reads localStorage, so it can't run during the server render.
  const [owned, setOwned] = useState<Set<string>>(new Set());

  const gridRef = useRef<HTMLDivElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);
  /** Where each note sat last commit, for the FLIP below. */
  const prevRects = useRef<Map<string, DOMRect>>(new Map());
  /** The dialog's rect at submit time, so the note can grow out of it. */
  const originRect = useRef<DOMRect | null>(null);
  const enteringId = useRef<string | null>(null);

  /**
   * Read live rather than captured at open time: the dialog collapses back
   * into wherever the tile is NOW, which is not where it was if the window
   * was resized while the dialog was up. Stable identity so the composer's
   * animation effect doesn't re-run on every render.
   */
  const getAddTileRect = useCallback(
    () => addBtnRef.current?.getBoundingClientRect() ?? null,
    []
  );

  const syncOwned = useCallback((list: StickyNote[]) => {
    setOwned(new Set(list.filter((n) => ownsNote(n.id)).map((n) => n.id)));
  }, []);

  // Stable, so the composer's enter/exit effects don't re-run each render.
  const closeComposer = useCallback(() => setOpen(false), []);

  useEffect(() => {
    let live = true;
    fetchNotes()
      .then((list) => {
        if (!live) return;
        setNotes(list);
        syncOwned(list);
        setStatus("ready");
      })
      .catch(() => {
        if (live) setStatus("error");
      });
    return () => {
      live = false;
    };
  }, [syncOwned]);

  /**
   * FLIP. Every note's position is recorded each commit; on the next one
   * anything that moved is animated from where it was to where it now is,
   * so inserting a note slides the whole wall across rather than snapping.
   * A brand new note instead grows out of the dialog that made it --
   * same first/last/invert/play, with the dialog's rect as "first".
   */
  useIsoLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = new Map<string, DOMRect>();

    grid.querySelectorAll<HTMLElement>("[data-sticky-id]").forEach((el) => {
      const id = el.dataset.stickyId;
      if (!id) return;
      const rect = el.getBoundingClientRect();
      next.set(id, rect);
      if (reduce || !rect.width) return;

      const prev = prevRects.current.get(id);

      if (prev) {
        const dx = prev.left - rect.left;
        const dy = prev.top - rect.top;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          el.animate(
            [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
            { duration: 420, easing: EASE }
          );
        }
        return;
      }

      if (id !== enteringId.current) return;

      const from = originRect.current;
      if (from && from.width) {
        el.animate(
          [
            {
              // FLIP's translate is computed from the top-left corners, so
              // the scale has to pivot there too. At the default 50% 50%
              // the element lands offset from the rect it is meant to grow
              // out of.
              transformOrigin: "top left",
              transform: `translate(${from.left - rect.left}px, ${from.top - rect.top}px) scale(${from.width / rect.width}, ${from.height / rect.height})`,
              opacity: 0.25,
              borderRadius: "14px",
            },
            { transformOrigin: "top left", transform: "none", opacity: 1, borderRadius: "2px" },
          ],
          { duration: 520, easing: EASE }
        );
      } else {
        el.animate(
          [{ transform: "scale(.86)", opacity: 0 }, { transform: "none", opacity: 1 }],
          { duration: 380, easing: EASE }
        );
      }
    });

    prevRects.current = next;
    enteringId.current = null;
    originRect.current = null;
  }, [notes]);

  /** Throws so the dialog can keep itself open and show the reason. */
  const add = async (draft: NoteDraft, panelRect: DOMRect | null) => {
    const saved = await postNote(draft);
    originRect.current = panelRect;
    enteringId.current = saved.id;
    setNotes((cur) => [saved, ...cur]);
    setOwned((cur) => new Set(cur).add(saved.id));
    setError(null);
  };

  /** Plays the note out before dropping it, so the reflow has something to follow. */
  const remove = async (id: string) => {
    const el = gridRef.current?.querySelector<HTMLElement>(`[data-sticky-id="${CSS.escape(id)}"]`);
    try {
      await removeNote(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete that note.");
      return;
    }
    if (el && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      await el.animate(
        [{ transform: "none", opacity: 1 }, { transform: "scale(.82)", opacity: 0 }],
        { duration: 240, easing: "ease-in", fill: "forwards" }
      ).finished.catch(() => {});
    }
    prevRects.current.delete(id);
    setNotes((cur) => cur.filter((n) => n.id !== id));
    setOwned((cur) => {
      const s = new Set(cur);
      s.delete(id);
      return s;
    });
  };

  return (
    <>
      <div className="sticky-grid" ref={gridRef}>
        <button ref={addBtnRef} type="button" className="sticky-add" onClick={() => setOpen(true)}>
          <span className="t-body">Add a Note!</span>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>

        {notes.map((n) => (
          <StickyNoteCard key={n.id} note={n} canDelete={owned.has(n.id)} onDelete={remove} />
        ))}
      </div>

      {status === "ready" && notes.length === 0 ? (
        <p className="sticky-empty t-body">No notes yet — yours would be the first!</p>
      ) : null}
      {status === "error" ? (
        <p className="sticky-warning t-label" role="status">
          The wall couldn&apos;t be loaded just now. Please try again in a moment.
        </p>
      ) : null}
      {error ? (
        <p className="sticky-warning t-label" role="status">
          {error}
        </p>
      ) : null}

      <StickyComposer
        open={open}
        onClose={closeComposer}
        onSubmit={add}
        getOriginRect={getAddTileRect}
      />
    </>
  );
}
