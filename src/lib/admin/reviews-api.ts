import type { AdminReviewsResponse, ReviewStatus } from "@/types/review";
import { adminAuthHeaders } from "@/lib/admin/token";

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

export async function fetchAdminReviews(
  params: { page?: number; limit?: number } = {},
): Promise<{ ok: true; data: AdminReviewsResponse } | { ok: false; message: string }> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));

  const qs = search.toString();
  const res = await fetch(`/api/admin/reviews${qs ? `?${qs}` : ""}`, {
    headers: adminAuthHeaders(),
  });

  if (!res.ok) {
    return { ok: false, message: await parseError(res, "Failed to load reviews") };
  }

  const data = (await res.json()) as AdminReviewsResponse;
  return { ok: true, data };
}

export async function updateAdminReviewStatus(
  id: string,
  status: Extract<ReviewStatus, "APPROVED" | "REJECTED">,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await fetch(`/api/admin/reviews/${id}/status`, {
    method: "PATCH",
    headers: adminAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    return { ok: false, message: await parseError(res, "Failed to update review") };
  }

  return { ok: true };
}

export async function fetchPendingReviewsCount(): Promise<number | null> {
  const result = await fetchAdminReviews({ page: 1, limit: 1 });
  if (!result.ok) return null;
  return result.data.meta?.total ?? 0;
}
