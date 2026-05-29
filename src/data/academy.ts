import type { AcademyImage } from "@/types/academy";

export const ACADEMY_IMAGES: AcademyImage[] = [
  {
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    alt: "Academy training session",
    variant: "main",
  },
  {
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80",
    alt: "Model development portrait",
    variant: "accent-overlap",
  },
];

export const ACADEMY_COPY = {
  eyebrow: "TRAINING · DEVELOPMENT · MASTERY",
  heading: "Join The\nAcademy",
  description:
    "Transform your potential into a professional modeling career.",
  ctaLabel: "Learn More",
  ctaHref: "/academy",
} as const;
