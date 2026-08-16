"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ReviewForm from "@/components/reviews/ReviewForm";
import { fetchReviewEligibility } from "@/lib/client/reviews-api";
import type { ReviewEligibility } from "@/types/review";

interface ModelAddReviewModalProps {
  modelName: string;
  talentUserId: string;
  onClose: () => void;
}

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; eligibility: ReviewEligibility };

export default function ModelAddReviewModal({
  modelName,
  talentUserId,
  onClose,
}: ModelAddReviewModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;

    async function loadEligibility() {
      setLoadState({ status: "loading" });
      const result = await fetchReviewEligibility(talentUserId);
      if (cancelled) return;

      if (!result.ok) {
        setLoadState({ status: "error", message: result.message });
        return;
      }

      setLoadState({ status: "ready", eligibility: result.data });
    }

    void loadEligibility();
    return () => {
      cancelled = true;
    };
  }, [talentUserId]);

  function renderBody() {
    if (loadState.status === "loading") {
      return (
        <p className="text-sm text-[#737373]">Checking whether you can leave a review…</p>
      );
    }

    if (loadState.status === "error") {
      return <p className="text-sm text-red-600">{loadState.message}</p>;
    }

    const { eligibility } = loadState;

    if (eligibility.canReview && eligibility.inquiryItemId) {
      return (
        <div className="space-y-4">
          <ReviewForm
            inquiryItemId={eligibility.inquiryItemId}
            onSubmitted={() => setSubmitted(true)}
          />
          {submitted && (
            <button
              type="button"
              onClick={onClose}
              className="w-full font-ui text-[10px] tracking-[0.18em] uppercase px-4 py-3 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
            >
              Close
            </button>
          )}
        </div>
      );
    }

    if (eligibility.existingReview) {
      return (
        <p className="text-sm text-[#737373]">
          You have already submitted a review for this talent
          {eligibility.existingReview.status
            ? ` (status: ${eligibility.existingReview.status}).`
            : "."}
        </p>
      );
    }

    return (
      <p className="text-sm text-[#737373]">
        You can leave a review after you have a confirmed or completed inquiry with this talent.
      </p>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Add review for ${modelName}`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#0A0A0A]/50"
        onClick={onClose}
        aria-label="Close review form"
      />

      <div className="relative w-full max-w-md bg-white border border-[#E0E0E0] shadow-[0_24px_80px_rgba(0,0,0,0.3)] max-h-[90dvh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 border-b border-[#E0E0E0] px-5 py-4">
          <div>
            <p className="font-ui text-[8px] tracking-[0.3em] uppercase text-[#C8A97A] mb-1">
              Review
            </p>
            <h2 className="font-display text-xl font-light text-[#0A0A0A]">
              {modelName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1.5 text-[#737373] hover:text-[#0A0A0A] transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5">{renderBody()}</div>
      </div>
    </div>
  );
}
