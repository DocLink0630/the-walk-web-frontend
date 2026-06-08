"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { getFirstName } from "@/lib/public/featured-models";
import { mapTierToCategory, mapToTalentProfile } from "@/lib/public/models";
import type { PublicModel } from "@/types/public-model";
import ModelDetailField from "./ModelDetailField";

interface ModelDetailModalProps {
  model: PublicModel;
  onClose: () => void;
}

export default function ModelDetailModal({ model, onClose }: ModelDetailModalProps) {
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useBooking();
  const [slideIndex, setSlideIndex] = useState(0);

  const displayName = isAuthenticated
    ? model.name
    : getFirstName(model.name).toUpperCase();

  const slideImages = useMemo(() => {
    const images =
      model.portfolioImages.length > 0
        ? model.portfolioImages
        : model.imageUrl
          ? [model.imageUrl]
          : [];
    if (images.length === 0) return [];
    if (images.length >= 3) return images.slice(0, 3);
    return [...images, ...Array(3 - images.length).fill(images[0])];
  }, [model.imageUrl, model.portfolioImages]);

  const slideCount = Math.max(slideImages.length, 1);

  const slides = useMemo(() => {
    return Array.from({ length: slideCount }, (_, i) => ({
      index: i,
      image: slideImages[i] ?? null,
      locked: !isAuthenticated && i > 0,
    }));
  }, [isAuthenticated, slideCount, slideImages]);

  useEffect(() => {
    setSlideIndex(0);
  }, [model.id]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setSlideIndex((i) => (i + 1) % slideCount);
      if (event.key === "ArrowLeft") setSlideIndex((i) => (i - 1 + slideCount) % slideCount);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, slideCount]);

  function goNext() {
    setSlideIndex((i) => (i + 1) % slideCount);
  }

  function goPrev() {
    setSlideIndex((i) => (i - 1 + slideCount) % slideCount);
  }

  const currentSlide = slides[slideIndex];
  const hasImage = !!currentSlide?.image;
  const tierLabel = model.category ?? mapTierToCategory(model.tier);
  const inCart = isInCart(model.id);

  function handleAddToCart() {
    addToCart(mapToTalentProfile(model));
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={`${displayName} — model profile`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#0A0A0A]/75 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close model profile"
      />

      <div
        className="relative w-full max-w-6xl max-h-[100dvh] md:max-h-[92dvh] bg-white border border-[#E0E0E0] shadow-[0_24px_80px_rgba(0,0,0,0.25)] overflow-y-auto md:overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="shrink-0 flex items-start justify-between gap-4 border-b border-[#E0E0E0] px-5 py-4 md:px-8 md:py-5">
          <div>
            <p className="font-ui text-[8px] tracking-[0.35em] uppercase text-[#C8A97A] mb-1">
              {model.isFeaturedOnly ? "Featured model" : "Model profile"}
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-light text-[#0A0A0A] tracking-wide">
              {displayName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2 border border-[#E0E0E0] hover:border-[#0A0A0A] transition-colors"
            aria-label="Close"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          <div className="relative lg:w-[55%] bg-[#0A0A0A] min-h-[320px] lg:min-h-0 flex items-center justify-center">
            {hasImage ? (
              <div className="relative w-full h-full min-h-[320px] lg:min-h-[480px]">
                <Image
                  src={currentSlide!.image!}
                  alt={displayName}
                  fill
                  className={[
                    "object-cover transition-all duration-500",
                    currentSlide?.locked ? "blur-md scale-105" : "",
                  ].join(" ")}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  unoptimized
                  priority
                />
                {currentSlide?.locked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A]/40 px-6 text-center">
                    <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-white/90 mb-4 max-w-xs leading-relaxed">
                      Full portfolio available to registered clients
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        href="/?login=1"
                        className="font-ui text-[9px] tracking-[0.2em] uppercase px-6 py-2.5 bg-white text-[#0A0A0A] hover:bg-[#C8A97A] transition-colors"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/register/client"
                        className="font-ui text-[9px] tracking-[0.2em] uppercase px-6 py-2.5 border border-white/60 text-white hover:border-[#C8A97A] hover:text-[#C8A97A] transition-colors"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-white/40">
                <span className="font-ui text-[10px] tracking-[0.2em] uppercase">
                  Imagery coming soon
                </span>
              </div>
            )}

            {hasImage && slideCount > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={28} strokeWidth={1} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={28} strokeWidth={1} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {slides.map((slide) => (
                    <button
                      key={slide.index}
                      type="button"
                      onClick={() => setSlideIndex(slide.index)}
                      className={[
                        "w-8 h-[2px] transition-colors",
                        slideIndex === slide.index ? "bg-[#C8A97A]" : "bg-white/30",
                      ].join(" ")}
                      aria-label={`Go to slide ${slide.index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="lg:w-[45%] flex flex-col min-h-0 border-t lg:border-t-0 lg:border-l border-[#E0E0E0]">
            <div className="flex-1 overflow-y-auto px-5 py-6 md:px-8">
              <p className="font-ui text-[8px] tracking-[0.3em] uppercase text-[#9A9A9A] mb-4">
                Profile
              </p>

              {!isAuthenticated && (
                <p className="font-ui text-[10px] text-[#6B6B6B] leading-relaxed mb-5 pb-5 border-b border-[#E8E8E8]">
                  Sign in to view the complete profile, measurements, and portfolio.
                </p>
              )}

              <ModelDetailField
                label="Height"
                value={isAuthenticated ? model.height ?? null : null}
                locked={false}
                placeholder="Available soon"
              />
              <ModelDetailField
                label="Weight"
                value={isAuthenticated ? model.weight ?? null : null}
                locked={!isAuthenticated}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Chest"
                value={isAuthenticated ? model.chest ?? null : null}
                locked={!isAuthenticated}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Rate"
                value={isAuthenticated ? model.rate ?? "On request" : null}
                locked={!isAuthenticated}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Tier"
                value={isAuthenticated ? tierLabel ?? null : null}
                locked={!isAuthenticated}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Eye colour"
                value={isAuthenticated ? model.eyeColor ?? null : null}
                locked={!isAuthenticated}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Hair colour"
                value={isAuthenticated ? model.hairColor ?? null : null}
                locked={!isAuthenticated}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Bio"
                value={isAuthenticated ? model.bio ?? null : null}
                locked={!isAuthenticated}
                placeholder="Members only"
              />
            </div>

            <div className="shrink-0 border-t border-[#E0E0E0] px-5 py-4 md:px-8 space-y-2">
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={inCart}
                    className="block w-full text-center font-ui text-[10px] tracking-[0.2em] uppercase px-6 py-3 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors disabled:opacity-60 disabled:cursor-default"
                  >
                    {inCart ? "Added to inquiry" : "Add to inquiry"}
                  </button>
                  {inCart && (
                    <Link
                      href="/inquiry"
                      className="block w-full text-center font-ui text-[9px] tracking-[0.2em] uppercase text-[#9A7329] underline"
                    >
                      View inquiry cart
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  href="/?login=1"
                  className="block w-full text-center font-ui text-[10px] tracking-[0.2em] uppercase px-6 py-3 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
                >
                  Sign in to book
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#E0E0E0] bg-[#FAFAFA] px-5 py-5 md:px-8">
          <p className="font-ui text-[8px] tracking-[0.3em] uppercase text-[#9A9A9A] mb-3">
            Work
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {slides.map((slide) => {
              const locked = !isAuthenticated && slide.index > 0;
              if (!slide.image) {
                return (
                  <div
                    key={slide.index}
                    className="relative shrink-0 w-24 h-32 border border-[#E0E0E0] bg-[#F0F0F0]"
                  />
                );
              }
              return (
                <div
                  key={slide.index}
                  className="relative shrink-0 w-24 h-32 border border-[#E0E0E0] overflow-hidden"
                >
                  <Image
                    src={slide.image}
                    alt={`${displayName} work ${slide.index + 1}`}
                    fill
                    className={["object-cover", locked ? "blur-sm" : ""].join(" ")}
                    sizes="96px"
                    unoptimized
                  />
                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]/30">
                      <Link
                        href="/?login=1"
                        className="font-ui text-[7px] tracking-[0.15em] uppercase text-white text-center px-2"
                      >
                        Sign in
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
