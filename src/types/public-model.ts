import type { ModelCategory } from "@/types/talents";
import type { ModelTier } from "@/types/admin";

export interface PublicFeaturedModel {
  name: string;
  height?: string | null;
  imageUrl: string | null;
  portfolioImages?: string[];
  portfolioCount?: number;
  videoUrl?: string | null;
}

/** GET /v1/public/models — no auth required */
export interface PublicApiModel {
  /** Real user UUID returned by the backend — use this for cart/inquiry */
  userId?: string | null;
  name: string;
  tier?: ModelTier | null;
  gender?: string | null;
  height?: string | null;
  imageUrl: string | null;
  portfolioImages?: string[];
  portfolioCount?: number;
  videoUrl?: string | null;
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
  /** Real backend user UUID — always use this when available for inquiry cart */
  userId?: string | null;
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
  /** Total number of portfolio images from the public gallery API */
  portfolioCount?: number;
  /** Optional intro / portfolio video URL */
  videoUrl?: string | null;
  workExperienceImages?: string[];
  /** True when sourced from featured-only fallback (guest or permission denied) */
  isFeaturedOnly?: boolean;
  /** True when this card is a public influencer, not a MODEL-role listing */
  isInfluencer?: boolean;
}
