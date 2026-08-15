"use client";

import { createElement, type JSX, type ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import type { RevealVariant } from "@/lib/reveal";

export default function RevealText({
  tag = "p",
  trigger,
  variant,
  stagger,
  className,
  style,
  children,
}: {
  tag?: keyof JSX.IntrinsicElements;
  trigger: "load" | "scroll";
  variant: RevealVariant;
  stagger?: number;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const ref = useReveal<HTMLElement>({ trigger, variant, stagger });
  return createElement(tag, { ref, className, style }, children);
}
