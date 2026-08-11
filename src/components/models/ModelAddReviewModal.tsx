"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { fetchOwnInquiries } from "@/lib/client/inquiries-api";
import { fetchReviewEligibility } from "@/lib/client/reviews-api";
import ReviewForm from "@/components/reviews/ReviewForm";
import type { ReviewEligibility } from "@/types/review";

interface ModelAddReviewModalProps {
  modelName: string;
  talentUserId: string;
  onClose: () => void;
}

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ineligible"; eligibility: ReviewEligibility }
  | { kind: "no-item" }
  | { kind: "ready"; inquiryItemId: string };

export default function ModelAddReviewModal({
  modelName,
  talentUserId,
  onClose,
}: ModelAddReviewModalProps) {
  const [loadState, setLoadState] = useState<LoadState>({ kind: "loading" });
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback(async () => {
    setLoadState({ kind: "loading" });
    setSubmitted(false);

    const [eligibilityResult, inquiriesResult] = await Promise.all([
      fetchReviewEligibility(talentUserId),
      fetchOwnInquiries({ limit: 20 }),
    ]);

    if (!eligibilityResult.ok) {
      setLoadState({ kind: "error", message: eligibilityResult.message });
      return;
    }

    if (!inquiriesResult.ok) {
      setLoadState({ kind: "error", message: inquiriesResult.message });
      return;
    }

    const eligibility = eligibilityResult.data;
    if (!eligibility.eligible) {
      setLoadState({ kind: "ineligible", eligibility });
      return;
    }

    const closedItem = inquiriesResult.data.data
      .filter((inquiry) => inquiry.status === "CLOSED")
      .flatMap((inquiry) => inquiry.items)
      .find((item) => item.modelUserId === talentUserId);

    if (!closedItem) {
      setLoadState({ kind: "no-item" });
      return;
    }

    setLoadState({ kind: "ready", inquiryItemId: closedItem.id });
  }, [talentUserId]);

  useEffect(() => {
    void load();
  }, [load]);

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

  function ineligibleMessage(eligibility: ReviewEligibility): string {
    if (
      eligibility.alreadyReviewed === true ||
      eligibility.reason?.toLowerCase().includes("already")
    ) {
      return "You have already submitted a review for this model.";
    }
    return (
      eligibility.reason?.trim() ||
      "You are not eligible to review this model yet."
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

        <div className="px-5 py-5">
          {loadState.kind === "loading" && (
            <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A]">
              Checking eligibility…
            </p>
          )}

          {loadState.kind === "error" && (
            <div className="space-y-4">
              <p className="text-sm text-red-600">{loadState.message}</p>
              <button
                type="button"
                onClick={() => void load()}
                className="font-ui text-[10px] tracking-[0.18em] uppercase px-4 py-2.5 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {loadState.kind === "ineligible" && (
            <p className="text-sm text-[#737373] leading-relaxed">
              {ineligibleMessage(loadState.eligibility)}
            </p>
          )}

          {loadState.kind === "no-item" && (
            <div className="space-y-4">
              <p className="text-sm text-[#737373] leading-relaxed">
                Reviews are available after a closed inquiry that includes this
                model. Check your client account for past inquiries.
              </p>
              <Link
                href="/client/profile"
                className="inline-block font-ui text-[10px] tracking-[0.18em] uppercase text-[#9A7329] underline"
              >
                Go to client profile
              </Link>
            </div>
          )}

          {loadState.kind === "ready" && (
            <div className="space-y-4">
              <ReviewForm
                inquiryItemId={loadState.inquiryItemId}
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
          )}
        </div>
      </div>
    </div>
  );
}
