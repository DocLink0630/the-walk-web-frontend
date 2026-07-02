"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Lock, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { getFirstName } from "@/lib/public/featured-models";
import { getClientToken } from "@/lib/client/token";
import {
  fetchPublicModelGallery,
  mapTierToCategory,
  mapToTalentProfile,
  resolveModelProfileForModal,
} from "@/lib/public/models";
import type { PublicModel } from "@/types/public-model";
import ModelDetailField from "./ModelDetailField";
import ReviewsList from "@/components/reviews/ReviewsList";

interface ModelDetailModalProps {
  model: PublicModel;
  onClose: () => void;
}

export default function ModelDetailModal({ model, onClose }: ModelDetailModalProps) {
  const { isAuthenticated, isClient, user } = useAuth();
  const { addToCart, isInCart } = useBooking();
  const [slideIndex, setSlideIndex] = useState(0);
  const [resolvedModel, setResolvedModel] = useState(model);

  const canViewFullPortfolio = isClient;

  useEffect(() => {
    setResolvedModel(model);
  }, [model]);

  useEffect(() => {
    let cancelled = false;
    void fetchPublicModelGallery(model.name).then((gallery) => {
      if (cancelled || !gallery) return;
      const visibleImages =
        canViewFullPortfolio || gallery.portfolioImages.length <= 1
          ? gallery.portfolioImages
          : gallery.portfolioImages.slice(0, 1);

      setResolvedModel((prev) => ({
        ...prev,
        ...(visibleImages.length > 0 && {
          portfolioImages: visibleImages,
          imageUrl: visibleImages[0] ?? prev.imageUrl,
        }),
        portfolioCount: gallery.portfolioCount ?? gallery.portfolioImages.length,
        height: gallery.height ?? prev.height,
      }));
    });
    return () => {
      cancelled = true;
    };
  }, [canViewFullPortfolio, model.name]);

  useEffect(() => {
    void fetch("/api/public/models/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modelName: model.name }),
    }).catch(() => {/* fire-and-forget */});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const token = getClientToken();
    if (!token) return;

    let cancelled = false;
    void resolveModelProfileForModal(model, token).then((enriched) => {
      if (!cancelled) {
        setResolvedModel((prev) => ({
          ...enriched,
          portfolioImages:
            enriched.portfolioImages.length > 0
              ? enriched.portfolioImages
              : prev.portfolioImages.length > 0
                ? prev.portfolioImages
                : enriched.portfolioImages,
          portfolioCount: Math.max(
            enriched.portfolioImages.length,
            prev.portfolioCount ?? 0,
            enriched.portfolioImages.length,
          ),
        }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isClient, model]);

  const displayName = canViewFullPortfolio
    ? resolvedModel.name
    : getFirstName(resolvedModel.name).toUpperCase();

  const slideImages = useMemo(() => {
    const images =
      resolvedModel.portfolioImages.length > 0
        ? resolvedModel.portfolioImages
        : resolvedModel.imageUrl
          ? [resolvedModel.imageUrl]
          : [];
    return images;
  }, [resolvedModel.imageUrl, resolvedModel.portfolioImages]);

  const slideCount = canViewFullPortfolio
    ? Math.max(slideImages.length, 1)
    : Math.max(resolvedModel.portfolioCount ?? slideImages.length, slideImages.length, 1);

  const slides = useMemo(() => {
    return Array.from({ length: slideCount }, (_, i) => ({
      index: i,
      image: slideImages[i] ?? null,
      locked: !canViewFullPortfolio && i > 0,
    }));
  }, [canViewFullPortfolio, slideCount, slideImages]);

  const galleryImages = useMemo(() => {
    const portfolio = resolvedModel.portfolioImages.filter(Boolean);
    if (portfolio.length > 0) return portfolio;
    return resolvedModel.workExperienceImages ?? [];
  }, [resolvedModel.portfolioImages, resolvedModel.workExperienceImages]);

  const galleryLabel =
    resolvedModel.portfolioImages.filter(Boolean).length > 0 ? "Portfolio" : "Work";

  const previewImage = galleryImages[0] ?? resolvedModel.imageUrl ?? null;

  const portfolioSlotCount = canViewFullPortfolio
    ? Math.max(galleryImages.length, previewImage ? 1 : 0)
    : Math.max(
        resolvedModel.portfolioCount ?? 0,
        galleryImages.length,
        previewImage ? 1 : 0,
      );

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
  const tierLabel = resolvedModel.category ?? mapTierToCategory(resolvedModel.tier);
  const inCart = isInCart(resolvedModel.id);

  function handleAddToCart() {
    addToCart(mapToTalentProfile(resolvedModel));
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
              Model profile
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

        {/* Under admin review banner — shown when the logged-in model views their own profile and is not yet active */}
        {isAuthenticated && user && resolvedModel.id === user.id && user.status !== "ACTIVE" && (
          <div className="shrink-0 border-b border-[#C8A97A] bg-[#C8A97A]/10 px-5 py-3 md:px-8">
            <p className="font-ui text-[9px] tracking-[0.2em] uppercase text-[#9A7329]">
              Under admin review — your profile is being reviewed before activation
            </p>
          </div>
        )}

        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          <div className="relative lg:w-[55%] bg-[#0A0A0A] min-h-[320px] lg:min-h-0 flex items-center justify-center">
            {hasImage || currentSlide?.locked ? (
              <div className="relative w-full h-full min-h-[320px] lg:min-h-[480px]">
                {hasImage && !currentSlide?.locked && (
                  <Image
                    src={currentSlide!.image!}
                    alt={displayName}
                    fill
                    className="object-contain object-center transition-all duration-500"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    unoptimized
                    priority
                  />
                )}
                {currentSlide?.locked && previewImage && (
                  <Image
                    src={previewImage}
                    alt=""
                    fill
                    className="object-contain object-center blur-xl scale-105 opacity-60"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    unoptimized
                    aria-hidden
                  />
                )}
                {currentSlide?.locked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A]/80 px-6 text-center">
                    <Lock className="size-8 text-white/90 mb-4" strokeWidth={1.25} />
                    <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-white/90 mb-4 max-w-xs leading-relaxed">
                      Full portfolio available to registered clients
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        href="/register/client"
                        className="font-ui text-[9px] tracking-[0.2em] uppercase px-6 py-2.5 bg-white text-[#0A0A0A] hover:bg-[#C8A97A] transition-colors"
                      >
                        Register as client
                      </Link>
                      <Link
                        href="/?login=1"
                        className="font-ui text-[9px] tracking-[0.2em] uppercase px-6 py-2.5 border border-white/60 text-white hover:border-[#C8A97A] hover:text-[#C8A97A] transition-colors"
                      >
                        Sign in
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

            {slideCount > 1 && (
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

              {!canViewFullPortfolio && (
                <p className="font-ui text-[10px] text-[#6B6B6B] leading-relaxed mb-5 pb-5 border-b border-[#E8E8E8]">
                  Sign in as a client to view the complete profile, measurements, and portfolio.
                </p>
              )}

              <ModelDetailField
                label="Height"
                value={resolvedModel.height ?? null}
                locked={false}
                placeholder="Available soon"
              />
              <ModelDetailField
                label="Weight"
                value={canViewFullPortfolio ? resolvedModel.weight ?? null : null}
                locked={!canViewFullPortfolio}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Chest"
                value={canViewFullPortfolio ? resolvedModel.chest ?? null : null}
                locked={!canViewFullPortfolio}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Rate"
                value={canViewFullPortfolio ? resolvedModel.rate ?? "On request" : null}
                locked={!canViewFullPortfolio}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Tier"
                value={canViewFullPortfolio ? tierLabel ?? null : null}
                locked={!canViewFullPortfolio}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Eye colour"
                value={canViewFullPortfolio ? resolvedModel.eyeColor ?? null : null}
                locked={!canViewFullPortfolio}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Hair colour"
                value={canViewFullPortfolio ? resolvedModel.hairColor ?? null : null}
                locked={!canViewFullPortfolio}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Bio"
                value={canViewFullPortfolio ? resolvedModel.bio ?? null : null}
                locked={!canViewFullPortfolio}
                placeholder="Members only"
              />
            </div>

            <div className="shrink-0 border-t border-[#E0E0E0] px-5 py-4 md:px-8 space-y-2">
              {isClient ? (
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
                  href="/register/client"
                  className="block w-full text-center font-ui text-[10px] tracking-[0.2em] uppercase px-6 py-3 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
                >
                  Sign in to inquiry
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#E0E0E0] bg-[#FAFAFA] px-5 py-5 md:px-8">
          <p className="font-ui text-[8px] tracking-[0.3em] uppercase text-[#9A9A9A] mb-3">
            Client reviews
          </p>
          <ReviewsList talentUserId={resolvedModel.id} />
        </div>

        <div className="shrink-0 border-t border-[#E0E0E0] bg-[#FAFAFA] px-5 py-5 md:px-8">
          <p className="font-ui text-[8px] tracking-[0.3em] uppercase text-[#9A9A9A] mb-3">
            {galleryLabel}
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {portfolioSlotCount > 0 ? (
              Array.from({ length: portfolioSlotCount }, (_, idx) => {
                const locked = !canViewFullPortfolio && idx > 0;
                const imageUrl = canViewFullPortfolio
                  ? galleryImages[idx] ?? null
                  : previewImage;

                return (
                  <button
                    key={`portfolio-slot-${idx}`}
                    type="button"
                    onClick={() => setSlideIndex(idx)}
                    className={[
                      "relative shrink-0 w-24 h-32 border overflow-hidden",
                      slideIndex === idx ? "border-[#C8A97A]" : "border-[#E0E0E0]",
                      "cursor-pointer",
                    ].join(" ")}
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={`${displayName} ${galleryLabel.toLowerCase()} ${idx + 1}`}
                        fill
                        className={[
                          "object-cover",
                          locked ? "blur-md scale-105" : "",
                        ].join(" ")}
                        sizes="96px"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#1A1A1A]" />
                    )}
                    {locked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-[#0A0A0A]/60">
                        <Lock className="size-4 text-white/90" strokeWidth={1.5} />
                        <span className="font-ui text-[7px] tracking-[0.12em] uppercase text-white/90 text-center px-1">
                          Sign in
                        </span>
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="relative shrink-0 w-24 h-32 border border-[#E0E0E0] bg-[#F0F0F0] flex items-center justify-center">
                <span className="font-ui text-[7px] tracking-[0.1em] uppercase text-[#C0C0C0] text-center px-2">
                  No portfolio photos
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
