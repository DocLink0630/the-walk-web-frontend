"use client";

import Link from "next/link";
import { useState } from "react";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/password-reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message ? String(data.message) : "Could not send reset email");
      } else {
        setMessage(
          data?.message ??
            "If an account with that email exists, a password reset link has been sent.",
        );
      }
    } catch {
      setError("Network error. Please try again.");
    }

    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-28 pb-16 px-4">
      <div className="max-w-md mx-auto">
        <p className="font-ui text-[8px] tracking-[0.35em] uppercase text-[#C8A97A] mb-2">
          Account
        </p>
        <h1 className="font-display text-3xl font-light text-[#0A0A0A] mb-3">
          Forgot password
        </h1>
        <p className="font-ui text-sm text-[#4A4A4A] mb-8 leading-relaxed">
          Enter your email and we&apos;ll send a link to reset your password. The link expires in
          one hour.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-[#E0E0E0] p-6">
          <div>
            <label
              htmlFor="forgot-email"
              className="block font-ui text-[10px] tracking-[0.15em] uppercase text-[#0A0A0A] mb-1.5"
            >
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#E0E0E0] px-3 py-2.5 font-ui text-sm outline-none focus:border-[#C8A97A]"
            />
          </div>

          {error && (
            <p className="font-ui text-sm text-red-700 border border-red-200 bg-red-50 px-3 py-2">
              {error}
            </p>
          )}
          {message && (
            <p className="font-ui text-sm text-[#0A0A0A] border border-[#C8A97A]/40 bg-[#FFFBF5] px-3 py-2">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={CTA_PRIMARY_FILLED + " w-full py-3 disabled:opacity-50"}
          >
            {submitting ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 font-ui text-[11px] text-center">
          <Link href="/?login=1" className="text-[#9A7329] underline underline-offset-2">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
