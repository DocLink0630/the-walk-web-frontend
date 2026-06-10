import type { RegistrationFormState, RegistrationVariant } from "@/types/registration-form";
import { buildPublicModelProfilePayload } from "./build-model-profile";
import { buildStudentProfilePayload } from "./build-student-profile";
import { buildWorkExperiencePayload, validateWorkExperienceDrafts } from "./build-work-experience-payload";
import {
  appendRegistrationImageTokens,
  uploadRegistrationImageTokens,
} from "./upload-registration-image-tokens";

export async function submitRegistration(
  state: RegistrationFormState,
  variant: RegistrationVariant,
  onUploadProgress?: (completed: number, total: number) => void,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (variant === "model") {
    const workError = validateWorkExperienceDrafts(state.workExperiences);
    if (workError) {
      return { ok: false, message: workError };
    }
  }

  const workImageCount =
    variant === "model"
      ? state.workExperiences.reduce((sum, e) => sum + e.images.length, 0)
      : 0;
  const total = 3 + state.portfolioPhotos.length + workImageCount;
  let completed = 0;
  const tick = () => onUploadProgress?.(++completed, total);

  const imageTokensResult = await uploadRegistrationImageTokens(state, tick);
  if (!imageTokensResult.ok) {
    return { ok: false, message: imageTokensResult.message };
  }

  let workPayload: Awaited<ReturnType<typeof buildWorkExperiencePayload>>;
  if (variant === "model") {
    workPayload = await buildWorkExperiencePayload(state.workExperiences, tick);
  } else {
    workPayload = { ok: true, payload: [] };
  }

  if (!workPayload.ok) {
    return { ok: false, message: workPayload.message };
  }

  const formData = new FormData();
  formData.append("email", state.email);
  formData.append("password", state.password);
  appendRegistrationImageTokens(formData, imageTokensResult.tokens);

  if (variant === "student") {
    formData.append("role", "STUDENT");
    formData.append(
      "studentProfile",
      JSON.stringify(buildStudentProfilePayload(state)),
    );
  } else {
    formData.append("role", "MODEL");
    formData.append(
      "modelProfile",
      JSON.stringify(buildPublicModelProfilePayload(state)),
    );

    if (workPayload.payload.length > 0) {
      formData.append("work_experience", JSON.stringify(workPayload.payload));
    }
  }

  try {
    const res = await fetch("/api/register", { method: "POST", body: formData });
    const data = (await res.json()) as { message?: string };

    if (res.status === 201) return { ok: true };

    if (res.status === 429) {
      return { ok: false, message: "Too many requests. Please wait a moment and try again." };
    }
    if (res.status === 409) {
      return {
        ok: false,
        message: data.message ?? "An account with this email or NIC already exists.",
      };
    }
    return {
      ok: false,
      message: data.message ?? "Registration failed. Please check your details and try again.",
    };
  } catch {
    return { ok: false, message: "Unable to connect to the server. Please try again." };
  }
}
