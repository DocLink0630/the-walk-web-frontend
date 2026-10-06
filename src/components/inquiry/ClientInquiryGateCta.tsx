"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function openLoginModal() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("walk:open-login"));
}

export default function ClientInquiryGateCta() {
  const { isAuthenticated, logout } = useAuth();

  function handleSignInAsClient() {
    if (isAuthenticated) {
      logout();
    }
    openLoginModal();
  }

  return (
    <div className="space-y-2">
      <p className="font-ui text-[10px] text-[#4A4A4A] leading-relaxed text-center">
        Only clients can add talent to an inquiry. Sign in with a client account
        to continue.
      </p>
      <button
        type="button"
        onClick={handleSignInAsClient}
        className="block w-full min-w-0 box-border text-center font-ui text-[10px] tracking-[0.18em] uppercase px-4 py-3.5 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors"
      >
        {isAuthenticated ? "Sign out and sign in as client" : "Sign in as client"}
      </button>
      <Link
        href="/register/client"
        className="block w-full min-w-0 box-border text-center font-ui text-[10px] tracking-[0.2em] uppercase px-6 py-3 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
      >
        Register as client
      </Link>
    </div>
  );
}
