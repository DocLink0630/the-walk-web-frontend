import type { ModelTier } from "@/types/api/model-profile";

export type RegistrationVariant = "student" | "model";

export interface RegistrationFormState {
  modelCode: string;
  email: string;
  password: string;
  fullName: string;
  gender: string;
  age: string;
  nic: string;
  dob: string;
  address: string;
  contactNumber: string;
  whatsappNumber: string;
  height: string;
  weight: string;
  chest: string;
  shoulder: string;
  waist: string;
  shoeSize: string;
  eyeColor: string;
  hairColor: string;
  talents: string;
  shortBio: string;
  skinColorOptionId: string;
  /** ModelProfileDto.tier — required for model registration */
  tier: ModelTier | "";
  source: string;
  preferredBranch: string;
  preferredDate: string;
  profilePhoto: File | null;
  nicFront: File | null;
  nicBack: File | null;
  portfolioPhotos: File[];
  step: 1 | 2 | 3;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

export interface RegistrationStore extends RegistrationFormState {
  set: (partial: Partial<RegistrationFormState & { isSubmitting?: boolean; error?: string | null; success?: boolean }>) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}
