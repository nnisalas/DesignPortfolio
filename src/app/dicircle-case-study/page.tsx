"use client";

import { useState } from "react";
import SubpageHeader from "@/components/SubpageHeader";
import CaseStudySidebar, { type SidebarSection } from "@/components/CaseStudySidebar";
import CityscapeFooter from "@/components/CityscapeFooter";
import Lightbox from "@/components/Lightbox";
import BeforeAfterToggle from "@/components/BeforeAfterToggle";
import CaseStudyVideo from "@/components/CaseStudyVideo";

// Shares ThreadIt's type scale and section rhythm so the two case studies
// read as one system.
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

// See the note on the same pair in the ThreadIt page: the originals were
// under AA on white, and the Label size makes that worse, not better.
const POS = "#1f7a46";
const NEG = "#b4342a";

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
  { id: "outcome", label: "The Outcome" },
];

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

/** A screen recording centred in the bordered frame (see .dc-frame). */
function VideoFrame({ src, label }: { src: string; label: string }) {
  return (
    <div className="dc-frame" data-lb="1">
      <CaseStudyVideo src={src} label={label} />
    </div>
  );
}

/** A caption point below a comparison figure. Matches the ThreadIt page's
 *  pro/con list exactly (20px circle, POS/NEG, white glyph) so the two case
 *  studies render identically. */
