import { SKIN_COLOR_OPTIONS } from "@/components/registration/personal/constants";
import type { RegistrationFormState } from "@/types/registration-form";

function parseOptionalNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}

function skinColorLabel(optionId: string): string | undefined {
  if (!optionId) return undefined;
  return SKIN_COLOR_OPTIONS.find((o) => o.id === optionId)?.label;
}

/** Payload for Supabase `student-register` edge function (plain fields, not encrypted). */
export function buildStudentEdgePayload(state: RegistrationFormState) {
  const payload: Record<string, unknown> = {
    fullName: state.fullName.trim(),
    email: state.email.trim().toLowerCase(),
    nic: state.nic.trim().toUpperCase(),
    dob: state.dob,
    age: Number(state.age),
    gender: state.gender,
    contactNumber: state.contactNumber.trim(),
    whatsappNumber: state.whatsappNumber.trim(),
    address: state.address.trim(),
  };

  const height = parseOptionalNumber(state.height);
  const weight = parseOptionalNumber(state.weight);
  const chest = parseOptionalNumber(state.chest);
  const shoulder = parseOptionalNumber(state.shoulder);
  const waist = parseOptionalNumber(state.waist);

  if (height !== undefined) payload.height = height;
  if (weight !== undefined) payload.weight = weight;
  if (chest !== undefined) payload.chest = chest;
  if (shoulder !== undefined) payload.shoulder = shoulder;
  if (waist !== undefined) payload.waist = waist;
  if (state.shoeSize.trim()) payload.shoeSize = state.shoeSize.trim();
  if (state.eyeColor.trim()) payload.eyeColor = state.eyeColor.trim();
  if (state.hairColor.trim()) payload.hairColor = state.hairColor.trim();

  const skinColor = skinColorLabel(state.skinColorOptionId);
  if (skinColor) payload.skinColor = skinColor;

  const talents = state.talents.trim() || state.shortBio.trim();
  if (talents) payload.talents = talents;

  if (state.preferredBranch.trim()) {
    payload.preferredBranch = state.preferredBranch.trim();
  }
  if (state.preferredDate) payload.preferredDate = state.preferredDate;

  return payload;
}
