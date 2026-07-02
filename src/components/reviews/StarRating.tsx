"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number | null | undefined;
  max?: number;
  size?: number;
  className?: string;
}

export default function StarRating({
  rating,
  max = 5,
  size = 16,
  className = "",
}: StarRatingProps) {
  if (rating == null || rating < 1) {
    return null;
  }

  return (
    <div className={`flex gap-0.5 ${className}`} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < rating
              ? "fill-[#C8A97A] text-[#C8A97A]"
              : "fill-transparent text-[#D4D4D4]"
          }
        />
      ))}
    </div>
  );
}
