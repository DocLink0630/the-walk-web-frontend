import Link from "next/link";
import type {
  BrandStoryCta,
  BrandStoryParagraph,
  BrandStoryParagraphVariant,
} from "@/types/brand-story";

const PARAGRAPH_STYLES: Record<BrandStoryParagraphVariant, string> = {
  body: "font-display text-[20px] font-light text-[#4A4A4A] leading-[1.7] mb-6",
  muted:
    "font-display italic text-[20px] font-light text-[#9A9A9A] leading-[1.7] mb-10",
};

const CTA_STYLES: Record<BrandStoryCta["variant"], string> = {
  outline:
    "inline-block font-ui text-[10px] font-light tracking-[0.25em] uppercase px-8 py-3 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors duration-300",
  filled:
    "inline-block font-ui text-[10px] font-light tracking-[0.25em] uppercase px-8 py-3 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors duration-300",
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
      <p className="font-ui text-[11px] font-light tracking-[0.35em] uppercase text-[#C8A97A] mb-6">
        {eyebrow}
      </p>

      <h2 className="font-display text-[72px] font-light tracking-[0.05em] text-[#0A0A0A] leading-[0.9] mb-12">
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

      <div className="flex items-center gap-6">
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
