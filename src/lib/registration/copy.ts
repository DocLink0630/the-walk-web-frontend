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
    uploadsSubtitle: "All photos must be JPEG or PNG — step 3 of 3",
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
      "Include your experience tier (Fresher / Experienced / Super model), measurements, and portfolio details.",
    uploadsTitle: "Portfolio & documents",
    uploadsSubtitle: "Profile photo, NIC, and portfolio images (JPEG or PNG) — step 3 of 3",
    submitLabel: "Submit profile",
    successTitle: "Profile submitted",
    successMessage:
      "Thank you for registering with The Walk. Verify your email, then our team will review your profile for listing on the platform.",
    successSteps: [
      "Check your inbox and verify your email address",
      "Our team reviews your profile and portfolio",
      "Once approved, your profile may be visible to clients on the platform",
    ],
    resetLabel: "Register another model",
  },
};
