"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
}

export default function StarRatingInput({ value, onChange, size = 24 }: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1" role="group" aria-label="Star rating">
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1;
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none"
          >
            <Star
              size={size}
              className={
                filled
                  ? "fill-[#C8A97A] text-[#C8A97A] transition-colors"
                  : "fill-transparent text-[#D4D4D4] transition-colors"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
