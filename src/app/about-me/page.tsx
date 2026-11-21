import SubpageHeader from "@/components/SubpageHeader";
import CityscapeFooter from "@/components/CityscapeFooter";
import MusicSnippets from "@/components/MusicSnippets";
import RevealText from "@/components/RevealText";
import AboutCarousel from "@/components/AboutCarousel";

/* The icons beside each community name. Leave a field out and that icon
   renders as a plain glyph instead of a dead link. */
const LINKS: Record<string, { instagram?: string; site?: string }> = {
  di: {
    instagram: "https://www.instagram.com/davisdesigninteractive/",
    site: "https://davisdi.org/",
  },
  figma: { instagram: "https://www.instagram.com/figmaatucd/" },
  hackdavis: { instagram: "https://www.instagram.com/hackdavis/" },
};

type Shot = { src: string; alt: string; caption: string };

const COMMUNITIES: {
  key: keyof typeof LINKS;
  name: string;
  logo: string;
  /** Only Design Interactive shows the house icon in the mockups. */
  hasSite?: boolean;
  blurb: string;
  duo: [Shot, Shot];
  wide: Shot;
}[] = [
  {
    key: "di",
    name: "Design Interactive",
    logo: "/assets/about/logo-di.webp",
    hasSite: true,
    blurb:
      "I co-lead a 60-member program teaching and mentoring beginner designers in UI/UX & Figma fundamentals through weekly workshops!",
    duo: [
      {
        src: "/assets/about/di-exec.webp",
        alt: "The Design Interactive exec board posing together under a tree on campus",
        caption: "(Most of) Our Exec. Board!",
      },
      {
        src: "/assets/about/di-workshop.webp",
        alt: "Nathan and his co-lead Alyse running a workshop from the front of a classroom",
        caption: "Leading a workshop with my co-lead (Alyse)!",
      },
    ],
    wide: {
      src: "/assets/about/di-community.webp",
      alt: "The whole Design Interactive cohort filling a lecture room, making a heart shape with their hands",
      caption: "The best design community ever",
    },
  },
  {
    key: "figma",
    name: "Figma @ UCD",
    logo: "/assets/about/logo-figma.webp",
    blurb:
      "As a Figma Campus Leader, with my co-leads, we plan and host events that bring design education and resources to students!",
    duo: [
      {
        src: "/assets/about/figma-coleads.webp",
        alt: "Nathan and his Figma co-leads around a dinner table of ramen, throwing peace signs",
        caption: "My Figma Co-Leads!",
      },
      {
        src: "/assets/about/figma-tabling.webp",
        alt: "The Figma @ UCD table at the Tech Mixer, stocked with stickers and swag",
        caption: "Tabling at UCD's Tech Mixer",
      },
    ],
    wide: {
      src: "/assets/about/figma-fof.webp",
      alt: "A room full of students at the Friends of Figma x Figma @ UCD event",
      caption: "Friends of Figma (FoF) x Figma @ UCD Event!",
    },
  },
  {
    key: "hackdavis",
    name: "HackDavis",
    logo: "/assets/about/logo-hackdavis.webp",
    blurb:
      "As Creative Director and Design Lead, I mentor design directors through structured syncs to prepare for UC Davis' annual hackathon!",
    duo: [
      {
        src: "/assets/about/hd-team.webp",
        alt: "The HackDavis design team crowded around a long dining-hall table",
        caption: "My Design Team!",
      },
      {
        src: "/assets/about/hd-arena.webp",
        alt: "The UC Davis arena filled with rows of hackers at work during HackDavis",
        caption: "HackDavis 2027!",
      },
    ],
    wide: {
      src: "/assets/about/hd-group.webp",
      alt: "The full HackDavis organizing team on stage under a balloon arch",
      caption: "Stay Tuned for 2027!",
    },
  },
];

const FOOD: Shot[] = [
  {
    src: "/assets/about/food-1.webp",
    alt: "Two bento boxes and iced drinks on a red picnic blanket",
    caption: "Komeya No Bento in SF!",
  },
  {
    src: "/assets/about/food-2.webp",
    alt: "A spread of Thai dishes — noodles, curry and broccoli beef — across a table",
    caption: "Marnee Thai in SF!",
  },
  {
    src: "/assets/about/food-3.webp",
    alt: "Two bingsu desserts on brass trays, one mango and one ube",
    caption: "U:Dessert Story in SF & Berkeley!",
  },
];

const FUN: Shot[] = [
  {
    src: "/assets/about/fun-1.webp",
    alt: "A six-frame photobooth strip of friends piling in with props",
    caption: "Photobooths anyone?",
  },
  {
    src: "/assets/about/fun-2.webp",
    alt: "A mahjong wall built up on a wooden table mid-game",
    caption: "I love mahjong!",
  },
  {
    src: "/assets/about/fun-3.webp",
    alt: "Friends posing at a garden and outside a cafe called JANDii",
    caption: "Cafe hopping!",
  },
];

