/* =============================================================
   HakoBot — the answer bank
   =============================================================

   THIS IS THE FILE TO EDIT. Everything HakoBot can say lives here
   as plain strings. Rewrite any answer, add an entry, delete one —
   no component code needs to change.

   Every answer below was drafted from copy already published on
   this site (the About Me page, the scroll-highlight intro, the
   work cards and the footer). Nothing here is invented, so it is
   all safe to say to a recruiter — but it is written in a first
   draft of your voice, so make it properly yours.

   ---- how an entry works -------------------------------------

     {
       id:  "design-story",          // unique; used to avoid repeating chips
       q:   "Hey, what's your design story?",   // the chip label, and the
                                                // text echoed in the orange
                                                // bubble when it is tapped
       a:   ["first paragraph", "second paragraph"],  // one string = one
                                                      // paragraph in the reply
       keywords: ["design story", "background"],      // see below
     }

   ---- keywords -----------------------------------------------

   These are what a TYPED question is matched against.

     • A multi-word keyword ("design story") is a phrase match and
       is weighted heavily — it only scores if the whole phrase
       appears in what the visitor typed.
     • A single-word keyword ("background") scores on its own but
       counts for less.

   Add the words a stranger would actually use, not the words you
   would use. If a question keeps falling through to the fallback,
   adding one keyword here is the fix.

   ---- the two tabs -------------------------------------------

     DESIGN  → "About Design": you as a designer.
     NATHAN  → "About Nathan": you as a person.

   A typed question searches the open tab first, then the other
   one, so a visitor on "About Design" who asks about food still
   gets a real answer instead of the fallback.
   ============================================================= */

export type Entry = {
  id: string;
  q: string;
  a: string[];
  keywords: string[];
};

/* ---------------- About Design ---------------- */

