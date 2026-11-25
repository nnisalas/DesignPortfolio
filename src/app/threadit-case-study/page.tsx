"use client";

import { useState } from "react";
import SubpageHeader from "@/components/SubpageHeader";
import CaseStudySidebar from "@/components/CaseStudySidebar";
import CityscapeFooter from "@/components/CityscapeFooter";
import Lightbox from "@/components/Lightbox";
import BeforeAfterToggle from "@/components/BeforeAfterToggle";
import PhoneVideo from "@/components/PhoneVideo";

// Every value here is a token from the type system in globals.css. The
// three styles are Label (eyebrow), Headline (h2) and Supporting copy
// (body); sub-headings reuse the body size at the medium weight.
const eyebrow: React.CSSProperties = {
  margin: "0 0 var(--space-label-to-headline)",
  fontFamily: "var(--font-family)",
  fontSize: "var(--label-size)",
  lineHeight: "var(--label-line)",
  fontWeight: "var(--weight-medium)",
  letterSpacing: "var(--label-tracking)",
  color: "var(--color-label)",
};
const h2: React.CSSProperties = {
  margin: "0 0 var(--space-headline-to-body)",
  fontFamily: "var(--font-family)",
  fontSize: "var(--headline-size)",
  lineHeight: "var(--headline-line)",
  fontWeight: "var(--weight-medium)",
  letterSpacing: "var(--headline-tracking)",
  color: "var(--color-headline)",
};
const h3: React.CSSProperties = {
  margin: "0 0 var(--space-headline-to-body)",
  fontFamily: "var(--font-family)",
  fontSize: "var(--body-size)",
  lineHeight: "var(--body-line)",
  fontWeight: "var(--weight-medium)",
  letterSpacing: "var(--body-tracking)",
  color: "var(--color-headline)",
};
const body: React.CSSProperties = {
  margin: "0 0 var(--space-paragraph)",
  fontFamily: "var(--font-family)",
  fontSize: "var(--body-size)",
  lineHeight: "var(--body-line)",
  fontWeight: "var(--weight-regular)",
  letterSpacing: "var(--body-tracking)",
  color: "var(--color-body)",
};
const section: React.CSSProperties = { marginBottom: "var(--space-section)" };
const strong: React.CSSProperties = { color: "var(--color-headline)", fontWeight: "var(--weight-medium)" };

// The pro/con semantics, darkened. The old #3aa864 / #e05b4b were 2.8:1 and
// 3.6:1 on white -- already under AA at the 15-16px they used to run at, and
// the system drops these markers to the 13px Label size, which makes it
// worse rather than better. These are 5.3:1 and 6.1:1.
const POS = "#1f7a46";
const NEG = "#b4342a";

// The pale blue the exported artwork is mounted on, sampled from the new
// webps themselves (218,233,251). PhoneVideo's #ddeefb is two points
// lighter and sits in the same family, so videos and stills read as one
// set down the page. Used here only to mount the two screenshots that were
// NOT re-exported, so all four testing findings share a background.
const PANEL = "#dae9fb";

// The spacing scale in globals.css runs 8 / 12 / 16 and then jumps
// straight to 56-88px for a section, so there is no step that says
// "this block is one unit, and the next unit starts here". Everything
// between a paragraph and a section therefore landed on either 16px
// (too tight to separate) or the section gap (too loose to group), and
// the page ended up with more air ABOVE each figure than below it --
// which reads as though the figure belongs to the text underneath.
//
// FIG   the air around a figure, equal on both sides
// GROUP one numbered finding to the next; wider than FIG, short of a section
// CAPTION a figure to the line that captions it -- deliberately the
//         tightest gap on the page, so the pairing is unambiguous
const FIG = "clamp(24px,3.4vw,32px)";
const GROUP = "clamp(34px,4.6vw,44px)";
const CAPTION = "var(--space-headline-to-body)";

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    // No bottom margin: every caller is a flex column that owns the
    // spacing between its children, so a margin here would add to the
    // container's gap and quietly desync the two.
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <svg viewBox="0 0 12 14" width="11" height="13" style={{ flex: "none", marginTop: 6 }}>
        <path d="M1 0 L11 7 L1 14 Z" fill="var(--color-headline)" />
      </svg>
      <p style={{ ...body, margin: 0 }}>{children}</p>
    </div>
  );
}

