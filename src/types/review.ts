export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PublicReview {
  id: string;
  rating: number | null;
  text: string | null;
  createdAt: string;
  clientName: string;
}

export interface AdminReview {
  id: string;
  rating: number | null;
  text: string | null;
  status: ReviewStatus | string;
  createdAt: string;
  talentName: string;
  talentType: string;
  clientName: string;
}

export interface AdminReviewsResponse {
  data: AdminReview[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/** GET /api/reviews/eligibility — parse defensively; only `eligible` is required. */
export interface ReviewEligibility {
  eligible: boolean;
  reason?: string;
  alreadyReviewed?: boolean;
}
