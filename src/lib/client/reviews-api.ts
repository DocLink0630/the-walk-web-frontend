import type { ReviewEligibility } from "@/types/review";
import { getClientToken } from "./token";

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getClientToken();
  if (!token) return extra;
  return { ...extra, Authorization: `Bearer ${token}` };
}

function parseEligibility(data: unknown): ReviewEligibility {
  if (data && typeof data === "object" && "eligible" in data) {
    const eligible = (data as { eligible: unknown }).eligible === true;
    const reason =
      "reason" in data && typeof (data as { reason: unknown }).reason === "string"
        ? (data as { reason: string }).reason
        : undefined;
    const alreadyReviewed =
      "alreadyReviewed" in data
        ? (data as { alreadyReviewed: unknown }).alreadyReviewed === true
        : undefined;
    return { eligible, reason, alreadyReviewed };
  }
  return { eligible: false };
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
