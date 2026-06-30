import type {
  ServiceRegistrationFormState,
  ServiceRegistrationVariant,
} from "@/types/service-registration";

export interface ServiceProfilePayload {
  fullName: string;
  contactNumberEnc: string;
  specialties: string[];
  yearsOfExperience?: number;
  location?: string;
  rateCard?: string;
  shortBio?: string;
  equipmentOverview?: string;
  isLoginEnabled: boolean;
}

export function parseSpecialties(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function buildServiceProfilePayload(
  state: ServiceRegistrationFormState,
  variant: ServiceRegistrationVariant,
): ServiceProfilePayload {
  const payload: ServiceProfilePayload = {
    fullName: state.fullName.trim(),
    contactNumberEnc: state.contactNumber.trim(),
    specialties: parseSpecialties(state.specialties),
    isLoginEnabled: false,
  };

  const years = Number(state.yearsOfExperience);
  if (state.yearsOfExperience.trim() && Number.isFinite(years)) {
    payload.yearsOfExperience = years;
  }
  if (state.rateCard.trim()) payload.rateCard = state.rateCard.trim();
  if (state.location.trim()) payload.location = state.location.trim();
  if (state.shortBio.trim()) payload.shortBio = state.shortBio.trim();

  if (variant === "photographer" && state.equipmentOverview.trim()) {
    payload.equipmentOverview = state.equipmentOverview.trim();
  }

  return payload;
}
