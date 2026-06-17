import type {
    FounderQuoteParagraph,
    FounderQuoteVariant,
} from "@/types/founder";
const QUOTE_STYLES: Record<FounderQuoteVariant, string> = {
    lead: "font-display italic text-[28px] md:text-[36px] lg:text-[40px] font-normal tracking-[0.03em] text-[#0A0A0A] leading-[1.45]",
    body: "font-display text-[20px] md:text-[22px] lg:text-[24px] font-normal text-[#3A3A3A] leading-[1.7]",
    muted: "font-display italic text-[20px] md:text-[22px] font-normal text-[#6B6B6B] leading-[1.7]",
};

export interface FounderQuoteBlockProps {
    eyebrow?: string;
    paragraphs?: FounderQuoteParagraph[];
    className?: string;
}

export default function FounderQuoteBlock({
    eyebrow,
    paragraphs,
    className = "",
}: FounderQuoteBlockProps) {
    return(
        <div className={className}>
            {eyebrow && (
                <p className="font-ui text-[12px] md:text-[13px] font-medium tracking-[0.3em] uppercase text-[#9A7329] mb-8">
                    {eyebrow}
                </p>
            )}
           <blockquote className="space-y-8">
                {paragraphs?.map((paragraph) => (
                <p
                    key={paragraph.text}
                    className={QUOTE_STYLES[paragraph.variant ?? "body"]}
                >
                    {paragraph.text}
                </p>
                ))}
            </blockquote>
        </div>
    )
}
