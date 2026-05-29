import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";

export type AcademyImageVariant = "main" | "accent-overlap";

export interface AcademyImage {
  src: string | StaticImageData;
  alt?: string;
  variant: AcademyImageVariant;
}

export interface AcademyCTAProps {
  id?: string;
  eyebrow?: string;
  heading?: string | ReactNode;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  images?: AcademyImage[];
}
