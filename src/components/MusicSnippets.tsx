"use client";

import { useState } from "react";

const BOPS: Record<"k" | "j" | "o", { img: string; label: string; track: string }[]> = {
  k: [
    { img: "/assets/bop-1.png", label: "Love Attack- Rescene", track: "6uosenLUNFZtOIih5T0qfV" },
    { img: "/assets/bop-2.png", label: "ATM- Jihyo", track: "7angRTnu7Xopk5DV3dXivC" },
    { img: "/assets/bop-3.png", label: "Fighting-BSS", track: "7eBpUuPnDTfbeP1P4P93CS" },
    { img: "/assets/bop-4.png", label: "What Can I Do?- Day6", track: "0vqv6S6Xu9zMa8O8PCo4Hl" },
  ],
  j: [
    { img: "/assets/jbop-1.png", label: "Spyder- Takase Toya", track: "0AETkRVMnlqB2KIaqu0tk2" },
    { img: "/assets/jbop-2.png", label: "UFO- F5ve", track: "1jovTsvEEuyIndZVGFSuIB" },
    { img: "/assets/jbop-3.png", label: "September San- Radwimps", track: "3EJ9foB9HKSfwFTR1uoeUH" },
    { img: "/assets/jbop-4.png", label: "Kusege- Saucy Dog", track: "4Ekl0MpYIJO7JewY0zm4nE" },
  ],
  o: [
    { img: "/assets/obop-1.png", label: "Dreamboy- Mico", track: "5KTNLtiDrid77ZaYkHtMxn" },
    { img: "/assets/obop-2.png", label: "Toast- Claudia", track: "7zZiFxWYwoSllreC0dtUxy" },
    { img: "/assets/obop-3.png", label: "Gala- XG", track: "6laUIsJKwTQMXAAEKnCwES" },
    { img: "/assets/obop-4.png", label: "Tell Me- Raph", track: "20HCM9B7zWN96bf6ntSUsK" },
  ],
};

const TABS: { key: "k" | "j" | "o"; label: string }[] = [
  { key: "k", label: "K-Bops" },
  { key: "j", label: "J-Bops" },
  { key: "o", label: "Other Bops" },
];

export default function MusicSnippets() {
  const [tab, setTab] = useState<"k" | "j" | "o">("k");
  const [sel, setSel] = useState<string | null>(null);

  const bops = BOPS[tab];

  return (
    <>
      <div style={{ display: "flex", gap: "clamp(22px,4vw,44px)", marginBottom: "clamp(22px,3.5vh,32px)" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setSel(null);
            }}
            style={{
              padding: "0 0 8px",
              background: "none",
              border: "none",
              borderBottom: `2px solid ${tab === t.key ? "#1f2329" : "transparent"}`,
              cursor: "pointer",
              fontFamily: "var(--font-ibm-plex-sans)",
              fontSize: "clamp(17px,2vw,21px)",
              fontWeight: 600,
              letterSpacing: "-.01em",
              color: tab === t.key ? "#1f2329" : "#b9bfc7",
              transition: "color .25s ease, border-color .25s ease",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "clamp(18px,3vw,32px)", maxWidth: 1080 }}>
        {bops.map((bop) => (
          <figure key={bop.track} style={{ margin: 0, minWidth: 0 }}>
            <button
              onClick={() => setSel((s) => (s === bop.track ? null : bop.track))}
              style={{
                display: "block",
                width: "100%",
                padding: 0,
                background: "none",
                border: `3px solid ${sel === bop.track ? "#3F9FE5" : "transparent"}`,
                borderRadius: 24,
                cursor: "pointer",
                boxShadow: "0 3px 17.1px rgba(0,0,0,.17)",
                transition: "border-color .3s ease-in-out, transform .3s ease-in-out",
              }}
            >
              <div
                role="img"
                aria-label={bop.label}
                style={{ display: "block", width: "100%", aspectRatio: "1/1", backgroundImage: `url(${bop.img})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: 20 }}
              />
            </button>
            <figcaption style={{ marginTop: 10, fontSize: 12, fontWeight: 500, color: "#898989" }}>{bop.label}</figcaption>
          </figure>
        ))}
      </div>

      {sel && (
        <div style={{ marginTop: "clamp(20px,3vh,28px)", maxWidth: 1080 }}>
          <iframe
            src={`https://open.spotify.com/embed/track/${sel}?utm_source=generator`}
            title="Spotify player"
            width="100%"
            height={152}
            frameBorder={0}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ display: "block", borderRadius: 14, border: "none" }}
          />
        </div>
      )}
    </>
  );
}
