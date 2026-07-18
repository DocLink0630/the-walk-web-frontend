import type { AssignableModelTier } from "@/types/api/model-profile";
import type { StudentProfilePayload, StudentSource } from "@/types/api/student-profile";
import type { RegistrationFormState } from "@/types/registration-form";

function resolveStudentTier(tier: RegistrationFormState["tier"]): AssignableModelTier {
  return tier || "FRESHER";
}

export function buildStudentProfilePayload(
  state: RegistrationFormState,
): StudentProfilePayload {
  const fullName =
    state.fullName.trim() ||
    [state.firstName.trim(), state.lastName.trim()].filter(Boolean).join(" ");

  const payload: StudentProfilePayload = {
    modelCode: state.modelCode,
    fullName,
    contactNumberEnc: state.contactNumber.trim(),
    tier: resolveStudentTier(state.tier),
    isLoginEnabled: false,
  };

  if (state.gender) payload.gender = state.gender;
  if (state.age && Number(state.age)) payload.age = Number(state.age);
  if (state.nic.trim()) payload.nicEnc = state.nic.trim();
  if (state.dob) payload.dobEnc = state.dob;
  if (state.address.trim()) payload.addressEnc = state.address.trim();
  if (state.whatsappNumber.trim()) payload.whatsappNumberEnc = state.whatsappNumber.trim();

  if (state.height.trim()) payload.heightEnc = state.height.trim();
  if (state.weight.trim()) payload.weightEnc = state.weight.trim();
  if (state.chest.trim()) payload.chestEnc = state.chest.trim();
  if (state.shoulder.trim()) payload.shoulderEnc = state.shoulder.trim();
  if (state.waist.trim()) payload.waistEnc = state.waist.trim();
  if (state.eyeColor.trim()) payload.eyeColorEnc = state.eyeColor.trim();
  if (state.hairColor.trim()) payload.hairColorEnc = state.hairColor.trim();
  if (state.source) payload.source = state.source as StudentSource;
  if (state.preferredBranch.trim()) {
    payload.preferredBranchRaw = state.preferredBranch.trim();
  }
  if (state.preferredDate.trim()) {
    payload.preferredDate = state.preferredDate.trim();
  }

  return payload;
}
