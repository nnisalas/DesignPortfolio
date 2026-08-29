import type { Metadata } from "next";
import { Geist, IBM_Plex_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" className={`${geist.variable} ${ibmPlexSans.variable}`}>
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
        <CustomCursor />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
