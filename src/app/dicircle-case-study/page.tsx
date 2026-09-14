"use client";

import { useState } from "react";
import SubpageHeader from "@/components/SubpageHeader";
import CaseStudySidebar, { type SidebarSection } from "@/components/CaseStudySidebar";
import CityscapeFooter from "@/components/CityscapeFooter";
import Lightbox from "@/components/Lightbox";
import BeforeAfterToggle from "@/components/BeforeAfterToggle";

// Shares ThreadIt's type scale and section rhythm so the two case studies
// read as one system.
const eyebrow: React.CSSProperties = { margin: "0 0 14px", fontFamily: "var(--font-ibm-plex-sans)", fontSize: 14, fontWeight: 600, letterSpacing: ".08em", color: "#2f9fe0" };
const h2: React.CSSProperties = { margin: "0 0 22px", fontFamily: "var(--font-geist)", fontSize: "clamp(22px,5.6vw,27px)", fontWeight: 700, lineHeight: 1.2, letterSpacing: ".03em", color: "#1f2329" };
const h3: React.CSSProperties = { margin: "0 0 14px", fontFamily: "var(--font-ibm-plex-sans)", fontSize: "clamp(19px,5vw,23px)", fontWeight: 700, lineHeight: 1.3, color: "#1f2329" };
const body: React.CSSProperties = { margin: "0 0 18px", fontSize: 16, lineHeight: 1.5, letterSpacing: ".06em", color: "#3c424b" };
const section: React.CSSProperties = { marginBottom: "clamp(44px,7vh,64px)" };
const strong: React.CSSProperties = { color: "#1f2329", fontWeight: 600 };

// Mirrors the page's blue eyebrow headings, in document order, rather than
// the grouping used in the design file. Module-level so the sidebar's scroll
// listener subscribes once (see CaseStudySidebar).
const SECTIONS: SidebarSection[] = [
  { id: "overview", label: "Overview" },
  { id: "impact", label: "My Impact" },
  { id: "artifacts", label: "Key Artifacts" },
  { id: "problem", label: "The Problem" },
  { id: "research", label: "Research Insights" },
  { id: "challenge", label: "Design Challenge" },
  { id: "moments", label: "Key Design Moments" },
  { id: "results", label: "Impact" },
  { id: "reflection", label: "Reflections" },
];

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

/** A screen recording centred in the bordered frame (see .dc-frame). */
function VideoFrame({ src, label }: { src: string; label: string }) {
  return (
    <div className="dc-frame">
      <video src={src} autoPlay loop muted playsInline aria-label={label} />
    </div>
  );
}

/** A caption point below a comparison figure. Values are copied verbatim from
 *  the ThreadIt page's pro/con list (22px circle, #3aa864 / #e05b4b, white
 *  glyph at 12/700) so the two case studies render identically. */
function Point({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span
        style={{
          flex: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          marginTop: 2,
          borderRadius: "50%",
          background: ok ? "#3aa864" : "#e05b4b",
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {ok ? "✓" : "✕"}
      </span>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, letterSpacing: ".06em", color: "#3c424b" }}>{children}</p>
    </div>
  );
}

/** A full-width case-study image. data-lb opens it in the Lightbox, which is
 *  how these wide annotated diagrams stay readable in a phone-width column. */
function Figure({ src, alt, mb = 18 }: { src: string; alt: string; mb?: number }) {
  return <img data-lb="1" src={src} alt={alt} style={{ display: "block", width: "100%", height: "auto", marginBottom: mb, borderRadius: 18 }} />;
}

