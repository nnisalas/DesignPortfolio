import type { Metadata } from "next";
import SubpageHeader from "@/components/SubpageHeader";
import CityscapeFooter from "@/components/CityscapeFooter";
import StickyWall from "@/components/StickyWall";

export const metadata: Metadata = {
  title: "Stickies — Nathan Salas",
  description: "Leave a little note on Nathan Salas's sticky wall.",
};

export default function StickiesPage() {
  return (
    <div style={{ position: "relative", width: "100%", background: "#ffffff", overflowX: "clip" }}>
      <SubpageHeader />

      <main className="sticky-wrap">
        {/* Headline, not display. The display tier is only for the three
            full-viewport moments where the type IS the composition (the
            name reveal, the home hero, the about scroll stage); a page
            title is not one, and every other page title on the site --
            including "Welcome to my design wall!", this one's direct
            peer -- is .t-headline. */}
        <h1 className="t-headline" style={{ margin: 0 }}>
          Say Hello!
        </h1>
        <p className="t-body" style={{ margin: "var(--space-headline-to-body) 0 0", maxWidth: "var(--measure)" }}>
          Thanks for stopping by! Leave a little note below :D
        </p>

        <StickyWall />
      </main>

      <CityscapeFooter />
    </div>
  );
}
