"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import {
  adminAlertErr,
  adminBtnPrimary,
  adminInput,
  adminLabel,
  adminPageTitle,
} from "./admin-ui";

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h1 className={adminPageTitle + " mb-1"}>Sign in</h1>
        <p className="text-sm text-gray-500">The Walk admin dashboard</p>
      </div>

      <div>
        <label className={adminLabel}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={adminInput}
          placeholder="admin@thewalk.com"
        />
      </div>

      <div>
        <label className={adminLabel}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className={adminInput}
          placeholder="••••••••"
        />
      </div>

      {error && <div className={adminAlertErr}>{error}</div>}

      <button type="submit" disabled={isLoading} className={adminBtnPrimary + " w-full"}>
        {isLoading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
