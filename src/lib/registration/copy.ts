import type { RegistrationVariant } from "@/types/registration-form";

export interface RegistrationCopy {
  eyebrow: string;
  accountTitle: string;
  accountSubtitle: string;
  personalTitle: string;
  personalSubtitle: string;
  uploadsTitle: string;
  uploadsSubtitle: string;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  successSteps: string[];
  resetLabel: string;
}

export const REGISTRATION_COPY: Record<RegistrationVariant, RegistrationCopy> = {
  student: {
    eyebrow: "Academy registration",
    accountTitle: "Create your account",
    accountSubtitle: "Join The Walk Academy — step 1 of 3",
    personalTitle: "Personal details",
    personalSubtitle: "Fields marked * are required",
    uploadsTitle: "Documents & photos",
    uploadsSubtitle: "All photos must be JPEG, PNG, or WebP — step 3 of 3",
    submitLabel: "Submit application",
    successTitle: "Application submitted",
    successMessage:
      "Thank you for applying to The Walk Academy. Our team will review your application and be in touch shortly.",
    successSteps: [
      "Your profile and documents are under review",
      "You will receive an email confirmation",
      "Our team will contact you to schedule your assessment",
    ],
    resetLabel: "Register another applicant",
  },
  model: {
    eyebrow: "Model registration",
    accountTitle: "Create your model profile",
    accountSubtitle: "Join The Walk Agency roster — step 1 of 3",
    personalTitle: "Model profile details",
    personalSubtitle:
      "Include your measurements, appearance details, and portfolio information. Our team assigns your listing tier and rate after review.",
    uploadsTitle: "Work samples & documents",
    uploadsSubtitle:
      "Profile photo, NIC, portfolio photos, and optional work experience entries (title + photos) — step 3 of 3",
    submitLabel: "Submit profile",
    successTitle: "Profile submitted",
    successMessage:
      "Thank you for registering with The Walk. Our team will review your profile and assign your listing tier and price range.",
    successSteps: [
      "Your profile and portfolio are submitted for admin review",
      "Our team reviews your application and work samples",
      "Once approved, your profile may be visible to clients on the platform",
    ],
    resetLabel: "Register another model",
  },
};

export const ADMIN_MODEL_COPY: RegistrationCopy = {
  eyebrow: "Admin — add model",
  accountTitle: "Model account",
  accountSubtitle: "Create login credentials for the new model — step 1 of 3",
  personalTitle: "Model profile details",
  personalSubtitle:
    "Set tier, rate, and measurements. These will be applied on approval after save.",
  uploadsTitle: "Work samples & documents",
  uploadsSubtitle:
    "Profile photo, NIC, portfolio photos, and optional work experience entries (title + photos) — step 3 of 3",
  submitLabel: "Save & activate model",
  successTitle: "Model added",
  successMessage:
    "The model profile was saved, approved with tier and price range, and set to Active.",
  successSteps: [
    "Profile and documents are stored on the platform",
    "Tier, price range per event, and talents were applied via approval",
    "Account status is Active — the model can sign in immediately",
  ],
  resetLabel: "Add another model",
};
