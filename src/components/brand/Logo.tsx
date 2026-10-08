import { useId } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`afx-g-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0d9a6" />
          <stop offset="55%" stopColor="#c9a467" />
          <stop offset="100%" stopColor="#9c7a43" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#afx-g-${id})`} strokeLinecap="square">
        <path d="M17 80 L50 13 L86 88" strokeWidth="11" strokeLinejoin="miter" />
        <path d="M17 80 L37 80 L47 66" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
      </g>
    </svg>
  );
}

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
}

const sizes = {
  sm: { mark: "h-8 w-8", word: "text-lg", tag: "text-[7px]" },
  md: { mark: "h-10 w-10", word: "text-[22px]", tag: "text-[8px]" },
  lg: { mark: "h-12 w-12", word: "text-[26px]", tag: "text-[9px]" },
};

export function Logo({ className, size = "md", asLink = true }: LogoProps) {
  const s = sizes[size];
  const content = (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={cn(s.mark, "shrink-0")} />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display font-medium tracking-[0.2em] text-foreground", s.word)}>AUTOFLEXII</span>
        <span className={cn("mt-1.5 font-display font-medium uppercase tracking-[0.38em] text-gold", s.tag)}>
          Perfection Delivered.
        </span>
      </span>
    </span>
  );
  if (!asLink) return content;
  return (
    <Link to="/" aria-label="AUTOFLEXII home" className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60">
      {content}
    </Link>
  );
}

/** Shield emblem used for the Inspectify sub-brand. */
export function InspectifyShield({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 64 72" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`ins-g-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0d9a6" />
          <stop offset="100%" stopColor="#a8844b" />
        </linearGradient>
      </defs>
      <path
        d="M32 3 L59 12 V34 C59 52 47 63 32 69 C17 63 5 52 5 34 V12 Z"
        fill="rgba(0,0,0,0.35)"
        stroke={`url(#ins-g-${id})`}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <g stroke={`url(#ins-g-${id})`} strokeWidth="3.2" strokeLinecap="round" fill="none">
        <path d="M21 50 L43 24" />
        <path d="M43 50 L21 24" />
        <path d="M38 22 a6 6 0 1 0 8 8" />
        <path d="M26 22 a6 6 0 1 1 -8 8" />
      </g>
    </svg>
  );
}