export const DESIGN: Entry[] = [
  {
    id: "design-story",
    q: "Hey, what's your design story?",
    a: [
      "Great question! To summarize…I was originally studying animation and illustration…but some things changed…",
      "After I transferred from community college and did some exploring I discovered UI/UX design at UC Davis! My first ever project was a Craigslist redesign…but in hindsight it was pretty bad.",
      "But even with that first time experience, I love how I was able to use my creative side and combine it with problem solving!",
    ],
    keywords: [
      "design story",
      "your story",
      "get into design",
      "got into design",
      "start designing",
      "background",
      "journey",
      "origin",
      "animation",
      "illustration",
    ],
  },
  {
    id: "grounding",
    q: "How do you ground your design decisions?",
    a: [
      "Research first, always! I lean on systems thinking to turn messy problems into something intuitive — grounded in research, interaction design, and behavioral psychology.",
      "I'm especially interested in how people actually think, behave, and interact with the products around them. I take those observations and use them to craft streamlined experiences, rather than designing from taste alone.",
      "On di.circle that meant 8 usability tests before I touched the redesign. Studying Psychology alongside design is a big part of why I work this way!",
    ],
    keywords: [
      "ground your design",
      "design decisions",
      "decision making",
      "justify",
      "research",
      "usability",
      "testing",
      "psychology",
      "systems thinking",
      "data",
      "evidence",
      "rationale",
    ],
  },
  {
    id: "process",
    q: "What's your design process like?",
    a: [
      "I start by understanding the behavior, not the screen! That usually means research and usability tests until I can describe the actual problem in one sentence.",
      "From there it's flows and systems before polish — I'd rather get the structure right and then make it feel good. Design systems are a big part of that for me, so the work stays consistent once other people pick it up.",
      "Then I test again. The Threadit onboarding went from 10 minutes to under 2 because of that loop, not because of one clever screen!",
    ],
    keywords: [
      "design process",
      "your process",
      "how do you work",
      "workflow",
      "approach",
      "methodology",
      "steps",
      "wireframe",
      "prototype",
    ],
  },
  {
    id: "projects",
    q: "What projects should I look at?",
    a: [
      "Three on here right now!",
      "Threadit — reducing first-time user drop-offs in onboarding. I got time-to-value from 10 minutes down to under 2. (B2C, fashion, mobile.)",
      "di.circle — lowering the psychological barrier to starting professional relationships, redesigning student-to-professional outreach off the back of 8 usability tests. (SaaS, interaction design, desktop.)",
      "Triceratops Club — improving recruitment for a student community club. It shipped, and drew 790 site visits and 36% of the club's Discord invite joins.",
    ],
    keywords: [
      "projects",
      "case study",
      "case studies",
      "work",
      "portfolio",
      "threadit",
      "dicircle",
      "di circle",
      "triceratops",
      "what should i look at",
      "best work",
    ],
  },
  {
    id: "tools",
    q: "What are your favorite tools?",
    a: [
      "Figma, first and always — I'm a Figma Campus Leader at UC Davis, so I spend a LOT of time in it. Miro when I need to think messy before I think neatly.",
      "I've also been expanding my toolkit with AI, using it to bring fun ideas and personal projects to life and to explore new ways to design and prototype. This whole portfolio is one of those experiments!",
    ],
    keywords: [
      "favorite tools",
      "what tools",
      "tools",
      "software",
      "figma",
      "miro",
      "stack",
      "apps you use",
      "prototyping tool",
    ],
  },
  {
    id: "ai",
    q: "How do you use AI in your work?",
    a: [
      "As a way to build, mostly! I've recently expanded my toolkit with AI and use it to bring fun ideas and personal projects to life while exploring new ways to design and prototype.",
      "It's let me take ideas further than a static mockup — this site, and the little experiments scattered through it, came out of that. I still do the thinking; AI just shortens the distance between an idea and something I can actually click.",
    ],
    keywords: [
      "ai",
      "artificial intelligence",
      "llm",
      "chatgpt",
      "claude",
      "vibe coding",
      "prototype with ai",
      "how do you build",
    ],
  },
  {
    id: "leading",
    q: "Have you led other designers?",
    a: [
      "Yes, and it's honestly my favorite part!",
      "At Design Interactive I co-lead a 60-member program, teaching and mentoring beginner designers in UI/UX and Figma fundamentals through weekly workshops.",
      "At HackDavis I'm Creative Director and Design Lead, mentoring design directors through structured syncs to get ready for UC Davis' annual hackathon. And as a Figma Campus Leader I plan and host events with my co-leads to bring design education and resources to students.",
    ],
    keywords: [
      "led other designers",
      "leadership",
      "lead",
      "mentor",
      "mentoring",
      "teaching",
      "teach",
      "manage",
      "team",
      "workshops",
      "hackdavis",
      "design interactive",
    ],
  },
  {
    id: "role",
    q: "What kind of role are you looking for?",
    a: [
      "I'm seeking full-time Product & UX Design roles!",
      "If you're excited about thoughtful, behavior-driven design and building things that make an impact, let's connect — I'd love to talk.",
    ],
    keywords: [
      "role",
      "looking for",
      "hiring",
      "job",
      "full time",
      "fulltime",
      "internship",
      "available",
      "opportunity",
      "position",
      "work with you",
      "hire",
    ],
  },
];

/* ---------------- About Nathan ---------------- */

