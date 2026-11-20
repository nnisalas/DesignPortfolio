"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MESSAGE_MAX,
  NAME_MAX,
  PALETTE,
  STAMPS,
  fileToStamp,
  type NoteDraft,
  type StampId,
} from "@/lib/stickies";

/**
 * The "Add a Note" overlay.
 *
 * Dialog behaviour is hand-rolled rather than <dialog>: the page needs the
 * backdrop, the scroll lock and the focus trap to behave identically in
 * Safari, where <dialog>'s ::backdrop and focus handling still differ.
 */
export default function StickyComposer({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  /** Rejects with a message to show; the dialog stays open on failure. */
  onSubmit: (draft: NoteDraft, panelRect: DOMRect | null) => Promise<void>;
}) {
  const [color, setColor] = useState<string>(PALETTE[7].key); // purple, as in the design
  const [stamp, setStamp] = useState<StampId>("blue");
  const [customStamp, setCustomStamp] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLButtonElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  // So focus goes back where it came from when the dialog closes.
  const openerRef = useRef<Element | null>(null);

  const reset = useCallback(() => {
    setColor(PALETTE[7].key);
    setStamp("blue");
    setCustomStamp(undefined);
    setName("");
    setMessage("");
    setError(null);
    setSaving(false);
  }, []);

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
        // Not while a note is in flight -- closing would leave the caller
        // resolving into a dialog that no longer exists.
        if (!saving) onClose();
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
    // `saving` is a dependency, not just a read: without it the handler
    // closes over a stale value and Escape would still close mid-save.
  }, [open, onClose, saving]);

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
      reset();
      onClose();
    } catch (err) {
      setSaving(false);
      setError(err instanceof Error ? err.message : "Couldn't save your note.");
    }
  };

  return (
    <div
      className="sc-backdrop"
      // Only a click that both starts and ends on the backdrop closes, so
      // a drag that began inside the panel doesn't dismiss it.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="sc-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sc-title"
      >
        <form onSubmit={submit}>
          <div className="sc-head">
            <h2 id="sc-title" className="t-headline" style={{ margin: 0 }}>
              Add a Note
            </h2>
            <button type="button" className="sc-close" onClick={onClose} aria-label="Close" disabled={saving}>
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
            <button type="button" className="sc-btn sc-btn-ghost t-label" onClick={onClose} disabled={saving}>
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
