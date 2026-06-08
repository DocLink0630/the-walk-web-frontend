import type {
  ModelRegistrationImage,
  RegistrationStep,
} from "@/types/model-registration";

export const MODEL_REGISTRATION_IMAGES: ModelRegistrationImage[] = [
  {
    src: "/images/Gallery/DSC00547.jpg",
    alt: "Model portfolio showcase",
    variant: "main",
  },
  {
    src: "/images/Gallery/DSC00533.jpg",
    alt: "Fashion portrait",
    variant: "accent-top",
  },
  {
    src: "/images/Gallery/DSC00567.jpg",
    alt: "Editorial model shot",
    variant: "accent-bottom",
  },
];

export const MODEL_REGISTRATION_STEPS: RegistrationStep[] = [
  {
    number: "01",
    title: "Register Your Account",
    description: "Complete your profile with measurements and bio",
  },
  {
    number: "02",
    title: "Upload Your Portfolio",
    description: "Showcase your best work and photography",
  },
  {
    number: "03",
    title: "Start Getting Bookings",
    description: "Receive inquiries from verified clients",
  },
];

export const MODEL_REGISTRATION_COPY = {
  eyebrow: "FOR ASPIRING MODELS",
  heading: "Get Showcased.\nBuild Your Career.",
  description:
    "Create your professional profile, upload your portfolio, and connect with top fashion brands, photographers, and agencies across Sri Lanka.",
  ctaLabel: "Create Your Profile",
  ctaHref: "/register/model",
  decorativeText: "MODEL",
} as const;
