export interface InfluencerRegistrationFormState {
  email: string;
  password: string;
  fullName: string;
  contactNumber: string;
  contentCategories: string;
  instagramUrl: string;
  instagramFollowers: string;
  tiktokUrl: string;
  tiktokFollowers: string;
  youtubeUrl: string;
  youtubeSubscribers: string;
  facebookUrl: string;
  facebookFollowers: string;
  pastBrandWork: string;
  rateCard: string;
  shortBio: string;
  profilePhoto: File | null;
  portfolioPhotos: File[];
  step: 1 | 2 | 3;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

export interface InfluencerRegistrationStore extends InfluencerRegistrationFormState {
  set: (
    partial: Partial<
      InfluencerRegistrationFormState & {
        isSubmitting?: boolean;
        error?: string | null;
        success?: boolean;
      }
    >,
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}
