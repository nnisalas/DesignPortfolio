"use client";

import { useState } from "react";
import SubpageHeader from "@/components/SubpageHeader";
import CaseStudySidebar from "@/components/CaseStudySidebar";
import CityscapeFooter from "@/components/CityscapeFooter";
import Lightbox from "@/components/Lightbox";
import BeforeAfterToggle from "@/components/BeforeAfterToggle";
import PhoneVideo from "@/components/PhoneVideo";

const eyebrow: React.CSSProperties = { margin: "0 0 14px", fontFamily: "var(--font-ibm-plex-sans)", fontSize: 14, fontWeight: 600, letterSpacing: ".08em", color: "#2f9fe0" };
const h2: React.CSSProperties = { margin: "0 0 22px", fontFamily: "var(--font-geist)", fontSize: "clamp(22px,5.6vw,27px)", fontWeight: 700, lineHeight: 1.2, letterSpacing: ".03em", color: "#1f2329" };
const body: React.CSSProperties = { margin: "0 0 18px", fontSize: 16, lineHeight: 1.5, letterSpacing: ".06em", color: "#3c424b" };
const section: React.CSSProperties = { marginBottom: "clamp(44px,7vh,64px)" };

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 30 }}>
      <svg viewBox="0 0 12 14" width="11" height="13" style={{ flex: "none", marginTop: 5 }}>
        <path d="M1 0 L11 7 L1 14 Z" fill="#1f2329" />
      </svg>
      <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, letterSpacing: ".06em", color: "#3c424b" }}>{children}</p>
    </div>
  );
}

