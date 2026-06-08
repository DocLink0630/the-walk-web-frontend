"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const current = items[currentIndex];

  useEffect(() => {
    if (!current) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const overlay = overlayRef.current;
    const imageWrap = imageWrapRef.current;

    if (overlay) {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    }
    if (imageWrap) {
      gsap.fromTo(
        imageWrap,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out", delay: 0.05 },
      );
    }

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
  }, [current, currentIndex, onClose, onNext, onPrev]);

  if (!current) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery image viewer"
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
        ref={imageWrapRef}
        className="relative max-w-[92vw] max-h-[88vh] w-full h-[88vh] flex items-center justify-center px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={current.url}
          src={current.url}
          alt={current.title}
          width={1600}
          height={1200}
          className="max-w-full max-h-[88vh] w-auto h-auto object-contain"
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
        <p className="font-ui text-[10px] tracking-[0.25em] uppercase text-white/50">
          {currentIndex + 1} / {items.length}
        </p>
      </div>
    </div>
  );
}
