const cell = "clamp(24px,6.5vw,42px)";

export default function MobileMenuPixels() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{ position: "absolute", top: 0, left: 0, transform: "translate(-30%,-30%)", display: "grid", gridTemplateColumns: `repeat(3,${cell})`, gridTemplateRows: `repeat(3,${cell})` }}>
        <span style={{ background: "#8cc164" }} /><span /><span style={{ background: "#8cc164" }} />
        <span /><span style={{ background: "#8cc164" }} /><span />
        <span style={{ background: "#8cc164" }} /><span /><span style={{ background: "#8cc164" }} />
      </div>
      <div style={{ position: "absolute", top: "47%", right: 0, transform: "translate(28%,-50%)", display: "grid", gridTemplateColumns: `repeat(2,${cell})`, gridTemplateRows: `repeat(4,${cell})` }}>
        <span style={{ background: "#5aa9e6" }} /><span />
        <span /><span style={{ background: "#5aa9e6" }} />
        <span style={{ background: "#5aa9e6" }} /><span />
        <span /><span style={{ background: "#5aa9e6" }} />
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, transform: "translate(-30%,30%)", display: "grid", gridTemplateColumns: `repeat(3,${cell})`, gridTemplateRows: `repeat(3,${cell})` }}>
        <span style={{ background: "#efc84e" }} /><span /><span style={{ background: "#efc84e" }} />
        <span /><span style={{ background: "#efc84e" }} /><span />
        <span style={{ background: "#efc84e" }} /><span /><span style={{ background: "#efc84e" }} />
      </div>
      <div style={{ position: "absolute", bottom: 0, right: 0, transform: "translate(28%,30%)", display: "grid", gridTemplateColumns: `repeat(2,${cell})`, gridTemplateRows: `repeat(2,${cell})` }}>
        <span style={{ background: "#f3a738" }} /><span />
        <span /><span style={{ background: "#f3a738" }} />
      </div>
    </div>
  );
}
