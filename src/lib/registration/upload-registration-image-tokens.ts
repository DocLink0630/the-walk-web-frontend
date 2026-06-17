import type { RegistrationFormState } from "@/types/registration-form";
import { uploadFloatingImage } from "./upload-floating-image";

export interface RegistrationImageTokens {
  profilePhotoToken?: string;
  nicFrontToken?: string;
  nicBackToken?: string;
  portfolioPhotoTokens: string[];
}

type ImageUploadState = Pick<
  RegistrationFormState,
  "profilePhoto" | "nicFront" | "nicBack" | "portfolioPhotos"
>;

export async function uploadRegistrationImageTokens(
  state: ImageUploadState,
  onProgress?: () => void,
): Promise<
  | { ok: true; tokens: RegistrationImageTokens }
  | { ok: false; message: string }
> {
  if (!state.profilePhoto && state.portfolioPhotos.length === 0) {
    return { ok: false, message: "At least one photo (profile or portfolio) is required." };
  }

  const tokens: RegistrationImageTokens = { portfolioPhotoTokens: [] };

  if (state.profilePhoto) {
    const upload = await uploadFloatingImage(state.profilePhoto, onProgress);
    if (!upload.ok) {
      return { ok: false, message: `Failed to upload profile photo: ${upload.message}` };
    }
    tokens.profilePhotoToken = upload.token;
  }

  if (state.nicFront) {
    const upload = await uploadFloatingImage(state.nicFront, onProgress);
    if (!upload.ok) {
      return { ok: false, message: `Failed to upload NIC front: ${upload.message}` };
    }
    tokens.nicFrontToken = upload.token;
  }

  if (state.nicBack) {
    const upload = await uploadFloatingImage(state.nicBack, onProgress);
    if (!upload.ok) {
      return { ok: false, message: `Failed to upload NIC back: ${upload.message}` };
    }
    tokens.nicBackToken = upload.token;
  }

  for (let i = 0; i < state.portfolioPhotos.length; i++) {
    const upload = await uploadFloatingImage(state.portfolioPhotos[i], onProgress);
    if (!upload.ok) {
      return {
        ok: false,
        message: `Failed to upload portfolio photo ${i + 1}: ${upload.message}`,
      };
    }
    tokens.portfolioPhotoTokens.push(upload.token);
  }

  return { ok: true, tokens };
}

export function appendRegistrationImageTokens(
  formData: FormData,
  tokens: RegistrationImageTokens,
): void {
  if (tokens.profilePhotoToken) {
    formData.append("profile_photo_token", tokens.profilePhotoToken);
  }
  if (tokens.nicFrontToken) {
    formData.append("nicFront_token", tokens.nicFrontToken);
  }
  if (tokens.nicBackToken) {
    formData.append("nicBack_token", tokens.nicBackToken);
  }
  if (tokens.portfolioPhotoTokens.length > 0) {
    formData.append("portfolio_photos_tokens", JSON.stringify(tokens.portfolioPhotoTokens));
  }
}
