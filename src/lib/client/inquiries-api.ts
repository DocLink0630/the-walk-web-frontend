import type {
  CreateInquiryPayload,
  PaginatedInquiriesResponse,
} from "@/types/inquiry";
import { getClientToken } from "./token";

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

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getClientToken();
  if (!token) return extra;
  return { ...extra, Authorization: `Bearer ${token}` };
}

export async function fetchOwnInquiries(
  params: { page?: number; limit?: number } = {},
): Promise<
  { ok: true; data: PaginatedInquiriesResponse } | { ok: false; message: string }
> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));

  const qs = search.toString();
  const res = await fetch(`/api/inquiries${qs ? `?${qs}` : ""}`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    return { ok: false, message: await parseError(res, "Failed to load inquiries") };
  }

  return { ok: true, data: (await res.json()) as PaginatedInquiriesResponse };
}

export async function submitInquiry(
  payload: CreateInquiryPayload,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!getClientToken()) {
    return {
      ok: false,
      message: "Your session has expired. Please sign in again to submit an inquiry.",
    };
  }

  const res = await fetch("/api/inquiries", {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return { ok: false, message: await parseError(res, "Failed to submit inquiry") };
  }

  return { ok: true };
}
