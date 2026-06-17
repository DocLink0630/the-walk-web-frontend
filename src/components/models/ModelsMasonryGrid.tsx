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
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-4 pb-4 pt-16">
                  <h3 className="font-ui text-[22px] md:text-[26px] font-bold tracking-[0.06em] uppercase text-white leading-[1.1] [text-shadow:0_2px_16px_rgba(0,0,0,1),0_1px_3px_rgba(0,0,0,0.9)]">
                    {displayName}
                  </h3>
                  {model.category && (
                    <p className="font-ui text-[10px] md:text-[11px] font-semibold tracking-[0.14em] uppercase text-[#E8D5B5] mt-1.5 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                      {model.category}
                    </p>
                  )}
                  {isAuthenticated && model.rate && (
                    <p className="font-ui text-[13px] md:text-[14px] font-semibold text-white mt-1.5 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                      {model.rate}
                    </p>
                  )}
                  {measurementLine && isAuthenticated && (
                    <p className="font-ui text-[10px] font-semibold tracking-[0.12em] uppercase text-white/80 mt-1.5 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                      {measurementLine}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
