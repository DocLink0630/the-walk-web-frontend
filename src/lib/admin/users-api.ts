import { buildModelProfilePayload } from "@/lib/registration/build-model-profile";
import {
  buildWorkExperiencePayload,
  validateWorkExperienceDrafts,
} from "@/lib/registration/build-work-experience-payload";
import {
  appendRegistrationImageTokens,
  uploadRegistrationImageTokens,
} from "@/lib/registration/upload-registration-image-tokens";
import { adminAuthHeaders, getAdminToken } from "@/lib/admin/token";
import type {
  AdminModelRegistrationMedia,
  AdminUser,
  AdminUserDetail,
  MediaOrderUpdateItem,
  ModelApprovalPayload,
  PaginatedUsersResponse,
  UserRole,
  UserStatus,
} from "@/types/admin";
import type { RegistrationFormState } from "@/types/registration-form";

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus | "";
  roles?: UserRole[];
}

export async function fetchAdminUsers(
  params: FetchUsersParams = {},
): Promise<{ ok: true; data: PaginatedUsersResponse } | { ok: false; message: string; status: number }> {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page ?? 1));
  sp.set("limit", String(params.limit ?? 20));
  if (params.search) sp.set("search", params.search);
  if (params.status) sp.set("status", params.status);
  if (params.roles && params.roles.length > 0) {
    sp.set("roles", JSON.stringify(params.roles));
  }

  const res = await fetch(`/api/admin/users?${sp.toString()}`, {
    headers: adminAuthHeaders(),
  });

  if (!res.ok) {
    let message = "Failed to load users";
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* ignore */
    }
    return { ok: false, message, status: res.status };
  }

  const data = (await res.json()) as PaginatedUsersResponse;
  return { ok: true, data };
}

