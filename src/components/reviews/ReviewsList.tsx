"use client";

import { useEffect, useState } from "react";
import type { PublicReview } from "@/types/review";
import StarRating from "./StarRating";

interface ReviewsListProps {
  talentUserId: string;
}

export default function ReviewsList({ talentUserId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!talentUserId) return;

    fetch(`/api/public/talent/${talentUserId}/reviews`)
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) setReviews(data as PublicReview[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [talentUserId]);

  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="h-14 bg-[#F5F5F0] rounded" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-[#737373] italic">No reviews yet.</p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-[#EBEBEB] pb-4 last:border-0 last:pb-0">
          <div className="flex items-center justify-between mb-1">
            {review.rating != null ? (
              <StarRating rating={review.rating} size={14} />
            ) : (
              <span className="text-xs text-[#737373] italic">No rating</span>
            )}
            <span className="text-xs text-[#737373]">
              {new Date(review.createdAt).toLocaleDateString("en-LK", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          {review.text && (
            <p className="text-sm text-[#0A0A0A] leading-relaxed mt-1">{review.text}</p>
          )}
          <p className="text-xs text-[#737373] mt-1">— {review.clientName}</p>
        </div>
      ))}
    </div>
  );
}
