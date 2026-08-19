import SubpageHeader from "@/components/SubpageHeader";
import CityscapeFooter from "@/components/CityscapeFooter";
import SnippetCarousel from "@/components/SnippetCarousel";
import MusicSnippets from "@/components/MusicSnippets";
import RevealText from "@/components/RevealText";

const foodSnippets = [
  { src: "/assets/food-snip-1.webp", caption: "Komeya No Bento in SF!" },
  { src: "/assets/food-snip-2.webp", caption: "Toast In Town in Foster City!" },
  { src: "/assets/food-snip-3.webp", caption: "Marnee Thai in SF!" },
  { src: "/assets/food-snip-4.webp", caption: "U:Dessert Story in SF & Berkeley!" },
  { src: "/assets/food-snip-5.webp", caption: "Sohn Cafe in SF!" },
];

const lifeSnippets = [
  { src: "/assets/life-snip-1.webp", caption: "Photobooths anyone?" },
  { src: "/assets/life-snip-2.webp", caption: "I love mahjong!" },
  { src: "/assets/life-snip-3.webp", caption: "Pokemon…my childhood" },
  { src: "/assets/life-snip-4.webp", caption: "My dogs <3" },
  { src: "/assets/life-snip-5.webp", caption: "KBBQ Night!" },
];

const sectionHeading: React.CSSProperties = { margin: "0 0 12px", fontFamily: "var(--font-ibm-plex-sans)", fontSize: "clamp(15px,1.7vw,17px)", fontWeight: 500, letterSpacing: "-.01em", color: "#3a9fe0" };
const sectionBlurb: React.CSSProperties = { margin: 0, fontSize: "clamp(15px,1.6vw,17px)", lineHeight: 1.65, color: "#3c424b" };
const bodyText: React.CSSProperties = { margin: "0 0 16px", fontSize: "clamp(15px,1.55vw,17px)", lineHeight: 1.7, color: "#3c424b" };

export default function AboutMe() {
  return (
    <div style={{ position: "relative", width: "100%", background: "#ffffff", overflowX: "clip" }}>
      <SubpageHeader />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 1080, margin: "0 auto", padding: "clamp(96px,14vh,150px) clamp(22px,5vw,40px) clamp(60px,9vh,110px)" }}>
        {/* HERO: portrait + intro */}
        <div className="about-two-col">
          <div>
            <img src="/assets/me-portrait.webp" alt="Nathan giving two thumbs up" style={{ display: "block", width: "100%", height: "auto", aspectRatio: "708/1164", objectFit: "cover", borderRadius: 6 }} />
          </div>
          <div>
            <RevealText
              tag="h1"
              trigger="scroll"
              variant="block"
              style={{ margin: "0 0 clamp(20px,3vh,30px)", fontFamily: "var(--font-geist)", fontSize: 36, fontWeight: 400, lineHeight: 1.25, letterSpacing: ".03em", color: "#1c1f24" }}
            >
              Hey, I&apos;m Nathan! A <strong style={{ fontWeight: 600 }}>Product Designer</strong> with a love for anything creative!
            </RevealText>
            <RevealText tag="p" trigger="scroll" variant="lines" stagger={0.05} style={bodyText}>
              I study UI/UX Design and Psychology @ UC Davis. I&apos;m currently based in San Francisco (born and raised!).
            </RevealText>
            <RevealText tag="p" trigger="scroll" variant="block" style={bodyText}>
              Originally, I studied animation. I&apos;ve always loved visual art which led me to branch out and explore design. I then joined a human-centered design club! It allowed me to discover something new about myself: <strong style={{ fontWeight: 700, color: "#1c1f24" }}>I love to help people through creative problem-solving</strong>. I love creating positive impact for people, which has been my biggest passion as a designer.
            </RevealText>
            <RevealText tag="p" trigger="scroll" variant="lines" stagger={0.05} style={bodyText}>
              You&apos;ll find me exploring my passion for helping others through leadership! I&apos;ll be an incoming leader at the human-centered design club, I&apos;ll be guiding students through their design journey and educating them about UI/UX fundamentals.
            </RevealText>
            <RevealText tag="p" trigger="scroll" variant="lines" stagger={0.05} style={bodyText}>
              I&apos;m also leading a team of designers for our university&apos;s hackathon organization! I&apos;ve discovered my passion for mentoring designers helping them develop their skills and find confidence in their creative voice!
            </RevealText>
            <RevealText tag="p" trigger="scroll" variant="lines" stagger={0.05} style={{ ...bodyText, marginBottom: 0 }}>
              Thanks for reading about my story! (Check out my life outside of design below)!
            </RevealText>
          </div>
        </div>

        {/* FOOD SNIPPETS */}
        <div className="about-two-col" style={{ marginTop: "clamp(60px,9vh,104px)" }}>
          <div>
            <RevealText tag="h2" trigger="scroll" variant="words" stagger={0.05} style={sectionHeading}>Food Snippets!</RevealText>
            <RevealText tag="p" trigger="scroll" variant="lines" stagger={0.05} style={sectionBlurb}>I believe food + cafes are the best thing to experience in life.&nbsp; psst…you can follow me on Beli! @HakoBako</RevealText>
          </div>
          <div style={{ minWidth: 0 }}>
            <SnippetCarousel items={foodSnippets} direction={-1} />
          </div>
        </div>

        {/* LIFE SNIPPETS */}
        <div className="about-two-col" style={{ marginTop: "clamp(52px,8vh,92px)" }}>
          <div>
            <RevealText tag="h2" trigger="scroll" variant="words" stagger={0.05} style={sectionHeading}>Life Snippets!</RevealText>
            <RevealText tag="p" trigger="scroll" variant="lines" stagger={0.05} style={sectionBlurb}>I also believe having fun with friends is the best thing to experience in life.</RevealText>
          </div>
          <div style={{ minWidth: 0 }}>
            <SnippetCarousel items={lifeSnippets} direction={1} />
          </div>
        </div>

        {/* MUSIC SNIPPETS */}
        <div className="about-two-col" style={{ marginTop: "clamp(52px,8vh,92px)" }}>
          <div>
            <RevealText tag="h2" trigger="scroll" variant="words" stagger={0.05} style={sectionHeading}>Music Snippets</RevealText>
            <RevealText tag="p" trigger="scroll" variant="lines" stagger={0.05} style={sectionBlurb}>…I also also believe listening to music is the best thing to experience in life. Take a look at my current favorite plays!</RevealText>
          </div>
          <div>
            <MusicSnippets />
          </div>
        </div>
      </main>

      <CityscapeFooter />
    </div>
  );
}
