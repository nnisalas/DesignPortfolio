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

// The same three steps the ThreadIt page runs on, so the two case studies
// group identically. The scale in globals.css goes 8 / 12 / 16 and then
// jumps to 56-88px for a section, with nothing in between -- which is why
// a sub-moment inside Key Design Moments was getting 88px, the very same
// gap as a whole section break, and the page read as one flat list.
//   FIG     air around a figure, equal above and below
//   GROUP   one numbered moment to the next: wider than FIG, short of a section
//   CAPTION a figure to the line that reads it -- the tightest gap on the
//           page on purpose, so the pairing is unambiguous
const FIG = "clamp(24px,3.4vw,32px)";
const GROUP = "clamp(34px,4.6vw,44px)";
const CAPTION = "var(--space-headline-to-body)";

// Mirrors the page's blue eyebrow headings, in document order, rather than
// the grouping used in the design file. Module-level so the sidebar's scroll
// listener subscribes once (see CaseStudySidebar).
const SECTIONS: SidebarSection[] = [
  { id: "overview", label: "Overview" },
  { id: "impact", label: "My Contributions" },
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
    // No bottom margin: every caller either ends its block or sits in a
    // flex column that owns the gap, so a margin here would add to the
    // container's and quietly desync the two.
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
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
 *  how these wide annotated diagrams stay readable in a phone-width column.
 *
 *  No border radius by default. Every export already carries its own
 *  corners with transparency outside them, so a CSS radius can only cut
 *  INTO what the file draws: the quotes card bakes a 25px arc at 2000px
 *  wide, which lands at 8px once the image is scaled into the column,
 *  and the old 18px rule sliced straight through the card's own stroke
 *  and left the corners open. `radius` is for the one figure that is a
 *  bare photograph and has no frame of its own to damage. */
function Figure({ src, alt, mb = FIG, radius = 0 }: { src: string; alt: string; mb?: number | string; radius?: number }) {
  // FIG above as well as below, so a figure carries equal air on both
  // sides. It collapses with the preceding paragraph's or toggle's own
  // 16px rather than stacking on it.
  return <img data-lb="1" src={src} alt={alt} style={{ display: "block", width: "100%", height: "auto", marginTop: FIG, marginBottom: mb, borderRadius: radius }} />;
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

        <article id="ts-article" style={{ minWidth: 0, maxWidth: "var(--measure-case)", flex: "0 1 var(--measure-case)" }}>
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
            {/* The headline used to be the first sentence of the paragraph
                under it, word for word. It now states the finding and lets
                the paragraph carry the detail. */}
            <h2 style={h2}>Students could find professionals, but felt unsure about reaching out</h2>
            <p style={body}>di.circle is a networking product our cohort designed for Design Interactive, connecting students with the organisation&apos;s alumni and industry professionals. When students try to start a conversation and keep a relationship going with a professional, they meet intimidation and uncertainty. Reaching out to someone more senior carries social risk, so potential connections often become unopened profiles and unsent messages.</p>
            <p style={{ ...body, marginBottom: 0 }}>Design Interactive challenged our team of 4 to design an easy-to-use outreach experience for students connecting with a professional network.</p>
          </section>

          <section id="impact" style={section}>
            {/* "My Contributions" rather than "My Impact": the side rail
                listed "My Impact" here and "Impact" eight entries later,
                two labels for different things. */}
            <p style={eyebrow}>My Contributions</p>
            <h2 style={h2}>I designed the connection experience, from the first request to the ongoing conversation</h2>
            <p style={body}>My contributions included:</p>
            {/* The section ends on the list now -- the old summary paragraph
                repeated the 8-rounds figure that the Key Design Moments
                heading already carries. */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Bullet>Designed and owned connect requests, relationship management, and the messaging experience</Bullet>
              <Bullet>Applied similarity-attraction, social-risk reduction, autonomy, and scaffolding to make outreach feel lower-pressure</Bullet>
              <Bullet>Refined community profiles to support the move from evaluating a connection to reaching out</Bullet>
            </div>
          </section>

          <section id="artifacts" style={section}>
            <p style={eyebrow}>Key Artifacts</p>
            <h2 style={h2}>An end-to-end experience that helps students move from discovering a professional to building an ongoing relationship</h2>

            <h3 style={h3}>Connecting with a professional</h3>
            <p style={body}>A connection flow that gives students enough context and confidence before reaching out.</p>
            <VideoFrame src="/assets/dc-connecting.mp4" label="Screen recording of the di.circle Community Hub: browsing professional profiles and sending a connect request" />

            <h3 style={{ ...h3, marginTop: GROUP }}>Relationship management</h3>
            <p style={body}>A management flow for filtering and maintaining professional relationships.</p>
            <VideoFrame src="/assets/dc-connections.mp4" label="Screen recording of the di.circle My Connections screen: filtering connections and reading their relationship states" />

            <h3 style={{ ...h3, marginTop: GROUP }}>Messaging Experience</h3>
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
            <Figure src="/assets/dc-research-quotes.webp" alt="Four interview quotes: “I don’t know if they’re willing to talk to me.” · “I want to know more about them.” · “I’m not sure how to start a conversation.” · “Conversations should feel less shallow.”" />

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
            {/* Testing was shared across the team, so the heading reports
                what the tests surfaced rather than who ran them; the
                redesigns below are first person, because those were mine. */}
            <h2 style={h2}>Across 8 usability tests, four moments stood out where students needed more confidence, context, or support</h2>
            <p style={{ ...body, marginBottom: GROUP }}>I redesigned each one rather than redesigning every screen.</p>

            {/* One flex column, one child per moment, so the gap between
                moments is set in exactly one place and cannot drift from
                the gaps inside them. */}
            <div style={{ display: "flex", flexDirection: "column", gap: GROUP }}>
              <div>
                <h3 style={h3}>Understanding a professional before deciding to reach out</h3>
                <p style={body}>I explored how much information was enough to decide without overwhelming people.</p>
                <BeforeAfterToggle beforeLabel="Before" afterLabel="After" after={profileAfter} onChange={setProfileAfter} />
                {/* Same shape as ThreadIt's toggle: two sibling visuals swapped
                    by state, so each slot is a 1:1 swap for the real export. */}
                {profileAfter ? (
                  <Figure mb={CAPTION} src="/assets/dc-profile-after.webp" alt="The redesigned profile card, annotated: 1. Signal approachability — Open to Chat and Last Active indicators, 2. Introduce an evaluation step — a View Profile button, 3. Surface common ground — shared interests shown on the profile" />
                ) : (
                  <Figure mb={CAPTION} src="/assets/dc-profile-before.webp" alt="The original profile card, annotated: 1. No signal of approachability — users couldn’t tell whether a professional was open to being contacted, 2. Connect came too early — the primary CTA asked users to commit before they had enough context" />
                )}
                {/* Named principles rather than "behavioral psychology": the
                    bold lead-in matches the trade-off line on the ThreadIt
                    page, so the two case studies caption a figure the same way. */}
                <p style={body}>
                  <strong style={strong}>Why it works:</strong>{" "}
                  the signals reduce the social risk of reaching out to someone who might not respond, and common interests draw on similarity-attraction, the tendency to feel drawn to people who share our interests.
                </p>
                <p style={{ ...body, margin: 0 }}>
                  <strong style={strong}>Trade-off:</strong>{" "}
                  the evaluation step adds a step before connecting. I accepted that because testers wanted context before committing, and I&apos;d watch acceptance rate to confirm it&apos;s worth it.
                </p>
              </div>

              <div>
                <h3 style={h3}>Making the first connection feel intentional, clear, and low-pressure</h3>
                <p style={body}>Even after learning about the person, testers hesitated to initiate. I turned &ldquo;Connect&rdquo; into a more intentional interaction.</p>
                <Figure
                  mb={CAPTION}
                  src="/assets/dc-connect-request.webp"
                  alt="The connect request flow: a connected profile, a profile with a Send Connect Request button, and the request sheet asking why you'd like to connect with an optional note"
                />
                {/* One drawback against three gains, so the columns are explicit
                    rather than an auto-flow grid -- auto-flow would interleave
                    them down the two tracks instead of keeping them apart.
                    These read the figure above, so they sit at CAPTION under
                    it and keep the takeaway line a paragraph step away. */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "20px clamp(20px,4vw,36px)", marginBottom: "var(--space-paragraph)" }}>
                  <Point ok={false}>Users hesitated when asked to commit before they had enough context.</Point>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <Point ok>Users can communicate why they&apos;re reaching out with clear intent</Point>
                    <Point ok>Keeps personalization low-pressure with an optional note to add context</Point>
                    <Point ok>Users can decide how they want to connect before sending the request</Point>
                  </div>
                </div>
                <p style={{ ...body, margin: 0 }}>
                  <strong style={strong}>Why it works:</strong>{" "}
                  choosing why you&apos;re reaching out, and whether to add a note, gives users autonomy over how they present themselves, so committing feels less risky.
                </p>
              </div>

              <div>
                <h3 style={h3}>Making relationship states visible after connecting</h3>
                <p style={body}>After a request is sent, users needed to understand where the relationship stood and what to do next.</p>
                <Figure mb={CAPTION} src="/assets/dc-connections-managing.webp" alt="The My Connections screen annotated with three callouts: 1. Relationship states give clarity on the current state, 2. Card filters help users find the relevant profile without endless scrolling, 3. Messaging serves as the next action to continue the relationship" />
                <p style={{ ...body, margin: 0 }}>I added relationship states, card filters to find the right profile without endless scrolling, and messaging as the clear next action. This shifted the experience from storing connections to acting on them.</p>
              </div>

              <div>
                <h3 style={h3}>Starting the conversation</h3>
                <p style={body}>A blank message field raised another psychological barrier: &ldquo;What do I say?&rdquo; I added optional guiding questions as conversation starters.</p>
                <BeforeAfterToggle beforeLabel="Before" afterLabel="After" after={messagingAfter} onChange={setMessagingAfter} />
                {messagingAfter ? (
                  <Figure mb={CAPTION} src="/assets/dc-messaging-after.webp" alt="The redesigned messaging screen, annotated: Guiding Questions — optional conversation starters that give users a low-pressure starting point without forcing a scripted interaction" />
                ) : (
                  <Figure mb={CAPTION} src="/assets/dc-messaging-before.webp" alt="The original messaging screen, annotated: Blank-Screen State — a blank message field requiring users to start a conversation from scratch" />
                )}
                {/* The reviewer's optional line -- "the prompts draw on the
                    common interests surfaced on the profile" -- is left out:
                    the three starters in the prototype are fixed templates,
                    not generated from profile data, so it would not be true. */}
                <p style={{ ...body, margin: 0 }}>
                  <strong style={strong}>Why it works:</strong>{" "}
                  the prompts act as scaffolding, temporary support that makes a hard first step manageable without dictating what to say.
                </p>
              </div>
            </div>
          </section>

          <section id="results" style={section}>
            <p style={eyebrow}>Impact</p>
            {/* The old heading -- "I turned a high-friction flow into a
                clearer path" -- asserted an outcome this section never
                evidences. It now says what the section can actually show. */}
            <h2 style={h2}>What the redesign changed, and how I&apos;d measure it next</h2>
            <p style={body}>
              <strong style={strong}>What testing showed:</strong>{" "}
              I didn&apos;t record per-tester counts, so I&apos;m reporting patterns, not percentages. In the original flow, testers hesitated at four points: they couldn&apos;t tell whether a professional was open to being contacted, they were asked to commit before they had enough context, they couldn&apos;t see where a relationship stood after connecting, and they stalled at a blank message field. Each change in this case study targets one of those moments.
            </p>
            <p style={body}>As a cohort prototype, we had no live usage data, so here is how I&apos;d measure success next:</p>
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
            <p style={body}>During Design Interactive&apos;s cohort presentation night, we presented our solution and prototype to our audience and won Audience Choice!</p>
            {/* The one unframed figure: a photograph, whose export bakes only
                a 12px corner (4px once scaled). It takes the page's radius. */}
            <Figure src="/assets/dc-outcome-team.webp" alt="The four-person di.circle team holding their Audience Choice certificates in front of a screen showing the di.circle presentation" mb={0} radius={18} />
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
