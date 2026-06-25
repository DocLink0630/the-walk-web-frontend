import type { RegistrationFormState, RegistrationVariant, RegistrationStore } from "@/types/registration-form";
import { buildPublicModelProfilePayload } from "./build-model-profile";
import { buildWorkExperiencePayload, validateWorkExperienceDrafts } from "./build-work-experience-payload";
import { generateRegistrationCode } from "./generate-registration-code";
import { postRegistrationForm } from "./post-registration-form";
import { submitStudentRegistration } from "./submit-student-registration";
import {
  appendRegistrationImageTokens,
  uploadRegistrationImageTokens,
} from "./upload-registration-image-tokens";

function withFreshModelCode(
  store: RegistrationStore,
  prefix: "STU" | "MOD",
): RegistrationFormState {
  const modelCode = generateRegistrationCode(prefix);
  store.set({ modelCode });
  return { ...store, modelCode };
}

export async function submitRegistration(
  store: RegistrationStore,
  variant: RegistrationVariant,
  onUploadProgress?: (completed: number, total: number) => void,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (variant === "student") {
    return submitStudentRegistration(store, onUploadProgress);
  }

  const state = withFreshModelCode(store, "MOD");

  const workError = validateWorkExperienceDrafts(state.workExperiences);
  if (workError) {
    return { ok: false, message: workError };
  }

  const workImageCount = state.workExperiences.reduce((sum, e) => sum + e.images.length, 0);
  const total = 3 + state.portfolioPhotos.length + workImageCount;
  let completed = 0;
  const tick = () => onUploadProgress?.(++completed, total);

  const imageTokensResult = await uploadRegistrationImageTokens(state, tick);
  if (!imageTokensResult.ok) {
    return { ok: false, message: imageTokensResult.message };
  }

  const workPayload = await buildWorkExperiencePayload(state.workExperiences, tick);
  if (!workPayload.ok) {
    return { ok: false, message: workPayload.message };
  }

  const formData = new FormData();
  formData.append("email", state.email);
  formData.append("password", state.password);
  appendRegistrationImageTokens(formData, imageTokensResult.tokens);
  formData.append("role", "MODEL");
  formData.append(
    "modelProfile",
    JSON.stringify(buildPublicModelProfilePayload(state)),
  );

  if (workPayload.payload.length > 0) {
    formData.append("work_experience", JSON.stringify(workPayload.payload));
  }

  return postRegistrationForm(formData);
}
