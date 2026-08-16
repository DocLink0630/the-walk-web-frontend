import type { ReviewEligibility, ReviewStatus } from "@/types/review";
import { getClientToken } from "./token";

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getClientToken();
  if (!token) return extra;
  return { ...extra, Authorization: `Bearer ${token}` };
}

function parseEligibility(data: unknown): ReviewEligibility {
  if (!data || typeof data !== "object") {
    return { canReview: false };
  }

  const raw = data as Record<string, unknown>;
  const canReview = raw.canReview === true;
  const inquiryItemId =
    typeof raw.inquiryItemId === "string" && raw.inquiryItemId.trim()
      ? raw.inquiryItemId
      : undefined;

  let existingReview: ReviewEligibility["existingReview"];
  if (raw.existingReview && typeof raw.existingReview === "object") {
    const er = raw.existingReview as Record<string, unknown>;
    existingReview = {
      rating: typeof er.rating === "number" ? er.rating : null,
      text: typeof er.text === "string" ? er.text : null,
      status: (typeof er.status === "string" ? er.status : "PENDING") as ReviewStatus | string,
    };
  }

  return { canReview, inquiryItemId, existingReview };
}

export async function fetchReviewEligibility(
  talentUserId: string,
): Promise<{ ok: true; data: ReviewEligibility } | { ok: false; message: string }> {
  if (!talentUserId) {
    return { ok: false, message: "Missing talent user id" };
  }

  const token = getClientToken();
  if (!token) {
    return { ok: false, message: "Not authenticated" };
  }

  const search = new URLSearchParams({ talentUserId });
  const res = await fetch(`/api/reviews/eligibility?${search.toString()}`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    let message = "Failed to check review eligibility";
    try {
      const body = await res.json();
      if (body?.message) {
        message = Array.isArray(body.message) ? body.message.join(", ") : String(body.message);
      }
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  const body: unknown = await res.json();
  return { ok: true, data: parseEligibility(body) };
}
