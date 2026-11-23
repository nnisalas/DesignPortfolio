import SiteHeader from "@/components/SiteHeader";
import HeroVisuals from "@/components/HeroVisuals";
import ScrollHighlightIntro from "@/components/ScrollHighlightIntro";
import Marquee from "@/components/Marquee";
import WorkCards from "@/components/WorkCards";
import CityscapeFooter from "@/components/CityscapeFooter";
import SparkleClicks from "@/components/SparkleClicks";
// import PixelIntro from "@/components/PixelIntro"; // unmounted for now

export default function Home() {
  return (
    <div style={{ position: "relative", width: "100%", background: "transparent" }}>
      {/* Pixel-dissolve loading screen (the blue screen that typed the name
          and broke into tiles), unmounted for now. Nothing was deleted --
          src/components/PixelIntro.tsx is untouched, and so is its
          `pixel-intro-blink` keyframe in globals.css.

          To bring it back: uncomment the import above and this line, then
          restore the logo-click replay in SiteHeader.tsx, which is
          commented out there for the same reason. */}
      {/* <PixelIntro /> */}
      <SiteHeader />
      <SparkleClicks />
      <HeroVisuals />
      <Marquee />
      <WorkCards />
      <ScrollHighlightIntro />
      <CityscapeFooter />
    </div>
  );
}