export default function DiCircleCaseStudy() {
  const [profileAfter, setProfileAfter] = useState(false);
  const [messagingAfter, setMessagingAfter] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%", background: "#ffffff", overflowX: "clip" }}>
      <SubpageHeader />

      {/* HERO COVER */}
      <div style={{ overflow: "hidden", background: "#eef4fc" }}>
        <img data-lb="1" src="/assets/dicircle-hero.webp" alt="The di.circle My Connections and Messages screens shown side by side" style={{ display: "block", width: "100%", height: "auto" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "clamp(36px,5vw,80px)", padding: "clamp(28px,5vw,52px) clamp(22px,6vw,40px) clamp(48px,8vh,72px)" }}>
        <CaseStudySidebar sections={SECTIONS} />

        <article id="ts-article" style={{ minWidth: 0, maxWidth: 680, flex: "0 1 680px" }}>
          <h1 style={{ margin: "0 0 14px", fontFamily: "var(--font-ibm-plex-sans)", fontSize: "clamp(28px,7vw,36px)", fontWeight: 700, lineHeight: 1.18, letterSpacing: "-.02em", color: "#1f2329" }}>
            Lowering the psychological barrier to starting and maintaining professional relationships
          </h1>
          <p style={{ margin: "0 0 clamp(30px,5vh,40px)", fontSize: 16, lineHeight: 1.5, letterSpacing: ".06em", fontWeight: 600, color: "#5a616b" }}>
            Redesigning student-to-professional outreach through insights from 8 usability tests
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "clamp(22px,5vw,30px) clamp(16px,4vw,28px)", marginBottom: "clamp(40px,7vh,60px)" }}>
            {[
              { label: "Timeline", value: <>Oct – Dec 2025<br />(8 Weeks)</> },
              { label: "My Role", value: "Lead Designer" },
              { label: "Team", value: "3 Designers + 1 Design Lead" },
              { label: "Skills", value: "Figma, FigJam, Prototyping, User Interviews" },
            ].map((m) => (
              <div key={m.label}>
                <h2 style={{ margin: "0 0 7px", fontFamily: "var(--font-geist)", fontSize: 16, fontWeight: 700, lineHeight: 1.2, letterSpacing: ".03em", color: "#2f9fe0" }}>{m.label}</h2>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, letterSpacing: ".06em", color: "#3c424b" }}>{m.value}</p>
              </div>
            ))}
          </div>

          <section id="overview" style={section}>
            <p style={eyebrow}>Overview</p>
            <h2 style={h2}>Students have access to a network of industry professionals, but students face difficulties in outreach</h2>
            <p style={body}>When students attempt to start a conversation and maintain a relationship with a professional, they&apos;re met with intimidation and uncertainty. This results in potential connections often becoming a collection of unopened profiles and unsent messages.</p>
            <p style={{ ...body, marginBottom: 0 }}>Design Interactive challenged our team of 4 to design an accessible outreach experience for students connecting with a professional network.</p>
          </section>

          <section id="impact" style={section}>
            <p style={eyebrow}>My Impact</p>
            <h2 style={h2}>I redesigned the connection journey to reduce friction in professional outreach</h2>
            <p style={body}>My contributions included:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "0 0 24px" }}>
              <Bullet>Designed and owned connect requests, relationship management, and the messaging experience.</Bullet>
              <Bullet>Applied behavioral psychology principles to redesign iterations, reducing user friction.</Bullet>
              <Bullet>Refined community profiles to better support the transition from evaluating a potential connection to reaching out.</Bullet>
            </div>
            <p style={{ ...body, marginBottom: 0 }}>
              Across <strong style={strong}>8 rounds of usability testing</strong>, I identified and addressed high-risk friction points across a student&apos;s connection journey, from finding a professional to initiating and maintaining a relationship.
            </p>
          </section>

          <section id="artifacts" style={section}>
            <p style={eyebrow}>Key Artifacts</p>
            <h2 style={h2}>Designing an end-to-end experience to help students move from discovering a professional to building an ongoing relationship</h2>

            <h3 style={h3}>Connecting with a professional</h3>
            <p style={body}>A connection flow designed to give students enough context and confidence before reaching out.</p>
            <VideoFrame src="/assets/dc-connecting.mp4" label="Screen recording of the di.circle Community Hub: browsing professional profiles and sending a connect request" />

            <h3 style={{ ...h3, marginTop: 34 }}>Relationship management</h3>
            <p style={body}>A management flow for filtering and maintaining professional relationships.</p>
            <VideoFrame src="/assets/dc-connections.mp4" label="Screen recording of the di.circle My Connections screen: filtering connections and reading their relationship states" />

            <h3 style={{ ...h3, marginTop: 34 }}>Messaging Experience</h3>
            <p style={body}>A conversation flow that gives students a lower-pressure starting point after connecting.</p>
            <VideoFrame src="/assets/dc-messaging.mp4" label="Screen recording of the di.circle messaging experience: guided prompts for opening a first conversation" />
          </section>

          <section id="problem" style={section}>
            <p style={eyebrow}>The Problem</p>
            <h2 style={h2}>Students lacked the confidence, context, and low-pressure opportunities needed to initiate the first conversation</h2>
            <p style={body}>They faced barriers such as intimidation around reaching out, uncertainty about how to start a conversation, and difficulty maintaining relationships.</p>
            <p style={{ ...body, marginBottom: 0 }}>This often results in friction between finding the right person and building a genuine connection.</p>
          </section>

          <section id="research" style={section}>
            <p style={eyebrow}>Research Insights</p>
            <h2 style={h2}>The biggest friction occurred between finding someone and feeling ready to reach out</h2>
            <p style={body}>
              Before designing, I wanted to understand what exactly made professional outreach feel difficult and where students hesitated most throughout the connection process. Across{" "}
              <strong style={strong}>11 collected interviews with college students</strong>, the key insights were:
            </p>

            {/* The four quotes are spelled out in the alt text so they're still
                available to screen readers and search, since the image itself
                carries them as pixels. */}
            <Figure src="/assets/dc-research-quotes.webp" alt="Four interview quotes: “I don’t know if they’re willing to talk to me.” · “I want to know more about them.” · “I’m not sure how to start a conversation.” · “Conversations should feel less shallow.”" mb={26} />

            <p style={body}>Research revealed that students could find professionals, but often lacked the confidence and context needed to decide whether and how to initiate contact.</p>

            <Figure src="/assets/dc-journey-before.webp" alt="User Connection Journey: 01 Finding a professional, 02 Evaluating a profile, 03 Starting a conversation, 04 Maintaining the relationship — with drop-offs marked between stages 01 and 02" />

            <p style={body}>The highest-friction moments occurred around evaluating whether to reach out, initiating the connection, and knowing what to do afterward.</p>
            <p style={{ ...body, marginBottom: 0 }}>This reframed the design problem from helping students find professionals to helping them feel confident enough to build a relationship.</p>
          </section>

          <section id="challenge" style={section}>
            <p style={eyebrow}>Design Challenge</p>
            <h2 style={{ ...h2, marginBottom: 0 }}>How might we make professional relationships easier to start and maintain?</h2>
          </section>

          <section id="moments" style={section}>
            <p style={eyebrow}>Key Design Moments</p>
            <h2 style={h2}>Across 8 usability tests, I identified three moments where students needed more confidence, context, or support to move forward</h2>
            <p style={{ ...body, marginBottom: 34 }}>I refined these interactions based on what users struggled with — not by redesigning every screen, but by focusing on the moments that most affected the connection journey.</p>

            <h3 style={h3}>Testing revealed that users wanted to understand a professional before deciding whether to reach out</h3>
            <p style={body}>I explored how much information was enough to make that decision without overwhelming them, through community profile cards.</p>
            <BeforeAfterToggle beforeLabel="Before" afterLabel="After" after={profileAfter} onChange={setProfileAfter} />
            {/* Same shape as ThreadIt's toggle: two sibling visuals swapped by
                state, so each slot is a direct 1:1 swap for the real export. */}
            {profileAfter ? (
              <Figure src="/assets/dc-profile-after.webp" alt="The redesigned profile card, annotated: 1. Signal approachability — Open to Chat and Last Active indicators, 2. Introduce an evaluation step — a View Profile button, 3. Surface common ground — shared interests shown on the profile" />
            ) : (
              <Figure src="/assets/dc-profile-before.webp" alt="The original profile card, annotated: 1. No signal of approachability — users couldn’t tell whether a professional was open to being contacted, 2. Connect came too early — the primary CTA asked users to commit before they had enough context" />
            )}
            <Bullet>Rather than asking users to commit immediately, I introduced a lower-pressure evaluation step that lets them understand the person before deciding to reach out.</Bullet>

            <h3 style={{ ...h3, marginTop: 34 }}>Making the first connection feel intentional, clear, and low-pressure</h3>
            <p style={body}>Even after deciding to connect, users noted that they needed more control over how they initiated the relationship. While they knew more about the person, there was still hesitation in initiating the connection.</p>
            <Figure
              src="/assets/dc-connect-request.webp"
              alt="The connect request flow: a connected profile, a profile with a Send Connect Request button, and the request sheet asking why you'd like to connect with an optional note"
              mb={26}
            />
            {/* One drawback against three gains, so the columns are explicit
                rather than an auto-flow grid -- auto-flow would interleave
                them down the two tracks instead of keeping them apart. */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "20px clamp(20px,4vw,36px)", marginBottom: 26 }}>
              <Point ok={false}>Users hesitated when asked to commit before they had enough context.</Point>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Point ok>Users can communicate why they&apos;re reaching out with clear intent</Point>
                <Point ok>Keeps personalization low-pressure with an optional note to add context</Point>
                <Point ok>Users can decide how they want to connect before sending the request</Point>
              </div>
            </div>
            <Bullet>I turned &ldquo;Connect&rdquo; into a more intentional interaction by giving users a way to communicate their reason for reaching out, while keeping personalization optional.</Bullet>

            <h3 style={{ ...h3, marginTop: 34 }}>Making relationship states visible after connecting</h3>
            <p style={body}>Once a connection request is sent, users needed a clear way to understand their relationship state and decide what to do next. I explored ways for users to manage their relationships.</p>
            <Figure src="/assets/dc-connections-managing.webp" alt="The My Connections screen annotated with three callouts: 1. Relationship states give clarity on the current state, 2. Card filters help users find the relevant profile without endless scrolling, 3. Messaging serves as the next action to continue the relationship" />
            <Bullet>I shifted the experience from simply storing connections to helping users understand and act on their relationships.</Bullet>

            <h3 style={{ ...h3, marginTop: 34 }}>Help users start and maintain the conversation to build the relationship</h3>
            <p style={body}>The blank message field created another psychological barrier. After connecting with someone, users were still faced with an open-ended question: &ldquo;What do I say?&rdquo;</p>
            <BeforeAfterToggle beforeLabel="Before" afterLabel="After" after={messagingAfter} onChange={setMessagingAfter} />
            {messagingAfter ? (
              <Figure src="/assets/dc-messaging-after.webp" alt="The redesigned messaging screen, annotated: Guiding Questions — optional conversation starters that give users a low-pressure starting point without forcing a scripted interaction" />
            ) : (
              <Figure src="/assets/dc-messaging-before.webp" alt="The original messaging screen, annotated: Blank-Screen State — a blank message field requiring users to start a conversation from scratch" />
            )}
            <Bullet>Rather than asking users to figure out what to say on their own, I introduced optional prompts that turn a blank conversation into an actionable starting point.</Bullet>
          </section>

          <section id="results" style={section}>
            <p style={eyebrow}>Impact</p>
            <h2 style={h2}>I turned a high-friction connection flow into a clearer path toward relationship-building</h2>
            <p style={body}>Across 8 rounds of usability testing, I identified and addressed friction across a student&apos;s connection journey, from finding a professional to initiating and maintaining a relationship.</p>
            <Figure src="/assets/dc-journey-after.webp" alt="The User Connection Journey after the redesign: all four stages connected through to “Users can outreach with confidence!”" />
            <Bullet>Rather than measuring success by the number of screens completed, I observed and measured success through users&apos; behaviors throughout the experience, and whether it reduced the friction between wanting to connect and feeling confident enough to reach out.</Bullet>
          </section>

          <section id="reflection" style={{ marginBottom: 8 }}>
            <p style={eyebrow}>Reflections</p>
            <h2 style={h2}>I learned to design for the behavior behind the interaction</h2>
            <p style={{ ...body, marginBottom: 0 }}>Students have the accessibility to connect with professionals, but the hardest part was feeling confident enough to act on it. Through usability testing, I learned that reducing friction isn&apos;t always about simplifying an interface. Giving users the context, reassurance, and guidance they need to take the next step is just as important.</p>
          </section>
        </article>
      </div>

      <CityscapeFooter />
      <Lightbox />
    </div>
  );
}
