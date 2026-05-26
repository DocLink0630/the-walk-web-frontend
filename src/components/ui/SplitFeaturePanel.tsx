import Link from "next/link";

export interface SplitFeaturePanelProps {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
}

export default function SplitFeaturePanel({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  className = "",
}: SplitFeaturePanelProps) {
  return (
    <div className={className}>
      <p className="font-ui text-[10px] md:text-[11px] font-light tracking-[0.28em] md:tracking-[0.32em] uppercase text-[#C8A97A] mb-4 md:mb-6">
        {eyebrow}
      </p>
      <h3 className="font-display text-[28px] md:text-[32px] lg:text-[40px] font-light text-[#0A0A0A] leading-[1.15] mb-4 md:mb-6">
        {title}
      </h3>
      <p className="font-display italic text-[16px] md:text-[18px] lg:text-[20px] font-light text-[#4A4A4A] leading-[1.8] mb-6 md:mb-8 lg:mb-10">
        {description}
      </p>
      <Link
        href={ctaHref}
        data-cursor="button"
        className="inline-block font-ui text-[11px] md:text-[12px] font-light tracking-[0.2em] md:tracking-[0.22em] uppercase px-6 md:px-8 py-3.5 md:py-4 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors duration-300 w-full md:w-auto text-center"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}