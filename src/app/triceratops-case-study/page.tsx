import SubpageHeader from "@/components/SubpageHeader";
import CaseStudySidebar, { type SidebarSection } from "@/components/CaseStudySidebar";
import CityscapeFooter from "@/components/CityscapeFooter";
import Lightbox from "@/components/Lightbox";

// Same type scale and section rhythm as the other two case studies.
const eyebrow: React.CSSProperties = { margin: "0 0 14px", fontFamily: "var(--font-ibm-plex-sans)", fontSize: 14, fontWeight: 600, letterSpacing: ".08em", color: "#2f9fe0" };
const h2: React.CSSProperties = { margin: "0 0 22px", fontFamily: "var(--font-geist)", fontSize: "clamp(22px,5.6vw,27px)", fontWeight: 600, lineHeight: 1.2, letterSpacing: ".03em", color: "#1f2329" };
const h3: React.CSSProperties = { margin: "0 0 14px", fontFamily: "var(--font-ibm-plex-sans)", fontSize: "clamp(19px,5vw,23px)", fontWeight: 600, lineHeight: 1.3, color: "#1f2329" };
const body: React.CSSProperties = { margin: "0 0 18px", fontSize: 16, lineHeight: 1.5, letterSpacing: ".06em", color: "#3c424b" };
const section: React.CSSProperties = { marginBottom: "clamp(44px,7vh,64px)" };
const strong: React.CSSProperties = { color: "#1f2329", fontWeight: 600 };

// The page's blue eyebrow headings, in document order. Only three while the
// project is in flight; the rest get added as those sections are written.
const SECTIONS: SidebarSection[] = [
  { id: "overview", label: "Overview" },
  { id: "impact", label: "My Impact" },
  { id: "artifacts", label: "Final Artifacts" },
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

/**
 * Placeholder for artwork that hasn't been exported yet. Deliberately looks
 * unfinished -- a blank box reads as a broken image, filler reads as done.
 * Swap the whole element for an <img data-lb="1" .../> when the asset lands;
 * `ratio` matches the intended export so the page doesn't reflow when it does.
 */
function VisualSlot({ label, ratio = "16 / 10" }: { label: string; ratio?: string }) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        aspectRatio: ratio,
        marginBottom: 18,
        padding: "20px 24px",
        borderRadius: 18,
        border: "2px dashed #cdd4dd",
        background: "#f7f9fb",
        textAlign: "center",
      }}
    >
      <span style={{ fontFamily: "var(--font-ibm-plex-sans)", fontSize: 14, fontWeight: 600, letterSpacing: ".04em", lineHeight: 1.5, color: "#8a919b" }}>{label}</span>
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

        <article id="ts-article" style={{ minWidth: 0, maxWidth: 680, flex: "0 1 680px" }}>
          <h1 style={{ margin: "0 0 14px", fontFamily: "var(--font-ibm-plex-sans)", fontSize: "clamp(28px,7vw,36px)", fontWeight: 600, lineHeight: 1.18, letterSpacing: "-.02em", color: "#1f2329" }}>
            Architecting a 0 → 1 UI-Kit for a more intuitive student recruitment
          </h1>
          <p style={{ margin: "0 0 clamp(30px,5vh,40px)", fontSize: 16, lineHeight: 1.5, letterSpacing: ".06em", fontWeight: 600, color: "#5a616b" }}>
            Creating reusable components and refining navigation through usability testing and best accessibility practices
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "clamp(22px,5vw,30px) clamp(16px,4vw,28px)", marginBottom: "clamp(40px,7vh,60px)" }}>
            {[
              { label: "Timeline", value: <>Jun – Oct 2026<br />(Ongoing project)</> },
              { label: "My Role", value: "Design Systems Lead, Web Designer" },
              { label: "Team", value: "6 Designers + 1 Design Lead" },
              { label: "Skills", value: "Figma, Claude, User Interviews, Design Systems" },
            ].map((m) => (
              <div key={m.label}>
                <h2 style={{ margin: "0 0 7px", fontFamily: "var(--font-geist)", fontSize: 16, fontWeight: 600, lineHeight: 1.2, letterSpacing: ".03em", color: "#2f9fe0" }}>{m.label}</h2>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, letterSpacing: ".06em", color: "#3c424b" }}>{m.value}</p>
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

            <h3 style={h3}>Reusable UI-kit that builds the design foundation</h3>
            <p style={body}>Comprised of a component library, typography, and color styles.</p>
            <VisualSlot label="UI kit — component library, typography, and color styles" />

            <h3 style={{ ...h3, marginTop: 34 }}>Desktop experience</h3>
            <p style={body}>Current desktop flow.</p>
            <VisualSlot label="Desktop flow — the current Triceratops Club site" />

            <h3 style={{ ...h3, marginTop: 34 }}>Mobile experience</h3>
            <p style={body}>Current mobile flow.</p>
            <VisualSlot label="Mobile flow — the current Triceratops Club site" ratio="4 / 5" />
          </section>

          {/* In-flight notice. Dashed to read as deliberately unfinished, the
              same language the visual placeholders above use. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "clamp(32px,6vw,52px) clamp(20px,4vw,36px)",
              marginBottom: 8,
              borderRadius: 18,
              border: "2px dashed #9ecb85",
              background: "#f6fbf3",
              textAlign: "center",
            }}
          >
            <p style={{ ...body, margin: 0 }}>
              This project is <strong style={strong}>currently ongoing</strong>!
            </p>
            <p style={{ ...body, margin: 0 }}>Check back on the full case study soon!</p>
          </div>
        </article>
      </div>

      <CityscapeFooter />
      <Lightbox />
    </div>
  );
}