// A numbered finding title: a sub-heading, so h3 at the supporting-copy
// size and the medium weight.
function NumberHeading({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h3 style={{ ...h3, display: "flex", alignItems: "center", gap: 12 }}>
      <span
        className="t-label"
        style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", background: "var(--color-headline)", color: "#fff", letterSpacing: 0 }}
      >
        {n}
      </span>
      {children}
    </h3>
  );
}

// `ratio` is always the file's true pixel ratio, so objectFit never has
// anything to crop -- it is there to reserve the right box before the
// image decodes, not to reframe the art.
function SlotImage({ src, alt, ratio }: { src: string; alt: string; ratio: string }) {
  return (
    <img
      data-lb="1"
      src={src}
      alt={alt}
      style={{ display: "block", height: "auto", width: "100%", aspectRatio: ratio, marginBottom: CAPTION, borderRadius: 18, objectFit: "cover" }}
    />
  );
}

// Two of the four testing findings are screenshots that predate this pass
// and carry no background of their own. Mounting them on PANEL keeps the
// run of four findings visually consistent with the re-exported artwork,
// which has that same blue baked in and therefore sits flush instead.
function PanelImage({ src, alt, ratio }: { src: string; alt: string; ratio: string }) {
  return (
    <div style={{ background: PANEL, borderRadius: 18, padding: "clamp(16px,4%,34px)", marginBottom: CAPTION }}>
      <img
        data-lb="1"
        src={src}
        alt={alt}
        style={{ display: "block", height: "auto", width: "100%", aspectRatio: ratio, borderRadius: 8 }}
      />
    </div>
  );
}

// The two takeaway cards under My Impact: the claim, and how it was
// arrived at. Kept side by side so the number is never read without the
// method that produced it.
function NoteCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#f5f5f4", borderRadius: 14, padding: "clamp(18px,3vw,24px)" }}>
      <h3 style={{ ...h3, marginBottom: 10 }}>{title}</h3>
      <p style={{ ...body, margin: 0 }}>{children}</p>
    </div>
  );
}

