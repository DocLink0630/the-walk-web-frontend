import type { ModelProfilePayload, ModelSource } from "@/types/api/model-profile";
import type { RegistrationFormState } from "@/types/registration-form";

export function buildModelProfilePayload(
  state: RegistrationFormState,
): ModelProfilePayload {
  if (!state.tier) {
    throw new Error("Model tier is required");
  }

  const payload: ModelProfilePayload = {
    modelCode: state.modelCode,
    fullName: state.fullName.trim(),
    gender: state.gender,
    age: Number(state.age),
    nicEnc: state.nic.trim(),
    dobEnc: state.dob,
    addressEnc: state.address.trim(),
    contactNumberEnc: state.contactNumber.trim(),
    whatsappNumberEnc: state.whatsappNumber.trim(),
    tier: state.tier,
    isLoginEnabled: false,
  };

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

  return payload;
}
