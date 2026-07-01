import type { InfluencerRegistrationFormState } from "@/types/influencer-registration";
import { parseSpecialties } from "./build-service-profile";

export interface InfluencerProfilePayload {
  fullName: string;
  contactNumberEnc: string;
  contentCategories: string[];
  instagramUrl?: string;
  instagramFollowers?: string;
  tiktokUrl?: string;
  tiktokFollowers?: string;
  youtubeUrl?: string;
  youtubeSubscribers?: string;
  facebookUrl?: string;
  facebookFollowers?: string;
  pastBrandWork?: string;
  rateCard?: string;
  shortBio?: string;
  isLoginEnabled: boolean;
}

function optional(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function buildInfluencerProfilePayload(
  state: InfluencerRegistrationFormState,
): InfluencerProfilePayload {
  const payload: InfluencerProfilePayload = {
    fullName: state.fullName.trim(),
    contactNumberEnc: state.contactNumber.trim(),
    contentCategories: parseSpecialties(state.contentCategories),
    isLoginEnabled: false,
  };

  const optionalFields: Array<[keyof InfluencerProfilePayload, string]> = [
    ["instagramUrl", state.instagramUrl],
    ["instagramFollowers", state.instagramFollowers],
    ["tiktokUrl", state.tiktokUrl],
    ["tiktokFollowers", state.tiktokFollowers],
    ["youtubeUrl", state.youtubeUrl],
    ["youtubeSubscribers", state.youtubeSubscribers],
    ["facebookUrl", state.facebookUrl],
    ["facebookFollowers", state.facebookFollowers],
    ["pastBrandWork", state.pastBrandWork],
    ["rateCard", state.rateCard],
    ["shortBio", state.shortBio],
  ];

  for (const [key, value] of optionalFields) {
    const trimmed = optional(value);
    if (trimmed) payload[key] = trimmed as never;
  }

  return payload;
}
