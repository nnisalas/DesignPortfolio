"use client";

/* HakoBot — the chat panel that slides in from the right and pushes the
   page over rather than covering it.

   The push is done with a single custom property, --hb-inset, toggled by
   the `hb-open` class on <html> (see globals.css). Everything in normal
   flow follows it via body's margin-right; the handful of position:fixed
   elements on the site read the same variable for their own `right`.
   A transform on a page wrapper would have been simpler but would make
   the sticky headers stop sticking, since a transformed ancestor becomes
   the containing block for fixed descendants.

   All of the copy lives in src/content/hakobot.ts. */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DESIGN,
  NATHAN,
  FALLBACK,
  WELCOME,
  findAnswer,
  suggestions,
  type Entry,
} from "@/content/hakobot";

type TabKey = "design" | "nathan";
type Msg = { key: number; role: "user" | "bot"; text: string[]; fallback?: boolean };

const TABS: { key: TabKey; label: string }[] = [
  { key: "design", label: "About Design" },
  { key: "nathan", label: "About Nathan" },
];

/* The four brand pixel clusters, in the order the mockup lays them out.
   Using the real assets rather than re-drawing them in CSS keeps the
   colours exact — px-blue is deliberately only 71% opaque, which is why
   it reads a touch softer than the other three. */
const PIXELS = [
  { src: "/assets/px-orange.webp", name: "orange" },
  { src: "/assets/px-blue.webp", name: "blue" },
  { src: "/assets/px-green.webp", name: "green" },
  { src: "/assets/px-yellow.webp", name: "yellow" },
];

/* Long enough to read as "he's typing", short enough not to feel broken.
   Randomised so repeated questions don't feel mechanical. */
const THINK_MIN = 850;
const THINK_MAX = 1400;

/* The reply types itself in. Per-character pace, but with a hard ceiling:
   the longest answer in the bank is ~450 characters, which at a natural
   typing speed would run past four seconds and stop being charming. The
   cap means short answers feel quick and long ones still land in 1.5s. */
const MS_PER_CHAR = 7;
const TYPE_MIN = 420;
const TYPE_MAX = 1500;

/** The first `n` characters of a multi-paragraph answer, paragraphs kept. */
function sliceParagraphs(paras: string[], n: number): string[] {
  const out: string[] = [];
  let left = n;
  for (const p of paras) {
    if (left <= 0) break;
    out.push(left >= p.length ? p : p.slice(0, left));
    left -= p.length;
  }
  return out.length ? out : [""];
}

function PixelRow({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      {PIXELS.map((p, i) => (
        <img key={p.name} src={p.src} alt="" style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
    </span>
  );
}

function IconSend() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10.1 15.6 12 3.4 13.9z" fill="currentColor" />
    </svg>
  );
}

function IconReset() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true">
      <path
        d="M20 12a8 8 0 1 1-2.6-5.9"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path d="M20 3.6V9h-5.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle cx="12" cy="8.2" r="3.6" fill="currentColor" />
      <path d="M4.8 20c0-3.6 3.2-5.9 7.2-5.9s7.2 2.3 7.2 5.9z" fill="currentColor" />
    </svg>
  );
}

