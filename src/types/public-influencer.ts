export interface PublicInfluencer {
  userId: string;
  name: string;
  imageUrl: string | null;
  portfolioImages: string[];
  contentCategories: string[];
  instagramUrl: string | null;
  instagramFollowers: string | null;
  tiktokUrl: string | null;
  tiktokFollowers: string | null;
  youtubeUrl: string | null;
  youtubeSubscribers: string | null;
  facebookUrl: string | null;
  facebookFollowers: string | null;
  pastBrandWork: string | null;
  rateCard: string | null;
  shortBio: string | null;
}

export interface PublicInfluencersPageResponse {
  data: PublicInfluencer[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
