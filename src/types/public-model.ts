import type { ModelCategory } from "@/types/talents";
import type { ModelTier } from "@/types/admin";

export interface PublicFeaturedModel {
  name: string;
  imageUrl: string | null;
}

export interface PublicModel {
  id: string;
  name: string;
  imageUrl: string | null;
  tier?: ModelTier;
  category?: ModelCategory;
  gender?: string;
  height?: string;
  weight?: string;
  chest?: string;
  waist?: string;
  rate?: string;
  measurements?: string;
  eyeColor?: string;
  hairColor?: string;
  bio?: string;
  portfolioImages: string[];
  /** True when sourced from featured-only fallback (guest or permission denied) */
  isFeaturedOnly?: boolean;
}
