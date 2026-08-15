"use client";

import { useReveal } from "@/hooks/useReveal";

export default function RevealImage({
  src,
  alt,
  style,
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}) {
  const ref = useReveal<HTMLImageElement>({ trigger: "scroll", variant: "block" });
  return <img ref={ref} src={src} alt={alt} style={style} />;
}
