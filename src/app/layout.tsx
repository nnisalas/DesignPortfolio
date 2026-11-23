import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import Script from "next/script";
import "./globals.css";
// import CustomCursor from "@/components/CustomCursor"; // unmounted for now
import PageTransition from "@/components/PageTransition";
import HakoBot from "@/components/HakoBot";

// Two weights only, per the type system in globals.css. Kept on
// next/font rather than the spec's <link> to fonts.googleapis.com:
// next/font self-hosts the files from our own origin, so there is no
// third-party request and no flash of unstyled text.
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Nathan Salas — Visual Product Designer",
  description: "Portfolio of Nathan Salas, Visual Product Designer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body>
        {/* Two things fight PixelIntro's "always land at the top" intent
            on the homepage, both native browser behavior that runs before
            any React effect gets a chance to: (1) scroll-to-fragment for a
            lingering "#work" hash, and (2) automatic scroll-position
            restoration for this history entry (the default
            history.scrollRestoration = "auto"), which can win independently
            of the hash. Disabling restoration and stripping the hash here,
            as early as possible (before hydration), beats both. */}
        <Script id="strip-home-hash" strategy="beforeInteractive">
          {`try {
            if ("scrollRestoration" in history) history.scrollRestoration = "manual";
            if (window.location.pathname === "/" && window.location.hash) {
              history.replaceState(null, "", window.location.pathname + window.location.search);
            }
          } catch (e) {}`}
        </Script>
        {/* Pixel-trail cursor, unmounted for now. The component is untouched
            in src/components/CustomCursor.tsx -- restore by uncommenting this
            line and its import above. */}
        {/* <CustomCursor /> */}
        <PageTransition>{children}</PageTransition>
        {/* Outside PageTransition on purpose: that wrapper is keyed on the
            pathname and remounts on every navigation, which would throw
            away an open conversation the moment a visitor clicked a link. */}
        <HakoBot />
      </body>
    </html>
  );
}
