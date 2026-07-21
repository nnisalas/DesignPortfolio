import DottedBackground from "@/components/DottedBackground";
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
      <DottedBackground />
      <SiteHeader />
      <SparkleClicks />
      <HeroVisuals />
      <ScrollHighlightIntro />
      <Marquee />
      <WorkCards />
      <CityscapeFooter />
    </div>
  );
}
