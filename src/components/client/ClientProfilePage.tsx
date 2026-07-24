"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchOwnInquiries } from "@/lib/client/inquiries-api";
import {
  fetchOwnClientProfile,
  patchOwnClientProfile,
} from "@/lib/client/profile-api";
import { INQUIRY_STATUS_COLORS, INQUIRY_STATUS_LABELS } from "@/lib/inquiry/status";
import ReviewForm from "@/components/reviews/ReviewForm";
import { downloadInquiryModelsPdf } from "@/lib/pdf/download-pdf";
import type { Inquiry } from "@/types/inquiry";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function ClientProfilePage() {
  const { user, isAuthenticated, isClient, isLoading } = useAuth();
  const router = useRouter();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [reviewingItemId, setReviewingItemId] = useState<string | null>(null);
  const [submittedItemIds, setSubmittedItemIds] = useState<Set<string>>(new Set());
  const [exportingInquiryId, setExportingInquiryId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/?login=1");
      return;
    }
    if (!isClient) {
      router.replace("/");
      return;
    }

    void Promise.all([fetchOwnClientProfile(), fetchOwnInquiries({ limit: 20 })]).then(
      ([profile, inquiryResult]) => {
        setFullName(profile?.clientProfile?.fullName?.trim() || user?.name || "");
        if (inquiryResult.ok) {
          setInquiries(inquiryResult.data.data);
        }
        setLoadingProfile(false);
      },
    );
  }, [isAuthenticated, isClient, isLoading, router, user?.name]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) {
      setBanner({ type: "err", text: "Name or company name is required." });
      return;
    }

    setSaving(true);
    setBanner(null);

    const result = await patchOwnClientProfile(fullName.trim());
    setSaving(false);
    setBanner(
      result.ok
        ? { type: "ok", text: "Profile updated." }
        : { type: "err", text: result.message ?? "Update failed" },
    );
  }

  async function handleExportInquiryPdf(inquiryId: string) {
    setExportingInquiryId(inquiryId);
    setBanner(null);
    const result = await downloadInquiryModelsPdf(inquiryId);
    setExportingInquiryId(null);
    if (!result.ok) {
      setBanner({ type: "err", text: result.message });
    }
  }

  const inputCls =
    "w-full border border-[#E0E0E0] px-3 py-2.5 font-ui text-[10px] tracking-[0.05em] bg-white outline-none focus:border-[#C8A97A] transition-colors";

  if (isLoading || loadingProfile) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A]">
          Loading…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        <p className="font-ui text-[8px] tracking-[0.35em] uppercase text-[#C8A97A] mb-2">
          Client account
        </p>
        <h1 className="font-display text-3xl font-light text-[#0A0A0A] mb-1">
          {fullName || user?.name || user?.email}
        </h1>
        <p className="font-ui text-[9px] tracking-[0.1em] text-[#9A9A9A] mb-8">
          {user?.email}
        </p>

        {banner && (
          <div
            className={
              (banner.type === "ok"
                ? "border border-[#C8A97A] bg-[#C8A97A]/10"
                : "border border-red-300 bg-red-50") + " px-4 py-3 mb-6"
            }
          >
            <p
              className={
                "font-ui text-[10px] " +
                (banner.type === "ok" ? "text-[#0A0A0A]" : "text-red-700")
              }
            >
              {banner.text}
            </p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <section className="bg-white border border-[#E0E0E0] p-6 space-y-5">
            <h2 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
              Profile details
            </h2>

            <div className="space-y-1">
              <label className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A]">
                Full name or company
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Acme Events Pvt Ltd"
                className={inputCls}
              />
            </div>

            {banner && (
              <div
                className={
                  banner.type === "ok"
                    ? "border border-[#C8A97A] bg-[#C8A97A]/10 px-4 py-3"
                    : "border border-red-300 bg-red-50 px-4 py-3"
                }
              >
                <p
                  className={
                    "font-ui text-[10px] " +
                    (banner.type === "ok" ? "text-[#0A0A0A]" : "text-red-700")
                  }
                >
                  {banner.text}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full font-ui text-[9px] tracking-[0.2em] uppercase px-4 py-3 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
          </section>
        </form>

        <section className="mt-8 bg-white border border-[#E0E0E0] p-6 space-y-4">
          <h2 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
            My inquiries
          </h2>

          {inquiries.length === 0 ? (
            <div className="space-y-3">
              <p className="font-ui text-[10px] text-[#4A4A4A] leading-relaxed">
                You have not submitted any booking inquiries yet.
              </p>
              <Link
                href="/models"
                className="inline-block font-ui text-[9px] tracking-[0.15em] uppercase text-[#9A7329] underline underline-offset-4"
              >
                Browse models to inquire
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {inquiries.map((inquiry) => {
                const expanded = expandedId === inquiry.id;
                return (
                  <li key={inquiry.id} className="border border-[#E0E0E0]">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(expanded ? null : inquiry.id)
                      }
                      className="w-full text-left px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <div>
                        <p className="font-ui text-[10px] text-[#0A0A0A]">
                          {formatDate(inquiry.createdAt)}
                          {inquiry.eventDate ? ` · Event ${inquiry.eventDate}` : ""}
                        </p>
                        <p className="font-ui text-[9px] text-[#6B6B6B] mt-0.5">
                          {inquiry.items.length} talent
                          {inquiry.items.length === 1 ? "" : "s"} selected
                        </p>
                      </div>
                      <span
                        className={`inline-flex self-start rounded-full border px-2.5 py-0.5 font-ui text-[8px] tracking-[0.1em] uppercase ${INQUIRY_STATUS_COLORS[inquiry.status]}`}
                      >
                        {INQUIRY_STATUS_LABELS[inquiry.status]}
                      </span>
                    </button>

                    {expanded && (
                      <div className="border-t border-[#E0E0E0] px-4 py-3 space-y-3 bg-[#FAFAFA]">
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => void handleExportInquiryPdf(inquiry.id)}
                            disabled={exportingInquiryId === inquiry.id}
                            className="font-ui text-[8px] tracking-[0.15em] uppercase px-3 py-2 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white disabled:opacity-50 transition-colors"
                          >
                            {exportingInquiryId === inquiry.id
                              ? "Preparing PDF…"
                              : "Download talent PDF"}
                          </button>
                        </div>
                        <p className="font-ui text-[9px] text-[#4A4A4A]">
                          <span className="text-[#9A9A9A] uppercase tracking-[0.1em]">
                            Phone:{" "}
                          </span>
                          {inquiry.phone}
                        </p>
                        {inquiry.message && (
                          <p className="font-ui text-[9px] text-[#4A4A4A] leading-relaxed">
                            {inquiry.message}
                          </p>
                        )}
                        <ul className="space-y-3">
                          {inquiry.items.map((item) => (
                            <li key={item.id} className="space-y-2">
                              <div className="font-ui text-[9px] text-[#0A0A0A] flex items-center justify-between gap-2 flex-wrap">
                                <span>
                                  {item.modelName}
                                  <span className="text-[#9A9A9A] capitalize">
                                    {" "}
                                    · {item.modelType}
                                  </span>
                                </span>
                                {inquiry.status === "CLOSED" && (
                                  submittedItemIds.has(item.id) ? (
                                    <span className="font-ui text-[8px] tracking-[0.1em] text-[#C8A97A]">
                                      Review submitted ✓
                                    </span>
                                  ) : reviewingItemId === item.id ? (
                                    <button
                                      type="button"
                                      onClick={() => setReviewingItemId(null)}
                                      className="font-ui text-[8px] tracking-[0.1em] uppercase text-[#737373] underline"
                                    >
                                      Cancel
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setReviewingItemId(item.id)}
                                      className="font-ui text-[8px] tracking-[0.1em] uppercase text-[#C8A97A] underline underline-offset-2"
                                    >
                                      Leave a review
                                    </button>
                                  )
                                )}
                              </div>
                              {reviewingItemId === item.id && (
                                <div className="border border-[#EBEBEB] p-4 bg-white">
                                  <ReviewForm
                                    inquiryItemId={item.id}
                                    onSubmitted={() => {
                                      setSubmittedItemIds((prev) => new Set(prev).add(item.id));
                                      setReviewingItemId(null);
                                    }}
                                  />
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/models"
            className="flex-1 text-center font-ui text-[9px] tracking-[0.2em] uppercase px-4 py-3 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            Browse models
          </Link>
          <Link
            href="/inquiry"
            className="flex-1 text-center font-ui text-[9px] tracking-[0.2em] uppercase px-4 py-3 border border-[#E0E0E0] text-[#4A4A4A] hover:border-[#C8A97A] transition-colors"
          >
            Booking inquiry
          </Link>
        </div>
      </div>
    </main>
  );
}