export const NATHAN: Entry[] = [
  {
    id: "outside",
    q: "What do you like outside of design?",
    a: [
      "Food and cafes, easily! I genuinely believe food + cafes are the best thing to experience in life. Psst… you can follow me on Beli, I'm @HakoBako.",
      "I also believe having fun with friends is the best thing to experience in life. And listening to music is the best thing to experience in life. I'm aware that's three bests — I stand by all of them!",
    ],
    keywords: [
      "outside of design",
      "outside design",
      "hobbies",
      "hobby",
      "free time",
      "interests",
      "besides design",
      // Apostrophes are stripped before matching, so this is "you're".
      "when youre not designing",
    ],
  },
  {
    id: "fun",
    q: "What do you do for fun?",
    a: [
      "Mahjong! I love mahjong. Cafe hopping with friends. And photobooths — anyone? Always photobooths.",
      "Most of my favorite weekends are some combination of all three, honestly.",
    ],
    keywords: [
      "for fun",
      "fun",
      "mahjong",
      "photobooth",
      "photobooths",
      "cafe hopping",
      "weekend",
      "games",
      "play",
    ],
  },
  {
    id: "from",
    q: "Where are you from?",
    a: [
      "San Francisco — born and raised! I'm up at UC Davis for school, but SF is home.",
      "It's also why most of my food recommendations are stubbornly Bay Area.",
    ],
    keywords: [
      "where are you from",
      "from",
      "based",
      "live",
      "location",
      "city",
      "san francisco",
      "sf",
      "bay area",
      "hometown",
      "relocate",
    ],
  },
  {
    id: "studying",
    q: "What are you studying?",
    a: [
      "UI/UX Design and Psychology at UC Davis — I'm in my 5th year.",
      "The Psychology half is not a side quest, by the way. It's most of why I care so much about how people actually behave rather than how we assume they will!",
    ],
    keywords: [
      "studying",
      "study",
      "school",
      "major",
      "college",
      "university",
      "uc davis",
      "davis",
      "degree",
      "graduate",
      "student",
      // A phrase, not a bare "year": that caught "what year is it" and
      // answered it with a degree, which is exactly the kind of
      // confidently-wrong reply the fallback exists to prevent.
      "year are you",
    ],
  },
  {
    id: "food",
    q: "Where are your favorite places to eat?",
    a: [
      "A few I keep sending people to: Komeya No Bento in SF, Marnee Thai in SF, and U:Dessert Story in SF and Berkeley!",
      "There are more on the About Me page under Life Snippets — and the full running list is on my Beli, @HakoBako.",
    ],
    keywords: [
      "favorite places to eat",
      "places to eat",
      "food",
      "eat",
      "restaurant",
      "restaurants",
      "cafe",
      "cafes",
      "coffee",
      "dessert",
      "recommendations",
      "beli",
    ],
  },
  {
    id: "music",
    q: "What music are you into?",
    a: [
      "Always something playing! I keep my current favorite plays on the About Me page — have a look under Life Snippets, in the Music tab.",
      "It updates as my taste wanders, which is often.",
    ],
    keywords: [
      "music",
      "listening",
      "listen",
      "songs",
      "song",
      "spotify",
      "playlist",
      "artist",
      "band",
    ],
  },
  {
    id: "communities",
    q: "What communities are you part of?",
    a: [
      "Three, and they've shaped most of my time at Davis!",
      "Design Interactive — I co-lead a 60-member program teaching beginner designers UI/UX and Figma fundamentals. Genuinely the best design community ever.",
      "Figma @ UCD — I'm a Figma Campus Leader, planning events with my co-leads to bring design education and resources to students.",
      "HackDavis — Creative Director and Design Lead for UC Davis' annual hackathon.",
    ],
    keywords: [
      "communities",
      "community",
      "clubs",
      "club",
      "involved",
      "extracurricular",
      "design interactive",
      "figma campus",
      "hackdavis",
      "organizations",
    ],
  },
  {
    id: "name",
    q: "Why are you called HakoBot?",
    a: [
      "Because I'm @HakoBako basically everywhere — Beli, the internet generally — so HakoBot felt like the obvious name for a small version of me that answers questions.",
      "I'm the pixel guy, if that wasn't clear from the rest of this site.",
    ],
    keywords: [
      "hakobot",
      "hakobako",
      "your name",
      "called",
      "why hako",
      "username",
      "handle",
      "who are you",
      /* Deliberately NOT "what are you": it is a prefix of "what are you
         studying", "what are you working on", "what are you looking for"
         — it would swallow half the bank. */
    ],
  },
  {
    id: "contact",
    q: "How can I get in touch?",
    a: [
      "Please do! Easiest is email: nnisalas710@gmail.com.",
      "I'm also on LinkedIn, and my resume is linked in the top nav. If you're excited about thoughtful, behavior-driven design, let's connect!",
    ],
    keywords: [
      "get in touch",
      "contact",
      "reach you",
      "email",
      "linkedin",
      "resume",
      "cv",
      "connect",
      "hire you",
      "message you",
    ],
  },
];

/* ---------------- the fallback ---------------- */

/** Shown when a typed question doesn't match anything well enough. */
export const FALLBACK = [
  "Ooh, that one's not in my head yet! I only know what Nathan's taught me so far.",
  "Try one of these, or email him directly at nnisalas710@gmail.com — he's much better at this than I am.",
];

export const WELCOME = {
  title: "Welcome, I'm HakoBot!",
  subtitle: "Here to answer any questions about Nathan!",
  prompt: "You can ask questions such as…",
  again: "Ask another question!",
};

/* ---------------- matching ---------------- */

