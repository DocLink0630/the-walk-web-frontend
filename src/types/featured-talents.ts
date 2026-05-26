import type { StaticImageData } from "next/image";

export interface FeaturedTalent {
  name: string;
  specialty: string;
  image: string | StaticImageData;
  offset?: number;
}