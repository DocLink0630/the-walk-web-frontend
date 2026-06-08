import { buildModelProfilePayload } from "@/lib/registration/build-model-profile";
import {
  buildWorkExperiencePayload,
  validateWorkExperienceDrafts,
} from "@/lib/registration/build-work-experience-payload";
import { adminAuthHeaders, getAdminToken } from "@/lib/admin/token";
import type {
  AdminUser,
  AdminUserDetail,
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

  const formData = new FormData();
  formData.append("email", state.email);
  formData.append("password", state.password);
  formData.append("role", "MODEL");
  formData.append("modelProfile", profileJson);

  const workResult = await buildWorkExperiencePayload(state.workExperiences);
  if (!workResult.ok) {
    return { ok: false, message: workResult.message };
  }
  if (workResult.payload.length > 0) {
    formData.append("work_experience", JSON.stringify(workResult.payload));
  }

  if (state.profilePhoto) formData.append("profile_photo", state.profilePhoto);
  if (state.nicFront) formData.append("nicFront", state.nicFront);
  if (state.nicBack) formData.append("nicBack", state.nicBack);
  state.portfolioPhotos.forEach((file) => {
    formData.append("portfolio_photos", file);
  });

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
