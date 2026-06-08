"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import Link from "next/link";
import { ExternalLink, X } from "lucide-react";
import type { AgencyEvent } from "@/types/events-page";
import EventImageLightbox from "./EventImageLightbox";

interface EventsGalleryModalProps {
  event: AgencyEvent;
  onClose: () => void;
}

export default function EventsGalleryModal({ event, onClose }: EventsGalleryModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allImages = useMemo(
    () => [event.image, ...event.gallery],
    [event.image, event.gallery],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (overlayRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    }
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", delay: 0.05 },
      );
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !lightboxOpen) onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, lightboxOpen]);

  function openLightbox(index: number) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`${event.title} gallery`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors duration-300 z-10"
          data-cursor="button"
          aria-label="Close gallery"
        >
          <X size={28} strokeWidth={1} />
        </button>

        <div
          ref={panelRef}
          className="max-w-[1200px] w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 md:mb-8 text-center px-4">
            <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A] mb-2 md:mb-3">
              {event.category}
            </p>
            <h3 className="font-display text-[32px] md:text-[48px] lg:text-[56px] font-light text-white leading-[1.05] mb-2 md:mb-3">
              {event.title}
            </h3>
            <p className="font-ui text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-white/60 mb-2">
              {event.date}
            </p>
            <p className="font-ui text-[10px] tracking-[0.15em] text-white/50 mb-4">
              {event.location}
            </p>
            <p className="font-display text-[15px] md:text-[16px] font-light text-white/70 leading-[1.7] max-w-2xl mx-auto mb-4">
              {event.description}
            </p>
            <Link
              href={`/events/${event.id}`}
              className="inline-flex items-center gap-2 font-ui text-[9px] tracking-[0.25em] uppercase text-[#C8A97A] hover:text-white transition-colors duration-300"
            >
              <ExternalLink size={14} strokeWidth={1.5} />
              View Full Event Details
            </Link>
          </div>

          <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-white/40 text-center mb-4">
            Click any image to enlarge
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {allImages.map((img, idx) => (
              <button
                key={`${event.id}-modal-${idx}`}
                type="button"
                onClick={() => openLightbox(idx)}
                className={`relative overflow-hidden cursor-pointer group text-left ${
                  idx === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-square"
                }`}
                data-cursor="view"
                aria-label={`View ${event.title} image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={idx === 0 ? event.title : `${event.title} ${idx}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes={
                    idx === 0
                      ? "(max-width: 768px) 100vw, 1200px"
                      : "(max-width: 768px) 100vw, 600px"
                  }
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <EventImageLightbox
        images={allImages}
        open={lightboxOpen}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
