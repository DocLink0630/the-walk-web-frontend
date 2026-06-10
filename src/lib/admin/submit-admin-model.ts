import {
  approveModelProfile,
  saveAdminModel,
  updateUserStatus,
} from "@/lib/admin/users-api";
import type { AssignableModelTier } from "@/types/admin";
import type { RegistrationFormState } from "@/types/registration-form";

export type AdminModelSubmitPhase = "uploading" | "approving" | "activating";

export type AdminModelSubmitResult =
  | { ok: true }
  | { ok: false; message: string; userId?: string; partial?: boolean };

export async function submitAdminModelWithApproval(
  state: RegistrationFormState,
  onPhase?: (phase: AdminModelSubmitPhase) => void,
  onUploadProgress?: (completed: number, total: number) => void,
): Promise<AdminModelSubmitResult> {
  try {
    if (!state.tier) {
      return {
        ok: false,
        message: "Please select an assignable tier (Fresher, Experienced, or Super model).",
      };
    }

    if (!state.rate.trim()) {
      return { ok: false, message: "Rate is required to approve the model after save." };
    }

    const talents = state.talents.trim() || state.shortBio.trim();
    if (!talents) {
      return {
        ok: false,
        message: "Talents or short bio is required to approve the model after save.",
      };
    }

    onPhase?.("uploading");
    const saveResult = await saveAdminModel(state, onUploadProgress);
    if (!saveResult.ok) {
      if (saveResult.status === 502) {
        return {
          ok: false,
          message:
            "Save timed out on the server (often due to slow file uploads). The model may still have been created — check the Models queue before submitting again.",
        };
      }
      return { ok: false, message: saveResult.message };
    }

    const userId = saveResult.userId;
    const tier = state.tier as AssignableModelTier;

    onPhase?.("approving");
    const approveResult = await approveModelProfile(userId, {
      rate: state.rate.trim(),
      tier,
      talents,
    });

    if (!approveResult.ok) {
      return {
        ok: false,
        message: `Model saved but approval failed: ${approveResult.message}`,
        userId,
        partial: true,
      };
    }

    onPhase?.("activating");
    const statusResult = await updateUserStatus(userId, "ACTIVE");
    if (!statusResult.ok) {
      return {
        ok: false,
        message: `Model saved and approved but activation failed: ${statusResult.message}`,
        userId,
        partial: true,
      };
    }

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    return { ok: false, message: `Submission failed: ${msg}` };
  }
}
