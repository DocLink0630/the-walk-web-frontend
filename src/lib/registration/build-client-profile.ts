import type { ClientRegistrationFormState } from "@/types/client-registration";

export function buildClientProfilePayload(state: ClientRegistrationFormState) {
  return {
    fullName: state.fullName.trim(),
    isLoginEnabled: true,
  };
}
