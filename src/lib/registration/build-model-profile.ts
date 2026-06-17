import type { ModelProfilePayload, ModelSource } from "@/types/api/model-profile";
import type { RegistrationFormState } from "@/types/registration-form";

function baseModelProfileFields(state: RegistrationFormState) {
  const base: ModelProfilePayload = {
    modelCode: state.modelCode,
    fullName: state.fullName.trim(),
    contactNumberEnc: state.contactNumber.trim(),
    isLoginEnabled: false,
  };
  if (state.gender) base.gender = state.gender;
  if (state.age && Number(state.age)) base.age = Number(state.age);
  if (state.nic.trim()) base.nicEnc = state.nic.trim();
  if (state.dob) base.dobEnc = state.dob;
  if (state.address.trim()) base.addressEnc = state.address.trim();
  if (state.whatsappNumber.trim()) base.whatsappNumberEnc = state.whatsappNumber.trim();
  return base;
}

function applyOptionalModelProfileFields(
  payload: ModelProfilePayload,
  state: RegistrationFormState,
) {
  if (state.height.trim()) payload.heightEnc = state.height.trim();
  if (state.weight.trim()) payload.weightEnc = state.weight.trim();
  if (state.chest.trim()) payload.chestEnc = state.chest.trim();
  if (state.shoulder.trim()) payload.shoulderEnc = state.shoulder.trim();
  if (state.waist.trim()) payload.waistEnc = state.waist.trim();
  if (state.shoeSize.trim()) payload.shoeSizeEnc = state.shoeSize.trim();
  if (state.eyeColor.trim()) payload.eyeColorEnc = state.eyeColor.trim();
  if (state.hairColor.trim()) payload.hairColorEnc = state.hairColor.trim();
  if (state.talents.trim()) payload.talentsEnc = state.talents.trim();
  if (state.shortBio.trim()) payload.shortBio = state.shortBio.trim();
  if (state.skinColorOptionId) payload.skinColorOptionId = state.skinColorOptionId;
  if (state.source) payload.source = state.source as ModelSource;
}

/** Self-service model registration — tier/rate assigned by admin on approval */
export function buildPublicModelProfilePayload(
  state: RegistrationFormState,
): ModelProfilePayload {
  const payload: ModelProfilePayload = {
    ...baseModelProfileFields(state),
    tier: "PENDING",
  };
  applyOptionalModelProfileFields(payload, state);
  return payload;
}

/** Admin-created model — tier/rate stored as registration expectations for review */
export function buildModelProfilePayload(
  state: RegistrationFormState,
): ModelProfilePayload {
  if (!state.tier) {
    throw new Error("Model tier is required");
  }

  const payload: ModelProfilePayload = {
    ...baseModelProfileFields(state),
    tier: state.tier,
  };

  if (state.rate.trim()) payload.rate = state.rate.trim();
  applyOptionalModelProfileFields(payload, state);
  return payload;
}