function NumberHeading({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p style={{ margin: "0 0 16px", display: "flex", alignItems: "center", gap: 12, fontFamily: "var(--font-ibm-plex-sans)", fontSize: "clamp(17px,4.4vw,20px)", fontWeight: 700, color: "#1f2329" }}>
      <span style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "50%", background: "#2c3036", color: "#fff", fontSize: 15 }}>{n}</span>
      {children}
    </p>
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
        <img data-lb="1" src="/assets/threadit-hero.png" alt="ThreadIt app — three iPhone mockups of the onboarding, closet, and planner screens" style={{ display: "block", width: "100%", height: "auto" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "clamp(36px,5vw,80px)", padding: "clamp(28px,5vw,52px) clamp(22px,6vw,40px) clamp(48px,8vh,72px)" }}>
        <CaseStudySidebar />

        <article id="ts-article" style={{ minWidth: 0, maxWidth: 680, flex: "0 1 680px" }}>
          <h1 style={{ margin: "0 0 14px", fontFamily: "var(--font-ibm-plex-sans)", fontSize: "clamp(28px,7vw,36px)", fontWeight: 700, lineHeight: 1.18, letterSpacing: "-.02em", color: "#1f2329" }}>
            Mitigating First-Time User Activation Drop-offs in Onboarding
          </h1>
          <p style={{ margin: "0 0 clamp(30px,5vh,40px)", fontSize: 16, lineHeight: 1.5, letterSpacing: ".06em", fontWeight: 600, color: "#5a616b" }}>
            1st Place Winner (judged by LinkedIn &amp; ServiceNow leads)
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "clamp(22px,5vw,30px) clamp(16px,4vw,28px)", marginBottom: "clamp(40px,7vh,60px)" }}>
            {[
              { label: "Timeline", value: <>March–June 2026<br />(8 Weeks)</> },
              { label: "My Role", value: "Lead Designer" },
              { label: "Team", value: "4 Designers + 1 Design Lead" },
              { label: "Skills", value: "Figma, Design Systems, Prototyping, Hi-Fi Design, User Interviews" },
            ].map((m) => (
              <div key={m.label}>
                <h2 style={{ margin: "0 0 7px", fontFamily: "var(--font-geist)", fontSize: 16, fontWeight: 700, lineHeight: 1.2, letterSpacing: ".03em", color: "#2f9fe0" }}>{m.label}</h2>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, letterSpacing: ".06em", color: "#3c424b" }}>{m.value}</p>
              </div>
            ))}
          </div>

          <section id="overview" style={section}>
            <p style={eyebrow}>Overview</p>
            <h2 style={h2}>Everyday fashion enthusiasts curate endless style inspiration across apps, yet these images are forgotten in camera rolls due to a digital &quot;pile-up.&quot;</h2>
            <p style={body}>When attempting to action these saves, users face intense psychological friction translating a look that fits onto their own body type, while professional styling remains financially inaccessible.</p>
            <p style={{ ...body, marginBottom: 0 }}>
              Design Interactive challenged our team of 5 to democratize personal styling, but the initial <strong style={{ color: "#1f2329", fontWeight: 600 }}>First-Time User Experience (FTUX)</strong> suffered from severe funnel drop-offs during high-latency closet importation tasks.
            </p>
          </section>

          <section id="impact" style={section}>
            <p style={eyebrow}>My Impact</p>
            <h2 style={h2}>I mitigated first-time user experience (FTUX) drop-offs in onboarding</h2>
            <p style={body}>My contributions included:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "0 0 24px" }}>
              <Bullet>Owning onboarding activation funnel to optimize completion rates without compromising critical data collection.</Bullet>
              <Bullet>Designed a non-linear paced progress bar and continuous feedback loops to optimize perceived performance.</Bullet>
              <Bullet>Introduced system safeguards (cancel/pause options) and motivational microcopy to alleviate trust erosion.</Bullet>
            </div>
            <p style={{ ...body, marginBottom: 0 }}>
              After <strong style={{ color: "#1f2329", fontWeight: 600 }}>5 rounds of usability testing</strong> for onboarding, friction was slashed by <strong style={{ color: "#1f2329", fontWeight: 600 }}>46%</strong>, completely eliminating the blank-slate &quot;cold start&quot; screen by turning a user&apos;s initial answers into instant, personalized style archetypes and visual mood-boards.
            </p>
          </section>

          <section id="problem" style={section}>
            <p style={eyebrow}>The Problem</p>
            <h2 style={h2}>Initial onboarding experience required users to upload their digital closets for tailored personal recommendations</h2>
            <p style={body}>This created a high-friction bottleneck: requiring users to invest significant time upfront before experiencing core product value, which caused early drop-off in the onboarding funnel.</p>
            <p style={{ ...body, marginBottom: 26 }}>Rich user data was needed to drive accurate styling, but asking for it upfront made onboarding feel tedious and high-effort.</p>
            <PhoneVideo src="/assets/onboarding-welcome.mp4" />
          </section>

          <section id="challenge" style={section}>
            <p style={eyebrow}>The Design Challenge</p>
            <h2 style={{ ...h2, marginBottom: 0 }}>How might we deliver immediate, personalized styling value before a user even finishes importing their closet?</h2>
          </section>

          <section id="exploration" style={section}>
            <p style={eyebrow}>Design Exploration</p>
            <h2 style={h2}>Designing for perceived performance and immediate activation</h2>
            <p style={body}>My first goal was to effectively optimize the FTUX to drive user retention. I initially considered a numbered progress indicator, which is a standard onboarding pattern as it gives a clear sense of structure.</p>
            <p style={{ ...body, marginBottom: 26 }}>
              Through conducting research, I later rejected the initial idea in order to satisfy <strong style={{ color: "#1f2329", fontWeight: 600 }}>Jakob Nielson&apos;s Usability Heuristics</strong>
            </p>

            <figure style={{ position: "relative", margin: "0 0 30px", background: "#f5f5f4", borderRadius: 16, padding: "clamp(30px,6vw,44px) clamp(24px,6vw,56px)" }}>
              <span aria-hidden="true" style={{ position: "absolute", top: 14, left: 20, fontFamily: "var(--font-ibm-plex-sans)", fontSize: 52, fontWeight: 700, lineHeight: 1, color: "#2c3036" }}>&#8220;</span>
              <p style={{ margin: "0 0 12px", textAlign: "center", fontFamily: "var(--font-ibm-plex-sans)", fontSize: 15, fontWeight: 600, letterSpacing: ".05em", color: "#2f9fe0" }}>Visibility of System Status</p>
              <p style={{ margin: 0, textAlign: "center", fontSize: "clamp(16px,4vw,18px)", lineHeight: 1.5, letterSpacing: ".06em", color: "#2c3036" }}>
                The design should always keep users <strong>informed</strong> about what is going on, through <strong>appropriate feedback within reasonable time</strong>.
              </p>
              <span aria-hidden="true" style={{ position: "absolute", bottom: 6, right: 20, fontFamily: "var(--font-ibm-plex-sans)", fontSize: 52, fontWeight: 700, lineHeight: 1, color: "#2c3036" }}>&#8221;</span>
            </figure>

            <div style={{ marginBottom: 26 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,4vw,36px)", marginBottom: 14 }}>
                <p style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "var(--font-ibm-plex-sans)", fontSize: 16, fontWeight: 600, letterSpacing: ".04em", color: "#e05b4b" }}>
                  <span style={{ fontSize: 18 }}>✕</span> Numbered Step Bar
                </p>
                <p style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "var(--font-ibm-plex-sans)", fontSize: 16, fontWeight: 600, letterSpacing: ".04em", color: "#3aa864" }}>
                  <span style={{ fontSize: 18 }}>✓</span> Non-Linear Progress Bar
                </p>
              </div>
              <img data-lb="1" src="/assets/progress-bar-compare.png" alt="Numbered step bar vs non-linear progress bar comparison" style={{ display: "block", width: "100%", height: "auto", borderRadius: 18 }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "20px clamp(20px,4vw,36px)", marginBottom: 26 }}>
              {[
                { ok: false, text: <>Emphasizes amount of <strong style={{ color: "#e05b4b" }}>effort needed</strong> rather than <strong style={{ color: "#e05b4b" }}>progress made</strong>.</> },
                { ok: true, text: <>Communicates <strong style={{ color: "#3aa864" }}>progress</strong> and <strong style={{ color: "#3aa864" }}>motion</strong> without prompting users to count remaining steps</> },
                { ok: false, text: <>Creates wrong psychological signal for a <strong style={{ color: "#e05b4b" }}>FTUX design</strong> to reduce perceived friction</> },
                { ok: true, text: <>Advances faster to create momentum so onboarding feels lighter</> },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, marginTop: 2, borderRadius: "50%", background: item.ok ? "#3aa864" : "#e05b4b", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                    {item.ok ? "✓" : "✕"}
                  </span>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, letterSpacing: ".06em", color: "#3c424b" }}>{item.text}</p>
                </div>
              ))}
            </div>

            <p style={body}>Personalized styling requires perceived speed. Applying Nielson&apos;s heuristic principle gives constant feedback as users advance every moment of the onboarding flow.</p>
            <p style={{ ...body, marginBottom: 0 }}>
              <strong style={{ color: "#1f2329", fontWeight: 600 }}>The Impact:</strong> I re-architected the onboarding flow to optimize perceived performance, implementing a non-linear progress bar and continuous feedback loops that successfully accelerated first-time user activation.
            </p>
          </section>

          <section id="testing" style={section}>
            <p style={eyebrow}>User Testing</p>
            <h2 style={h2}>Stripping psychological friction from the onboarding funnel</h2>
            <p style={{ ...body, marginBottom: 26 }}>I conducted usability testing sessions with 5 users to observe where most high-latency drop offs occurred across the current onboarding flow. I gathered 4 key feedback points</p>

            <NumberHeading n={1}>14-Steps Is Too Long</NumberHeading>
            <SlotImage src="/assets/slots/ts-feedback-14steps.webp" alt="Full 14-step onboarding flow" ratio="16/11" />
            <Bullet>Users often lost the unique <strong style={{ color: "#1f2329" }}>app value propositions</strong> since onboarding ran long.</Bullet>

            <NumberHeading n={2}>Camera Simulation Felt Long</NumberHeading>
            <SlotImage src="/assets/slots/ts-feedback-camera.webp" alt="Camera permission / camera view / save option screens" ratio="16/11" />
            <Bullet>Simulated upload read as high-latency and often <strong style={{ color: "#1f2329" }}>killed early retention</strong></Bullet>

            <NumberHeading n={3}>Feed Curation Felt Too Similar</NumberHeading>
            <SlotImage src="/assets/slots/ts-feedback-feed.webp" alt="Feed curation screen + What's the difference? callout" ratio="2072/1074" />
            <Bullet>Browse + Discovery read as the same, leading to <strong style={{ color: "#1f2329" }}>difficulty visualizing</strong> the feed</Bullet>

            <NumberHeading n={4}>Inclusivity Concerns</NumberHeading>
            <SlotImage src="/assets/slots/ts-feedback-inclusivity.webp" alt="Inclusivity concerns" ratio="1360/705" />
            <Bullet>The weight + gender prompt became a <strong style={{ color: "#1f2329" }}>sensitive identity and ethical concern</strong></Bullet>

            <p style={{ ...body, marginBottom: 24 }}>After synthesizing testing findings, my next goal was to insulate the experience against high-latency drop-offs (such as physical closet importing). Based on testing findings, I revised the onboarding flow</p>

            <BeforeAfterToggle beforeLabel="Before (14-Steps)" afterLabel="After (8-Steps)" after={flowAfter} onChange={setFlowAfter} />
            {flowAfter ? (
              <img data-lb="1" src="/assets/slots/ts-flow-after.webp" alt="After — 8-step flow" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "2074/1368", borderRadius: 18, objectFit: "cover" }} />
            ) : (
              <img data-lb="1" src="/assets/slots/ts-flow-before.webp" alt="Before — 14-step flow" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "2074/1368", borderRadius: 18, objectFit: "cover" }} />
            )}
          </section>

          <section id="finalizing" style={section}>
            <p style={eyebrow}>Before Finalizing</p>
            <h2 style={h2}>Accelerating time-to-value without cognitive overload</h2>
            <p style={body}>Before finalizing the solution and to streamline the core interaction model, I introduced clear cognitive scaffolding alongside proactive error-prevention guardrails.</p>
            <p style={{ ...body, marginBottom: 26 }}>This ensured user inputs mapped effortlessly to tailored style archetypes without inducing decision fatigue.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
              <div>
                <NumberHeading n={1}>Photo Lighting Tips</NumberHeading>
                <img data-lb="1" src="/assets/slots/ts-guardrail-lighting.webp" alt="Build your closet — Lighting Tips" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "1360/741", borderRadius: 18, objectFit: "cover" }} />
              </div>
              <div>
                <NumberHeading n={2}>Contextual Info Icons</NumberHeading>
                <img data-lb="1" src="/assets/slots/ts-guardrail-info.webp" alt="Fashion goals — contextual info icons" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "1360/741", borderRadius: 18, objectFit: "cover" }} />
              </div>
              <div>
                <NumberHeading n={3}>Style Archetype + Moodboard</NumberHeading>
                <img data-lb="1" src="/assets/slots/ts-guardrail-archetype.webp" alt="Style Archetype + moodboard result" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "1360/741", borderRadius: 18, objectFit: "cover" }} />
              </div>
            </div>
          </section>

          <section id="solution" style={section}>
            <p style={eyebrow}>Finalized Solution &amp; Impact</p>
            <h2 style={h2}>After I re-architectured the onboarding flow, friction was cut by 46% across 5 rounds of testing</h2>
            <p style={{ ...body, marginBottom: 24 }}>Onboarding was cut from 14 to 8 screens, reducing time-to-value from session-end to the first session, achievable in minutes. I further reduced retention drop offs to deliver effective First-Time-User Experience.</p>

            <BeforeAfterToggle beforeLabel="Before" afterLabel="After" after={finalAfter} onChange={setFinalAfter} />
            {finalAfter ? <PhoneVideo src="/assets/final-onboarding.mp4" /> : <PhoneVideo src="/assets/onboarding-welcome.mp4" />}
          </section>

          <section id="reflection" style={section}>
            <p style={eyebrow}>Reflection &amp; Takeaways</p>
            <h2 style={h2}>I learned that product thinking adopts an outcome mindset</h2>
            <p style={body}>Working closely with design mentors, I received valuable feedback. I learned that product thinking involves adopting an outcome mindset: measuring success through behavioral changes.</p>
            <p style={{ ...body, marginBottom: 30 }}>A product&apos;s feature value heavily considers the decisions and behaviors a user makes. Before designing screens, I carry forward a key question: what decision or action should a user make differently?</p>
            <h3 style={{ margin: "0 0 18px", fontFamily: "var(--font-ibm-plex-sans)", fontSize: "clamp(19px,5vw,23px)", fontWeight: 700, lineHeight: 1.3, color: "#1f2329" }}>If I had more time to explore further…</h3>
            <p style={{ ...body, marginBottom: 0 }}>I would take the product further and explore business model features (freemium vs. affiliate), expanded archetype libraries, and API integration for one-tap inspiration import through platforms such as Pinterest.</p>
          </section>

          <section id="outcome" style={section}>
            <p style={eyebrow}>The Outcome!</p>
            <h2 style={h2}>Our team won 1st place in Design Interactive cohort (judged by LinkedIn and ServiceNow leads)</h2>
            <p style={{ ...body, marginBottom: 26 }}>During cohort presentation night, my team presented a slide deck of our prototype. The judges commended our use of storytelling and as a result..we won first place!</p>
            <img data-lb="1" src="/assets/slots/ts-team-photo.webp" alt="Team photo — presentation night" style={{ display: "block", height: "auto", width: "100%", aspectRatio: "3/2", borderRadius: 14, objectFit: "cover" }} />
          </section>

          <section id="thanks" style={{ marginBottom: 8 }}>
            <p style={eyebrow}>Gratitude &amp; Special Thanks</p>
            <h2 style={h2}>Thank you to my wonderful design team and mentors!</h2>
            <p style={body}>A special shout-out to my design members: Jared Martinez, Grace Asuncion &amp; Emily Wu! A bigger shout-out to my design lead, Sidney Heng and my team&apos;s industry mentor Juliana Viado (Product Designer, Leela) providing guidance throughout the cohort! It was super rewarding to have worked alongside my members; who each provided valuable perspectives that I carry forward onto my future works.</p>
            <p style={{ ...body, marginBottom: 0 }}>Special Shoutouts to Chris Ota (Staff Product Designer, LinkedIn), Ken Skistimas (Director of UX, ServiceNow), Aditi Jain (UI Designer, Computrition) and my team&apos;s industry mentor Juliana Viado (Product Designer, Leela) for providing valuable feedback during presentation night!</p>
          </section>
        </article>
      </div>

      <CityscapeFooter />
      <Lightbox />
    </div>
  );
}
