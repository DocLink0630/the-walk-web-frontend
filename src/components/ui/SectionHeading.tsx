import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  action,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="font-ui text-[9px] md:text-[10px] lg:text-[11px] font-light tracking-[0.3em] md:tracking-[0.35em] uppercase text-[#C8A97A] mb-4 md:mb-6">
          {eyebrow}
        </p>
      )}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8">
        <h2 className="font-display text-[48px] md:text-[64px] lg:text-[84px] font-light tracking-[0.05em] text-[#0A0A0A] leading-[0.9]">
          {title}
        </h2>
        {action}
      </div>
    </div>
  );
}