export default function HakoBot() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>("design");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [thinking, setThinking] = useState(false);
  const [asked, setAsked] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  // Which reply is still typing itself out, and how far in it has got.
  const [typing, setTyping] = useState<{ key: number; total: number } | null>(null);
  const [revealed, setRevealed] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | null>(null);
  const seq = useRef(0);

  const pool = tab === "design" ? DESIGN : NATHAN;
  const otherPool = tab === "design" ? NATHAN : DESIGN;
  const chips = suggestions(pool, asked);

  /* The page-push lives entirely in CSS so there is no width arithmetic
     here and nothing to re-measure on resize. */
  useEffect(() => {
    document.documentElement.classList.toggle("hb-open", open);
    return () => document.documentElement.classList.remove("hb-open");
  }, [open]);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  // Keep the newest message in view, including while "Thinking…" is up.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: msgs.length > 1 ? "smooth" : "auto" });
  }, [msgs, thinking]);

  /* Drive the typewriter. Time-based rather than one character per frame,
     so the pace is the same on a 120Hz screen as on a 60Hz one. */
  useEffect(() => {
    if (!typing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(typing.total);
      setTyping(null);
      return;
    }
    const dur = Math.min(TYPE_MAX, Math.max(TYPE_MIN, typing.total * MS_PER_CHAR));
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setRevealed(Math.round(p * typing.total));
      // Follow the growing text, but only for a reader who is already at
      // the bottom -- yanking someone back down while they scroll up to
      // re-read an earlier answer would be hostile.
      const el = scrollRef.current;
      if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 140) el.scrollTop = el.scrollHeight;
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTyping(null);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [typing]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Move focus into the panel on open and back to the launcher on close,
  // so the keyboard doesn't get stranded. The panel itself takes focus
  // rather than the text field: focusing an input here would throw up the
  // on-screen keyboard on phones before the visitor has read anything.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open && !wasOpen.current) panelRef.current?.focus();
    if (!open && wasOpen.current) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const ask = useCallback(
    (text: string, entry?: Entry) => {
      const question = text.trim();
      if (!question || thinking) return;

      const hit = entry ?? findAnswer(question, pool, otherPool);
      // Asking again mid-reveal snaps the previous answer to complete
      // rather than leaving it half-typed above the new question.
      setTyping(null);
      setMsgs((m) => [...m, { key: ++seq.current, role: "user", text: [question] }]);
      setDraft("");
      setThinking(true);

      if (timer.current !== null) window.clearTimeout(timer.current);
      const wait = THINK_MIN + Math.random() * (THINK_MAX - THINK_MIN);
      timer.current = window.setTimeout(() => {
        setThinking(false);
        const text = hit ? hit.a : FALLBACK;
        const key = ++seq.current;
        setMsgs((m) => [...m, { key, role: "bot", text, fallback: !hit }]);
        setRevealed(0);
        setTyping({ key, total: text.reduce((n, p) => n + p.length, 0) });
        if (hit) setAsked((a) => (a.includes(hit.id) ? a : [...a, hit.id]));
      }, wait);
    },
    [pool, otherPool, thinking]
  );

  const reset = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    setMsgs([]);
    setThinking(false);
    setAsked([]);
    setDraft("");
    setTyping(null);
    setRevealed(0);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ask(draft);
  };

  const started = msgs.length > 0 || thinking;

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className="hb-launcher"
        aria-expanded={open}
        aria-controls="hakobot-panel"
        aria-label={open ? "Close HakoBot" : "Open HakoBot, a chat about Nathan"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="hb-launcher-label t-label" aria-hidden="true">HakoBot</span>
        {/* The straightened copy of the cluster. The tilted original stays
            in the header and the thinking row, where the scatter is the
            point -- here it reads as a button, so it sits upright. */}
        <img src="/assets/px-green-up.webp" alt="" aria-hidden="true" />
      </button>

      <div
        id="hakobot-panel"
        ref={panelRef}
        className="hb-panel"
        role="dialog"
        aria-label="HakoBot"
        tabIndex={-1}
        /* Not aria-modal: the page stays visible, scrollable and usable
           beside the panel, so claiming modality would be a lie to a
           screen reader. */
        aria-hidden={!open}
        inert={!open}
      >
        <div className="hb-wash" aria-hidden="true" />

        <header className="hb-head">
          <span className="hb-brand">
            <span className="hb-brand-name">HakoBot</span>
            <PixelRow className="hb-brand-px" />
          </span>
          <span className="hb-head-actions">
            <button type="button" onClick={reset} aria-label="Start the conversation over" title="Start over">
              <IconReset />
            </button>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close HakoBot">
              <IconClose />
            </button>
          </span>
        </header>

        <div className="hb-tabs" role="tablist" aria-label="Question topics">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              type="button"
              id={`hb-tab-${t.key}`}
              aria-selected={tab === t.key}
              aria-controls="hb-thread"
              tabIndex={tab === t.key ? 0 : -1}
              className="hb-tab"
              data-on={tab === t.key}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          className="hb-scroll"
          ref={scrollRef}
          id="hb-thread"
          role="tabpanel"
          aria-labelledby={`hb-tab-${tab}`}
        >
          {!started && (
            <div className="hb-welcome">
              <h2 className="t-headline hb-welcome-title">{WELCOME.title}</h2>
              <span className="hb-welcome-face">
                <img src="/assets/hakobot-avatar.png" alt="" aria-hidden="true" />
              </span>
              <p className="t-body hb-welcome-sub">{WELCOME.subtitle}</p>
            </div>
          )}

          {msgs.map((m) =>
            m.role === "user" ? (
              <div key={m.key} className="hb-row hb-row-user">
                <p className="hb-bubble hb-bubble-user">{m.text[0]}</p>
                <span className="hb-avatar hb-avatar-user">
                  <IconUser />
                </span>
              </div>
            ) : (
              <div key={m.key} className="hb-row hb-row-bot">
                <span className="hb-avatar hb-avatar-bot">
                  <img src="/assets/hakobot-avatar.png" alt="" aria-hidden="true" />
                </span>
                <div className="hb-bubble hb-bubble-bot">
                  {(() => {
                    const live = typing?.key === m.key;
                    const paras = live ? sliceParagraphs(m.text, revealed) : m.text;
                    return paras.map((p, i) => (
                      <p key={i}>
                        {p}
                        {live && i === paras.length - 1 && <span className="hb-caret" aria-hidden="true" />}
                      </p>
                    ));
                  })()}
                </div>
              </div>
            )
          )}

          {thinking && (
            <div className="hb-thinking">
              <PixelRow className="hb-think-px" />
              <p className="hb-think-label">Thinking…</p>
            </div>
          )}

          {/* Held back until the reply has finished typing, so the card
              doesn't shunt down the screen line by line. */}
          {!thinking && !typing && (
            <div className="hb-suggest">
              <p className="hb-suggest-head">{started ? WELCOME.again : WELCOME.prompt}</p>
              {chips.map((c) => (
                <button key={c.id} type="button" className="hb-chip" onClick={() => ask(c.q, c)}>
                  {c.q}
                </button>
              ))}
            </div>
          )}

          {/* Announces replies without moving focus. */}
          <p className="sr-only" aria-live="polite">
            {/* Announced once, complete -- not character by character. */}
            {thinking
              ? "HakoBot is thinking"
              : !typing && msgs.length && msgs[msgs.length - 1].role === "bot"
                ? msgs[msgs.length - 1].text.join(" ")
                : ""}
          </p>
        </div>

        <form className="hb-compose" onSubmit={onSubmit}>
          <input
            className="hb-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a message..."
            aria-label="Ask HakoBot a question"
            autoComplete="off"
          />
          <button type="submit" className="hb-send" aria-label="Send" disabled={!draft.trim() || thinking}>
            <IconSend />
          </button>
        </form>
      </div>
    </>
  );
}
