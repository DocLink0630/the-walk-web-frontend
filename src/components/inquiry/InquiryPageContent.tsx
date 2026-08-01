"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { submitInquiry } from "@/lib/client/inquiries-api";
import {
  downloadInquiryCartPdf,
  downloadInquiryModelsPdf,
} from "@/lib/pdf/download-pdf";

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function InquiryExportButton({
  onClick,
  disabled,
  loading,
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="shrink-0 font-ui text-[11px] tracking-[0.2em] uppercase px-5 py-2.5 bg-[#0A0A0A] text-white border border-[#C8A97A] hover:bg-[#C8A97A] hover:text-[#0A0A0A] disabled:opacity-50 transition-colors"
    >
      {loading ? "Exporting…" : "Export"}
    </button>
  );
}

export default function InquiryPageContent() {
  const { bookingCart, removeFromCart, clearCart } = useBooking();
  const { isAuthenticated, isClient, isLoading, user } = useAuth();
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExportPdf(inquiryId?: string | null) {
    if (bookingCart.length === 0 && !inquiryId) {
      setError("Add at least one talent to export a PDF.");
      return;
    }

    setExportingPdf(true);
    setError(null);

    const result = inquiryId
      ? await downloadInquiryModelsPdf(inquiryId)
      : await downloadInquiryCartPdf({
          phone,
          eventDate,
          message,
          cart: bookingCart,
          clientName: user?.name,
          clientEmail: user?.email,
          inquiryId: inquiryId ?? undefined,
        });

    setExportingPdf(false);
    if (!result.ok) {
      setError(result.message);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!phone.trim()) {
      setError("Phone number is required.");
      return;
    }
    if (!isValidPhone(phone)) {
      setError("Enter a valid phone number (7–15 digits).");
      return;
    }
    if (bookingCart.length === 0) {
      setError("Add at least one talent to your inquiry cart.");
      return;
    }

    setSubmitting(true);
    const result = await submitInquiry({
      phone: phone.trim(),
      eventDate: eventDate || undefined,
      message: message.trim() || undefined,
      items: bookingCart.map(({ talent }) => ({
        modelUserId: talent.id,
        modelName: talent.name,
        modelType: talent.type,
        category: talent.category,
        priceRate: talent.priceRate,
      })),
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSubmittedInquiryId(result.inquiry.id);
    clearCart();
    setSubmitted(true);
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="font-ui text-sm text-[#4A4A4A]">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated || !isClient) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 md:py-16 text-center space-y-6">
        <p className="font-ui text-[11px] tracking-[0.2em] uppercase text-[#9A7329]">
          Booking inquiry
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-light text-[#0A0A0A]">
          Sign in as a client to submit an inquiry
        </h1>
        <p className="font-ui text-sm text-[#4A4A4A] leading-relaxed">
          Create a client account to book models, beauticians, and photographers.
          {bookingCart.length > 0 &&
            ` You have ${bookingCart.length} talent${bookingCart.length === 1 ? "" : "s"} in your cart.`}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/register/client"
            data-cursor="button"
            className={CTA_PRIMARY_FILLED + " text-center px-8 py-3"}
          >
            Register as client
          </Link>
          <Link
            href="/?login=1"
            className="font-ui text-[11px] tracking-[0.15em] uppercase border border-[#0A0A0A] px-8 py-3 hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const canExport = submitted ? Boolean(submittedInquiryId) : bookingCart.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-10">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 min-w-0 flex-1">
          <p className="font-ui text-[11px] tracking-[0.2em] uppercase text-[#9A7329]">
            Booking inquiry
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-light text-[#0A0A0A]">
            Your selected talent
          </h1>
          <p className="font-ui text-sm text-[#4A4A4A]">
            Review your cart and add event details. Our team will follow up to confirm
            availability and rates.
          </p>
        </div>
        {canExport ? (
          <InquiryExportButton
            onClick={() =>
              void handleExportPdf(submitted ? submittedInquiryId : undefined)
            }
            loading={exportingPdf}
          />
        ) : null}
      </div>

      {error ? (
        <p className="font-ui text-sm text-red-700 border border-red-200 bg-red-50 px-4 py-3">
          {error}
        </p>
      ) : null}

      {bookingCart.length === 0 && !submitted ? (
        <div className="border border-[#E0E0E0] bg-white p-8 text-center space-y-4">
          <p className="font-ui text-sm text-[#4A4A4A]">
            Your inquiry cart is empty. Browse talent and add profiles to inquire.
          </p>
          <Link
            href="/models"
            className="font-ui text-[11px] tracking-[0.15em] uppercase text-[#9A7329] underline underline-offset-4"
          >
            Browse models
          </Link>
        </div>
      ) : submitted ? (
        <div className="space-y-6">
          <div className="border border-[#C8A97A]/40 bg-[#C8A97A]/10 px-6 py-6 space-y-3">
            <p className="font-ui text-sm text-[#0A0A0A] font-normal">
              Your inquiry has been submitted.
            </p>
            <p className="font-ui text-xs text-[#4A4A4A] leading-relaxed">
              Our team will review your request and contact you shortly. You can track
              status on your{" "}
              <Link href="/client/profile" className="text-[#9A7329] underline">
                client profile
              </Link>
              .
            </p>
          </div>

          <Link
            href="/models"
            className="inline-block font-ui text-[11px] tracking-[0.15em] uppercase text-[#9A7329] underline underline-offset-4"
          >
            Browse more talent
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {bookingCart.map(({ talent }) => (
              <li
                key={talent.id}
                className="flex gap-4 border border-[#E0E0E0] bg-white p-4"
              >
                <div className="relative w-20 h-24 shrink-0 bg-[#F5F5F5]">
                  <Image
                    src={talent.mainImage}
                    alt={talent.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg text-[#0A0A0A]">{talent.name}</p>
                  <p className="font-ui text-[11px] tracking-[0.1em] uppercase text-[#6B6B6B] capitalize">
                    {talent.type}
                    {talent.category ? ` · ${talent.category}` : ""}
                  </p>
                  {talent.priceRate && (
                    <p className="font-ui text-xs text-[#4A4A4A] mt-1">{talent.priceRate}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(talent.id)}
                  className="font-ui text-[10px] tracking-[0.1em] uppercase text-[#9A9A9A] hover:text-red-600 shrink-0 self-start"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit} className="space-y-6 border-t border-[#E0E0E0] pt-8">
            <div className="space-y-1.5">
              <label
                htmlFor="inquiry-phone"
                className="block font-ui text-[11px] tracking-[0.12em] uppercase text-[#0A0A0A]"
              >
                Phone number
              </label>
              <input
                id="inquiry-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+94 77 123 4567"
                required
                className="w-full border border-[#D4D4D4] bg-white px-4 py-3 font-ui text-sm text-[#0A0A0A] outline-none focus:border-[#C8A97A]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="inquiry-date"
                className="block font-ui text-[11px] tracking-[0.12em] uppercase text-[#0A0A0A]"
              >
                Event or shoot date
              </label>
              <input
                id="inquiry-date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full border border-[#D4D4D4] bg-white px-4 py-3 font-ui text-sm text-[#0A0A0A] outline-none focus:border-[#C8A97A]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="inquiry-message"
                className="block font-ui text-[11px] tracking-[0.12em] uppercase text-[#0A0A0A]"
              >
                Project details
              </label>
              <textarea
                id="inquiry-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Describe your event, location, duration, and any specific requirements."
                className="w-full border border-[#D4D4D4] bg-white px-4 py-3 font-ui text-sm text-[#0A0A0A] outline-none focus:border-[#C8A97A] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              data-cursor="button"
              className={CTA_PRIMARY_FILLED + " w-full sm:w-auto px-10 py-3.5 disabled:opacity-50"}
            >
              {submitting ? "Submitting…" : "Submit inquiry"}
            </button>

            <button
              type="button"
              onClick={clearCart}
              className="font-ui text-[10px] tracking-[0.15em] uppercase text-[#9A9A9A] hover:text-[#0A0A0A]"
            >
              Clear cart
            </button>
          </form>
        </>
      )}
    </div>
  );
}
