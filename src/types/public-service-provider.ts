export type ServiceProviderType = "beautician" | "photographer";

export interface PublicServiceProvider {
  id: string;
  userId: string;
  name: string;
  specialties: string[];
  yearsOfExperience: number | null;
  location: string | null;
  rateCard: string | null;
  shortBio: string | null;
  equipmentOverview?: string | null;
  imageUrl: string | null;
  portfolioImages: string[];
}

export interface PublicServiceProvidersResponse {
  data: PublicServiceProvider[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
