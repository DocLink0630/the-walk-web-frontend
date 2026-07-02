"use client";

import { useCallback, useEffect, useState } from "react";
import { adminAuthHeaders } from "@/lib/admin/token";
import StarRating from "@/components/reviews/StarRating";

interface AdminReview {
  id: string;
  rating: number | null;
  text: string | null;
  status: string;
  createdAt: string;
  talentName: string;
  talentType: string;
  clientName: string;
}

interface ReviewsResponse {
  data: AdminReview[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function ReviewsPanel() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews?limit=50", {
        headers: adminAuthHeaders(),
      });
      if (res.ok) {
        const body = (await res.json()) as ReviewsResponse;
        setReviews(body.data ?? []);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function updateStatus(id: string, status: "APPROVED" | "REJECTED") {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}/status`, {
        method: "PATCH",
        headers: adminAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      // silently fail
    }
    setUpdatingId(null);
  }

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Approve or reject client-submitted reviews before they appear on talent profiles.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded">
          <p className="text-sm text-gray-400">No pending reviews</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-gray-900">
                    {review.talentName}
                    <span className="ml-1 text-xs font-normal text-gray-400 capitalize">
                      · {review.talentType}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">by {review.clientName}</p>
                </div>
                <div className="flex items-center gap-2">
                  {review.rating != null ? (
                    <StarRating rating={review.rating} size={14} />
                  ) : (
                    <span className="text-xs text-gray-400 italic">No rating</span>
                  )}
                  <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                </div>
              </div>

              {review.text && (
                <p className="text-sm text-gray-700 leading-relaxed">{review.text}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  disabled={updatingId === review.id}
                  onClick={() => void updateStatus(review.id, "APPROVED")}
                  className="px-4 py-1.5 text-xs bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 rounded"
                >
                  {updatingId === review.id ? "…" : "Approve"}
                </button>
                <button
                  type="button"
                  disabled={updatingId === review.id}
                  onClick={() => void updateStatus(review.id, "REJECTED")}
                  className="px-4 py-1.5 text-xs border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 rounded"
                >
                  {updatingId === review.id ? "…" : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
