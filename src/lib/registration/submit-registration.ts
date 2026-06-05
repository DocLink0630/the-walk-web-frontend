import type { RegistrationFormState, RegistrationVariant } from "@/types/registration-form";
import { buildModelProfilePayload } from "./build-model-profile";
import { buildStudentProfilePayload } from "./build-student-profile";

export async function submitRegistration(
  state: RegistrationFormState,
  variant: RegistrationVariant,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const formData = new FormData();
  formData.append("email", state.email);
  formData.append("password", state.password);

  if (variant === "model" && !state.tier) {
    return { ok: false, message: "Please select your modelling experience level." };
  }

  if (variant === "student") {
    formData.append("role", "STUDENT");
    formData.append(
      "studentProfile",
      JSON.stringify(buildStudentProfilePayload(state)),
    );
  } else {
    formData.append("role", "MODEL");
    formData.append("modelProfile", JSON.stringify(buildModelProfilePayload(state)));
  }

  if (state.profilePhoto) formData.append("profile_photo", state.profilePhoto);
  if (state.nicFront) formData.append("nicFront", state.nicFront);
  if (state.nicBack) formData.append("nicBack", state.nicBack);
  state.portfolioPhotos.forEach((file) => {
    formData.append("portfolio_photos", file);
  });

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
