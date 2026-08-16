"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { BookingProvider } from "@/context/BookingContext";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import ShootCompletedReviewPrompt from "@/components/client/ShootCompletedReviewPrompt";
import ScrollTriggerResync from "@/components/ScrollTriggerResync";

function PublicSiteShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <BookingProvider>
        <CustomCursor />
        <ScrollTriggerResync />
        <Navbar />
        <ShootCompletedReviewPrompt />
        {children}
      </BookingProvider>
    </AuthProvider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return <PublicSiteShell>{children}</PublicSiteShell>;
}
