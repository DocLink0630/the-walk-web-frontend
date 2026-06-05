import type { StaticImageData } from "next/image";

export type BrandStoryParagraphVariant = "body" | "muted";

export interface BrandStoryParagraph {
  text: string;
  variant?: BrandStoryParagraphVariant;
}

export interface BrandStoryCta {
  label: string;
  href: string;
  variant: "outline" | "filled";
}

export interface BrandStorySectionProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  paragraphs?: BrandStoryParagraph[];
  ctas?: BrandStoryCta[];
  image?: string | StaticImageData;
  imageAlt?: string;
}
