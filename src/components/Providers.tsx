"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { BookingProvider } from "@/context/BookingContext";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import ScrollTriggerResync from "@/components/ScrollTriggerResync";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <BookingProvider>
        <CustomCursor />
        <ScrollTriggerResync />
        <Navbar />
        {children}
      </BookingProvider>
    </AuthProvider>
  );
}