/* Words that carry no signal. Dropped before scoring so "what are your
   favorite tools" and "tools?" land on the same entry. */
const STOP = new Set([
  "a", "an", "the", "is", "are", "was", "were", "do", "does", "did", "you",
  "your", "yours", "youre", "what", "whats", "how", "why", "when", "where",
  "who", "which", "i", "me", "my", "to", "of", "in", "on", "at", "for", "and",
  "or", "it", "its", "that", "this", "with", "about", "tell", "can", "could",
  "would", "should", "like", "have", "has", "had", "any", "some", "so", "im",
  "hey", "hi", "hello", "please", "thanks", "thank", "us", "we", "be", "been",
  "get", "got", "there", "here", "from", "into", "out", "up", "down", "just",
]);

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function contentTokens(s: string): string[] {
  return normalize(s)
    .split(" ")
    .filter((t) => t.length > 1 && !STOP.has(t));
}

/* One solid keyword is enough to answer. The banks' keywords are specific
   enough that a single hit is real signal ("figma", "threadit", "mahjong"),
   and a visitor typing one word deserves an answer rather than a shrug.
   Below this the fallback is the honest reply — a confidently wrong answer
   is worse than "ask me something else". */
const MIN_SCORE = 3;
const KW_EXACT = 4;
const KW_PREFIX = 3; // "mentored" -> "mentor", "working" -> "work"
const PHRASE_BASE = 4;

/* Cheap stemming: one word is a prefix of the other, and the shorter of
   the two is long enough that the overlap means something. Scores below
   an exact hit so "playlist" still prefers the music entry's own keyword
   over the fun entry's "play". */
function prefixMatch(token: string, keyword: string): boolean {
  const short = token.length < keyword.length ? token : keyword;
  if (short.length < 4) return false;
  return token.startsWith(keyword) || keyword.startsWith(token);
}

function scoreEntry(entry: Entry, text: string, tokens: string[]): number {
  let score = 0;

  for (const raw of entry.keywords) {
    const k = normalize(raw);
    if (!k) continue;
    if (k.includes(" ")) {
      // A phrase is strong evidence, and a longer phrase is stronger.
      if (text.includes(k)) score += PHRASE_BASE + k.split(" ").length;
    } else if (tokens.includes(k)) {
      score += KW_EXACT;
    } else if (tokens.some((t) => prefixMatch(t, k))) {
      score += KW_PREFIX;
    }
  }

  // Someone typing the chip's own wording should always land on it, even
  // if that entry's keywords happen to be thin.
  const qTokens = contentTokens(entry.q);
  if (qTokens.length) {
    const overlap = qTokens.filter((t) => tokens.includes(t)).length;
    score += (overlap / qTokens.length) * 5;
  }

  return score;
}

/**
 * Best entry for a typed question, or null to use the fallback.
 * `preferred` is searched first so the open tab wins ties, but the other
 * bank is still searched — a visitor on "About Design" asking about food
 * should get the food answer, not a shrug.
 */
export function findAnswer(input: string, preferred: Entry[], other: Entry[]): Entry | null {
  const text = normalize(input);
  if (!text) return null;
  // No early exit on an empty token list: "where are you from" is nothing
  // BUT stop words, and it still has to match its phrase keyword.
  const tokens = contentTokens(text);

  let best: Entry | null = null;
  let bestScore = 0;

  // Preferred bank first, and it keeps a tie: strict > means a later,
  // equal-scoring entry from the other tab can't displace it.
  for (const e of [...preferred, ...other]) {
    const s = scoreEntry(e, text, tokens);
    if (s > bestScore) {
      bestScore = s;
      best = e;
    }
  }

  return bestScore >= MIN_SCORE ? best : null;
}

/**
 * Three chips to offer next, preferring questions not yet asked so the
 * suggestions keep moving instead of re-offering what was just answered.
 */
export function suggestions(pool: Entry[], asked: string[], n = 3): Entry[] {
  const fresh = pool.filter((e) => !asked.includes(e.id));
  const picked = fresh.slice(0, n);
  if (picked.length === n) return picked;
  // Everything's been asked — top up from the start of the pool.
  for (const e of pool) {
    if (picked.length >= n) break;
    if (!picked.includes(e)) picked.push(e);
  }
  return picked;
}
