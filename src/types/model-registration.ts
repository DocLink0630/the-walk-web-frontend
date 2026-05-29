import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";

export interface RegistrationStep {
  number: string;
  title: string;
  description: string;
}

export type ModelRegistrationImageVariant =
  | "main"
  | "accent-top"
  | "accent-bottom";

export interface ModelRegistrationImage {
  src: string | StaticImageData;
  alt?: string;
  variant: ModelRegistrationImageVariant;
}

export interface ModelRegistrationCTAProps {
  id?: string;
  eyebrow?: string;
  heading?: string | ReactNode;
  description?: string;
  steps?: RegistrationStep[];
  ctaLabel?: string;
  ctaHref?: string;
  images?: ModelRegistrationImage[];
  decorativeText?: string;
}