function Point({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span
        aria-hidden="true"
        style={{
          flex: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          marginTop: 3,
          borderRadius: "50%",
          background: ok ? POS : NEG,
          color: "#fff",
          fontSize: 11,
          fontWeight: "var(--weight-medium)",
        }}
      >
        {ok ? "✓" : "✕"}
      </span>
      <p style={{ ...body, margin: 0 }}>{children}</p>
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

        <article id="ts-article" style={{ minWidth: 0, maxWidth: "var(--measure)", flex: "0 1 var(--measure)" }}>
          <h1 className="t-headline" style={{ margin: "0 0 var(--space-headline-to-body)" }}>
            Lowering the psychological barrier to starting and maintaining professional relationships
          </h1>
          <p style={{ ...body, marginBottom: "var(--space-section)" }}>
            Redesigning student-to-professional outreach, shaped by 11 interviews and 8 usability tests
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "clamp(22px,5vw,30px) clamp(16px,4vw,28px)", marginBottom: "var(--space-section)" }}>
            {[
              { label: "Timeline", value: <>Oct – Dec 2025<br />(8 Weeks)</> },
              { label: "My Role", value: "Connection Experience Designer" },
              { label: "Team", value: "3 Designers + 1 Design Lead" },
              { label: "Skills", value: "Figma, FigJam, Prototyping, User Interviews" },
            ].map((m) => (
              <div key={m.label}>
                {/* Metadata keys are not headings -- these were <h2>s. */}
                <p style={{ ...eyebrow, margin: "0 0 var(--space-label-to-headline)" }}>{m.label}</p>
                <p style={{ ...body, margin: 0 }}>{m.value}</p>
              </div>
            ))}
          </div>

          <section id="overview" style={section}>
            <p style={eyebrow}>Overview</p>
            <h2 style={h2}>Students have access to a network of industry professionals, but students face difficulties in outreach</h2>
            <p style={body}>Students have access to a network of industry professionals, but starting a conversation feels intimidating and uncertain, so potential connections become unopened profiles and unsent messages.</p>
            <p style={{ ...body, marginBottom: 0 }}>Design Interactive challenged our team of 4 to design an easy-to-use outreach experience for students connecting with a professional network.</p>
          </section>

          <section id="impact" style={section}>
            <p style={eyebrow}>My Impact</p>
            <h2 style={h2}>I designed the connection experience, from the first request to the ongoing conversation</h2>
            <p style={body}>My contributions included:</p>
            {/* The section ends on the list now -- the old summary paragraph
                repeated the 8-rounds figure that the Key Design Moments
                heading already carries. */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Bullet>Designed and owned connect requests, relationship management, and the messaging experience</Bullet>
              <Bullet>Used behavioral psychology to make outreach feel lower-pressure, from asking for commitment later to removing the blank-page problem</Bullet>
              <Bullet>Refined community profiles to support the move from evaluating a connection to reaching out</Bullet>
            </div>
          </section>

          <section id="artifacts" style={section}>
            <p style={eyebrow}>Key Artifacts</p>
            <h2 style={h2}>An end-to-end experience that helps students move from discovering a professional to building an ongoing relationship</h2>

            <h3 style={h3}>Connecting with a professional</h3>
            <p style={body}>A connection flow that gives students enough context and confidence before reaching out.</p>
            <VideoFrame src="/assets/dc-connecting.mp4" label="Screen recording of the di.circle Community Hub: browsing professional profiles and sending a connect request" />

            <h3 style={{ ...h3, marginTop: "var(--space-section)" }}>Relationship management</h3>
            <p style={body}>A management flow for filtering and maintaining professional relationships.</p>
            <VideoFrame src="/assets/dc-connections.mp4" label="Screen recording of the di.circle My Connections screen: filtering connections and reading their relationship states" />

            <h3 style={{ ...h3, marginTop: "var(--space-section)" }}>Messaging Experience</h3>
            <p style={body}>A conversation flow that gives students a lower-pressure starting point after connecting.</p>
            <VideoFrame src="/assets/dc-messaging.mp4" label="Screen recording of the di.circle messaging experience: guided prompts for opening a first conversation" />
          </section>

          <section id="problem" style={section}>
            <p style={eyebrow}>The Problem</p>
            <h2 style={h2}>Students lacked the confidence, context, and low-pressure opportunities to start the first conversation</h2>
            <p style={{ ...body, marginBottom: 0 }}>They faced intimidation around reaching out, uncertainty about how to start a conversation, and difficulty maintaining relationships. That created friction between finding the right person and building a genuine connection.</p>
          </section>

          <section id="research" style={section}>
            <p style={eyebrow}>Research Insights</p>
            <h2 style={h2}>I discovered the biggest friction sat between finding someone and feeling ready to reach out</h2>
            <p style={body}>
              Firstly, I wanted to understand what exactly made professional outreach feel difficult and where students hesitated most throughout the connection process. We interviewed{" "}
              <strong style={strong}>11 college students</strong> to learn where outreach felt hardest. The key themes were:
            </p>

            {/* The four quotes are spelled out in the alt text so they're still
                available to screen readers and search, since the image itself
                carries them as pixels. */}
            <Figure src="/assets/dc-research-quotes.webp" alt="Four interview quotes: “I don’t know if they’re willing to talk to me.” · “I want to know more about them.” · “I’m not sure how to start a conversation.” · “Conversations should feel less shallow.”" mb={26} />

            <p style={body}>Students could find professionals, but often lacked the confidence and context to decide whether and how to reach out.</p>

            <Figure src="/assets/dc-journey-before.webp" alt="User Connection Journey: 01 Finding a professional, 02 Evaluating a profile, 03 Starting a conversation, 04 Maintaining the relationship — with drop-offs marked between stages 01 and 02" />

            <p style={body}>The highest-friction moments were evaluating whether to reach out, initiating the connection, and knowing what to do afterward.</p>
            <p style={{ ...body, marginBottom: 0 }}>That reframed the problem from helping students find professionals to helping them feel confident enough to build a relationship.</p>
          </section>

          <section id="challenge" style={section}>
            <p style={eyebrow}>Design Challenge</p>
            <h2 style={{ ...h2, marginBottom: 0 }}>How might we make professional relationships easier to start and maintain?</h2>
          </section>

          <section id="moments" style={section}>
            <p style={eyebrow}>Key Design Moments</p>
            <h2 style={h2}>Across 8 usability tests, I identified four moments where students needed more confidence, context, or support to move forward</h2>
            <p style={{ ...body, marginBottom: "var(--space-section)" }}>I refined these interactions based on what users struggled with by focusing on the moments that most affected the connection journey.</p>

            <h3 style={h3}>Users wanted to understand a professional before deciding whether to reach out</h3>
            <p style={body}>I explored how much information was enough to make that decision without overwhelming people, through community profile cards.</p>
            <BeforeAfterToggle beforeLabel="Before" afterLabel="After" after={profileAfter} onChange={setProfileAfter} />
            {/* Same shape as ThreadIt's toggle: two sibling visuals swapped by
                state, so each slot is a direct 1:1 swap for the real export. */}
            {profileAfter ? (
              <Figure src="/assets/dc-profile-after.webp" alt="The redesigned profile card, annotated: 1. Signal approachability — Open to Chat and Last Active indicators, 2. Introduce an evaluation step — a View Profile button, 3. Surface common ground — shared interests shown on the profile" />
            ) : (
              <Figure src="/assets/dc-profile-before.webp" alt="The original profile card, annotated: 1. No signal of approachability — users couldn’t tell whether a professional was open to being contacted, 2. Connect came too early — the primary CTA asked users to commit before they had enough context" />
            )}
            <Bullet>Rather than asking users to commit immediately, I introduced a lower-pressure evaluation step that lets them understand the person before deciding to reach out.</Bullet>

            <h3 style={{ ...h3, marginTop: "var(--space-section)" }}>I made the first connection feel intentional, clear, and low-pressure</h3>
            <p style={body}>Even after learning about the person, users hesitated as they needed more control over how they initiated the relationship. I turned &ldquo;Connect&rdquo; into a more intentional interaction.</p>
            <Figure
              src="/assets/dc-connect-request.webp"
              alt="The connect request flow: a connected profile, a profile with a Send Connect Request button, and the request sheet asking why you'd like to connect with an optional note"
              mb={26}
            />
            {/* One drawback against three gains, so the columns are explicit
                rather than an auto-flow grid -- auto-flow would interleave
                them down the two tracks instead of keeping them apart. */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "20px clamp(20px,4vw,36px)", marginBottom: "var(--space-section)" }}>
              <Point ok={false}>Users hesitated when asked to commit before they had enough context.</Point>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Point ok>Users can communicate why they&apos;re reaching out with clear intent</Point>
                <Point ok>Keeps personalization low-pressure with an optional note to add context</Point>
                <Point ok>Users can decide how they want to connect before sending the request</Point>
              </div>
            </div>
            <Bullet>I gave users a way to communicate their reason for reaching out while keeping personalization optional.</Bullet>

            <h3 style={{ ...h3, marginTop: "var(--space-section)" }}>I made relationship states clearly visible after connecting</h3>
            <p style={body}>Once a connection request is sent, users needed a clear way to understand their relationship state and decide what to do next. I explored ways for users to manage their relationships.</p>
            <Figure src="/assets/dc-connections-managing.webp" alt="The My Connections screen annotated with three callouts: 1. Relationship states give clarity on the current state, 2. Card filters help users find the relevant profile without endless scrolling, 3. Messaging serves as the next action to continue the relationship" />
            <Bullet>I shifted the experience from simply storing connections to helping users understand and act on their relationships.</Bullet>

            <h3 style={{ ...h3, marginTop: "var(--space-section)" }}>I introduced guiding prompts to start and maintain the conversation</h3>
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
            <p style={body}>I observed and measured success through users&apos; behaviors throughout the experience, and whether it reduced the friction between wanting to connect and feeling confident enough to reach out.</p>
            <p style={body}>As a prototype, we had no live usage data, so here is how I&apos;d measure success next:</p>
            {/* The table's rows are spelled out in the alt text, since the
                image itself carries them as pixels. */}
            <Figure
              src="/assets/dc-metrics.webp"
              alt="How I would measure success metrics. 01 Evaluating a profile — profile views that become requests (%). 02 Connecting with a professional — request acceptance rate. 03 Starting a conversation — first message within 7 days (%). 04 Maintaining the relationship — conversations with a reply and follow-up (%). 05 Goal — self-reported confidence after reaching out (1–5)."
            />
            <p style={{ ...body, marginBottom: 0 }}>Success means a conversation that gets a reply. I&apos;d watch acceptance rate as a guardrail, so a drop in raw requests from the new evaluation step isn&apos;t mistaken for a failure.</p>
          </section>

          <section id="reflection" style={section}>
            <p style={eyebrow}>Reflections</p>
            <h2 style={h2}>I learned that psychological friction can be just as important as interaction friction</h2>
            <p style={body}>Through repeated usability testing, I saw that users didn&apos;t necessarily need fewer actions, but rather needed more confidence and context before taking them.</p>
            <p style={body}>
              This changed how I approach interaction design. Rather than asking only{" "}
              <strong style={strong}>&ldquo;What should the user do?&rdquo;</strong>, I now ask,{" "}
              <strong style={strong}>&ldquo;What does the user need to understand or feel confident about before they&apos;re ready to complete an action?&rdquo;</strong>
            </p>
            <p style={{ ...body, marginBottom: 0 }}>
              {/* The explicit space matters: a JSX text chunk that holds an
                  entity AND ends at a newline drops its leading space. */}
              <strong style={strong}>If I had more time:</strong>{" "}
              I&apos;d run the measurement plan above with a live cohort.
            </p>
          </section>

          <section id="outcome" style={section}>
            <p style={eyebrow}>The Outcome!</p>
            <h2 style={h2}>Our team won Audience Choice in Design Interactive&apos;s cohort!</h2>
            <p style={{ ...body, marginBottom: "var(--space-section)" }}>During Design Interactive&apos;s cohort presentation night, we presented our solution and prototype to our audience and won Audience Choice!</p>
            <Figure src="/assets/dc-outcome-team.webp" alt="The four-person di.circle team holding their Audience Choice certificates in front of a screen showing the di.circle presentation" mb={0} />
          </section>

          <section id="thanks" style={{ marginBottom: 8 }}>
            <p style={eyebrow}>Gratitude &amp; Special Thanks</p>
            <h2 style={h2}>Thank you to my wonderful design team!</h2>
            <p style={{ ...body, marginBottom: 0 }}>Thank you to my teammates Alyse Cho and Vyvyan Tran, and to our design lead Joanne Cai for mentoring us through the sprint.</p>
          </section>
        </article>
      </div>

      <CityscapeFooter />
      <Lightbox />
    </div>
  );
}
