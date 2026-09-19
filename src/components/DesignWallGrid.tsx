"use client";

import CityscapeFooter from "./CityscapeFooter";
import Lightbox from "./Lightbox";

/**
 * The design wall as a scrolling grid of framed projects, replacing the
 * drag-around canvas (DesignWallStage, still in the tree).
 *
 * Grid follows the two layout guides from the design file exactly:
 *   desktop  12 columns, 40 margin, 20 gutter  -> cards span 4 (3 up)
 *   mobile    4 columns, 24 margin, 16 gutter  -> cards span 4 (1 up)
 * A 2-up band sits between them; a 3-up to 1-up jump at the phone
 * breakpoint would waste most of a tablet's width. See .dw-grid.
 */

type Item = {
  /** percentage box inside the frame, so art scales with the card */
  left: string;
  top: string;
  width: string;
  src: string;
  alt: string;
  z?: number;
  rotate?: string;
  shadow?: boolean;
  video?: boolean;
};

type Project = {
  title: string;
  blurb: string;
  note?: string;
  items: Item[];
};

// Doze is populated as the worked example. The rest carry whatever art
// already exists in /assets/wall; empty `items` renders an empty frame,
// which is deliberately visible as unfinished rather than filled with
// something stand-in.
const PROJECTS: Project[] = [
  {
    title: "Doze",
    blurb: "Brand mockups for a fictional music festival project using Adobe Illustrator, Procreate, & Kitl",
    items: [
      { left: "6%", top: "7%", width: "56%", src: "/assets/wall/doze-rtd.webp", alt: "Two Doze x Blue Bottle Coffee milk cartons, shown front and back", z: 2, shadow: true },
      { left: "30%", top: "30%", width: "64%", src: "/assets/wall/doze-video.mp4", alt: "Motion reel of the Doze brand mockups", z: 3, video: true, shadow: true },
      { left: "8%", top: "58%", width: "48%", src: "/assets/wall/doze-milk-carton-mockups.webp", alt: "The same Doze milk cartons angled on white presentation cards", z: 4, shadow: true },
      { left: "62%", top: "6%", width: "32%", src: "/assets/wall/doze-logo.webp", alt: "The Doze logo: a welcome sign flanked by clouds", z: 1 },
    ],
  },
  {
    title: "#Include",
    blurb: "Sticker designs for one of my university's tech + design clubs: # Include",
    items: [
      { left: "8%", top: "10%", width: "58%", src: "/assets/wall/include-sticker-sheet.webp", alt: "#Include sticker sheet", z: 2, shadow: true },
      { left: "50%", top: "44%", width: "44%", src: "/assets/wall/include-computer-mascot.webp", alt: "#Include computer mascot sticker", z: 3 },
      { left: "10%", top: "58%", width: "40%", src: "/assets/wall/include-vip-pass-ticket.webp", alt: "#Include VIP pass ticket design", z: 4, shadow: true },
    ],
  },
  { title: "Pixel Cityscape", blurb: "I created a pixel cityscape for my footer (thanks Figma)!", items: [] },
  {
    title: "The Lavender Field",
    blurb: "Brand identity for a fictional coffee brand",
    items: [{ left: "26%", top: "8%", width: "48%", src: "/assets/wall/lavender-field-brand-board.webp", alt: "The Lavender Field brand board: logo, colour palette and type specimens", z: 2, shadow: true }],
  },
  { title: "Design Interactive", blurb: "Mobile design practice for my human-centered design club project with Figma material", items: [] },
  {
    title: "Snapshoot",
    blurb: "Photo booth inspired project designed on Figma & Claude",
    note: "Click the image to play with the prototype!",
    items: [{ left: "19%", top: "8%", width: "62%", src: "/assets/wall/snapshoot-home-screen.webp", alt: "The Snapshoot home screen, showing a photo strip and a Snapshoot a pic button", z: 2, shadow: true }],
  },
  { title: "HackDavis Design", blurb: "Concept designs for one of my university's hackathons", items: [] },
  { title: "ASMR Keyboard", blurb: "Keyboard with different themes using Figma & Claude", note: "Click to play with the prototype!", items: [] },
  { title: "Komorebi (木漏れ日)", blurb: "Branding design project I'm working on", items: [] },
];

function Frame({ p }: { p: Project }) {
  return (
    <article className="dw-card">
      <div className="dw-frame">
        {p.items.map((it, i) => {
          const style: React.CSSProperties = {
            position: "absolute",
            left: it.left,
            top: it.top,
            width: it.width,
            height: "auto",
            zIndex: it.z ?? 1,
            transform: it.rotate ? `rotate(${it.rotate})` : undefined,
            filter: it.shadow ? "drop-shadow(0 6px 18px rgba(30,36,46,.14))" : undefined,
            borderRadius: 6,
            // Belt and braces on "must fit the frame": cap the height at
            // whatever room is left below this item's own top offset, and let
            // object-fit hold the aspect if that cap bites. Without it a tall
            // asset silently runs past the frame and gets clipped -- the
            // Lavender brand board (0.48 ratio) needed 131% of the frame
            // height at the width it was first given.
            maxWidth: `calc(100% - ${it.left})`,
            maxHeight: `calc(100% - ${it.top})`,
            objectFit: "contain",
            objectPosition: "top left",
          };
          return it.video ? (
            <video key={i} src={it.src} autoPlay loop muted playsInline preload="metadata" aria-label={it.alt} style={style} />
          ) : (
            <img key={i} src={it.src} alt={it.alt} style={style} />
          );
        })}
      </div>
      <h3 className="dw-title">{p.title}</h3>
      <p className="dw-blurb">{p.blurb}</p>
      {p.note ? <p className="dw-note">{p.note}</p> : null}
    </article>
  );
}

export default function DesignWallGrid() {
  return (
    <div style={{ position: "relative", width: "100%", background: "#ffffff", overflowX: "clip" }}>
      <div className="dw-wrap">
        {/* HERO */}
        <header className="dw-hero">
          <div className="dw-hero-art">
            <img className="dw-polaroid" src="/assets/wall/welcome-polaroid.webp" alt="An illustrated portrait of Nathan in a taped-up polaroid" />
            {/* real vector, so the drop shadow moved to CSS: baking it back
                into the SVG would hit Safari's filter-rasterisation bug */}
            <img className="dw-coffee" src="/assets/wall/coffee-cup.svg" alt="" aria-hidden="true" />
            <img className="dw-croissant" src="/assets/wall/croissant.svg" alt="" aria-hidden="true" />
          </div>
          <div className="dw-hero-copy">
            <h1>Welcome to my design wall!</h1>
            <p>Even outside of design, I love designing. I love expressing my love for creativity in different ways!</p>
            <p>Check out my other creative works on my free time!</p>
          </div>
        </header>

        {/* PROJECTS */}
        <div className="dw-grid">
          {PROJECTS.map((p) => (
            <Frame key={p.title} p={p} />
          ))}
        </div>
      </div>

      <CityscapeFooter />
      <Lightbox />
    </div>
  );
}
