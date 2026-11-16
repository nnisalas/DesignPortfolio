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

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: "var(--space-list-item)" }}>
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

function SlotImage({ src, alt, ratio }: { src: string; alt: string; ratio: string }) {
  return (
    <img
      data-lb="1"
      src={src}
      alt={alt}
      style={{ display: "block", height: "auto", width: "100%", aspectRatio: ratio, marginBottom: 18, borderRadius: 18, objectFit: "cover" }}
    />
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
          <h1 className="t-headline" style={{ margin: "0 0 var(--space-headline-to-body)" }}>
            Mitigating First-Time User Activation Drop-offs in Onboarding
          </h1>
          <p style={{ ...body, marginBottom: "var(--space-section)" }}>
            1st Place Winner (judged by LinkedIn &amp; ServiceNow leads)
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "clamp(22px,5vw,30px) clamp(16px,4vw,28px)", marginBottom: "var(--space-section)" }}>
            {[
              { label: "Timeline", value: <>March–June 2026<br />(8 Weeks)</> },
              { label: "My Role", value: "Lead Designer" },
              { label: "Team", value: "4 Designers + 1 Design Lead" },
              { label: "Skills", value: "Figma, Design Systems, Prototyping, Hi-Fi Design, User Interviews" },
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
            <h2 style={h2}>Everyday fashion enthusiasts curate endless style inspiration across apps, yet these images are forgotten in camera rolls due to a digital &quot;pile-up.&quot;</h2>
            <p style={body}>When attempting to action these saves, users face intense psychological friction translating a look that fits onto their own body type, while professional styling remains financially inaccessible.</p>
            <p style={{ ...body, marginBottom: 0 }}>
              Design Interactive challenged our team of 5 to democratize personal styling, but the initial <strong style={strong}>First-Time User Experience (FTUX)</strong> suffered from severe funnel drop-offs during high-latency closet importation tasks.
            </p>
          </section>

          <section id="impact" style={section}>
            <p style={eyebrow}>My Impact</p>
            <h2 style={h2}>I mitigated first-time user experience (FTUX) drop-offs in onboarding</h2>
            <p style={body}>My contributions included:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "0 0 24px" }}>
              <Bullet>Owned the onboarding activation funnel to optimize completion rates without compromising critical data collection.</Bullet>
              <Bullet>Designed a non-linear paced progress bar and continuous feedback loops to optimize perceived performance.</Bullet>
              <Bullet>Introduced system safeguards (cancel/pause options) and motivational microcopy to alleviate trust erosion.</Bullet>
            </div>
            <p style={{ ...body, marginBottom: 0 }}>
              {/* explicit {" "}: this text chunk carries HTML entities and ends
                  at a newline, and in that combination JSX drops the leading
                  space, closing "testing for" up to "testingfor" */}
              After <strong style={strong}>5 rounds of usability testing</strong>{" "}
              for onboarding, I accelerated time-to-value from 10 minutes to under 2 minutes. This eliminated the blank-slate &quot;cold start&quot; screen by turning a user&apos;s initial answers into instant, personalized style archetypes and visual mood-boards.
            </p>
          </section>

          <section id="problem" style={section}>
            <p style={eyebrow}>The Problem</p>
            <h2 style={h2}>Initial onboarding experience required users to upload their digital closets for tailored personal recommendations</h2>
            <p style={body}>This created a high-friction bottleneck: requiring users to invest significant time upfront before experiencing core product value, which caused early drop-off in the onboarding funnel.</p>
            <p style={{ ...body, marginBottom: "var(--space-section)" }}>Rich user data was needed to drive accurate styling, but asking for it upfront made onboarding feel tedious and high-effort.</p>
            <PhoneVideo src="/assets/onboarding-welcome.mp4" label="Screen recording of the original ThreadIt onboarding: the welcome screen followed by the closet import step" dataLb />
          </section>

          <section id="challenge" style={section}>
            <p style={eyebrow}>The Design Challenge</p>
            <h2 style={{ ...h2, marginBottom: 0 }}>How might we deliver immediate, personalized styling value before a user even finishes importing their closet?</h2>
          </section>

          <section id="exploration" style={section}>
            <p style={eyebrow}>Design Exploration</p>
            <h2 style={h2}>Designing for perceived performance and immediate activation</h2>
            <p style={body}>My first goal was to effectively optimize the FTUX to drive user retention. I initially considered a numbered progress indicator, which is a standard onboarding pattern as it gives a clear sense of structure.</p>
            <p style={{ ...body, marginBottom: "var(--space-section)" }}>
              Through conducting research, I later rejected the initial idea in order to satisfy <strong style={strong}>Jakob Nielsen&apos;s Usability Heuristics</strong>
            </p>

            {/* The two quote marks are ornament, not text in the system: they
                carry no reading content (aria-hidden) and are sized as a
                graphic. Everything readable inside is Label + body. */}
            <figure style={{ position: "relative", margin: "0 0 var(--space-section)", background: "#f5f5f4", borderRadius: 16, padding: "clamp(30px,6vw,44px) clamp(24px,6vw,56px)" }}>
              <span aria-hidden="true" style={{ position: "absolute", top: 14, left: 20, fontSize: 52, fontWeight: "var(--weight-medium)", lineHeight: 1, color: "var(--color-headline)" }}>&#8220;</span>
              <p style={{ ...eyebrow, textAlign: "center" }}>Visibility of System Status</p>
              <p style={{ ...body, margin: 0, textAlign: "center" }}>
                The design should always keep users <strong>informed</strong> about what is going on, through <strong>appropriate feedback within reasonable time</strong>.
              </p>
              <span aria-hidden="true" style={{ position: "absolute", bottom: 6, right: 20, fontSize: 52, fontWeight: "var(--weight-medium)", lineHeight: 1, color: "var(--color-headline)" }}>&#8221;</span>
            </figure>

            <div style={{ marginBottom: "var(--space-paragraph)" }}>
              {/* Before/after comparison markers: Label style, in their own
                  semantic red/green rather than the label colours. */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,4vw,36px)", marginBottom: "var(--space-paragraph)" }}>
                <p className="t-label" style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: NEG }}>
                  <span aria-hidden="true">✕</span> Numbered Step Bar
                </p>
                <p className="t-label" style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: POS }}>
                  <span aria-hidden="true">✓</span> Non-Linear Progress Bar
                </p>
              </div>
              <img data-lb="1" src="/assets/progress-bar-compare.webp" alt="Side-by-side comparison: a numbered step bar showing a step count, against a non-linear progress bar that shows motion without one" style={{ display: "block", width: "100%", height: "auto", borderRadius: 18 }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "var(--space-paragraph) clamp(20px,4vw,36px)", marginBottom: "var(--space-section)" }}>
              {[
                { ok: false, text: <>Emphasizes amount of <strong style={{ color: NEG }}>effort needed</strong> rather than <strong style={{ color: NEG }}>progress made</strong>.</> },
                { ok: true, text: <>Communicates <strong style={{ color: POS }}>progress</strong> and <strong style={{ color: POS }}>motion</strong> without prompting users to count remaining steps.</> },
                { ok: false, text: <>Creates the wrong psychological signal for a <strong style={{ color: NEG }}>FTUX design</strong> to reduce perceived friction.</> },
                { ok: true, text: <>Advances faster to create momentum so onboarding feels lighter.</> },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span aria-hidden="true" style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, marginTop: 3, borderRadius: "50%", background: item.ok ? POS : NEG, color: "#fff", fontSize: 11, fontWeight: "var(--weight-medium)" }}>
                    {item.ok ? "✓" : "✕"}
                  </span>
                  <p style={{ ...body, margin: 0 }}>{item.text}</p>
                </div>
              ))}
            </div>

            <p style={body}>Personalized styling requires perceived speed. Applying Nielsen&apos;s heuristic principle gives constant feedback as users advance every moment of the onboarding flow.</p>
            <p style={{ ...body, marginBottom: 0 }}>
              <strong style={strong}>The Impact:</strong> I re-architected the onboarding flow to optimize perceived performance, implementing a non-linear progress bar and continuous feedback loops that successfully accelerated first-time user activation.
            </p>
          </section>

          <section id="testing" style={section}>
            <p style={eyebrow}>User Testing</p>
            <h2 style={h2}>Stripping psychological friction from the onboarding funnel</h2>
            <p style={{ ...body, marginBottom: "var(--space-section)" }}>I conducted usability testing sessions with 5 users to observe where most high-latency drop-offs occurred across the current onboarding flow. I gathered 4 key feedback points:</p>

            <NumberHeading n={1}>14 Steps Is Too Long</NumberHeading>
            <SlotImage src="/assets/slots/ts-feedback-14steps.webp" alt="Full 14-step onboarding flow" ratio="16/11" />
            <Bullet>Users often lost the unique <strong style={strong}>app value propositions</strong> since onboarding ran long.</Bullet>

            <NumberHeading n={2}>Camera Simulation Felt Long</NumberHeading>
            <SlotImage src="/assets/slots/ts-feedback-camera.webp" alt="Camera permission / camera view / save option screens" ratio="16/11" />
            <Bullet>Simulated upload read as high-latency and often <strong style={strong}>killed early retention</strong>.</Bullet>

            <NumberHeading n={3}>Feed Curation Felt Too Similar</NumberHeading>
            <SlotImage src="/assets/slots/ts-feedback-feed.webp" alt="Feed curation screen + What's the difference? callout" ratio="2072/1074" />
            <Bullet>Browse + Discovery read as the same, leading to <strong style={strong}>difficulty visualizing</strong> the feed.</Bullet>

            <NumberHeading n={4}>Inclusivity Concerns</NumberHeading>
            <SlotImage src="/assets/slots/ts-feedback-inclusivity.webp" alt="Inclusivity concerns" ratio="1360/705" />
            <Bullet>The weight + gender prompt became a <strong style={strong}>sensitive identity and ethical concern</strong>.</Bullet>

            <p style={{ ...body, marginBottom: "var(--space-section)" }}>After synthesizing testing findings, my next goal was to insulate the experience against high-latency drop-offs (such as physical closet importing). Based on testing findings, I revised the onboarding flow</p>

            <BeforeAfterToggle beforeLabel="Before (14-Steps)" afterLabel="After (8-Steps)" after={flowAfter} onChange={setFlowAfter} />
            {flowAfter ? (
              <img data-lb="1" src="/assets/slots/ts-flow-after.webp" alt="After: the rebuilt onboarding as an 8-step flow diagram" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "2074/1368", borderRadius: 18, objectFit: "cover" }} />
            ) : (
              <img data-lb="1" src="/assets/slots/ts-flow-before.webp" alt="Before: the original onboarding as a 14-step flow diagram" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "2074/1368", borderRadius: 18, objectFit: "cover" }} />
            )}
          </section>

          <section id="finalizing" style={section}>
            <p style={eyebrow}>Before Finalizing</p>
            <h2 style={h2}>Accelerating time-to-value without cognitive overload</h2>
            <p style={body}>Before finalizing the solution and to streamline the core interaction model, I introduced clear cognitive scaffolding alongside proactive error-prevention guardrails.</p>
            <p style={{ ...body, marginBottom: "var(--space-section)" }}>This ensured user inputs mapped effortlessly to tailored style archetypes without inducing decision fatigue.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-section)" }}>
              <div>
                <NumberHeading n={1}>Photo Lighting Tips</NumberHeading>
                <img data-lb="1" src="/assets/slots/ts-guardrail-lighting.webp" alt="The Build your closet screen with a lighting tips callout guiding users to photograph garments in even light" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "1360/741", borderRadius: 18, objectFit: "cover" }} />
              </div>
              <div>
                <NumberHeading n={2}>Contextual Info Icons</NumberHeading>
                <img data-lb="1" src="/assets/slots/ts-guardrail-info.webp" alt="The Fashion goals screen, each option carrying an info icon that explains what the goal means" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "1360/741", borderRadius: 18, objectFit: "cover" }} />
              </div>
              <div>
                <NumberHeading n={3}>Style Archetype + Moodboard</NumberHeading>
                <img data-lb="1" src="/assets/slots/ts-guardrail-archetype.webp" alt="The result screen: a personalized style archetype with a visual mood-board of matching outfits" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "1360/741", borderRadius: 18, objectFit: "cover" }} />
              </div>
            </div>
          </section>

          <section id="solution" style={section}>
            <p style={eyebrow}>Finalized Solution &amp; Impact</p>
            <h2 style={h2}>After I re-architected the onboarding flow, I reduced time-to-value from 10 minutes to under 2 minutes</h2>
            <p style={{ ...body, marginBottom: "var(--space-section)" }}>Onboarding was cut from 14 to 8 screens, reducing time-to-value from session-end to the first session, achievable in under 2 minutes. I further reduced retention drop-offs to deliver an effective First-Time-User Experience.</p>

            <BeforeAfterToggle beforeLabel="Before" afterLabel="After" after={finalAfter} onChange={setFinalAfter} />
            {finalAfter ? <PhoneVideo src="/assets/final-onboarding.mp4" label="Screen recording of the redesigned 8-step onboarding, ending on a personalized style archetype and mood-board" dataLb /> : <PhoneVideo src="/assets/onboarding-welcome.mp4" label="Screen recording of the original 14-step onboarding, with the closet import step" dataLb />}
          </section>

          <section id="reflection" style={section}>
            <p style={eyebrow}>Reflection &amp; Takeaways</p>
            <h2 style={h2}>I learned that product thinking means designing for behavior, not just screens</h2>
            {/* The {" "} before each <strong> is deliberate: a JSX text chunk that
                carries HTML entities and ends at a newline loses its leading
                space, which is what once shipped "testingfor onboarding". */}
            <p style={body}>
              Product thinking pushed me to evaluate success through{" "}
              <strong style={strong}>what users actually do</strong>, not simply how a feature looks or functions. Through usability testing with first-time users, I learned that onboarding decisions are best validated by observing whether users understand the product, make confident choices, and reach value without friction.
            </p>
            <p style={{ ...body, marginBottom: "var(--space-section)" }}>
              This changed how I approach design: before designing a screen, I now ask,{" "}
              <strong style={strong}>&ldquo;What should the user understand, decide, or do differently because of this experience?&rdquo;</strong>
            </p>
            <h3 style={h3}>If I had more time to explore further…</h3>
            <p style={{ ...body, marginBottom: 0 }}>
              I would take the product beyond the core experience by exploring{" "}
              <strong style={strong}>sustainable business models, personalization, and ecosystem integrations</strong>. I&apos;d test freemium versus affiliate models, expand the archetype library based on user demand, and explore integrations with platforms like Pinterest to enable one-tap inspiration imports.
            </p>
          </section>

          <section id="outcome" style={section}>
            <p style={eyebrow}>The Outcome!</p>
            <h2 style={h2}>Our team won 1st place in Design Interactive cohort (judged by LinkedIn and ServiceNow leads)</h2>
            <p style={{ ...body, marginBottom: "var(--space-section)" }}>During cohort presentation night, my team presented a slide deck of our prototype. The judges commended our use of storytelling and, as a result, we won first place!</p>
            <img data-lb="1" src="/assets/slots/ts-team-photo.webp" alt="The ThreadIt team on stage at Design Interactive cohort presentation night" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "3/2", borderRadius: 14, objectFit: "cover" }} />
          </section>

          <section id="thanks" style={{ marginBottom: 8 }}>
            <p style={eyebrow}>Gratitude &amp; Special Thanks</p>
            <h2 style={h2}>Thank you to my wonderful design team and mentors!</h2>
            <p style={body}>A special shout-out to my design members: Jared Martinez, Grace Asuncion &amp; Emily Wu! A bigger shout-out to my design lead, Sidney Heng, and my team&apos;s industry mentor Juliana Viado (Product Designer, Leela), for providing guidance throughout the cohort! It was super rewarding to have worked alongside my members, who each provided valuable perspectives that I carry forward into my future work.</p>
            <p style={{ ...body, marginBottom: 0 }}>Special shout-outs to Chris Ota (Staff Product Designer, LinkedIn), Ken Skistimas (Director of UX, ServiceNow), Aditi Jain (UI Designer, Computrition) and my team&apos;s industry mentor Juliana Viado (Product Designer, Leela) for providing valuable feedback during presentation night!</p>
          </section>
        </article>
      </div>

      <CityscapeFooter />
      <Lightbox />
    </div>
  );
}
