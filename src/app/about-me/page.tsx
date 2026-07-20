import SubpageHeader from "@/components/SubpageHeader";
import CityscapeFooter from "@/components/CityscapeFooter";
import SnippetCarousel from "@/components/SnippetCarousel";
import MusicSnippets from "@/components/MusicSnippets";

const foodSnippets = [
  { src: "/assets/food-snip-1.png", caption: "Komeya No Bento in SF!" },
  { src: "/assets/food-snip-2.png", caption: "Toast In Town in Foster City!" },
  { src: "/assets/food-snip-3.png", caption: "Marnee Thai in SF!" },
  { src: "/assets/food-snip-4.png", caption: "U:Dessert Story in SF & Berkeley!" },
  { src: "/assets/food-snip-5.png", caption: "Sohn Cafe in SF!" },
];

const lifeSnippets = [
  { src: "/assets/life-snip-1.png", caption: "Photobooths anyone?" },
  { src: "/assets/life-snip-2.png", caption: "I love mahjong!" },
  { src: "/assets/life-snip-3.png", caption: "Pokemon…my childhood" },
  { src: "/assets/life-snip-4.png", caption: "My dogs <3" },
  { src: "/assets/life-snip-5.png", caption: "KBBQ Night!" },
];

const sectionHeading: React.CSSProperties = { fontFamily: "var(--font-ibm-plex-sans)", fontSize: "clamp(20px,2.4vw,24px)", fontWeight: 600, letterSpacing: "-.02em", color: "#3a9fe0" };
const bodyText: React.CSSProperties = { margin: "0 0 18px", fontSize: "clamp(16px,1.7vw,18px)", lineHeight: 1.7, color: "#3c424b" };

export default function AboutMe() {
  return (
    <div style={{ position: "relative", width: "100%", background: "#ffffff", overflowX: "clip" }}>
      <SubpageHeader />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 1080, margin: "0 auto", padding: "clamp(96px,14vh,150px) clamp(22px,5vw,40px) clamp(60px,9vh,110px)" }}>
        <h1 style={{ margin: "0 0 clamp(36px,6vh,64px)", fontFamily: "var(--font-ibm-plex-sans)", fontSize: "clamp(28px,4.4vw,46px)", fontWeight: 500, lineHeight: 1.18, letterSpacing: "-.03em", color: "#2c3036" }}>
          Hey, I&apos;m Nathan! A <span style={{ color: "#2f9fe0", fontWeight: 700 }}>UI/UX &amp; Product designer</span> with a love for anything creative!
        </h1>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(28px,5vw,56px)", alignItems: "flex-start" }}>
          <div style={{ flex: "0 0 clamp(220px,30vw,320px)", maxWidth: "100%" }}>
            <img src="/assets/me-portrait.png" alt="Nathan giving two thumbs up" style={{ display: "block", width: "100%", height: "auto", aspectRatio: "708/1164", objectFit: "cover", borderRadius: 6 }} />
          </div>

          <div style={{ flex: "1 1 380px", minWidth: 0 }}>
            <h2 style={{ margin: "0 0 16px", ...sectionHeading }}>My Story</h2>
            <p style={bodyText}>I study Design and Psychology at UC Davis, where I focus on UI/UX design, cognitive and social psychology. I&apos;m currently based in San Francisco (born and raised!).</p>
            <p style={bodyText}>Originally, I studied both animation and illustration. As I&apos;ve always loved anything involving visuals, it led me to branch out and explore design. Though…I wasn&apos;t sure what field of design to pursue.</p>
            <p style={bodyText}>
              That was until, after joining a human-centered design organization on campus, I grew a love for <strong style={{ color: "#2f9fe0", fontWeight: 600 }}>creative problem-solving</strong> to bring solutions in <strong style={{ color: "#2f9fe0", fontWeight: 600 }}>accessibility and social connection</strong>.
            </p>
            <p style={bodyText}>
              I&apos;m someone who is <strong style={{ color: "#2f9fe0", fontWeight: 600 }}>proactive, communicative, and advocating</strong> to push things forward to ensure everyone stays on the same page. But most importantly, I love <strong style={{ color: "#2f9fe0", fontWeight: 600 }}>building connections!</strong>
            </p>
            <p style={bodyText}>Outside of design, you&apos;ll often find me going on fun excursions with my friends! I love discovering new coffee shops/cafes, exploring the city, and taking photos!</p>
            <p style={{ ...bodyText, marginBottom: 0 }}>For my drink connoisseurs, Heytea&apos;s jasmine milk tea has become my biggest obsession! If you want to hear my other favorite drinks (or your own!), let&apos;s chat and yap together!</p>
          </div>
        </div>

        <h2 style={{ margin: "clamp(56px,9vh,96px) 0 14px", ...sectionHeading }}>Food Snippets!</h2>
        <p style={{ margin: "0 0 clamp(22px,3.5vh,30px)", fontSize: "clamp(16px,1.7vw,18px)", lineHeight: 1.7, color: "#3c424b" }}>
          I believe food + cafes are the best thing to experience in life.&nbsp; psst…you can follow me on Beli! @HakoBako
        </p>
        <SnippetCarousel items={foodSnippets} direction={-1} />

        <h2 style={{ margin: "clamp(40px,6.5vh,64px) 0 14px", ...sectionHeading }}>Life Snippets!</h2>
        <p style={{ margin: "0 0 clamp(22px,3.5vh,30px)", fontSize: "clamp(16px,1.7vw,18px)", lineHeight: 1.7, color: "#3c424b" }}>
          I also believe having fun with friends is the best thing to experience in life.
        </p>
        <SnippetCarousel items={lifeSnippets} direction={1} />

        <h2 style={{ margin: "clamp(40px,6.5vh,64px) 0 14px", ...sectionHeading }}>Music Snippets</h2>
        <p style={{ margin: "0 0 clamp(22px,3.5vh,30px)", fontSize: "clamp(16px,1.7vw,18px)", lineHeight: 1.7, color: "#3c424b" }}>
          …I also also believe listening to music is the best thing to experience in life. Take a look at my current favorite plays!
        </p>
        <MusicSnippets />
      </main>

      <CityscapeFooter buildingStyle="boxes" />
    </div>
  );
}