export default function ThreadItCaseStudy() {
  const [flowAfter, setFlowAfter] = useState(false);
  const [finalAfter, setFinalAfter] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%", background: "#ffffff", overflowX: "clip" }}>
      <SubpageHeader />

      {/* HERO COVER */}
      <div style={{ overflow: "hidden", background: "#9fd2f7" }}>
        <img data-lb="1" src="/assets/threadit-hero.webp" alt="ThreadIt app — three iPhone mockups of the onboarding, closet, and planner screens" style={{ display: "block", width: "100%", height: "auto" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "clamp(36px,5vw,80px)", padding: "clamp(28px,5vw,52px) clamp(22px,6vw,40px) clamp(48px,8vh,72px)" }}>
        <CaseStudySidebar />

        <article id="ts-article" style={{ minWidth: 0, maxWidth: "var(--measure)", flex: "0 1 var(--measure)" }}>
          {/* The award was the old subtitle and got displaced by the
              time-to-value line. It earns its own slot above the title
              instead: it is the one thing worth reading in the first few
              seconds, and a pill reads as a credential rather than as
              another sentence competing with the headline. */}
          <p
            className="t-label"
            // A 14px chip, not a 999px pill: the line wraps to two at phone
            // width, where stadium ends read as a balloon rather than a badge.
            style={{ display: "inline-block", margin: "0 0 14px", padding: "7px 14px", borderRadius: 14, background: "#e8f2fb", color: "var(--color-label)" }}
          >
            1st Place Winner &middot; Judged by LinkedIn &amp; ServiceNow leads
          </p>
          <h1 className="t-headline" style={{ margin: "0 0 var(--space-headline-to-body)" }}>
            Reducing First-Time User Drop-off in Onboarding
          </h1>
          <p style={{ ...body, marginBottom: "var(--space-section)" }}>
            Cut time-to-value from 10 minutes to under 2 minutes
          </p>

          {/* 132px, not 140: at the 640px measure four 140px tracks plus
              three 28px gaps come to 644px, four short, so the row wrapped
              3 + 1 and dropped Skills onto a line of its own. */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(132px,1fr))", gap: "clamp(22px,5vw,30px) clamp(16px,4vw,28px)", marginBottom: "var(--space-section)" }}>
            {[
              { label: "Timeline", value: <>March–June 2026<br />(8 Weeks)</> },
              { label: "My Role", value: <>Lead Designer<br />(Onboarding Flow)</> },
              { label: "Team", value: "4 Designers (including me) + 1 Design Lead" },
              { label: "Skills", value: "Figma, Design Systems, Prototyping, Hi-Fi Design, Usability Testing" },
            ].map((m) => (
              <div key={m.label}>
                {/* A metadata key is not a heading -- these were <h2>s, which
                    put four of them above the page's own section headings. */}
                <p style={{ ...eyebrow, margin: "0 0 var(--space-label-to-headline)" }}>{m.label}</p>
                <p style={{ ...body, margin: 0 }}>{m.value}</p>
              </div>
            ))}
          </div>

          <section id="overview" style={section}>
            <p style={eyebrow}>Overview</p>
            <h2 style={h2}>Fashion fans save endless style inspiration, but the images often sit forgotten in camera rolls due to a digital &quot;pile-up.&quot;</h2>
            <p style={body}>When attempting to action these saves, users face psychological friction translating a look that fits onto their own body type, while professional styling remains financially inaccessible.</p>
            <p style={{ ...body, marginBottom: 0 }}>
              The initial <strong style={strong}>first-time user experience (FTUX)</strong> had a problem: users had to import their closet before seeing any value. That step was slow, so it risked early drop-offs.
            </p>
          </section>

          <section id="impact" style={section}>
            <p style={eyebrow}>My Impact</p>
            <h2 style={h2}>I owned the onboarding flow and cut it from 14 to 8 screens. Usability testing with 5 users showed where people lost interest, and the redesign addressed those points.</h2>
            <p style={body}>My contributions included:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: `0 0 ${FIG}` }}>
              <Bullet>
                Designed a <strong style={strong}>non-linear progress bar</strong> and{" "}
                <strong style={strong}>continuous feedback</strong> so waiting felt shorter
              </Bullet>
              <Bullet>
                Added <strong style={strong}>cancel/pause</strong> options and motivational microcopy to build trust during long steps
              </Bullet>
              <Bullet>Replaced the blank &quot;cold start&quot; screen with a personalized style archetype and mood-board, generated from the user&apos;s answers</Bullet>
              <Bullet>
                Pivoted from an <strong style={strong}>AR try-on</strong> to an identity moodboard after testing raised body-image concerns
              </Bullet>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "clamp(14px,2.5vw,20px)" }}>
              <NoteCard title="Result">
                Time-to-value dropped from <strong style={strong}>10 minutes</strong> to under{" "}
                <strong style={strong}>2 minutes</strong>
              </NoteCard>
              {/* Both flows were timed with the same five testers, so the
                  figure is measured rather than projected -- which is why
                  nothing on this page hedges it any more. */}
              <NoteCard title="How I measured it">
                I timed the same <strong style={strong}>5 testers on both flows</strong>: about 10 minutes on the original (a full closet import) versus under 2 minutes on the new prototype.
              </NoteCard>
            </div>
          </section>

          <section id="problem" style={section}>
            <p style={eyebrow}>The Problem</p>
            <h2 style={h2}>The initial onboarding asked users to upload their digital closet before they got any tailored recommendations</h2>
            <p style={{ ...body, marginBottom: FIG }}>This created a high-friction bottleneck: requiring users to invest significant time upfront before experiencing core product value. The product needed rich user data, but asking for it first made onboarding feel tedious.</p>
            <PhoneVideo src="/assets/onboarding-welcome.mp4" label="Screen recording of the original ThreadIt onboarding: the welcome screen followed by the closet import step" dataLb />
          </section>

          <section id="challenge" style={section}>
            <p style={eyebrow}>The Design Challenge</p>
            <h2 style={{ ...h2, marginBottom: 0 }}>How might we deliver immediate, personalized styling value before a user even finishes importing their closet?</h2>
          </section>

          <section id="exploration" style={section}>
            <p style={eyebrow}>Design Exploration</p>
            <h2 style={h2}>Designing for perceived performance and immediate activation</h2>
            <p style={body}>My first idea was a numbered progress indicator, a standard onboarding pattern that gives a clear sense of structure.</p>
            {/* This used to say the step indicator was rejected *because of*
                visibility of system status, which does not hold: a step
                count is a very direct report of system status, arguably a
                better one than a bar. The heuristic is the bar both options
                clear; what decided it is below the quote. */}
            <p style={{ ...body, marginBottom: FIG }}>
              Both it and a continuous bar clear{" "}
              <strong style={strong}>Jakob Nielsen&apos;s visibility-of-system-status heuristic</strong>
              {" "}&mdash; a step count is feedback, and so is a moving bar:
            </p>

            {/* The two quote marks are ornament, not text in the system: they
                carry no reading content (aria-hidden) and are sized as a
                graphic. Everything readable inside is Label + body. */}
            {/* Paragraph step below, not FIG: prose follows the quote now,
                and the figure step would read as a break between them. */}
            <figure style={{ position: "relative", margin: "0 0 var(--space-paragraph)", background: "#f5f5f4", borderRadius: 16, padding: "clamp(30px,6vw,44px) clamp(24px,6vw,56px)" }}>
              <span aria-hidden="true" style={{ position: "absolute", top: 14, left: 20, fontSize: 52, fontWeight: "var(--weight-medium)", lineHeight: 1, color: "var(--color-headline)" }}>&#8220;</span>
              <p style={{ ...eyebrow, textAlign: "center" }}>Visibility of System Status</p>
              <p style={{ ...body, margin: 0, textAlign: "center" }}>
                The design should always keep users <strong>informed</strong> about what is going on, through <strong>appropriate feedback within reasonable time</strong>.
              </p>
              <span aria-hidden="true" style={{ position: "absolute", bottom: 6, right: 20, fontSize: 52, fontWeight: "var(--weight-medium)", lineHeight: 1, color: "var(--color-headline)" }}>&#8221;</span>
            </figure>

            {/* The argument the decision actually rested on. It was already
                on the page, split across the ✕/✓ list below; stating it
                here is what lets the heuristic above be a constraint both
                options meet, rather than a citation standing in for a
                reason. */}
            <p style={{ ...body, marginBottom: FIG }}>
              So the heuristic ruled neither one out. What separated them was what their feedback actually says. A step count answers{" "}
              <strong style={strong}>&ldquo;how much is left&rdquo;</strong>, putting remaining effort in front of someone who has not yet seen the product do anything. A continuous bar answers{" "}
              <strong style={strong}>&ldquo;how far you have come.&rdquo;</strong>
            </p>

            {/* The ✕/✓ captions that used to sit above this image are now part
                of the artwork itself: the rejected bar is boxed in red, the
                chosen one in green. Repeating them here would say it twice. */}
            <img data-lb="1" src="/assets/progress-bar-compare.webp" alt="Side-by-side comparison of the Fashion goals screen: on the left a segmented step bar outlined in red, on the right the continuous non-linear progress bar outlined in green" style={{ display: "block", width: "100%", height: "auto", aspectRatio: "2000/1527", marginBottom: CAPTION, borderRadius: 18 }} />

            {/* Source order is neg, pos, neg, pos so the two-column grid
                stacks the rejected pattern down the left and the chosen one
                down the right, and a one-column phone still alternates
                sensibly rather than reading as two separate lists. */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "var(--space-paragraph) clamp(20px,4vw,36px)", marginBottom: FIG }}>
              {[
                { ok: false, text: <>Emphasizes amount of <strong style={{ color: NEG }}>effort needed</strong> rather than <strong style={{ color: NEG }}>progress made</strong>.</> },
                { ok: true, text: <>Communicates <strong style={{ color: POS }}>progress</strong> without prompting users to count remaining steps</> },
                { ok: false, text: <>Sends the wrong psychological signal for a <strong style={{ color: NEG }}>FTUX design</strong> to reduce perceived friction</> },
                { ok: true, text: <>Advances faster, creating momentum so onboarding feels lighter</> },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span aria-hidden="true" style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, marginTop: 3, borderRadius: "50%", background: item.ok ? POS : NEG, color: "#fff", fontSize: 11, fontWeight: "var(--weight-medium)" }}>
                    {item.ok ? "✓" : "✕"}
                  </span>
                  <p style={{ ...body, margin: 0 }}>{item.text}</p>
                </div>
              ))}
            </div>

            <p style={{ ...body, marginBottom: 0 }}>
              <strong style={strong}>The trade-off:</strong>{" "}
              Without a step count, users can&apos;t see how much is left, which can feel open-ended. I paired the bar with cancel/pause options and motivational microcopy to offset that.
            </p>
          </section>

          <section id="testing" style={section}>
            <p style={eyebrow}>User Testing</p>
            {/* FIG, since the findings now follow the heading directly:
                the 12px headline-to-body step is for a paragraph, and
                left a numbered block crowding the heading. */}
            <h2 style={{ ...h2, marginBottom: FIG }}>I ran usability tests with 5 users on the original flow to see where they lost interest</h2>
            {/* The heading already says who was tested and why, so the
                lead-in paragraph that used to sit here only said it a
                second time in heavier words. The four findings open
                straight after it. */}

            {/* One flex column owns the rhythm of the whole list, so each
                finding is held together by its own tight internal gaps and
                separated from the next by GROUP. Laid out as margins it was
                the other way round: 12px and 18px inside a finding against
                8px between them, so every caption read as the opening line
                of the finding below it. */}
            <div style={{ display: "flex", flexDirection: "column", gap: GROUP, marginBottom: GROUP }}>
              <div>
                <NumberHeading n={1}>14 Steps Is Too Long</NumberHeading>
                <PanelImage src="/assets/slots/ts-feedback-14steps.webp" alt="The full 14-step onboarding flow laid out as two rows of screens" ratio="2072/1074" />
                {/* "Testers", not "users often": this is what the five
                    people in the room did, and "often" was never counted. */}
                <Bullet>
                  Testers lost the unique <strong style={strong}>app value propositions</strong> since onboarding ran long.
                </Bullet>
              </div>
              <div>
                <NumberHeading n={2}>Camera Simulation Felt Long</NumberHeading>
                <PanelImage src="/assets/slots/ts-feedback-camera.webp" alt="The camera permission, camera view and save option screens of the simulated closet upload" ratio="1360/705" />
                <Bullet>Simulated upload read as slow and high-effort, which led to testers disengaging</Bullet>
              </div>
              <div>
                <NumberHeading n={3}>Feed Curation Felt Too Similar</NumberHeading>
                <SlotImage src="/assets/slots/ts-feedback-feed.webp" alt="The feed curation screen beside its three options, with the Pick for me and Browse options grouped and annotated “What’s the difference?”" ratio="2000/1037" />
                <Bullet>
                  <strong style={strong}>Browse and Discovery</strong> read as the same, so testers struggled to picture their feed
                </Bullet>
              </div>
              <div>
                <NumberHeading n={4}>Inclusivity Concerns</NumberHeading>
                <SlotImage src="/assets/slots/ts-feedback-inclusivity.webp" alt="Two tester quote cards: “What if I don’t identify as only male or female?” and “What if I’m not comfortable sharing my weight?”" ratio="2000/1037" />
                <Bullet>
                  The weight + gender prompt became a <strong style={strong}>sensitive identity and ethical concern</strong>
                </Bullet>
              </div>
            </div>

            <p style={{ ...body, marginBottom: FIG }}>Each finding led to a change. Toggle between the original 14-step flow and the revised 8 steps to see what moved.</p>

            {/* "14 Steps", not "14-Steps", to match the finding heading
                above -- the hyphen belongs in "14-step flow", not here. */}
            <BeforeAfterToggle beforeLabel="Before (14 Steps)" afterLabel="After (8 Steps)" after={flowAfter} onChange={setFlowAfter} />
            {flowAfter ? (
              <img data-lb="1" src="/assets/slots/ts-flow-after.webp" alt="After: the rebuilt 8-step onboarding, annotated with the two changes that were pivoted and replaced" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "2000/1319", borderRadius: 18 }} />
            ) : (
              <img data-lb="1" src="/assets/slots/ts-flow-before.webp" alt="Before: the original 14-step onboarding, annotated with the gender prompt that was reframed, the camera simulation that was removed, and the feed curation and weight question that were cut and shifted" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "2000/1319", borderRadius: 18 }} />
            )}
          </section>

          <section id="pivot" style={section}>
            <p style={eyebrow}>An earlier idea that didn&apos;t survive testing</p>
            <h2 style={h2}>I pivoted from an AR try-on to an identity moodboard</h2>
            <p style={{ ...body, marginBottom: FIG }}>
              In an earlier session with the same 5 testers, I tested an AR try-on.{" "}
              <strong style={strong}>3 of 5</strong>{" "}
              hesitated at the idea of a body rendering, because it amplified body-image concerns instead of resolving them. That led me to pivot to an identity moodboard that reflects a user&apos;s style, not their body.
            </p>
            <img data-lb="1" src="/assets/slots/ts-ar-sketch.webp" alt="A lo-fi pen sketch of the early AR try-on concept: a figure on a phone screen with notes about a virtual tool, overlay smoothness, colour-swatch variation and Figma VR plugins" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "2000/1186", marginBottom: FIG, borderRadius: 18 }} />
            <p style={{ ...body, marginBottom: 0 }}>
              <strong style={strong}>The trade-off:</strong>{" "}
              I gave up the try-on &quot;wow&quot; moment and precise fit measurements, in exchange for a flow people would be more comfortable finishing.
            </p>
          </section>

          <section id="finalizing" style={section}>
            <p style={eyebrow}>Before Finalizing</p>
            <h2 style={h2}>Accelerating time-to-value without cognitive overload</h2>
            <p style={{ ...body, marginBottom: FIG }}>I added two usability aids and a payoff screen so inputs map to style archetypes without adding decision fatigue</p>

            {/* No NumberHeadings here any more: each export carries its own
                numbered "Added:" / "Result:" card beside the screen, so a
                heading above it would number the same item twice. */}
            <div style={{ display: "flex", flexDirection: "column", gap: FIG }}>
              <img data-lb="1" src="/assets/slots/ts-guardrail-lighting.webp" alt="1. Added: the Build your closet screen with a Photo Lighting Tips card showing good-versus-avoid examples, to prevent frustrating upload retakes" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "2000/1090", borderRadius: 18 }} />
              <img data-lb="1" src="/assets/slots/ts-guardrail-info.webp" alt="2. Added: the Fashion goals screen with info icons replacing clunky parentheticals on the option cards, reducing visual noise" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "2000/1090", borderRadius: 18 }} />
              <img data-lb="1" src="/assets/slots/ts-guardrail-archetype.webp" alt="3. Result: the payoff screen, where a user’s first answers map straight to the Quiet Confidence style archetype and a moodboard, replacing the blank cold-start screen" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "2000/1090", borderRadius: 18 }} />
            </div>
          </section>

          <section id="solution" style={section}>
            {/* Matches the sidebar's "Final Solution" exactly -- the nav
                and the heading it jumps to should not use two names. */}
            <p style={eyebrow}>Final Solution</p>
            <h2 style={h2}>I cut time-to-value from 10 minutes to under 2 minutes</h2>
            {/* The 10-to-2 figure is already carried by the subtitle, the
                Result card and the heading directly above this. A fourth
                statement of it here read as padding. */}
            <p style={{ ...body, marginBottom: FIG }}>Onboarding went from 14 to 8 screens. Instead of waiting for a full closet import, users get a personalized style archetype and mood-board from their first answers.</p>

            <BeforeAfterToggle beforeLabel="Before" afterLabel="After" after={finalAfter} onChange={setFinalAfter} />
            {finalAfter ? <PhoneVideo src="/assets/final-onboarding.mp4" label="Screen recording of the redesigned 8-step onboarding, ending on a personalized style archetype and mood-board" dataLb /> : <PhoneVideo src="/assets/onboarding-welcome.mp4" label="Screen recording of the original 14-step onboarding, with the closet import step" dataLb />}
          </section>

          <section id="reflection" style={section}>
            <p style={eyebrow}>Reflection &amp; Takeaways</p>
            <h2 style={h2}>I learned that product thinking means designing for behavior, not just screens</h2>
            <p style={body}>Usability testing with first-time users taught me to judge onboarding by what people do: whether they understand the product, make confident choices, and reach value without friction.</p>
            {/* The {" "} before <strong> is deliberate: a JSX text chunk that
                carries HTML entities and ends at a newline loses its leading
                space, which is what once shipped "testingfor onboarding". */}
            {/* GROUP, not a section gap: "If I had more time" is a
                sub-heading inside Reflection, not a new section, and the
                full 56-88px made it look like one. */}
            <p style={{ ...body, marginBottom: GROUP }}>
              Before designing a screen, I now ask,{" "}
              <strong style={strong}>&ldquo;What should the user understand, decide, or do differently because of this experience?&rdquo;</strong>
            </p>
            <h3 style={h3}>If I had more time to explore further…</h3>
            <p style={{ ...body, marginBottom: 0 }}>I&apos;d test freemium versus affiliate models, expand the archetype library based on user demand, and explore one-tap inspiration imports from platforms like Pinterest.</p>
          </section>

          <section id="outcome" style={section}>
            <p style={eyebrow}>The Outcome</p>
            <h2 style={h2}>Our team won 1st place in Design Interactive cohort (judged by LinkedIn and ServiceNow leads)</h2>
            {/* The first sentence used to repeat the heading above it
                almost word for word. Only the detail the heading does
                not already carry is left. */}
            <p style={{ ...body, marginBottom: FIG }}>At presentation night we presented our prototype in a slide deck, and the judges commended our storytelling.</p>
            <img data-lb="1" src="/assets/slots/ts-team-photo.webp" alt="The ThreadIt team on stage at Design Interactive cohort presentation night" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "3/2", borderRadius: 14, objectFit: "cover" }} />
          </section>

          <section id="thanks" style={{ marginBottom: 8 }}>
            {/* "Thank you" was landing three times in a row -- eyebrow,
                heading, then the first words of the paragraph. It is kept
                in the heading, where it carries the warmth, and dropped
                from the other two. */}
            <p style={eyebrow}>Gratitude</p>
            <h2 style={h2}>Thank you to my wonderful design team and mentors!</h2>
            <p style={body}>Jared Martinez, Grace Asuncion and Emily Wu on the design team; Sidney Heng, our design lead; and Juliana Viado (Product Designer, Leela), our industry mentor.</p>
            <p style={{ ...body, marginBottom: 0 }}>Thanks also to Chris Ota (Staff Product Designer, LinkedIn), Ken Skistimas (Director of UX, ServiceNow), and Aditi Jain (UI Designer, Computrition) for their feedback on presentation night.</p>
          </section>
        </article>
      </div>

      <CityscapeFooter />
      <Lightbox />
    </div>
  );
}
