import type {
    FounderQuoteParagraph,
    FounderQuoteVariant,
} from "@/types/founder";
const QUOTE_STYLES: Record<FounderQuoteVariant, string> = {
    lead: "font-display italic text-[24px] md:text-[32px] font-light tracking-[0.05em] text-[#0A0A0A] leading-[1.4]",
    body: "font-display text-[18px] md:text-[20px] font-light text-[#4A4A4A] leading-[1.7]",
    muted: "font-display italic text-[18px] md:text-[20px] font-light text-[#9A9A9A] leading-[1.7]",
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
                <p className="font-ui text-[11px] font-light tracking-[0.35em] uppercase text-[#C8A97A] mb-8">
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
