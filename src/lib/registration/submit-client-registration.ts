import { buildClientProfilePayload } from "./build-client-profile";
import type { ClientRegistrationFormState } from "@/types/client-registration";

export async function submitClientRegistration(
  state: ClientRegistrationFormState,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!state.fullName.trim()) {
    return { ok: false, message: "Please enter your name or company name." };
  }

  const formData = new FormData();
  formData.append("email", state.email);
  formData.append("password", state.password);
  formData.append("role", "CORPORATE_CLIENT");
  formData.append(
    "clientProfile",
    JSON.stringify(buildClientProfilePayload(state)),
  );

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
        message: data.message ?? "An account with this email already exists.",
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