function Figure({ shot, ratio }: { shot: Shot; ratio: string }) {
  return (
    <figure className="ab-fig">
      <img src={shot.src} alt={shot.alt} loading="lazy" style={{ aspectRatio: ratio }} />
      <figcaption className="ab-cap">{shot.caption}</figcaption>
    </figure>
  );
}

function IconLink({ href, src, label }: { href?: string; src: string; label: string }) {
  const img = <img className="ab-ident-icon" src={src} alt="" />;
  if (!href) return <span title={label}>{img}</span>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="ab-ident-link">
      {img}
    </a>
  );
}

export default function AboutMe() {
  return (
    <div style={{ position: "relative", width: "100%", background: "#ffffff", overflowX: "clip" }}>
      <SubpageHeader />

      <main className="ab-wrap">
        {/* The measure keeps this to the two lines the mockup breaks it into;
            full-bleed across a 1300px column it would be one thin line. */}
        <RevealText
          tag="h1"
          className="t-headline"
          trigger="scroll"
          variant="block"
          style={{ margin: 0, maxWidth: "var(--measure)" }}
        >
          Hey, I&apos;m Nathan! A <strong>Product Designer</strong> with a love for anything creative!
        </RevealText>

        <div className="ab-hero">
          <div>
            <RevealText
              tag="h2"
              className="t-headline"
              trigger="scroll"
              variant="block"
              style={{ margin: "0 0 var(--space-headline-to-body)" }}
            >
              My Design Story
            </RevealText>
            <RevealText tag="p" trigger="scroll" variant="lines" stagger={0.05} className="t-body ab-p">
              I study UI/UX Design and Psychology @ UC Davis, and I&apos;m based in San Francisco (born and raised)!
            </RevealText>
            <RevealText tag="p" trigger="scroll" variant="block" className="t-body ab-p">
              I originally studied animation and illustration as I&apos;ve always loved visual art and storytelling. My
              interests eventually led me to branch out and explore design. Joining a human-centered design club helped
              me discover what I really enjoy about it: <strong>using creativity to solve problems for people.</strong>
            </RevealText>
            <RevealText tag="p" trigger="scroll" variant="lines" stagger={0.05} className="t-body ab-p">
              I&apos;ve become especially interested in understanding how people think, behave, and interact with digital
              products around them. I use those observations and craft streamlined experiences.
            </RevealText>
            <RevealText
              tag="p"
              trigger="scroll"
              variant="lines"
              stagger={0.05}
              className="t-body ab-p"
              style={{ marginBottom: 0 }}
            >
              Thanks for reading my story! (Check out some of my life snippets below!)
            </RevealText>
          </div>
          <img
            className="ab-portrait"
            src="/assets/about/me-headshot.webp"
            alt="Nathan smiling in a light blue shirt on a tree-lined street"
          />
        </div>

        {/* ---- MY DESIGN COMMUNITIES ---- */}
        <AboutCarousel heading="My Design Communities" labels={COMMUNITIES.map((c) => c.name)}>
          {COMMUNITIES.map((c) => (
            <div key={c.key}>
              <div className="ab-ident">
                <img className="ab-ident-logo" src={c.logo} alt="" />
                <div>
                  <p className="ab-ident-name">
                    <span className="t-sub">{c.name}</span>
                    <IconLink
                      href={LINKS[c.key].instagram}
                      src="/assets/about/icon-instagram.webp"
                      label={`${c.name} on Instagram`}
                    />
                    {c.hasSite && (
                      <IconLink
                        href={LINKS[c.key].site}
                        src="/assets/about/icon-home.webp"
                        label={`${c.name} website`}
                      />
                    )}
                  </p>
                  <p className="t-body" style={{ margin: 0, maxWidth: "var(--measure-display)" }}>
                    {c.blurb}
                  </p>
                </div>
              </div>

              <div className="ab-duo">
                <Figure shot={c.duo[0]} ratio="888 / 754" />
                <Figure shot={c.duo[1]} ratio="1 / 1" />
              </div>
              <div className="ab-wide">
                <Figure shot={c.wide} ratio="1670 / 602" />
              </div>
            </div>
          ))}
        </AboutCarousel>

        {/* ---- MY LIFE SNIPPETS ---- */}
        <AboutCarousel heading="My Life Snippets" labels={["Food", "Friends", "Music"]}>
          <div>
            <p className="t-body ab-blurb">
              I believe food + cafes are the best thing to experience in life. Psst… you can follow me on Beli!
              @HakoBako
            </p>
            <div className="ab-trio">
              {FOOD.map((s) => (
                <Figure key={s.src} shot={s} ratio="545 / 656" />
              ))}
            </div>
          </div>

          <div>
            <p className="t-body ab-blurb">
              I also believe having fun with friends is the best thing to experience in life.
            </p>
            <div className="ab-trio">
              {FUN.map((s) => (
                <Figure key={s.src} shot={s} ratio="545 / 656" />
              ))}
            </div>
          </div>

          <div>
            <p className="t-body ab-blurb">
              …I also also believe listening to music is the best thing to experience in life. Take a look at my current
              favorite plays!
            </p>
            <MusicSnippets />
          </div>
        </AboutCarousel>
      </main>

      <CityscapeFooter />
    </div>
  );
}
