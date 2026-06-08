"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import { CONTACT_EMAIL } from "@/data/contact";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";

export default function InquiryPageContent() {
  const { bookingCart, removeFromCart, clearCart } = useBooking();
  const { isAuthenticated, isLoading } = useAuth();
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="font-ui text-sm text-[#4A4A4A]">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 md:py-16 text-center space-y-6">
        <p className="font-ui text-[11px] tracking-[0.2em] uppercase text-[#9A7329]">
          Booking inquiry
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-light text-[#0A0A0A]">
          Sign in to submit an inquiry
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-10">
      <div className="space-y-2">
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

      {bookingCart.length === 0 ? (
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
              <label htmlFor="inquiry-date" className="block font-ui text-[11px] tracking-[0.12em] uppercase text-[#0A0A0A]">
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
              <label htmlFor="inquiry-message" className="block font-ui text-[11px] tracking-[0.12em] uppercase text-[#0A0A0A]">
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

            {submitted ? (
              <div className="border border-[#C8A97A]/40 bg-[#C8A97A]/10 px-4 py-4 space-y-2">
                <p className="font-ui text-sm text-[#0A0A0A] font-normal">
                  Direct inquiry submission is coming soon.
                </p>
                <p className="font-ui text-xs text-[#4A4A4A] leading-relaxed">
                  Thank you for your interest. Our team will be in touch shortly. You can
                  also reach us at{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-[#9A7329] underline"
                  >
                    {CONTACT_EMAIL}
                  </a>{" "}
                  with your selected talent and event details.
                </p>
              </div>
            ) : (
              <button
                type="submit"
                data-cursor="button"
                className={CTA_PRIMARY_FILLED + " w-full sm:w-auto px-10 py-3"}
              >
                Submit inquiry
              </button>
            )}

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
