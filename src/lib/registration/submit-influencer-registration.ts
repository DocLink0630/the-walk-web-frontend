import type { InfluencerRegistrationFormState } from "@/types/influencer-registration";
import { buildInfluencerProfilePayload } from "./build-influencer-profile";
import { postRegistrationForm } from "./post-registration-form";
import { uploadFloatingImage } from "./upload-floating-image";

export async function submitInfluencerRegistration(
  state: InfluencerRegistrationFormState,
  onUploadProgress?: (completed: number, total: number) => void,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const formData = new FormData();
  formData.append("email", state.email);
  formData.append("password", state.password);
  formData.append("role", "INFLUENCER");
  formData.append(
    "influencerProfile",
    JSON.stringify(buildInfluencerProfilePayload(state)),
  );

  const files: File[] = [];
  if (state.profilePhoto) files.push(state.profilePhoto);
  const portfolioStart = files.length;
  files.push(...state.portfolioPhotos);

  const total = files.length;
  let completed = 0;

  if (total > 0) {
    const portfolioTokens: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const upload = await uploadFloatingImage(files[i], () =>
        onUploadProgress?.(++completed, total),
      );
      if (!upload.ok) {
        return {
          ok: false,
          message: `Failed to upload image ${i + 1}: ${upload.message}`,
        };
      }

      if (state.profilePhoto && i < portfolioStart) {
        formData.append("profile_photo_token", upload.token);
      } else {
        portfolioTokens.push(upload.token);
      }
    }

    if (portfolioTokens.length > 0) {
      formData.append("portfolio_photos_tokens", JSON.stringify(portfolioTokens));
    }
  }

  return postRegistrationForm(formData);
}
