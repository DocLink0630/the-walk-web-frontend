"use client";

import { useState } from "react";
import { getClientToken } from "@/lib/client/token";
import { PASSWORD_HINT, validatePassword } from "@/lib/auth/password";

export default function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setMessage({ type: "err", text: passwordError });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "err", text: "New passwords do not match." });
      return;
    }

    const token = getClientToken();
    if (!token) {
      setMessage({ type: "err", text: "Your session has expired. Please sign in again." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({
          type: "err",
          text: data?.message ? String(data.message) : "Could not update password",
        });
      } else {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage({ type: "ok", text: "Password updated." });
      }
    } catch {
      setMessage({ type: "err", text: "Network error." });
    }
    setSaving(false);
  }

  const inputCls =
    "w-full border border-[#E0E0E0] px-3 py-2.5 font-ui text-[10px] tracking-[0.05em] bg-white outline-none focus:border-[#C8A97A] transition-colors";

  return (
    <section className="bg-white border border-[#E0E0E0] p-6 space-y-4">
      <div>
        <h2 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
          Password
        </h2>
        <p className="font-ui text-[10px] text-[#6B6B6B] mt-1">
          <a href="/forgot-password" className="text-[#9A7329] underline underline-offset-2">
            Forgot your password?
          </a>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block font-ui text-[9px] tracking-[0.12em] uppercase text-[#0A0A0A] mb-1">
            Current password
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block font-ui text-[9px] tracking-[0.12em] uppercase text-[#0A0A0A] mb-1">
            New password
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            className={inputCls}
          />
          <p className="font-ui text-[9px] text-[#9A9A9A] mt-1">{PASSWORD_HINT}</p>
        </div>
        <div>
          <label className="block font-ui text-[9px] tracking-[0.12em] uppercase text-[#0A0A0A] mb-1">
            Confirm new password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className={inputCls}
          />
        </div>

        {message && (
          <p
            className={
              "font-ui text-[10px] px-3 py-2 border " +
              (message.type === "ok"
                ? "border-[#C8A97A]/40 bg-[#FFFBF5] text-[#0A0A0A]"
                : "border-red-200 bg-red-50 text-red-700")
            }
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="font-ui text-[9px] tracking-[0.2em] uppercase px-5 py-2.5 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] hover:text-[#0A0A0A] disabled:opacity-50 transition-colors"
        >
          {saving ? "Updating…" : "Update password"}
        </button>
      </form>
    </section>
  );
}
