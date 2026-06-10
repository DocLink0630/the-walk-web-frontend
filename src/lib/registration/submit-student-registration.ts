import type { RegistrationFormState } from "@/types/registration-form";
import { buildStudentEdgePayload } from "./build-student-edge-payload";
import { compressImage } from "./compress-image";

export async function submitStudentRegistration(
  state: RegistrationFormState,
  onUploadProgress?: (completed: number, total: number) => void,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!state.profilePhoto || !state.nicFront || !state.nicBack) {
    return { ok: false, message: "Profile photo and NIC images are required." };
  }
  if (state.portfolioPhotos.length === 0) {
    return { ok: false, message: "At least one portfolio photo is required." };
  }

  const filesToCompress = [
    state.profilePhoto,
    state.nicFront,
    state.nicBack,
    ...state.portfolioPhotos,
  ];
  const total = filesToCompress.length;
  let completed = 0;

  const compressed: File[] = [];
  for (const file of filesToCompress) {
    compressed.push(await compressImage(file));
    onUploadProgress?.(++completed, total);
  }

  const [profilePhoto, nicFront, nicBack, ...portfolioPhotos] = compressed;

  const formData = new FormData();
  formData.append("payload", JSON.stringify(buildStudentEdgePayload(state)));
  formData.append("profilePhoto", profilePhoto);
  formData.append("nicFront", nicFront);
  formData.append("nicBack", nicBack);
  for (const photo of portfolioPhotos) {
    formData.append("portfolioPhotos", photo);
  }

  try {
    const res = await fetch("/api/student-register", {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(300_000),
    });

    const data = (await res.json()) as { message?: string; error?: string };

    if (res.status === 201) return { ok: true };

    if (res.status === 409) {
      return {
        ok: false,
        message:
          data.message ??
          data.error ??
          "An application with this email or NIC already exists.",
      };
    }

    return {
      ok: false,
      message:
        data.message ??
        data.error ??
        "Registration failed. Please check your details and try again.",
    };
  } catch {
    return { ok: false, message: "Unable to connect to the server. Please try again." };
  }
}
