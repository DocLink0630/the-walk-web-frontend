import type { RegistrationFormState } from "@/types/registration-form";
import { uploadFloatingImage } from "./upload-floating-image";

export interface RegistrationImageTokens {
  profilePhotoToken: string;
  nicFrontToken: string;
  nicBackToken: string;
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
  if (!state.profilePhoto) {
    return { ok: false, message: "Profile photo is required." };
  }
  if (!state.nicFront) {
    return { ok: false, message: "NIC front image is required." };
  }
  if (!state.nicBack) {
    return { ok: false, message: "NIC back image is required." };
  }
  if (state.portfolioPhotos.length === 0) {
    return { ok: false, message: "At least one portfolio photo is required." };
  }

  const profileUpload = await uploadFloatingImage(state.profilePhoto, onProgress);
  if (!profileUpload.ok) {
    return { ok: false, message: `Failed to upload profile photo: ${profileUpload.message}` };
  }

  const nicFrontUpload = await uploadFloatingImage(state.nicFront, onProgress);
  if (!nicFrontUpload.ok) {
    return { ok: false, message: `Failed to upload NIC front: ${nicFrontUpload.message}` };
  }

  const nicBackUpload = await uploadFloatingImage(state.nicBack, onProgress);
  if (!nicBackUpload.ok) {
    return { ok: false, message: `Failed to upload NIC back: ${nicBackUpload.message}` };
  }

  const portfolioPhotoTokens: string[] = [];
  for (let i = 0; i < state.portfolioPhotos.length; i++) {
    const upload = await uploadFloatingImage(state.portfolioPhotos[i], onProgress);
    if (!upload.ok) {
      return {
        ok: false,
        message: `Failed to upload portfolio photo ${i + 1}: ${upload.message}`,
      };
    }
    portfolioPhotoTokens.push(upload.token);
  }

  return {
    ok: true,
    tokens: {
      profilePhotoToken: profileUpload.token,
      nicFrontToken: nicFrontUpload.token,
      nicBackToken: nicBackUpload.token,
      portfolioPhotoTokens,
    },
  };
}

export function appendRegistrationImageTokens(
  formData: FormData,
  tokens: RegistrationImageTokens,
): void {
  formData.append("profile_photo_token", tokens.profilePhotoToken);
  formData.append("nicFront_token", tokens.nicFrontToken);
  formData.append("nicBack_token", tokens.nicBackToken);
  formData.append("portfolio_photos_tokens", JSON.stringify(tokens.portfolioPhotoTokens));
}
