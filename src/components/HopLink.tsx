import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: string;
  };

export default function HopLink({ children, className, ...props }: Props) {
  return (
    <Link {...props} className={`hoplink ${className || ""}`}>
      {children.split("").map((c, i) => (
        <span key={i} className="hl" style={{ animationDelay: `${(i * 0.035).toFixed(3)}s` }}>
          {c === " " ? " " : c}
        </span>
      ))}
    </Link>
  );
}
