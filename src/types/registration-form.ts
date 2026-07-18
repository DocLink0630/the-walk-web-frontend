import type { AssignableModelTier } from "@/types/api/model-profile";

export type RegistrationVariant = "student" | "model";

export interface WorkExperienceImageDraft {
  file: File;
  alt?: string;
}

export interface WorkExperienceDraft {
  id: string;
  title: string;
  images: WorkExperienceImageDraft[];
}

export interface RegistrationFormState {
  modelCode: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  /** Derived from firstName + lastName; kept for legacy/admin flows */
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
  /** Admin-assigned tier when adding a model manually */
  tier: AssignableModelTier | "";
  /** Applicant rate / price range (modelProfile.rate) */
  rate: string;
  source: string;
  preferredBranch: string;
  /** Preferred class time slot label */
  preferredDate: string;
  profilePhoto: File | null;
  nicFront: File | null;
  nicBack: File | null;
  portfolioPhotos: File[];
  /** Model registration — sent as work_experience with uploaded image tokens */
  workExperiences: WorkExperienceDraft[];
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
