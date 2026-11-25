import SubpageHeader from "@/components/SubpageHeader";
import CaseStudySidebar, { type SidebarSection } from "@/components/CaseStudySidebar";
import CityscapeFooter from "@/components/CityscapeFooter";
import Lightbox from "@/components/Lightbox";
import RevealPhoneMockup from "@/components/RevealPhoneMockup";
import CaseStudyVideo from "@/components/CaseStudyVideo";

// Same type scale and section rhythm as the other two case studies.
// Eyebrows use the club's green rather than the blue the other two case
// studies share.
// The club's green stays as this page's accent: at 6.14:1 on white it is
// one of the two brand colours that clears the spec's 4.5:1 bar, so it did
// not need replacing with --color-label.
const CLUB_GREEN = "#2F6F25";

const eyebrow: React.CSSProperties = {
  margin: "0 0 var(--space-label-to-headline)",
  fontFamily: "var(--font-family)",
  fontSize: "var(--label-size)",
  lineHeight: "var(--label-line)",
  fontWeight: "var(--weight-medium)",
  letterSpacing: "var(--label-tracking)",
  color: CLUB_GREEN,
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
// One step between a whole section (88px) and a paragraph (16px), shared
// with the other two case studies. Without it the metadata row sat 88px
// below the title and 88px above the first section, floating between the
// block it belongs to and the one it doesn't.
const GROUP = "clamp(34px,4.6vw,44px)";
const strong: React.CSSProperties = { color: "var(--color-headline)", fontWeight: "var(--weight-medium)" };

// The page's blue eyebrow headings, in document order. Only three while the
// project is in flight; the rest get added as those sections are written.
const SECTIONS: SidebarSection[] = [
  { id: "overview", label: "Overview" },
  { id: "impact", label: "My Impact" },
  { id: "artifacts", label: "Final Artifacts" },
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

export default function TriceratopsCaseStudy() {
  return (
    <div style={{ position: "relative", width: "100%", background: "#ffffff", overflowX: "clip" }}>
      <SubpageHeader />

      {/* HERO COVER */}
      <div style={{ overflow: "hidden", background: "#b6e29a" }}>
        <img data-lb="1" src="/assets/triceratops-hero.webp" alt="The Triceratops Club site shown on desktop and mobile" style={{ display: "block", width: "100%", height: "auto" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "clamp(36px,5vw,80px)", padding: "clamp(28px,5vw,52px) clamp(22px,6vw,40px) clamp(48px,8vh,72px)" }}>
        <CaseStudySidebar sections={SECTIONS} />

        <article id="ts-article" style={{ minWidth: 0, maxWidth: "var(--measure-case)", flex: "0 1 var(--measure-case)" }}>
          <h1 className="t-headline" style={{ margin: "0 0 var(--space-headline-to-body)" }}>
            Improving recruitment for new members in a student community club
          </h1>
          <p style={{ ...body, marginBottom: GROUP }}>
            Drawing 790 site visits and 36% of the club’s Discord invite joins
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "clamp(22px,5vw,30px) clamp(16px,4vw,28px)", marginBottom: "var(--space-section)" }}>
            {[
              { label: "Timeline", value: <>Jun – Oct 2026<br />(Ongoing project)</> },
              { label: "My Role", value: "Design Systems Lead, Web Designer" },
              { label: "Team", value: "6 Designers + 1 Design Lead" },
              { label: "Skills", value: "Figma, Claude, User Interviews, Design Systems" },
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
            <h2 style={h2}>The UC Davis Triceratops Club needed a cohesive foundation for its web experience to attract and engage new students.</h2>
            <p style={body}>As Design Systems Lead and web designer, I translated client requirements into a reusable UI kit while collaborating with a team of six designers.</p>
            <p style={{ ...body, marginBottom: 0 }}>Alongside establishing the visual foundation, I used usability testing findings to identify opportunities to improve navigation and information hierarchy, making key recruitment information easier for students to find and understand.</p>
          </section>

          <section id="impact" style={section}>
            <p style={eyebrow}>My Impact</p>
            <h2 style={h2}>I established a reusable UI foundation for the team while identifying and addressing usability issues in the student recruitment experience.</h2>
            <p style={body}>My contributions included:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "0 0 0" }}>
              <Bullet>
                Built a <strong style={strong}>0 → 1 UI kit</strong> with reusable components, design tokens, typography, and color styles, giving six designers a shared foundation to design from.
              </Bullet>
              <Bullet>
                Conducted <strong style={strong}>5 usability tests</strong> to identify breakdowns in navigation and information hierarchy, then reworked the navigation flow to make key recruitment content easier to discover.
              </Bullet>
              <Bullet>Created reusable patterns that can be carried across future pages, reducing the need for designers to independently recreate common UI elements.</Bullet>
            </div>
          </section>

          <section id="artifacts" style={section}>
            <p style={eyebrow}>Final Artifacts</p>
            <h2 style={h2}>Designing a consistent, responsive experience across desktop and mobile</h2>

            <h3 style={{ ...h3, marginTop: GROUP }}>Reusable UI-kit that builds the design foundation</h3>
            <p style={body}>Comprised of a component library, typography, and color styles.</p>
            <img data-lb="1" src="/assets/tri-uikit.webp" alt="The Triceratops UI kit: desktop button styles, a typography scale for desktop and mobile, and the color palette" style={{ display: "block", width: "100%", height: "auto", marginBottom: 18, borderRadius: 18 }} />

            <h3 style={{ ...h3, marginTop: GROUP }}>Desktop experience</h3>
            <p style={body}>Current desktop flow.</p>
            <div className="dc-frame" data-lb="1">
              <CaseStudyVideo src="/assets/tri-desktop.mp4" label="Screen recording of the Triceratops Club website on desktop: the hero banner, the Our Mission section with club photos, and the main navigation" />
            </div>

            <h3 style={{ ...h3, marginTop: GROUP }}>Mobile experience</h3>
            <p style={body}>Current mobile flow.</p>
            <div className="dc-frame dc-frame-phone" data-lb="1">
              {/* ThreadIt's mockup, with the Triceratops recording in the screen
                  cut-out -- same insets, so the bezel lines up. */}
              <RevealPhoneMockup style={{ position: "relative", width: "min(232px, 62%)", aspectRatio: "600/1206", filter: "drop-shadow(0 14px 30px rgba(44,54,74,.25))" }}>
                <CaseStudyVideo
                  src="/assets/tri-mobile.mp4"
                  label="Screen recording of the Triceratops Club website on mobile: the stacked hero, the Our Mission section, and the collapsed navigation menu"
                  style={{ position: "absolute", left: "6.2%", top: "2.8%", width: "87.5%", height: "94.4%", objectFit: "cover", borderRadius: "7.6%/3.7%" }}
                />
                <img src="/assets/iphone14-bezel.webp" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
              </RevealPhoneMockup>
            </div>
          </section>

          {/* In-flight notice, as exported. */}
          <img
            data-lb="1"
            src="/assets/tri-ongoing.webp"
            alt="This project is currently ongoing! Check back on the full case study soon!"
            style={{ display: "block", width: "100%", height: "auto", marginBottom: 8 }}
          />
        </article>
      </div>

      <CityscapeFooter />
      <Lightbox />
    </div>
  );
}
