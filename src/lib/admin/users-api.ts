import type { PaginatedUsersResponse, UserRole, UserStatus } from "@/types/admin";

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
    credentials: "include",
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

export async function updateUserStatus(
  userId: string,
  status: UserStatus,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await fetch(`/api/admin/users/${userId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
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
