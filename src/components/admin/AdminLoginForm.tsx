"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";

const inputCls =
  "w-full border border-[#E0E0E0] px-4 py-3 font-ui text-[11px] tracking-[0.1em] outline-none transition-colors focus:border-[#C8A97A] bg-transparent";

export default function AdminLoginForm() {
  const router = useRouter();
  const { login, fetchSession, probeAdminAccess, isLoading, error, setError } =
    useAdminAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function checkExistingSession() {
      const ok = await fetchSession();
      if (cancelled || !ok) return;
      const canAdmin = await probeAdminAccess();
      if (cancelled || !canAdmin) return;
      router.replace("/admin/dashboard");
    }

    checkExistingSession();
    return () => {
      cancelled = true;
    };
  }, [fetchSession, probeAdminAccess, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const ok = await login(email.trim(), password);
    if (ok) {
      router.push("/admin/dashboard");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-light text-[#0A0A0A] mb-1">
          Admin Sign In
        </h1>
        <p className="font-ui text-[10px] tracking-[0.15em] text-[#9A9A9A] uppercase">
          The Walk — internal dashboard
        </p>
      </div>

      <div className="space-y-1">
        <label className="block font-ui text-[9px] tracking-[0.25em] uppercase text-[#4A4A4A]">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={inputCls}
          placeholder="admin@thewalk.com"
        />
      </div>

      <div className="space-y-1">
        <label className="block font-ui text-[9px] tracking-[0.25em] uppercase text-[#4A4A4A]">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className={inputCls}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="border border-red-300 bg-red-50 px-4 py-3">
          <p className="font-ui text-[10px] tracking-[0.05em] text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        data-cursor="button"
        className={CTA_PRIMARY_FILLED + " w-full text-center disabled:opacity-60"}
      >
        {isLoading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
