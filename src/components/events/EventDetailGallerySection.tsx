"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AgencyEvent } from "@/types/events-page";
import EventImageLightbox from "./EventImageLightbox";

interface EventDetailGallerySectionProps {
  event: AgencyEvent;
}

export default function EventDetailGallerySection({ event }: EventDetailGallerySectionProps) {
  const allImages = useMemo(() => [event.image, ...event.gallery], [event.image, event.gallery]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % allImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <section className="py-8 md:py-12 bg-[#0A0A0A]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-[80px]">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A] mb-2">
                Event Gallery
              </p>
              <h2 className="font-display text-[36px] md:text-[48px] font-light text-white leading-[1.1]">
                Moments Captured
              </h2>
            </div>
            <div className="font-ui text-[10px] tracking-[0.2em] uppercase text-white/50">
              {currentSlide + 1} / {allImages.length}
            </div>
          </div>

          <div className="relative mb-6 md:mb-8">
            <button
              type="button"
              onClick={() => openLightbox(currentSlide)}
              className="relative block w-full aspect-[16/9] overflow-hidden cursor-pointer group"
              data-cursor="view"
            >
              <Image
                src={allImages[currentSlide]}
                alt={`${event.title} ${currentSlide + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1600px) 100vw, 1600px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </button>

            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  data-cursor="button"
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-300 group"
                  aria-label="Previous slide"
                >
                  <ChevronLeft
                    size={24}
                    strokeWidth={1.5}
                    className="group-hover:-translate-x-0.5 transition-transform"
                  />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  data-cursor="button"
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-300 group"
                  aria-label="Next slide"
                >
                  <ChevronRight
                    size={24}
                    strokeWidth={1.5}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
            {allImages.map((img, i) => (
              <button
                key={`${event.id}-thumb-${i}`}
                type="button"
                onClick={() => openLightbox(i)}
                className={`relative aspect-square overflow-hidden border-2 transition-all duration-300 ${
                  i === currentSlide
                    ? "border-[#C8A97A] scale-95"
                    : "border-white/20 hover:border-white/40"
                }`}
                data-cursor="button"
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 12vw"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <EventImageLightbox
        images={allImages}
        open={lightboxOpen}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(i) => {
          setLightboxIndex(i);
          setCurrentSlide(i);
        }}
      />
    </>
  );
}
