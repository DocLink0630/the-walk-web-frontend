"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/types/gallery-page";

interface GalleryLightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function GalleryLightbox({
  items,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: GalleryLightboxProps) {
  const current = items[currentIndex];

  useEffect(() => {
    if (!current) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNext();
      if (event.key === "ArrowLeft") onPrev();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [current, onClose, onNext, onPrev]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${current.title} — image viewer`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 md:top-10 md:right-10 text-white/70 hover:text-white transition-colors duration-300 z-10"
        data-cursor="button"
        aria-label="Close gallery"
      >
        <X size={32} strokeWidth={1} />
      </button>

      <div
        className="relative max-w-[90vw] max-h-[90vh] w-full h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={current.url}
          alt={current.title}
          width={1600}
          height={1200}
          className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
          priority
        />
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            data-cursor="button"
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} strokeWidth={1.5} className="text-white" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            data-cursor="button"
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all duration-300"
            aria-label="Next image"
          >
            <ChevronRight size={24} strokeWidth={1.5} className="text-white" />
          </button>
        </>
      )}

      <div className="absolute bottom-6 md:bottom-10 left-0 right-0 text-center pointer-events-none">
        <div className="inline-block bg-black/50 backdrop-blur-sm px-6 py-3">
          <p className="font-ui text-[9px] tracking-[0.3em] uppercase text-[#C8A97A] mb-1">
            {current.category}
          </p>
          <p className="font-display text-[16px] font-light text-white">
            {current.title}
          </p>
          <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-white/60 mt-2">
            {currentIndex + 1} / {items.length}
          </p>
        </div>
      </div>
    </div>
  );
}
