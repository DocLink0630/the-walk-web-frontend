import type { ModelCategory } from "@/types/talents";
import type { ModelTier } from "@/types/admin";

export interface PublicFeaturedModel {
  name: string;
  height?: string | null;
  imageUrl: string | null;
}

/** GET /v1/public/models — no auth required */
export interface PublicApiModel {
  name: string;
  height?: string | null;
  imageUrl: string | null;
}

export interface PublicModelsPageResponse {
  data: PublicApiModel[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
