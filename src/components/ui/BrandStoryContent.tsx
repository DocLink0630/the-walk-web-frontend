import Link from "next/link";
import type {
  BrandStoryCta,
  BrandStoryParagraph,
  BrandStoryParagraphVariant,
} from "@/types/brand-story";

const PARAGRAPH_STYLES: Record<BrandStoryParagraphVariant, string> = {
  body: "font-display text-[16px] md:text-[18px] lg:text-[20px] font-light text-[#4A4A4A] leading-[1.7] mb-6",
  muted:
    "font-display italic text-[16px] md:text-[18px] lg:text-[20px] font-light text-[#9A9A9A] leading-[1.7] mb-8 md:mb-10",
};

const CTA_STYLES: Record<BrandStoryCta["variant"], string> = {
  outline:
    "inline-block w-full sm:w-auto text-center font-ui text-[10px] font-light tracking-[0.25em] uppercase px-6 md:px-8 py-3 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors duration-300",
  filled:
    "inline-block w-full sm:w-auto text-center font-ui text-[10px] font-light tracking-[0.25em] uppercase px-6 md:px-8 py-3 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors duration-300",
};

export interface BrandStoryContentProps {
  eyebrow: string;
  heading: string;
  paragraphs: BrandStoryParagraph[];
  ctas: BrandStoryCta[];
}

export default function BrandStoryContent({
  eyebrow,
  heading,
  paragraphs,
  ctas,
}: BrandStoryContentProps) {
  return (
    <>
      <p className="font-ui text-[10px] md:text-[11px] font-light tracking-[0.35em] uppercase text-[#C8A97A] mb-4 md:mb-6">
        {eyebrow}
      </p>

      <h2 className="font-display text-[40px] sm:text-[52px] md:text-[64px] lg:text-[72px] font-light tracking-[0.05em] text-[#0A0A0A] leading-[0.95] mb-8 md:mb-12">
        {heading}
      </h2>

      {paragraphs.map((paragraph) => (
        <p
          key={paragraph.text}
          className={PARAGRAPH_STYLES[paragraph.variant ?? "body"]}
        >
          {paragraph.text}
        </p>
      ))}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6">
        {ctas.map((cta) => (
          <Link
            key={cta.href}
            href={cta.href}
            data-cursor="button"
            className={CTA_STYLES[cta.variant]}
          >
            {cta.label}
          </Link>
        ))}
      </div>
    </>
  );
}