export async function fetchAdminUserDetail(
  userId: string,
): Promise<{ ok: true; data: AdminUserDetail } | { ok: false; message: string }> {
  const res = await fetch(`/api/admin/users/${userId}`, {
    headers: adminAuthHeaders(),
  });

  if (!res.ok) {
    let message = "Failed to load user details";
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  const data = (await res.json()) as AdminUserDetail;
  return { ok: true, data };
}

export async function updateModelMediaOrder(
  userId: string,
  items: MediaOrderUpdateItem[],
): Promise<
  | { ok: true; registrationMedia: AdminModelRegistrationMedia }
  | { ok: false; message: string }
> {
  const res = await fetch(`/api/admin/users/${userId}/media/order`, {
    method: "PATCH",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    let message = "Failed to update image order";
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  const body = (await res.json()) as { registrationMedia?: AdminModelRegistrationMedia };
  if (!body.registrationMedia) {
    return { ok: false, message: "Order saved but media was not returned." };
  }

  return { ok: true, registrationMedia: body.registrationMedia };
}

export async function updateUserStatus(
  userId: string,
  status: UserStatus,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await fetch(`/api/admin/users/${userId}`, {
    method: "PATCH",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    let message = "Failed to update status";
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  return { ok: true };
}

function parseApiError(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const record = body as Record<string, unknown>;
  if (typeof record.message === "string") return record.message;
  if (Array.isArray(record.message)) return record.message.join(", ");
  if (Array.isArray(record.errors)) {
    return record.errors
      .map((e) => {
        if (e && typeof e === "object" && "field" in e && "constraints" in e) {
          const constraints = (e as { constraints?: Record<string, string> }).constraints;
          const msg = constraints ? Object.values(constraints).join(", ") : "";
          return `${(e as { field?: string }).field}: ${msg}`;
        }
        return String(e);
      })
      .join("; ");
  }
  return fallback;
}

export async function saveAdminModel(
  state: RegistrationFormState,
  onUploadProgress?: (completed: number, total: number) => void,
): Promise<
  { ok: true; userId: string } | { ok: false; message: string; status?: number }
> {
  if (!getAdminToken()) {
    return { ok: false, message: "Session expired. Please log in to the admin dashboard again." };
  }

  if (!state.tier) {
    return { ok: false, message: "Please select the model's listing tier." };
  }

  const workError = validateWorkExperienceDrafts(state.workExperiences);
  if (workError) {
    return { ok: false, message: workError };
  }

  let profileJson: string;
  try {
    profileJson = JSON.stringify(buildModelProfilePayload(state));
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid profile data";
    return { ok: false, message: msg };
  }

  const workImageCount = state.workExperiences.reduce((sum, e) => sum + e.images.length, 0);
  const total = 3 + state.portfolioPhotos.length + workImageCount;
  let completed = 0;
  const tick = () => onUploadProgress?.(++completed, total);

  const imageTokensResult = await uploadRegistrationImageTokens(state, tick);
  if (!imageTokensResult.ok) {
    return { ok: false, message: imageTokensResult.message };
  }

  const workResult = await buildWorkExperiencePayload(state.workExperiences, tick);
  if (!workResult.ok) {
    return { ok: false, message: workResult.message };
  }

  const formData = new FormData();
  formData.append("email", state.email);
  formData.append("password", state.password);
  formData.append("role", "MODEL");
  formData.append("modelProfile", profileJson);
  appendRegistrationImageTokens(formData, imageTokensResult.tokens);

  if (workResult.payload.length > 0) {
    formData.append("work_experience", JSON.stringify(workResult.payload));
  }

  let res: Response;
  try {
    res = await fetch("/api/admin/users/save", {
      method: "POST",
      headers: adminAuthHeaders(),
      body: formData,
      signal: AbortSignal.timeout(300_000),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Request failed";
    if (msg.includes("aborted") || msg.includes("timeout")) {
      return {
        ok: false,
        message: "Upload timed out. Check your connection and try again with smaller images.",
      };
    }
    return { ok: false, message: `Could not reach the server (${msg}).` };
  }

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (res.status === 200 || res.status === 201) {
    const user = body as AdminUser;
    if (!user?.id) {
      return { ok: false, message: "Model saved but no user id was returned." };
    }
    return { ok: true, userId: user.id };
  }

  return {
    ok: false,
    message: parseApiError(body, "Failed to save model"),
    status: res.status,
  };
}

export async function toggleModelFeatured(
  userId: string,
  isFeatured: boolean,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await fetch(`/api/admin/users/${userId}/feature`, {
    method: "PATCH",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ is_featured: isFeatured }),
  });

  if (!res.ok) {
    let message = "Failed to update featured status";
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  return { ok: true };
}

export async function approveModelProfile(
  userId: string,
  payload: ModelApprovalPayload,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await fetch(`/api/admin/users/${userId}/approve`, {
    method: "POST",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Failed to approve model profile";
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  return { ok: true };
}

export async function deleteAdminUser(
  userId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await fetch(`/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: adminAuthHeaders(),
  });

  if (!res.ok) {
    let message = "Failed to delete user";
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  return { ok: true };
}

export type AdminAttachMediaType =
  | "PORTFOLIO"
  | "WORK_EXPERIENCE"
  | "PROFILE"
  | "NIC_FRONT"
  | "NIC_BACK";

export async function updateAdminModelProfile(
  userId: string,
  payload: Record<string, string | number | undefined>,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await fetch(`/api/admin/users/${userId}/model-profile`, {
    method: "PATCH",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Failed to update profile";
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  return { ok: true };
}

export async function deleteModelMedia(
  userId: string,
  storageFileId: string,
): Promise<
  | { ok: true; registrationMedia: AdminModelRegistrationMedia }
  | { ok: false; message: string }
> {
  const res = await fetch(`/api/admin/users/${userId}/media/${storageFileId}`, {
    method: "DELETE",
    headers: adminAuthHeaders(),
  });

  if (!res.ok) {
    let message = "Failed to delete photo";
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  const data = await res.json();
  return { ok: true, registrationMedia: data.registrationMedia };
}

export async function attachAdminModelMedia(
  userId: string,
  payload: { token: string; type: AdminAttachMediaType; workExperienceId?: string },
): Promise<
  | { ok: true; registrationMedia: AdminModelRegistrationMedia }
  | { ok: false; message: string }
> {
  const res = await fetch(`/api/admin/users/${userId}/media`, {
    method: "POST",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Failed to upload photo";
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  const data = await res.json();
  return { ok: true, registrationMedia: data.registrationMedia };
}

export async function createAdminWorkExperience(
  userId: string,
  payload: { title: string; imageTokens: string[] },
): Promise<
  | { ok: true; registrationMedia: AdminModelRegistrationMedia }
  | { ok: false; message: string }
> {
  const res = await fetch(`/api/admin/users/${userId}/work-experience`, {
    method: "POST",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Failed to add work experience";
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  const data = await res.json();
  return { ok: true, registrationMedia: data.registrationMedia };
}

export async function updateAdminWorkExperienceTitle(
  userId: string,
  workExperienceId: string,
  title: string,
): Promise<
  | { ok: true; registrationMedia: AdminModelRegistrationMedia }
  | { ok: false; message: string }
> {
  const res = await fetch(
    `/api/admin/users/${userId}/work-experience/${workExperienceId}`,
    {
      method: "PATCH",
      headers: adminAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ title }),
    },
  );

  if (!res.ok) {
    let message = "Failed to update work experience";
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  const data = await res.json();
  return { ok: true, registrationMedia: data.registrationMedia };
}

export async function deleteAdminWorkExperience(
  userId: string,
  workExperienceId: string,
): Promise<
  | { ok: true; registrationMedia: AdminModelRegistrationMedia }
  | { ok: false; message: string }
> {
  const res = await fetch(
    `/api/admin/users/${userId}/work-experience/${workExperienceId}`,
    { method: "DELETE", headers: adminAuthHeaders() },
  );

  if (!res.ok) {
    let message = "Failed to delete work experience";
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  const data = await res.json();
  return { ok: true, registrationMedia: data.registrationMedia };
}
