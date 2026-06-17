import type { RegistrationFormState } from "@/types/registration-form";
import { buildStudentProfilePayload } from "./build-student-profile";
import { compressImage } from "./compress-image";

export async function submitStudentRegistration(
  state: RegistrationFormState,
  onUploadProgress?: (completed: number, total: number) => void,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!state.profilePhoto && state.portfolioPhotos.length === 0) {
    return { ok: false, message: "At least one photo is required." };
  }

  const optionalFiles: { file: File; key: string }[] = [];
  if (state.profilePhoto) optionalFiles.push({ file: state.profilePhoto, key: "profile_photo" });
  if (state.nicFront) optionalFiles.push({ file: state.nicFront, key: "nicFront" });
  if (state.nicBack) optionalFiles.push({ file: state.nicBack, key: "nicBack" });
  const portfolioFiles = state.portfolioPhotos;

  const allFiles = [...optionalFiles.map((f) => f.file), ...portfolioFiles];
  const total = allFiles.length;
  let completed = 0;

  const compressedAll: File[] = [];
  for (const file of allFiles) {
    compressedAll.push(await compressImage(file));
    onUploadProgress?.(++completed, total);
  }

  const compressedOptional = compressedAll.slice(0, optionalFiles.length);
  const portfolioPhotos = compressedAll.slice(optionalFiles.length);

  const formData = new FormData();
  formData.append("email", state.email);
  formData.append("password", state.password);
  formData.append("role", "STUDENT");
  formData.append("studentProfile", JSON.stringify(buildStudentProfilePayload(state)));
  for (let i = 0; i < optionalFiles.length; i++) {
    formData.append(optionalFiles[i].key, compressedOptional[i]);
  }
  for (const photo of portfolioPhotos) {
    formData.append("portfolio_photos", photo);
  }

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(300_000),
    });

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
