"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchOwnInquiries } from "@/lib/client/inquiries-api";
import ReviewForm from "@/components/reviews/ReviewForm";
import type { Inquiry } from "@/types/inquiry";

const DISMISS_KEY = "thewalk_review_prompt_dismissed";

type PromptItem = {
  inquiryItemId: string;
  modelName: string;
  eventDate?: string | null;
};

function readDismissed(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set();
  }
}

function persistDismissed(ids: Set<string>) {
  localStorage.setItem(DISMISS_KEY, JSON.stringify([...ids]));
}

function todayYmd(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isShootDone(inquiry: Inquiry): boolean {
  if (inquiry.status === "CLOSED") return true;
  if (inquiry.status !== "CONFIRMED") return false;
  const eventDate = inquiry.eventDate?.trim();
  if (!eventDate) return false;
  return eventDate.slice(0, 10) < todayYmd();
}

function firstPromptItem(inquiries: Inquiry[], dismissed: Set<string>): PromptItem | null {
  for (const inquiry of inquiries) {
    if (!isShootDone(inquiry)) continue;
    for (const item of inquiry.items) {
      if (dismissed.has(item.id)) continue;
      return {
        inquiryItemId: item.id,
        modelName: item.modelName,
        eventDate: inquiry.eventDate,
      };
    }
  }
  return null;
}

function formatEventDate(iso: string) {
  try {
    const datePart = iso.slice(0, 10);
    const [y, m, d] = datePart.split("-").map(Number);
    if (!y || !m || !d) return iso;
    return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function ShootCompletedReviewPrompt() {
  const { isClient, isLoading } = useAuth();
  const [item, setItem] = useState<PromptItem | null>(null);

  useEffect(() => {
    if (isLoading || !isClient) return;

    let cancelled = false;

    async function load() {
      const result = await fetchOwnInquiries({ limit: 20 });
      if (cancelled || !result.ok) return;
      const next = firstPromptItem(result.data.data, readDismissed());
      if (!cancelled) setItem(next);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [isClient, isLoading]);

  const dismiss = useCallback(() => {
    setItem((current) => {
      if (current) {
        const ids = readDismissed();
        ids.add(current.inquiryItemId);
        persistDismissed(ids);
      }
      return null;
    });
  }, []);

  const markDismissed = useCallback((inquiryItemId: string) => {
    const ids = readDismissed();
    ids.add(inquiryItemId);
    persistDismissed(ids);
  }, []);

  useEffect(() => {
    if (!item) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        dismiss();
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [item, dismiss]);

  if (!item) return null;

  const dateLabel = item.eventDate?.trim() ? formatEventDate(item.eventDate) : null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Shoot completed — add a review"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#0A0A0A]/50"
        onClick={dismiss}
        aria-label="Dismiss review prompt"
      />

      <div className="relative w-full max-w-md bg-white border border-[#E0E0E0] shadow-[0_24px_80px_rgba(0,0,0,0.3)] max-h-[90dvh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 border-b border-[#E0E0E0] px-5 py-4">
          <div>
            <p className="font-ui text-[8px] tracking-[0.3em] uppercase text-[#C8A97A] mb-1">
              Shoot completed
            </p>
            <h2 className="font-display text-xl font-light text-[#0A0A0A]">
              {item.modelName}
            </h2>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 p-1.5 text-[#737373] hover:text-[#0A0A0A] transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <p className="text-sm text-[#737373] leading-relaxed">
            {dateLabel
              ? `Your shoot on ${dateLabel} was completed. Add a review for ${item.modelName}.`
              : `Your shoot date was completed. Add a review for ${item.modelName}.`}
          </p>

          <ReviewForm
            inquiryItemId={item.inquiryItemId}
            onSubmitted={() => markDismissed(item.inquiryItemId)}
          />

          <button
            type="button"
            onClick={dismiss}
            className="w-full font-ui text-[10px] tracking-[0.18em] uppercase px-4 py-3 border border-[#E0E0E0] text-[#737373] hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
