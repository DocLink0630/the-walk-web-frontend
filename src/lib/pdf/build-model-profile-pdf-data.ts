import type { AdminModelRegistrationMedia } from "@/types/admin";
import type { ModelProfilePdfData } from "@/lib/pdf/types";

type OwnProfileResponse = {
  email?: string;
  viewCount?: number;
  modelProfile?: {
    fullName?: string;
    shortBio?: string | null;
    gender?: string;
    tier?: string;
    heightEnc?: string | null;
    weightEnc?: string | null;
    chestEnc?: string | null;
    shoulderEnc?: string | null;
    waistEnc?: string | null;
    eyeColorEnc?: string | null;
    hairColorEnc?: string | null;
  } | null;
  registrationMedia?: AdminModelRegistrationMedia | null;
};

export function buildModelProfilePdfData(profile: OwnProfileResponse): ModelProfilePdfData {
  const mp = profile.modelProfile;
  const media = profile.registrationMedia;

  const portfolioImages =
    media?.portfolioPhotos?.map((photo) => photo.url).filter(Boolean) ?? [];

  return {
    fullName: mp?.fullName?.trim() || "Model profile",
    email: profile.email?.trim() || "",
    tier: mp?.tier ?? null,
    gender: mp?.gender ?? null,
    shortBio: mp?.shortBio ?? null,
    height: mp?.heightEnc ?? null,
    weight: mp?.weightEnc ?? null,
    chest: mp?.chestEnc ?? null,
    shoulder: mp?.shoulderEnc ?? null,
    waist: mp?.waistEnc ?? null,
    eyeColor: mp?.eyeColorEnc ?? null,
    hairColor: mp?.hairColorEnc ?? null,
    viewCount: profile.viewCount,
    profileImage: media?.profilePhoto?.url ?? portfolioImages[0] ?? null,
    portfolioImages,
    workExperience:
      media?.workExperience?.map((entry) => ({
        title: entry.title,
        images: entry.images.map((img) => img.url).filter(Boolean),
      })) ?? [],
  };
}
