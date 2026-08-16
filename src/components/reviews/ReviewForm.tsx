"use client";

import { useState } from "react";
import { getClientToken } from "@/lib/client/token";
import StarRatingInput from "./StarRatingInput";

interface ReviewFormProps {
  inquiryItemId: string;
  onSubmitted?: () => void;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

function parseErrorMessage(body: { message?: unknown }): string {
  const message = body.message;
  if (Array.isArray(message)) {
    return message.map(String).join(", ");
  }
  if (typeof message === "string" && message.trim()) {
    return message;
  }
  return "Failed to submit review";
}

export default function ReviewForm({ inquiryItemId, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!inquiryItemId) {
      setErrorMsg("Missing inquiry item. You can only review after a confirmed booking.");
      setSubmitState("error");
      return;
    }

    setSubmitState("submitting");
    setErrorMsg(null);

    const token = getClientToken();
    if (!token) {
      setErrorMsg("You must be logged in to submit a review.");
      setSubmitState("error");
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          inquiryItemId,
          ...(rating > 0 ? { rating } : {}),
          ...(text.trim() ? { text: text.trim() } : {}),
        }),
      });

      if (!res.ok) {
        const body = (await res.json()) as { message?: unknown };
        throw new Error(parseErrorMessage(body));
      }

      setSubmitState("success");
      onSubmitted?.();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setSubmitState("error");
    }
  }

  if (submitState === "success") {
    return (
      <div className="rounded-lg border border-[#C8A97A]/30 bg-[#FAFAF8] p-4 text-sm text-[#0A0A0A]">
        <p className="font-medium">Review submitted</p>
        <p className="text-[#737373] mt-1">
          Your review is pending admin approval and will appear on the talent&apos;s profile once approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="font-ui text-[11px] tracking-[0.15em] uppercase text-[#0A0A0A] mb-2">
          Your rating <span className="normal-case tracking-normal text-[#737373]">(optional)</span>
        </p>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <div>
        <label
          htmlFor={`review-text-${inquiryItemId}`}
          className="font-ui text-[11px] tracking-[0.15em] uppercase text-[#0A0A0A]"
        >
          Review <span className="normal-case tracking-normal text-[#737373]">(optional)</span>
        </label>
        <textarea
          id={`review-text-${inquiryItemId}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={600}
          placeholder="Share your experience…"
          className="mt-2 w-full border border-[#D4D4D4] px-3 py-2 text-sm text-[#0A0A0A] focus:border-[#C8A97A] focus:outline-none resize-none"
        />
      </div>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={submitState === "submitting"}
        className="px-6 py-2.5 bg-[#0A0A0A] text-white text-sm font-ui tracking-[0.1em] uppercase disabled:opacity-50 hover:bg-[#1A1A1A] transition-colors"
      >
        {submitState === "submitting" ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
