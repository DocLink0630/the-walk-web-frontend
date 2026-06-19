import type { RegistrationFormState } from "@/types/registration-form";
import { buildPublicModelProfilePayload } from "./build-model-profile";
import {
  buildWorkExperiencePayload,
  validateWorkExperienceDrafts,
} from "./build-work-experience-payload";
import { compressImage } from "./compress-image";

export async function submitModelRegistration(
  state: RegistrationFormState,
  onUploadProgress?: (completed: number, total: number) => void,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const workError = validateWorkExperienceDrafts(state.workExperiences);
  if (workError) {
    return { ok: false, message: workError };
  }

  if (!state.profilePhoto && state.portfolioPhotos.length === 0) {
    return { ok: false, message: "At least one photo (profile or portfolio) is required." };
  }

  const optionalFiles: { file: File; key: string }[] = [];
  if (state.profilePhoto) optionalFiles.push({ file: state.profilePhoto, key: "profile_photo" });
  if (state.nicFront) optionalFiles.push({ file: state.nicFront, key: "nicFront" });
  if (state.nicBack) optionalFiles.push({ file: state.nicBack, key: "nicBack" });

  const portfolioFiles = state.portfolioPhotos;
  const workImageCount = state.workExperiences.reduce((sum, e) => sum + e.images.length, 0);
  const fileUploadCount = optionalFiles.length + portfolioFiles.length;
  const total = fileUploadCount + workImageCount;
  let completed = 0;
  const tick = () => onUploadProgress?.(++completed, total);

  const compressedAll: File[] = [];
  for (const file of [...optionalFiles.map((f) => f.file), ...portfolioFiles]) {
    compressedAll.push(await compressImage(file));
    tick();
  }

  const compressedOptional = compressedAll.slice(0, optionalFiles.length);
  const compressedPortfolio = compressedAll.slice(optionalFiles.length);

  const workPayload = await buildWorkExperiencePayload(state.workExperiences, tick);
  if (!workPayload.ok) {
    return { ok: false, message: workPayload.message };
  }

  const formData = new FormData();
  formData.append("email", state.email);
  formData.append("password", state.password);
  formData.append("role", "MODEL");
  formData.append(
    "modelProfile",
    JSON.stringify(buildPublicModelProfilePayload(state)),
  );

  for (let i = 0; i < optionalFiles.length; i++) {
    formData.append(optionalFiles[i].key, compressedOptional[i]);
  }
  for (const photo of compressedPortfolio) {
    formData.append("portfolio_photos", photo);
  }
  if (workPayload.payload.length > 0) {
    formData.append("work_experience", JSON.stringify(workPayload.payload));
  }

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(300_000),
    });

    const data = (await res.json()) as {
      message?: string | string[];
      error?: string;
      fields?: string[];
      errors?: { field: string; constraints: Record<string, string> }[];
    };

    if (res.status === 201) return { ok: true };

    if (res.status === 429) {
      return { ok: false, message: "Too many requests. Please wait a moment and try again." };
    }
    if (res.status === 409) {
      const msg = Array.isArray(data.message) ? data.message.join(" ") : data.message;
      return {
        ok: false,
        message: msg ?? data.error ?? "An account with this email or NIC already exists.",
      };
    }

    if (data.errors && data.errors.length > 0) {
      const details = data.errors
        .map(({ field, constraints }) => `${field}: ${Object.values(constraints).join("; ")}`)
        .join("\n");
      return { ok: false, message: `Validation failed:\n${details}` };
    }

    if (data.fields?.length) {
      return {
        ok: false,
        message: `Missing required fields: ${data.fields.join(", ")}`,
      };
    }

    const msg = Array.isArray(data.message)
      ? data.message.join(" ")
      : data.message ?? data.error;
    return {
      ok: false,
      message: msg ?? "Registration failed. Please check your details and try again.",
    };
  } catch {
    return { ok: false, message: "Unable to connect to the server. Please try again." };
  }
}
