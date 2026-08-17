import { adminAuthHeaders } from "@/lib/admin/token";
import { sortByCreatedAtDesc } from "@/lib/admin/sort-by-created-at";
import type {
  Inquiry,
  InquiryStatus,
  PaginatedInquiriesResponse,
} from "@/types/inquiry";

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    if (body?.message) {
      const msg = body.message;
      return Array.isArray(msg) ? msg.join(", ") : String(msg);
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

export interface FetchAdminInquiriesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: InquiryStatus | "";
}

export async function fetchAdminInquiries(
  params: FetchAdminInquiriesParams = {},
): Promise<
  { ok: true; data: PaginatedInquiriesResponse } | { ok: false; message: string }
> {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page ?? 1));
  sp.set("limit", String(params.limit ?? 20));
  if (params.search) sp.set("search", params.search);
  if (params.status) sp.set("status", params.status);

  const res = await fetch(`/api/admin/inquiries?${sp.toString()}`, {
    headers: adminAuthHeaders(),
  });

  if (!res.ok) {
    return { ok: false, message: await parseError(res, "Failed to load inquiries") };
  }

  const payload = (await res.json()) as PaginatedInquiriesResponse;
  return {
    ok: true,
    data: {
      ...payload,
      data: sortByCreatedAtDesc(payload.data ?? []),
    },
  };
}

export async function fetchAdminInquiry(
  id: string,
): Promise<{ ok: true; data: Inquiry } | { ok: false; message: string }> {
  const res = await fetch(`/api/admin/inquiries/${id}`, {
    headers: adminAuthHeaders(),
  });

  if (!res.ok) {
    return { ok: false, message: await parseError(res, "Failed to load inquiry") };
  }

  return { ok: true, data: (await res.json()) as Inquiry };
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
): Promise<{ ok: true; data: Inquiry } | { ok: false; message: string }> {
  const res = await fetch(`/api/admin/inquiries/${id}/status`, {
    method: "PATCH",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    return { ok: false, message: await parseError(res, "Failed to update status") };
  }

  return { ok: true, data: (await res.json()) as Inquiry };
}

export async function updateInquiryItems(
  id: string,
  keepItemIds: string[],
  notifyClient: boolean,
): Promise<{ ok: true; data: Inquiry } | { ok: false; message: string }> {
  const res = await fetch(`/api/admin/inquiries/${id}/items`, {
    method: "PATCH",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ keepItemIds, notifyClient }),
  });

  if (!res.ok) {
    return { ok: false, message: await parseError(res, "Failed to update talent") };
  }

  return { ok: true, data: (await res.json()) as Inquiry };
}

export async function fetchPendingInquiriesCount(): Promise<number | null> {
  const result = await fetchAdminInquiries({ page: 1, limit: 1, status: "NEW" });
  if (!result.ok) return null;
  return result.data.meta?.total ?? 0;
}
