import type { AcademyImage } from "@/types/academy";

export const ACADEMY_IMAGES: AcademyImage[] = [
  {
    src: "/images/Gallery/DSC09664%20copy.webp",
    alt: "Academy training session",
    variant: "main",
  },
  {
    src: "/images/Gallery/DSC09640%20copy.webp",
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
