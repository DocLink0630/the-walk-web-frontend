export type ServiceRegistrationVariant = "beautician" | "photographer";

export interface ServiceRegistrationFormState {
  email: string;
  password: string;
  fullName: string;
  contactNumber: string;
  /** Comma-separated specialties entered by the applicant */
  specialties: string;
  yearsOfExperience: string;
  /** Free-text rate / rate card, e.g. "LKR 25,000 / day" */
  rateCard: string;
  location: string;
  shortBio: string;
  /** Photographer only — equipment overview */
  equipmentOverview: string;
  /** Optional images */
  profilePhoto: File | null;
  portfolioPhotos: File[];
  step: 1 | 2 | 3;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

export interface ServiceRegistrationStore extends ServiceRegistrationFormState {
  set: (
    partial: Partial<
      ServiceRegistrationFormState & {
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
