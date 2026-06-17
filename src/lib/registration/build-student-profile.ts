import type { StudentProfilePayload, StudentSource } from "@/types/api/student-profile";
import type { RegistrationFormState } from "@/types/registration-form";

export function buildStudentProfilePayload(
  state: RegistrationFormState,
): StudentProfilePayload {
  const payload: StudentProfilePayload = {
    modelCode: state.modelCode,
    fullName: state.fullName.trim(),
    contactNumberEnc: state.contactNumber.trim(),
    tier: state.tier || "FRESHER",
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
  if (state.shoeSize.trim()) payload.shoeSizeEnc = state.shoeSize.trim();
  if (state.eyeColor.trim()) payload.eyeColorEnc = state.eyeColor.trim();
  if (state.hairColor.trim()) payload.hairColorEnc = state.hairColor.trim();
  if (state.talents.trim()) payload.talentsEnc = state.talents.trim();
  if (state.shortBio.trim()) payload.shortBio = state.shortBio.trim();
  if (state.skinColorOptionId) payload.skinColorOptionId = state.skinColorOptionId;
  if (state.source) payload.source = state.source as StudentSource;
  if (state.preferredBranch.trim()) {
    payload.preferredBranchRaw = state.preferredBranch.trim();
  }
  if (state.preferredDate) payload.preferredDate = state.preferredDate;

  return payload;
}
