import { getClientToken } from "@/lib/client/token";
import type { AdminModelRegistrationMedia } from "@/types/admin";

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getClientToken();
  if (!token) throw new Error("Not authenticated");
  return {
    Authorization: `Bearer ${token}`,
    ...extra,
  };
}

export type AttachMediaType =
  | "PORTFOLIO"
  | "WORK_EXPERIENCE"
  | "PROFILE"
  | "NIC_FRONT"
  | "NIC_BACK";

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    if (body?.message) return String(body.message);
  } catch {
    /* ignore */
  }
  return fallback;
}

export async function deleteModelMedia(
  storageFileId: string,
): Promise<{ ok: true; registrationMedia: AdminModelRegistrationMedia } | { ok: false; message: string }> {
  try {
    const res = await fetch(`/api/model/profile/media/${storageFileId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) return { ok: false, message: await parseError(res, "Failed to delete photo") };
    const data = await res.json();
    return { ok: true, registrationMedia: data.registrationMedia };
  } catch {
    return { ok: false, message: "Network error" };
  }
}

export async function attachModelMedia(
  payload: { token: string; type: AttachMediaType; workExperienceId?: string },
): Promise<{ ok: true; registrationMedia: AdminModelRegistrationMedia } | { ok: false; message: string }> {
  try {
    const res = await fetch("/api/model/profile/media", {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, message: await parseError(res, "Failed to upload photo") };
    const data = await res.json();
    return { ok: true, registrationMedia: data.registrationMedia };
  } catch {
    return { ok: false, message: "Network error" };
  }
}

export async function createModelWorkExperience(
  title: string,
  imageTokens: string[],
): Promise<{ ok: true; registrationMedia: AdminModelRegistrationMedia } | { ok: false; message: string }> {
  try {
    const res = await fetch("/api/model/profile/work-experience", {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ title, imageTokens }),
    });
    if (!res.ok) return { ok: false, message: await parseError(res, "Failed to add work experience") };
    const data = await res.json();
    return { ok: true, registrationMedia: data.registrationMedia };
  } catch {
    return { ok: false, message: "Network error" };
  }
}

export async function updateModelWorkExperienceTitle(
  workExperienceId: string,
  title: string,
): Promise<{ ok: true; registrationMedia: AdminModelRegistrationMedia } | { ok: false; message: string }> {
  try {
    const res = await fetch(`/api/model/profile/work-experience/${workExperienceId}`, {
      method: "PATCH",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ title }),
    });
    if (!res.ok) return { ok: false, message: await parseError(res, "Failed to update work experience") };
    const data = await res.json();
    return { ok: true, registrationMedia: data.registrationMedia };
  } catch {
    return { ok: false, message: "Network error" };
  }
}

export async function deleteModelWorkExperience(
  workExperienceId: string,
): Promise<{ ok: true; registrationMedia: AdminModelRegistrationMedia } | { ok: false; message: string }> {
  try {
    const res = await fetch(`/api/model/profile/work-experience/${workExperienceId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) return { ok: false, message: await parseError(res, "Failed to delete work experience") };
    const data = await res.json();
    return { ok: true, registrationMedia: data.registrationMedia };
  } catch {
    return { ok: false, message: "Network error" };
  }
}

export async function patchOwnModelProfile(
  data: Record<string, string>,
): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch("/api/model/profile", {
      method: "PATCH",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, message: body?.message ?? "Update failed" };
    return { ok: true };
  } catch {
    return { ok: false, message: "Network error" };
  }
}
