// Scroll/load-triggered text & block reveal system: masks + staggered
// translateY/opacity/blur transitions. Pure DOM functions (no React) so
// they can run safely inside a useEffect after React has committed the
// initial render, without React ever needing to know about the extra
// wrapper spans this creates.

export type RevealVariant = "block" | "lines" | "words";

type RevealState = { variant: RevealVariant; words?: HTMLElement[]; lines?: HTMLElement[] };

const stateMap = new WeakMap<HTMLElement, RevealState>();
const EASE = "cubic-bezier(.2,.6,.35,1)";

export function splitWords(el: HTMLElement): HTMLElement[] {
  const out: HTMLElement[] = [];
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((k) => {
      if (k.nodeType === 3) {
        const text = k.textContent || "";
        const parts = text.split(/(\s+)/);
        if (parts.length === 1 && !parts[0].trim()) return;
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (p === "") return;
          if (/^\s+$/.test(p)) {
            frag.appendChild(document.createTextNode(p));
            return;
          }
          const s = document.createElement("span");
          s.className = "rv-w";
          s.textContent = p;
          frag.appendChild(s);
          out.push(s);
        });
        node.replaceChild(frag, k);
      } else if (k.nodeType === 1 && !(k as HTMLElement).classList.contains("rv-w")) {
        walk(k);
      }
    });
  };
  walk(el);
  return out;
}

/** Groups existing word spans (checking `.hw` first, then `.rv-w`, splitting fresh
 * if neither exists) into visual lines based on rendered position, wrapping each
 * line in an overflow-hidden mask so it can slide up from below. */
export function splitLines(el: HTMLElement): HTMLElement[] {
  let words = Array.from(el.querySelectorAll<HTMLElement>(".hw"));
  if (!words.length) words = Array.from(el.querySelectorAll<HTMLElement>(".rv-w"));
  if (!words.length) words = splitWords(el);
  words.forEach((w) => {
    w.style.display = "inline-block";
  });
  const groups: HTMLElement[][] = [];
  let top: number | null = null;
  let cur: HTMLElement[] = [];
  words.forEach((w) => {
    const t = Math.round(w.getBoundingClientRect().top);
    if (top === null || Math.abs(t - top) > 4) {
      cur = [];
      groups.push(cur);
      top = t;
    }
    cur.push(w);
  });
  const inners: HTMLElement[] = [];
  groups.forEach((g) => {
    const first = g[0];
    const last = g[g.length - 1];
    const mask = document.createElement("span");
    mask.className = "rv-line-mask";
    mask.style.cssText = "display:block;overflow:hidden;";
    const inner = document.createElement("span");
    inner.className = "rv-line";
    inner.style.cssText = "display:block;";
    el.insertBefore(mask, first);
    let n: ChildNode | null = first;
    while (n) {
      const nx: ChildNode | null = n.nextSibling;
      inner.appendChild(n);
      if (n === last) break;
      n = nx;
    }
    mask.appendChild(inner);
    inners.push(inner);
  });
  return inners;
}

function unwrapLines(el: HTMLElement) {
  el.querySelectorAll(".rv-line-mask").forEach((mask) => {
    const inner = mask.firstElementChild;
    if (inner) {
      while (inner.firstChild) el.insertBefore(inner.firstChild, mask);
    }
    mask.remove();
  });
  el.querySelectorAll<HTMLElement>(".hw, .rv-w").forEach((w) => {
    w.style.display = "";
  });
}

/** Sets up the hidden pre-reveal state for `el` and returns the element that
 * should be observed for visibility (a wrapping mask for "block" mode, `el`
 * itself otherwise). */
export function setupReveal(el: HTMLElement, variant: RevealVariant): HTMLElement {
  if (variant === "block") {
    const mask = document.createElement("span");
    mask.className = "rv-block-mask";
    const radius = getComputedStyle(el).borderRadius || "0";
    mask.style.cssText = `display:block;width:100%;overflow:hidden;border-radius:${radius}`;
    el.parentNode?.insertBefore(mask, el);
    mask.appendChild(el);
    el.style.display = "block";
    el.style.transform = "translateY(101%)";
    el.style.opacity = "0";
    el.style.filter = "blur(8px)";
    el.style.willChange = "transform, opacity, filter";
    stateMap.set(el, { variant });
    return mask;
  }
  if (variant === "lines") {
    const lines = splitLines(el);
    lines.forEach((ln) => {
      ln.style.transform = "translateY(110%)";
      ln.style.opacity = "0";
      ln.style.filter = "blur(5px)";
      ln.style.willChange = "transform, opacity, filter";
    });
    stateMap.set(el, { variant, lines });
    return el;
  }
  const words = splitWords(el);
  words.forEach((w) => {
    w.style.display = "inline-block";
    w.style.opacity = "0";
    w.style.transform = "translateY(0.5em)";
    w.style.filter = "blur(6px)";
    w.style.willChange = "opacity, transform, filter";
  });
  stateMap.set(el, { variant, words });
  return el;
}

export function playReveal(el: HTMLElement, stagger: number) {
  const state = stateMap.get(el);
  if (!state) return;
  if (state.variant === "block") {
    el.style.transition = `transform .9s ${EASE}, opacity .7s ease, filter .7s ease`;
    el.style.transform = "translateY(0)";
    el.style.opacity = "1";
    el.style.filter = "blur(0px)";
    return;
  }
  if (state.variant === "lines") {
    const lines = state.lines || [];
    lines.forEach((ln, i) => {
      const d = (i * stagger).toFixed(3);
      ln.style.transition = `transform .8s ${EASE} ${d}s, opacity .7s ease ${d}s, filter .6s ease ${d}s`;
      ln.style.transform = "translateY(0)";
      ln.style.opacity = "1";
      ln.style.filter = "blur(0px)";
    });
    if (lines.length) {
      const lastLn = lines[lines.length - 1];
      const done = (e: TransitionEvent) => {
        if (e.propertyName !== "transform") return;
        lastLn.removeEventListener("transitionend", done);
        unwrapLines(el);
      };
      lastLn.addEventListener("transitionend", done);
    }
    return;
  }
  const words = state.words || [];
  words.forEach((w, i) => {
    const d = (i * stagger).toFixed(3);
    w.style.transition = `opacity .6s ${EASE} ${d}s, transform .7s ${EASE} ${d}s, filter .55s ease ${d}s`;
    w.style.opacity = "1";
    w.style.transform = "translateY(0)";
    w.style.filter = "blur(0px)";
  });
}
