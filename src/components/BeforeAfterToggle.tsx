"use client";

export default function BeforeAfterToggle({
  beforeLabel,
  afterLabel,
  after,
  onChange,
}: {
  beforeLabel: string;
  afterLabel: string;
  after: boolean;
  onChange: (after: boolean) => void;
}) {
  const activeCol = "#1f2329";
  const inactiveCol = "#b9bfc7";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
      <span
        onClick={() => onChange(false)}
        style={{ fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "color .3s ease", color: after ? inactiveCol : activeCol }}
      >
        {beforeLabel}
      </span>
      <button
        onClick={() => onChange(!after)}
        aria-label="Toggle before/after"
        style={{
          position: "relative",
          flex: "none",
          width: 54,
          height: 30,
          border: "none",
          borderRadius: 999,
          background: after ? "#2f9fe0" : "#b6bcc4",
          cursor: "pointer",
          padding: 0,
          transition: "background .3s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: 3,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#ffffff",
            boxShadow: "0 1px 4px rgba(0,0,0,.25)",
            transform: `translateX(${after ? 24 : 0}px)`,
            transition: "transform .3s cubic-bezier(.65,0,.35,1)",
          }}
        />
      </button>
      <span
        onClick={() => onChange(true)}
        style={{ fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "color .3s ease", color: after ? activeCol : inactiveCol }}
      >
        {afterLabel}
      </span>
    </div>
  );
}
