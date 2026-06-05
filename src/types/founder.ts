import type { StaticImageData } from "next/image";

export type FounderQuoteVariant = "lead" | "body" | "muted";

export interface FounderQuoteParagraph {
    text: string;
    variant: FounderQuoteVariant;
}

export interface FounderProfile {
    name: string;
    title:string;
    image: string | StaticImageData;
    imageAlt?: string;
}

export interface FounderSectionProps {
    id?:string;
    eyebrow?:string;
    profile?:FounderProfile;
    paragraphs?:FounderQuoteParagraph[];
}