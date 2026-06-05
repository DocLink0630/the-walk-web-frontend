"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/stores/adminAuthStore";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const { session, logout } = useAdminAuthStore();

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="border-b border-[#E0E0E0] bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-display text-lg font-light text-[#0A0A0A] tracking-widest"
            >
              THE WALK
            </Link>
            <span className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#C8A97A]">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            {session?.email && (
              <span className="font-ui text-[9px] tracking-[0.1em] text-[#4A4A4A] hidden sm:inline">
                {session.email}
              </span>
            )}
            <Link
              href="/"
              className="font-ui text-[9px] tracking-[0.2em] uppercase text-[#9A9A9A] hover:text-[#0A0A0A] transition-colors"
            >
              Public site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="font-ui text-[9px] tracking-[0.2em] uppercase px-4 py-2 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>
    </div>
  );
}
