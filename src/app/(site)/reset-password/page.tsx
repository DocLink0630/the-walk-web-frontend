"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import { PASSWORD_HINT, validatePassword } from "@/lib/auth/password";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!tokenFromUrl) {
      setError("This reset link is invalid. Request a new link from the forgot password page.");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenFromUrl, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message ? String(data.message) : "Could not reset password");
      } else {
        setDone(true);
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  }

  if (done) {
    return (
      <div className="space-y-4">
        <p className="font-ui text-sm text-[#0A0A0A] border border-[#C8A97A]/40 bg-[#FFFBF5] px-4 py-3">
          Your password has been updated. You can sign in with your new password.
        </p>
        <Link
          href="/?login=1"
          className={
            CTA_PRIMARY_FILLED +
            " inline-block text-center w-full py-3 font-ui text-[10px] tracking-[0.2em] uppercase"
          }
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-[#E0E0E0] p-6">
      {!tokenFromUrl && (
        <p className="font-ui text-sm text-red-700 border border-red-200 bg-red-50 px-3 py-2">
          Missing reset token. Open the link from your email or{" "}
          <Link href="/forgot-password" className="underline">
            request a new one
          </Link>
          .
        </p>
      )}

      <div>
        <label
          htmlFor="new-password"
          className="block font-ui text-[10px] tracking-[0.15em] uppercase text-[#0A0A0A] mb-1.5"
        >
          New password
        </label>
        <input
          id="new-password"
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          className="w-full border border-[#E0E0E0] px-3 py-2.5 font-ui text-sm outline-none focus:border-[#C8A97A]"
        />
        <p className="font-ui text-[10px] text-[#6B6B6B] mt-1">{PASSWORD_HINT}</p>
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="block font-ui text-[10px] tracking-[0.15em] uppercase text-[#0A0A0A] mb-1.5"
        >
          Confirm password
        </label>
        <input
          id="confirm-password"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          className="w-full border border-[#E0E0E0] px-3 py-2.5 font-ui text-sm outline-none focus:border-[#C8A97A]"
        />
      </div>

      {error && (
        <p className="font-ui text-sm text-red-700 border border-red-200 bg-red-50 px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !tokenFromUrl}
        className={CTA_PRIMARY_FILLED + " w-full py-3 disabled:opacity-50"}
      >
        {submitting ? "Updating…" : "Set new password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-28 pb-16 px-4">
      <div className="max-w-md mx-auto">
        <p className="font-ui text-[8px] tracking-[0.35em] uppercase text-[#C8A97A] mb-2">
          Account
        </p>
        <h1 className="font-display text-3xl font-light text-[#0A0A0A] mb-8">
          Reset password
        </h1>
        <Suspense
          fallback={
            <p className="font-ui text-sm text-[#6B6B6B]">Loading…</p>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
