import type { ModelCategory } from "@/types/talents";
import type { ModelTier } from "@/types/admin";

export interface PublicFeaturedModel {
  name: string;
  height?: string | null;
  imageUrl: string | null;
  portfolioImages?: string[];
  portfolioCount?: number;
}

/** GET /v1/public/models — no auth required */
export interface PublicApiModel {
  /** Real user UUID returned by the backend — use this for cart/inquiry */
  userId?: string | null;
  name: string;
  height?: string | null;
  imageUrl: string | null;
  portfolioImages?: string[];
  portfolioCount?: number;
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
  /** Total number of portfolio images — used to render locked placeholder slots for guests */
  portfolioCount?: number;
  workExperienceImages?: string[];
  /** True when sourced from featured-only fallback (guest or permission denied) */
  isFeaturedOnly?: boolean;
}
