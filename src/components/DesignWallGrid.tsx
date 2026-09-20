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
  /**
   * Percentage box inside the frame, so art scales with the card. The
   * desktop and mobile frames are different shapes (878x1444 vs 704x767)
   * and the design file composes them differently -- on mobile the whole
   * arrangement mirrors -- so each item carries both placements. They are
   * handed to CSS as custom properties; see .dw-item.
   */
  left: string;
  top: string;
  width: string;
  /** mobile placement; falls back to the desktop values */
  mLeft?: string;
  mTop?: string;
  mWidth?: string;
  src: string;
  /**
   * A separate file for mobile. Some projects are composed differently at
   * each breakpoint rather than just repositioned, so this is a different
   * image, not a different size -- it goes through <picture> so a phone
   * never downloads the desktop one.
   */
  mSrc?: string;
  alt: string;
  z?: number;
  video?: boolean;
};

type Project = {
  title: string;
  blurb: string;
  note?: string;
  items: Item[];
};

/**
 * Doze is the worked example, measured off Project Frame (desktop/mobile).
 * The others are deliberately empty until their new art arrives -- an empty
 * frame reads as unfinished, which is honest; stand-in art would not.
 */
const PROJECTS: Project[] = [
  {
    title: "Doze",
    blurb:
      "Brand mockups for a fictional music festival project using Adobe Illustrator, Procreate, & Kittl",
    items: [
      {
        left: "2.5%", top: "4.4%", width: "68.1%",
        mLeft: "44%", mTop: "6.6%", mWidth: "50.7%",
        src: "/assets/wall/doze-logo.webp",
        alt: "The Doze logo: a welcome sign flanked by clouds",
        z: 1,
      },
      {
        left: "33.3%", top: "30.7%", width: "62.9%",
        mLeft: "5.7%", mTop: "28.2%", mWidth: "51.6%",
        src: "/assets/wall/doze-video.mp4",
        alt: "Motion reel of the Doze cartons packed in ice",
        z: 2,
        video: true,
      },
      {
        left: "3.1%", top: "71.3%", width: "80.2%",
        mLeft: "35.8%", mTop: "69%", mWidth: "57.7%",
        src: "/assets/wall/doze-rtd.webp",
        alt: "Two Doze x Blue Bottle Coffee cartons, front and nutrition panel",
        z: 3,
      },
    ],
  },
  {
    title: "#Include",
    blurb: "Sticker designs for one of my university's tech + design clubs: #Include",
    items: [
      {
        left: "4.1%", top: "5.4%", width: "91.8%",
        mLeft: "7%", mTop: "2.2%", mWidth: "86.1%",
        src: "/assets/wall/include-desktop.webp",
        mSrc: "/assets/wall/include-mobile.webp",
        alt: "#Include sticker set: a folder, keycaps spelling INCLUDE, a phone, a monitor mascot, a speech bubble, VIP pass tickets and a lanyard badge",
      },
    ],
  },
  {
    title: "Pixel Cityscape",
    blurb: "I created a pixel cityscape for my footer (thanks Figma)!",
    items: [
      {
        left: "2.5%", top: "6.3%", width: "95%",
        mLeft: "0.4%", mTop: "4.7%", mWidth: "99.1%",
        src: "/assets/wall/cityscape-desktop.webp",
        mSrc: "/assets/wall/cityscape-mobile.webp",
        alt: "Two pixel cityscapes: a pale blue daytime skyline and a dark night skyline under a crescent moon, each reflected in the water below",
      },
    ],
  },
  {
    title: "The Lavender Field",
    blurb: "Brand identity for a fictional coffee brand",
    items: [
      {
        left: "15.3%", top: "3.3%", width: "69.4%",
        mLeft: "26.4%", mTop: "3.2%", mWidth: "47.3%",
        src: "/assets/wall/lavender-desktop.webp",
        mSrc: "/assets/wall/lavender-mobile.webp",
        alt: "The Lavender Field brand board: logo variations, colour palette, Poppins and Pacifico type specimens, a lavender pattern and a coffee bag mockup",
      },
    ],
  },
  { title: "Design Interactive", blurb: "Mobile design practice for my human-centered design club project with Figma material", items: [] },
  { title: "Snapshoot", blurb: "Photo booth inspired project designed on Figma & Claude", note: "Click the image to play with the prototype!", items: [] },
  { title: "HackDavis Design", blurb: "Concept designs for one of my university's hackathons", items: [] },
  { title: "ASMR Keyboard", blurb: "Keyboard with different themes using Figma & Claude", note: "Click to play with the prototype!", items: [] },
  { title: "Komorebi (木漏れ日)", blurb: "Branding design project I'm working on", items: [] },
];

function Frame({ p }: { p: Project }) {
  return (
    <article className="dw-card">
      <div className="dw-frame">
        {p.items.map((it, i) => {
          const style = {
            "--l": it.left,
            "--t": it.top,
            "--w": it.width,
            "--lm": it.mLeft ?? it.left,
            "--tm": it.mTop ?? it.top,
            "--wm": it.mWidth ?? it.width,
            zIndex: it.z ?? 1,
          } as React.CSSProperties;
          const cls = it.video ? "dw-item dw-item-video" : "dw-item";
          return it.video ? (
            <video
              key={i}
              className={cls}
              src={it.src}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label={it.alt}
              style={style}
            />
          ) : it.mSrc ? (
            <picture key={i}>
              <source media="(max-width: 700px)" srcSet={it.mSrc} />
              <img className={cls} src={it.src} alt={it.alt} style={style} />
            </picture>
          ) : (
            <img key={i} className={cls} src={it.src} alt={it.alt} style={style} />
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
            <img
              className="dw-polaroid"
              src="/assets/wall/welcome-polaroid-taped.webp"
              alt="An illustrated portrait of Nathan in a taped-up polaroid"
            />
            {/* the two blue blocks used to be baked into the old polaroid;
                the new one is the photo alone, so they come in separately */}
            <img className="dw-accent dw-accent-1" src="/assets/wall/welcome-accent-2.webp" alt="" aria-hidden="true" />
            <img className="dw-accent dw-accent-2" src="/assets/wall/welcome-accent-1.webp" alt="" aria-hidden="true" />
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
