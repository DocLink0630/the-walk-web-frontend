import type { RegistrationStore } from "@/types/registration-form";
import { buildStudentProfilePayload } from "./build-student-profile";
import { generateRegistrationCode } from "./generate-registration-code";
import { postRegistrationForm } from "./post-registration-form";
import {
  appendRegistrationImageTokens,
  uploadRegistrationImageTokens,
} from "./upload-registration-image-tokens";

export async function submitStudentRegistration(
  store: RegistrationStore,
  onUploadProgress?: (completed: number, total: number) => void,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const modelCode = generateRegistrationCode("STU");
  store.set({ modelCode });
  const state = { ...store, modelCode };

  if (!state.profilePhoto || !state.portfolioPhotos[0]) {
    return { ok: false, message: "Both photos are required." };
  }

  const total = 2;
  let completed = 0;
  const tick = () => onUploadProgress?.(++completed, total);

  const imageTokensResult = await uploadRegistrationImageTokens(
    {
      profilePhoto: state.profilePhoto,
      nicFront: null,
      nicBack: null,
      portfolioPhotos: [state.portfolioPhotos[0]],
    },
    tick,
  );
  if (!imageTokensResult.ok) {
    return { ok: false, message: imageTokensResult.message };
  }

  const formData = new FormData();
  formData.append("email", state.email);
  formData.append("password", state.password);
  formData.append("role", "STUDENT");
  formData.append("studentProfile", JSON.stringify(buildStudentProfilePayload(state)));
  appendRegistrationImageTokens(formData, imageTokensResult.tokens);

  return postRegistrationForm(formData);
}
