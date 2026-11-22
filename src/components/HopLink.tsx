import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: string;
    /**
     * A shorter label for narrow phones. Both are rendered and CSS picks
     * one (see .hl-full / .hl-short), so the swap costs no JavaScript and
     * can't disagree between the server and the client the way a
     * matchMedia check at render time would.
     */
    short?: string;
  };

const hop = (text: string) =>
  text.split("").map((c, i) => (
    <span key={i} className="hl" style={{ animationDelay: `${(i * 0.035).toFixed(3)}s` }}>
      {c === " " ? " " : c}
    </span>
  ));

export default function HopLink({ children, short, className, ...props }: Props) {
  return (
    <Link {...props} className={`hoplink ${className || ""}`}>
      {short ? (
        <>
          <span className="hl-full">{hop(children)}</span>
          <span className="hl-short">{hop(short)}</span>
        </>
      ) : (
        hop(children)
      )}
    </Link>
  );
}
