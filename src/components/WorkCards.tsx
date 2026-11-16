import Link from "next/link";
import RevealImage from "./RevealImage";
import RevealVideo from "./RevealVideo";
import RevealText from "./RevealText";
import RevealPhoneMockup from "./RevealPhoneMockup";

// Card metadata ("Design Interactive • Jun 2026") is a Label in the accent
// colour; the old #3295CE is only 3.32:1 on white, so it reads through the
// token instead.
const tagStyle: React.CSSProperties = { margin: 0 };

function CardText({ title, subtitle, tags }: { title: string; subtitle: string; tags?: string[] }) {
  return (
    <div style={{ padding: "clamp(16px,1.6vw,22px) 2px 0" }}>
      <RevealText
        tag="h3"
        className="t-headline"
        trigger="scroll"
        variant="lines"
        stagger={0.1}
        style={{ margin: 0, maxWidth: "var(--measure)" }}
      >
        {title}
      </RevealText>
      <RevealText
        tag="p"
        className="t-body"
        trigger="scroll"
        variant="lines"
        stagger={0.08}
        style={{ margin: "var(--space-headline-to-body) 0 0", maxWidth: "var(--measure)" }}
      >
        {subtitle}
      </RevealText>
      {tags?.length ? (
        <div className="work-tag-row">
          {tags.map((t) => (
            <span key={t} className="work-tag">
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function WorkCards() {
  return (
    <section
      id="work"
      style={{
        position: "relative",
        zIndex: 1,
        background: "#ffffff",
        padding: "clamp(70px,11vh,130px) clamp(16px,3vw,40px) clamp(60px,9vh,110px)",
      }}
    >
      <div style={{ maxWidth: 1340, margin: "0 auto" }}>
        <div
          className="workstack"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))",
            // Row gap is deliberately larger than the column gap: once a
            // third card wraps to a second row, the shared value left it
            // crowding the card above.
            gap: "clamp(56px,6vw,88px) clamp(20px,2.4vw,36px)",
            alignItems: "start",
            justifyItems: "stretch",
          }}
        >
          <Link href="/threadit-case-study" data-cursor="view" className="work-card-trigger work-card-link" style={{ display: "block", position: "relative", width: "100%", textDecoration: "none", color: "inherit" }}>
            <RevealText tag="p" className="t-label" trigger="scroll" variant="words" stagger={0.03} style={{ ...tagStyle, margin: "0 0 var(--space-label-to-headline)" }}>
              Design Interactive • Jun 2026
            </RevealText>
            <div style={{ position: "relative", width: "100%" }}>
              <RevealImage src="/assets/cover-threadit.webp" alt="A neatly organized closet of hanging clothes, shoes, and storage bins" style={{ display: "block", width: "100%", height: "auto", borderRadius: 16 }} />
              <RevealPhoneMockup style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "26%", aspectRatio: "600/1206", filter: "drop-shadow(0 14px 30px rgba(44,54,74,.25))" }}>
                <video
                  src="/assets/final-onboarding.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "6.2%", top: "2.8%", width: "87.5%", height: "94.4%", objectFit: "cover", borderRadius: "7.6%/3.7%" }}
                />
                <img src="/assets/iphone14-bezel.webp" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
              </RevealPhoneMockup>
              <div className="work-card-overlay" aria-hidden="true" />
            </div>
            <CardText
              title="Reducing first-time user activation drop-offs in onboarding"
              subtitle="Accelerated time-to-value from 10 minutes to under 2 minutes"
              tags={["B2C", "Fashion", "Mobile"]}
            />
            {/* Only rendered on touch devices (see .work-card-cta) -- desktop
                still gets the hover overlay. */}
            <p className="work-card-cta">
              View case study
              <span className="wc-arrow" aria-hidden="true">
                →
              </span>
            </p>
          </Link>

          <Link href="/dicircle-case-study" data-cursor="view" className="work-card-trigger work-card-link" style={{ display: "block", position: "relative", width: "100%", textDecoration: "none", color: "inherit" }}>
            <RevealText tag="p" className="t-label" trigger="scroll" variant="words" stagger={0.03} style={{ ...tagStyle, margin: "0 0 var(--space-label-to-headline)" }}>
              Design Interactive • Dec 2025
            </RevealText>
            <div style={{ position: "relative", width: "100%" }}>
              <RevealVideo src="/assets/cover-dicircle.mp4" poster="/assets/cover-dicircle.webp" label="The di.circle My Connections screen, showing community member cards with their relationship states" style={{ display: "block", width: "100%", height: "auto", borderRadius: 16 }} />
              <div className="work-card-overlay" aria-hidden="true" />
            </div>
            {/* Mirrors the case study's own h1 and subtitle. */}
            <CardText
              title="Lowering the psychological barrier to starting professional relationships"
              subtitle="Redesigning student-to-professional outreach through insights from 8 usability tests"
              tags={["SaaS", "Interaction Design", "Desktop"]}
            />
            {/* Only rendered on touch devices (see .work-card-cta). */}
            <p className="work-card-cta">
              View case study
              <span className="wc-arrow" aria-hidden="true">
                →
              </span>
            </p>
          </Link>

          <Link href="/triceratops-case-study" data-cursor="view" className="work-card-trigger work-card-link" style={{ display: "block", position: "relative", width: "100%", textDecoration: "none", color: "inherit" }}>
            <RevealText tag="p" className="t-label" trigger="scroll" variant="words" stagger={0.03} style={{ ...tagStyle, margin: "0 0 var(--space-label-to-headline)" }}>
              UC Davis • Ongoing Project
            </RevealText>
            <div style={{ position: "relative", width: "100%" }}>
              <RevealImage src="/assets/cover-triceratops.webp" alt="The Triceratops Club site homepage, showing the hero banner and Our Mission section" style={{ display: "block", width: "100%", height: "auto", borderRadius: 16 }} />
              <div className="work-card-overlay" aria-hidden="true" />
            </div>
            <CardText
              title="Improving recruitment for new members in a student community club"
              subtitle="Drawing 790 site visits and 36% of the club’s Discord invite joins"
              tags={["Shipped", "Community", "Design Systems", "Web Design"]}
            />
            {/* Only rendered on touch devices (see .work-card-cta). */}
            <p className="work-card-cta">
              View case study
              <span className="wc-arrow" aria-hidden="true">
                →
              </span>
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
