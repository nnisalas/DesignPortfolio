"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  MESSAGE_MAX,
  NAME_MAX,
  PALETTE,
  STAMPS,
  fileToStamp,
  type NoteDraft,
  type StampId,
} from "@/lib/stickies";

const EASE = "cubic-bezier(.22,.9,.32,1)";

// useLayoutEffect warns when a component is rendered on the server.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The "Add a Note" overlay.
 *
 * Dialog behaviour is hand-rolled rather than <dialog>: the page needs the
 * backdrop, the scroll lock and the focus trap to behave identically in
 * Safari, where <dialog>'s ::backdrop and focus handling still differ --
 * and <dialog> would make the open/close morph below much harder to drive.
 *
 * Opening and closing are FLIPped against the "Add a Note!" tile, so the
 * tile appears to expand into the dialog and collapse back into it. The
 * one exception is closing after a successful post: there the wall is
 * already growing the new note out of this panel's rect, so the panel
 * cross-dissolves instead of travelling somewhere the eye isn't going.
 */
export default function StickyComposer({
  open,
  onClose,
  onSubmit,
  getOriginRect,
}: {
  open: boolean;
  onClose: () => void;
  /** Rejects with a message to show; the dialog stays open on failure. */
  onSubmit: (draft: NoteDraft, panelRect: DOMRect | null) => Promise<void>;
  /** Live rect of the tile this dialog grows out of. Must be stable. */
  getOriginRect?: () => DOMRect | null;
}) {
  const [color, setColor] = useState<string>(PALETTE[7].key); // purple, as in the design
  const [stamp, setStamp] = useState<StampId>("blue");
  const [customStamp, setCustomStamp] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLButtonElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  // So focus goes back where it came from when the dialog closes.
  const openerRef = useRef<Element | null>(null);
  // Guards against a second close being started while one is playing.
  const closingRef = useRef(false);

  const reset = useCallback(() => {
    setColor(PALETTE[7].key);
    setStamp("blue");
    setCustomStamp(undefined);
    setName("");
    setMessage("");
    setError(null);
    setSaving(false);
  }, []);

  /** Grow out of the tile. */
  useIsoLayoutEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;

    closingRef.current = false;
    const reduce = prefersReducedMotion();
    backdrop.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: reduce ? 120 : 260,
      easing: EASE,
    });

    const from = reduce ? null : getOriginRect?.();
    const to = panel.getBoundingClientRect();

    if (from && from.width && to.width) {
      panel.animate(
        [
          {
            transformOrigin: "top left",
            transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
            borderRadius: "2px",
            opacity: 0.6,
          },
          { transformOrigin: "top left", transform: "none", borderRadius: "14px", opacity: 1 },
        ],
        { duration: 420, easing: EASE }
      );
      // Held back, then faded in. The panel is being scaled from roughly
      // 0.65x/0.54x, which squashes its text; by the time the content is
      // visible the distortion has mostly resolved.
      formRef.current?.animate(
        [
          { opacity: 0, offset: 0 },
          { opacity: 0, offset: 0.38 },
          { opacity: 1, offset: 1 },
        ],
        { duration: 420, easing: "ease-out" }
      );
    } else {
      panel.animate(
        [{ opacity: 0, transform: "scale(.97)" }, { opacity: 1, transform: "none" }],
        { duration: reduce ? 120 : 220, easing: EASE }
      );
    }
  }, [open, getOriginRect]);

  /**
   * "morph" collapses back into the tile; "handoff" is the post path,
   * where the wall is already growing the note out of this rect.
   */
  const playExit = useCallback(
    async (mode: "morph" | "handoff") => {
      const panel = panelRef.current;
      const backdrop = backdropRef.current;
      if (!panel || !backdrop) return;
      const reduce = prefersReducedMotion();

      if (reduce) {
        await backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 100, fill: "forwards" })
          .finished.catch(() => {});
        return;
      }

      const dur = mode === "handoff" ? 200 : 320;
      backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, easing: "ease-in", fill: "forwards" });

      const to = mode === "morph" ? getOriginRect?.() : null;
      const from = panel.getBoundingClientRect();

      if (to && to.width && from.width) {
        formRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 150,
          easing: "ease-in",
          fill: "forwards",
        });
        await panel.animate(
          [
            { transformOrigin: "top left", transform: "none", borderRadius: "14px", opacity: 1 },
            {
              transformOrigin: "top left",
              transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width}, ${to.height / from.height})`,
              borderRadius: "2px",
              opacity: 0.4,
            },
          ],
          { duration: dur, easing: EASE, fill: "forwards" }
        ).finished.catch(() => {});
        return;
      }

      await panel.animate(
        [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.97)" }],
        { duration: dur, easing: "ease-in", fill: "forwards" }
      ).finished.catch(() => {});
    },
    [getOriginRect]
  );

  /** Every dismissal goes through here so the exit always plays. */
  const requestClose = useCallback(async () => {
    if (saving || closingRef.current) return;
    closingRef.current = true;
    await playExit("morph");
    closingRef.current = false;
    onClose();
  }, [saving, playExit, onClose]);

  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus the first control rather than the panel, so a keyboard user
    // lands somewhere they can act.
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 30);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      const opener = openerRef.current;
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [open]);

  // Escape to close, Tab cycles inside the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        // requestClose already refuses while a note is in flight.
        void requestClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, requestClose]);

  if (!open) return null;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      const dataUri = await fileToStamp(file);
      setCustomStamp(dataUri);
      setStamp("custom");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That image couldn't be used.");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const n = name.trim();
    const m = message.trim();
    if (!n || !m) {
      setError("Add your name and a short message.");
      return;
    }
    // Measured BEFORE the dialog unmounts: the wall animates the new note
    // out of this rect, so the panel appears to become the note.
    const panelRect = panelRef.current?.getBoundingClientRect() ?? null;
    setSaving(true);
    setError(null);
    try {
      await onSubmit(
        {
          color,
          stamp,
          customStamp: stamp === "custom" ? customStamp : undefined,
          name: n.slice(0, NAME_MAX),
          message: m.slice(0, MESSAGE_MAX),
        },
        panelRect
      );
      // The wall is already growing the note out of panelRect, so this
      // cross-dissolves over the top of it rather than morphing away.
      closingRef.current = true;
      await playExit("handoff");
      closingRef.current = false;
      reset();
      onClose();
    } catch (err) {
      setSaving(false);
      setError(err instanceof Error ? err.message : "Couldn't save your note.");
    }
  };

  return (
    <div
      ref={backdropRef}
      className="sc-backdrop"
      // Only a click that both starts and ends on the backdrop closes, so
      // a drag that began inside the panel doesn't dismiss it.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) void requestClose();
      }}
    >
      <div
        ref={panelRef}
        className="sc-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sc-title"
      >
        <form ref={formRef} onSubmit={submit}>
          <div className="sc-head">
            <h2 id="sc-title" className="t-headline" style={{ margin: 0 }}>
              Add a Note
            </h2>
            <button type="button" className="sc-close" onClick={() => void requestClose()} aria-label="Close" disabled={saving}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <fieldset className="sc-field">
            <legend className="t-sub sc-legend">Choose a Color!</legend>
            <div className="sc-swatches">
              {PALETTE.map((p, i) => (
                <button
                  key={p.key}
                  ref={i === 0 ? firstFieldRef : undefined}
                  type="button"
                  className={`sc-swatch${color === p.key ? " is-on" : ""}`}
                  style={{ background: p.fill, borderColor: p.ring }}
                  onClick={() => setColor(p.key)}
                  aria-pressed={color === p.key}
                  aria-label={p.key}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="sc-field">
            <legend className="t-sub sc-legend">Add a Stamp!</legend>
            <div className="sc-stamps">
              {STAMPS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`sc-stamp${stamp === s.id ? " is-on" : ""}`}
                  onClick={() => setStamp(s.id)}
                  aria-pressed={stamp === s.id}
                  aria-label={s.label}
                >
                  <img src={s.src} alt="" aria-hidden="true" draggable={false} />
                </button>
              ))}

              {/* Upload-your-own. The image is downscaled and kept in this
                  browser; nothing is sent anywhere. */}
              <button
                type="button"
                className={`sc-stamp sc-stamp-upload${stamp === "custom" ? " is-on" : ""}`}
                onClick={() => (customStamp ? setStamp("custom") : fileRef.current?.click())}
                aria-pressed={stamp === "custom"}
                aria-label={customStamp ? "Use your uploaded picture" : "Upload your own picture"}
              >
                {customStamp ? (
                  <img src={customStamp} alt="" aria-hidden="true" draggable={false} />
                ) : (
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  void handleFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </div>
            {customStamp ? (
              <button type="button" className="sc-replace t-label" onClick={() => fileRef.current?.click()}>
                Replace picture
              </button>
            ) : null}
          </fieldset>

          <label className="sc-sr" htmlFor="sc-name">Your name</label>
          <input
            id="sc-name"
            className="sc-input t-body"
            placeholder="Your name"
            value={name}
            maxLength={NAME_MAX}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="sc-sr" htmlFor="sc-msg">Your message</label>
          <textarea
            id="sc-msg"
            className="sc-input sc-textarea t-body"
            placeholder="Write a short message…"
            value={message}
            maxLength={MESSAGE_MAX}
            rows={3}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="sc-count t-label" aria-live="polite">
            {message.length}/{MESSAGE_MAX}
          </p>

          {error ? (
            <p className="sc-error t-label" role="alert">
              {error}
            </p>
          ) : null}

          <div className="sc-actions">
            <button type="button" className="sc-btn sc-btn-ghost t-label" onClick={() => void requestClose()} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="sc-btn sc-btn-primary t-label" disabled={saving}>
              {saving ? "Posting…" : "Post note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
