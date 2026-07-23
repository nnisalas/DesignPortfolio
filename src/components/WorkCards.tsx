import Link from "next/link";

export default function WorkCards() {
  return (
    <section
      id="work"
      style={{
        position: "relative",
        zIndex: 1,
        background: "#ffffff",
        padding: "clamp(70px,11vh,130px) clamp(20px,6vw,90px) clamp(60px,9vh,110px)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          className="workstack"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))",
            gap: "clamp(28px,4vw,56px)",
            alignItems: "start",
            justifyItems: "center",
          }}
        >
          <Link
            href="/threadit-case-study"
            data-cursor="view"
            style={{ display: "block", position: "relative", width: "min(100%,82vw)", textDecoration: "none", color: "inherit" }}
          >
            <img
              src="/assets/project-card-threadit.png"
              alt="Mitigating First-Time User Activation Drop-offs in Onboarding — 1st Place Winner (judged by LinkedIn & ServiceNow leads)"
              width={1272}
              height={1296}
              style={{ display: "block", width: "100%", height: "auto", aspectRatio: "1272/1296" }}
            />
            <img className="pc-pop" src="/assets/pop-tie.png" alt="" style={{ position: "absolute", top: "-4%", right: "-5%", width: "22%", transform: "scale(.4) rotate(14deg)" }} />
            <img className="pc-pop" src="/assets/pop-hanger.png" alt="" style={{ position: "absolute", top: "52%", left: "-5%", width: "12%", transform: "scale(.4) rotate(-16deg)" }} />
          </Link>

          <div data-cursor="soon" style={{ width: "min(100%,82vw)" }}>
            <img
              src="/assets/project-card-dicircle.png"
              alt="Lowering First-Contact Friction Between Students and Alumni — Reducing the friction that keeps students from reaching out to alumni and mentors"
              width={1272}
              height={1290}
              style={{ display: "block", width: "100%", height: "auto", aspectRatio: "1272/1290" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
