import SiteHeader from "@/components/SiteHeader";
import HeroVisuals from "@/components/HeroVisuals";
import ScrollHighlightIntro from "@/components/ScrollHighlightIntro";
import Marquee from "@/components/Marquee";
import WorkCards from "@/components/WorkCards";
import CityscapeFooter from "@/components/CityscapeFooter";
import SparkleClicks from "@/components/SparkleClicks";

export default function Home() {
  return (
    <div style={{ position: "relative", width: "100%", background: "transparent" }}>
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
