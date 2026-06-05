import logoImage from "@/assets/images/logo.png";
import type { BrandStoryCta, BrandStoryParagraph } from "@/types/brand-story";

export const BRAND_STORY_IMAGE = logoImage;

export const BRAND_STORY_COPY = {
  eyebrow: "OUR STORY",
  heading: "A VISION REALIZED",
  imageAlt: "The Walk Academy logo",
} as const;

export const BRAND_STORY_PARAGRAPHS: BrandStoryParagraph[] = [
  {
    text: "Founded in 2019 by Dasun Wijesinghe, The Walk Academy was built to raise the standard of modelling education in Sri Lanka — with professional training, honest guidance, and a clear path for new talent.",
    variant: "body",
  },
  {
    text: "What started as focused classes in Colombo has grown into a trusted academy for aspiring models across the island, helping students build confidence, technique, and the discipline the industry expects.",
    variant: "body",
  },
  {
    text: "We do not only teach poses and runway walks. We prepare Sri Lankan talent to show up prepared, professional, and ready for real opportunities at home.",
    variant: "muted",
  },
];

export const BRAND_STORY_CTAS: BrandStoryCta[] = [
  {
    label: "EXPLORE COURSES",
    href: "/academy",
    variant: "outline",
  },
  {
    label: "STUDENT REGISTRATION",
    href: "/register",
    variant: "filled",
  },
];
