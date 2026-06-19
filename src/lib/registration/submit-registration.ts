import type { RegistrationFormState, RegistrationVariant } from "@/types/registration-form";
import { submitModelRegistration } from "./submit-model-registration";
import { submitStudentRegistration } from "./submit-student-registration";

export async function submitRegistration(
  state: RegistrationFormState,
  variant: RegistrationVariant,
  onUploadProgress?: (completed: number, total: number) => void,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (variant === "student") {
    return submitStudentRegistration(state, onUploadProgress);
  }

  return submitModelRegistration(state, onUploadProgress);
}
