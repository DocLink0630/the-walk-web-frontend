export interface MembershipPackage {
  id: string;
  name: string;
  price: string;
  durationMonths: number;
  isTrial: boolean;
  isPriorityListing: boolean;
  description: string | null;
  features: string[];
  sortOrder: number;
  isActive: boolean;
}

export const MODEL_PACKAGES: MembershipPackage[] = [
  {
    id: "model-starter",
    name: "Starter Package",
    price: "LKR 3,500",
    durationMonths: 3,
    isTrial: false,
    isPriorityListing: false,
    description: "Best for: New models getting started.",
    features: [
      "Up to 5 Portfolio Photos",
      "Model Profile Listing",
      "Apply for Casting Opportunities",
    ],
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "model-standard",
    name: "Standard Package",
    price: "LKR 5,000",
    durationMonths: 6,
    isTrial: false,
    isPriorityListing: false,
    description: "Best for: Models looking for more exposure.",
    features: [
      "Up to 10 Portfolio Photos",
      "Model Profile Listing",
      "Apply for Casting Opportunities",
    ],
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "model-professional",
    name: "Professional Package",
    price: "LKR 7,500",
    durationMonths: 12,
    isTrial: false,
    isPriorityListing: true,
    description: "Best for: Active models building their professional portfolio.",
    features: [
      "Up to 15 Portfolio Photos",
      "Verified Profile Badge",
      "Priority Profile Listing",
      "Apply for Casting Opportunities",
    ],
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "model-premium",
    name: "Premium Package",
    price: "LKR 15,000",
    durationMonths: 36,
    isTrial: false,
    isPriorityListing: true,
    description: "Best for: Professional models seeking maximum visibility.",
    features: [
      "Up to 25 Portfolio Photos",
      "Verified Profile Badge",
      "Priority Profile Listing",
      "Long-Term Membership",
      "Apply for Casting Opportunities",
    ],
    sortOrder: 3,
    isActive: true,
  },
];

export const SERVICE_PACKAGES: MembershipPackage[] = [
  {
    id: "service-trial",
    name: "Free Trial Access (First 3 Months)",
    price: "FREE",
    durationMonths: 3,
    isTrial: true,
    isPriorityListing: false,
    description: "Experience the platform before committing.",
    features: [
      "Basic profile setup on the platform",
      "Ability to showcase your work",
      "Visibility in search results",
      "Access to incoming booking opportunities",
      "Platform exposure to models and clients",
    ],
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "service-annual",
    name: "Annual Membership Plan",
    price: "LKR 5,000",
    durationMonths: 12,
    isTrial: false,
    isPriorityListing: true,
    description: "Continue with full access after your free trial.",
    features: [
      "Full professional profile",
      "Unlimited visibility in relevant searches",
      "Showcase portfolio (expanded uploads)",
      "Direct booking requests from models/clients",
      "Priority listing over non-paid users",
      "Continued access to platform opportunities",
      "1-Year Membership Renewal",
    ],
    sortOrder: 1,
    isActive: true,
  },
];

export type MembershipPackageVariant = "model" | "service";

export function getDefaultPackages(variant: MembershipPackageVariant): MembershipPackage[] {
  return variant === "service" ? SERVICE_PACKAGES : MODEL_PACKAGES;
}

export function formatPackageDuration(durationMonths: number): string {
  if (durationMonths === 1) return "1 month";
  if (durationMonths === 12) return "1 year";
  if (durationMonths === 36) return "3 years";
  return `${durationMonths} months`;
}
