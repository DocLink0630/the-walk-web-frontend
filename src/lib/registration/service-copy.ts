import type { ServiceRegistrationVariant } from "@/types/service-registration";

export interface ServiceRegistrationCopy {
  eyebrow: string;
  accountTitle: string;
  accountSubtitle: string;
  personalTitle: string;
  personalSubtitle: string;
  specialtiesLabel: string;
  specialtiesPlaceholder: string;
  uploadsTitle: string;
  uploadsSubtitle: string;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  successSteps: string[];
  resetLabel: string;
}

export const SERVICE_REGISTRATION_COPY: Record<
  ServiceRegistrationVariant,
  ServiceRegistrationCopy
> = {
  beautician: {
    eyebrow: "Beautician registration",
    accountTitle: "Create your beautician account",
    accountSubtitle: "Join The Walk talent network — step 1 of 3",
    personalTitle: "Your professional details",
    personalSubtitle: "Tell us about your work. Fields marked * are required.",
    specialtiesLabel: "Specialties",
    specialtiesPlaceholder: "e.g. Bridal, Editorial, SFX",
    uploadsTitle: "Portfolio photos",
    uploadsSubtitle: "Image uploads are optional — add work samples if you have them (step 3 of 3)",
    submitLabel: "Submit application",
    successTitle: "Application submitted",
    successMessage:
      "Thank you for applying to The Walk. Our team will review your profile and be in touch shortly.",
    successSteps: [
      "Your profile is submitted for admin review",
      "Our team reviews your application and work samples",
      "Once approved, your profile may be listed and you can sign in",
    ],
    resetLabel: "Register another beautician",
  },
  photographer: {
    eyebrow: "Photographer registration",
    accountTitle: "Create your photographer account",
    accountSubtitle: "Join The Walk talent network — step 1 of 3",
    personalTitle: "Your professional details",
    personalSubtitle: "Tell us about your work. Fields marked * are required.",
    specialtiesLabel: "Specialties",
    specialtiesPlaceholder: "e.g. Fashion, Commercial, Editorial",
    uploadsTitle: "Portfolio photos",
    uploadsSubtitle: "Image uploads are optional — add work samples if you have them (step 3 of 3)",
    submitLabel: "Submit application",
    successTitle: "Application submitted",
    successMessage:
      "Thank you for applying to The Walk. Our team will review your profile and be in touch shortly.",
    successSteps: [
      "Your profile is submitted for admin review",
      "Our team reviews your application and portfolio",
      "Once approved, your profile may be listed and you can sign in",
    ],
    resetLabel: "Register another photographer",
  },
};
