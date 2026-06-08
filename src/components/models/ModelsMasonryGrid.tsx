"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { getGuestDisplayName } from "@/lib/public/models";
import type { PublicModel } from "@/types/public-model";

interface ModelsMasonryGridProps {
  models: PublicModel[];
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onSelect: (model: PublicModel) => void;
}

export default function ModelsMasonryGrid({
  models,
  cardRefs,
  onSelect,
}: ModelsMasonryGridProps) {
  const { isAuthenticated } = useAuth();
  const { isInCart } = useBooking();

  if (models.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-[20px] font-light text-[#9A9A9A] italic">
          No models match these filters.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
      {models.map((model, index) => {
        const displayName = isAuthenticated
          ? model.name
          : getGuestDisplayName(model.name);

        const measurementLine = [model.height, model.chest, model.waist]
          .filter(Boolean)
          .join(" · ");

        return (
          <div
            key={model.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="group cursor-pointer break-inside-avoid mb-4 md:mb-6"
            onClick={() => onSelect(model)}
            style={{ perspective: "1000px" }}
            data-cursor="view"
          >
            <div className="card-inner" style={{ transformStyle: "preserve-3d" }}>
              <div
                className="card-image relative aspect-[3/4] overflow-hidden border border-[#E0E0E0] bg-[#F5F5F5]"
                data-cursor="image"
              >
                {model.imageUrl ? (
                  <Image
                    src={model.imageUrl}
                    alt={displayName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#F0F0F0]">
                    <span className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A]">
                      Photo coming soon
                    </span>
                  </div>
                )}
                {isInCart(model.id) && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-[#C8A97A] border border-white flex items-center justify-center">
                    <span className="font-ui text-[9px] text-white">✓</span>
                  </div>
                )}
                {measurementLine && isAuthenticated && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="font-ui text-[8px] tracking-[0.25em] uppercase text-white/70">
                      {measurementLine}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-3 bg-white border-l-2 border-[#C8A97A] pl-3 py-1">
                <h3 className="font-ui text-[10px] tracking-[0.25em] uppercase text-[#0A0A0A]">
                  {displayName}
                </h3>
                {model.category && (
                  <p className="font-ui text-[8px] tracking-[0.3em] uppercase text-[#C8A97A] mt-1">
                    {model.category}
                  </p>
                )}
                {isAuthenticated && model.rate && (
                  <p className="font-display text-[13px] text-[#9A9A9A] mt-1">
                    {model.rate}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
