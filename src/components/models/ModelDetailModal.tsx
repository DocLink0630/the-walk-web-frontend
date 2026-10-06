"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingCart, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { getFirstName } from "@/lib/public/featured-models";
import { getClientToken } from "@/lib/client/token";
import { downloadModelProfilePdf, downloadModelProfilePdfForUser } from "@/lib/pdf/download-pdf";
import {
  fetchPublicModelGallery,
  mapTierToCategory,
  mapToTalentProfile,
  resolveModelProfileForModal,
} from "@/lib/public/models";
import type { PublicModel } from "@/types/public-model";
import ClientInquiryGateCta from "@/components/inquiry/ClientInquiryGateCta";
import ReviewsList from "@/components/reviews/ReviewsList";
import ModelAddReviewModal from "./ModelAddReviewModal";
import ModelDetailField from "./ModelDetailField";

interface ModelDetailModalProps {
  model: PublicModel;
  onClose: () => void;
}

export default function ModelDetailModal({ model, onClose }: ModelDetailModalProps) {
  const { isAuthenticated, isClient, isLoading, user } = useAuth();
  const { addToCart, bookingCart, isInCart } = useBooking();
  const [slideIndex, setSlideIndex] = useState(0);
  const [resolvedModel, setResolvedModel] = useState(model);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  /** Measurements, full name, rate, bio — still client-only. Portfolio images are public. */
  const canViewFullProfile = isClient;

  useEffect(() => {
    setResolvedModel(model);
  }, [model]);

  useEffect(() => {
    let cancelled = false;
    void fetchPublicModelGallery(model.name).then((gallery) => {
      if (cancelled || !gallery) return;

      setResolvedModel((prev) => {
        // Gallery is looked up by name only; duplicate names can return the wrong
        // model with fewer images. Never replace a richer roster portfolio.
        const galleryImages = gallery.portfolioImages;
        const useGalleryImages =
          galleryImages.length > 0 &&
          (prev.portfolioImages.length === 0 ||
            galleryImages.length > prev.portfolioImages.length);
        const portfolioImages = useGalleryImages
          ? galleryImages
          : prev.portfolioImages;

        return {
          ...prev,
          ...(portfolioImages.length > 0 && {
            portfolioImages,
            imageUrl: portfolioImages[0] ?? prev.imageUrl,
          }),
          portfolioCount: Math.max(
            gallery.portfolioCount ?? 0,
            galleryImages.length,
            portfolioImages.length,
            prev.portfolioCount ?? 0,
          ),
          height: gallery.height ?? prev.height,
          videoUrl: gallery.videoUrl ?? prev.videoUrl ?? null,
        };
      });
    });
    return () => {
      cancelled = true;
    };
  }, [model.name]);

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
          videoUrl: enriched.videoUrl ?? prev.videoUrl ?? null,
        }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isClient, model]);

  const displayName = canViewFullProfile
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

  const slideCount = Math.max(slideImages.length, 1);

  const slides = useMemo(() => {
    return Array.from({ length: slideCount }, (_, i) => ({
      index: i,
      image: slideImages[i] ?? null,
    }));
  }, [slideCount, slideImages]);

  const galleryImages = useMemo(() => {
    const portfolio = resolvedModel.portfolioImages.filter(Boolean);
    if (portfolio.length > 0) return portfolio;
    return resolvedModel.workExperienceImages ?? [];
  }, [resolvedModel.portfolioImages, resolvedModel.workExperienceImages]);

  const galleryLabel =
    resolvedModel.portfolioImages.filter(Boolean).length > 0 ? "Portfolio" : "Work";

  const portfolioSlotCount = Math.max(
    galleryImages.length,
    resolvedModel.imageUrl ? 1 : 0,
  );

  useEffect(() => {
    setSlideIndex(0);
  }, [model.id]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (reviewOpen) return;
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setSlideIndex((i) => (i + 1) % slideCount);
      if (event.key === "ArrowLeft") setSlideIndex((i) => (i - 1 + slideCount) % slideCount);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, reviewOpen, slideCount]);

  function goNext() {
    setSlideIndex((i) => (i + 1) % slideCount);
  }

  function goPrev() {
    setSlideIndex((i) => (i - 1 + slideCount) % slideCount);
  }

  const currentSlide = slides[slideIndex];
  const hasImage = !!currentSlide?.image;
  const tierLabel = resolvedModel.category ?? mapTierToCategory(resolvedModel.tier);
  const modelUserId = resolvedModel.userId ?? resolvedModel.id;
  const inCart =
    isInCart(modelUserId) || isInCart(resolvedModel.id) || isInCart(model.id);
  const isOwnModelProfile =
    isAuthenticated && !!user?.id && user.id === modelUserId;
  const canExportProfile = isClient || isOwnModelProfile;

  async function handleExportProfilePdf() {
    setExportingPdf(true);
    setExportError(null);
    const result = isOwnModelProfile
      ? await downloadModelProfilePdf()
      : await downloadModelProfilePdfForUser(modelUserId);
    setExportingPdf(false);
    if (!result.ok) {
      setExportError(result.message);
    }
  }

  function handleAddToCart() {
    if (!isClient) return;
    addToCart(mapToTalentProfile(resolvedModel));
  }

  return (
    <>
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
        className="relative w-full max-w-6xl max-h-[100dvh] md:max-h-[92dvh] bg-white border border-[#E0E0E0] shadow-[0_24px_80px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="shrink-0 flex items-start justify-between gap-4 border-b border-[#E0E0E0] px-5 py-5 md:px-8 md:py-6">
          <div className="min-w-0 flex-1 pr-2">
            <p className="font-ui text-[8px] tracking-[0.35em] uppercase text-[#C8A97A] mb-2">
              Model profile
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-light text-[#0A0A0A] tracking-wide leading-[1.2] break-words [overflow:visible] pt-0.5">
              {displayName}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {canExportProfile && (
              <button
                type="button"
                onClick={() => void handleExportProfilePdf()}
                disabled={exportingPdf}
                className="shrink-0 font-ui text-[11px] tracking-[0.2em] uppercase px-5 py-2.5 bg-[#0A0A0A] text-white border border-[#C8A97A] hover:bg-[#C8A97A] hover:text-[#0A0A0A] disabled:opacity-50 transition-colors"
              >
                {exportingPdf ? "Exporting…" : "Portfolio"}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 border border-[#E0E0E0] hover:border-[#0A0A0A] transition-colors"
              aria-label="Close"
            >
              <X className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        </header>

        {exportError && (
          <div className="shrink-0 border-b border-red-200 bg-red-50 px-5 py-2 md:px-8">
            <p className="font-ui text-[10px] text-red-700">{exportError}</p>
          </div>
        )}

        {/* Under admin review banner — shown when the logged-in model views their own profile and is not yet active */}
        {isAuthenticated && user && resolvedModel.id === user.id && user.status !== "ACTIVE" && (
          <div className="shrink-0 border-b border-[#C8A97A] bg-[#C8A97A]/10 px-5 py-3 md:px-8">
            <p className="font-ui text-[9px] tracking-[0.2em] uppercase text-[#9A7329]">
              Under admin review — your profile is being reviewed before activation
            </p>
          </div>
        )}

        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          <div className="relative lg:w-[55%] bg-[#0A0A0A] h-56 max-h-[40vh] shrink-0 lg:h-auto lg:max-h-none lg:min-h-0 flex items-center justify-center">
            {hasImage ? (
              <div className="relative w-full h-full lg:min-h-[480px]">
                <Image
                  src={currentSlide!.image!}
                  alt={displayName}
                  fill
                  className="object-contain object-center transition-all duration-500"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  unoptimized
                  priority
                />
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-white/40">
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

          <div className="flex-1 lg:w-[45%] lg:min-w-[280px] flex flex-col min-h-0 min-w-0 border-t lg:border-t-0 lg:border-l border-[#E0E0E0]">
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 md:px-6 md:pr-8">
              <p className="font-ui text-[10px] tracking-[0.3em] uppercase text-[#9A9A9A] mb-4">
                Profile
              </p>

              {resolvedModel.videoUrl && (
                <div className="mb-5 pb-5 border-b border-[#E8E8E8] space-y-2">
                  <p className="font-ui text-[8px] tracking-[0.25em] uppercase text-[#9A9A9A]">
                    Intro video
                  </p>
                  <video
                    src={resolvedModel.videoUrl}
                    controls
                    playsInline
                    className="w-full max-h-56 bg-[#0A0A0A] object-contain"
                    preload="metadata"
                  />
                </div>
              )}

              {!canViewFullProfile && (
                <p className="font-ui text-[10px] text-[#6B6B6B] leading-relaxed mb-5 pb-5 border-b border-[#E8E8E8]">
                  Sign in as a client to view measurements and full profile details.
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
                value={canViewFullProfile ? resolvedModel.weight ?? null : null}
                locked={!canViewFullProfile}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Chest"
                value={canViewFullProfile ? resolvedModel.chest ?? null : null}
                locked={!canViewFullProfile}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Rate"
                value={canViewFullProfile ? resolvedModel.rate ?? "On request" : null}
                locked={!canViewFullProfile}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Tier"
                value={canViewFullProfile ? tierLabel ?? null : null}
                locked={!canViewFullProfile}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Eye colour"
                value={canViewFullProfile ? resolvedModel.eyeColor ?? null : null}
                locked={!canViewFullProfile}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Hair colour"
                value={canViewFullProfile ? resolvedModel.hairColor ?? null : null}
                locked={!canViewFullProfile}
                placeholder="Members only"
              />
              <ModelDetailField
                label="Bio"
                value={canViewFullProfile ? resolvedModel.bio ?? null : null}
                locked={!canViewFullProfile}
                placeholder="Members only"
              />

              <div className="mt-6 pt-5 border-t border-[#E8E8E8] pb-2">
                <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-3">
                  Client reviews
                </p>
                <ReviewsList talentUserId={modelUserId} />
              </div>
            </div>

            <div className="shrink-0 border-t border-[#E0E0E0] px-5 py-4 md:px-6 md:pr-8 space-y-2">
              {isLoading ? (
                <div
                  className="h-11 w-full bg-[#F0F0F0] animate-pulse"
                  aria-hidden
                />
              ) : isClient ? (
                <>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={inCart}
                    className="block w-full min-w-0 box-border text-center font-ui text-[10px] tracking-[0.18em] uppercase px-4 py-3.5 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors disabled:opacity-60 disabled:cursor-default"
                  >
                    {inCart ? "Added to inquiry" : "Add to inquiry"}
                  </button>
                  <Link
                    href="/inquiry"
                    className="flex w-full min-w-0 items-center justify-center gap-2 font-ui text-[10px] font-bold tracking-[0.18em] uppercase px-4 py-3 bg-[#C8A97A]/20 text-[#9A7329] border border-[#C8A97A] hover:bg-[#C8A97A] hover:text-white transition-colors"
                  >
                    <ShoppingCart size={14} strokeWidth={2.25} />
                    View inquiry cart
                    {bookingCart.length > 0 && (
                      <span className="flex h-4 min-w-4 items-center justify-center bg-[#9A7329] px-1 font-ui text-[8px] tracking-normal text-white">
                        {bookingCart.length}
                      </span>
                    )}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setReviewOpen(true)}
                    className="block w-full min-w-0 box-border text-center font-ui text-[10px] tracking-[0.18em] uppercase px-4 py-3.5 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
                  >
                    Add review
                  </button>
                </>
              ) : (
                <ClientInquiryGateCta />
              )}
            </div>
          </div>
        </div>

        <div className="hidden md:block shrink-0 border-t border-[#E0E0E0] bg-[#FAFAFA] px-5 py-5 md:px-8">
          <p className="font-ui text-[8px] tracking-[0.3em] uppercase text-[#9A9A9A] mb-3">
            {galleryLabel}
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {portfolioSlotCount > 0 ? (
              Array.from({ length: portfolioSlotCount }, (_, idx) => {
                const imageUrl =
                  galleryImages[idx] ?? (idx === 0 ? resolvedModel.imageUrl : null);

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
                        className="object-cover"
                        sizes="96px"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#1A1A1A]" />
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

      {reviewOpen && (
        <ModelAddReviewModal
          modelName={resolvedModel.name}
          talentUserId={modelUserId}
          onClose={() => setReviewOpen(false)}
        />
      )}
    </>
  );
}
