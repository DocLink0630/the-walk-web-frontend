"use client";

import { useEffect, useState, useCallback } from "react";
import type { MembershipPackage } from "@/components/model/MembershipPackagesSection";
import { DEFAULT_PACKAGES } from "@/components/model/MembershipPackagesSection";

async function fetchPackages(): Promise<MembershipPackage[]> {
  try {
    const res = await fetch("/api/membership-packages");
    if (!res.ok) return [];
    const json = await res.json();
    return (json?.data as MembershipPackage[]) ?? [];
  } catch {
    return [];
  }
}

export default function RegistrationPackagesPreview() {
  const [packages, setPackages] = useState<MembershipPackage[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchPackages().then((pkgs) => {
      setPackages(pkgs.length > 0 ? pkgs : DEFAULT_PACKAGES);
      setOpen(true);
    });
  }, []);

  const close = useCallback(() => setOpen(false), []);

  if (!open || packages.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center text-[#9A9A9A] hover:text-[#0A0A0A] transition-colors"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Header */}
        <div className="px-6 pt-8 pb-4 text-center border-b border-[#E0E0E0]">
          <p className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#C8A97A] mb-1">
            Our Packages
          </p>
          <h2 className="font-display text-2xl font-light text-[#0A0A0A]">
            Membership Plans
          </h2>
          <p className="font-ui text-xs text-[#6B6B6B] mt-2 max-w-md mx-auto leading-relaxed">
            After your application is approved, choose a plan to maximise your
            visibility with THE WALK Agency.
          </p>
        </div>

        {/* Package cards */}
        <div className="grid gap-4 sm:grid-cols-3 p-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={[
                "border p-5 flex flex-col gap-2.5 transition-shadow hover:shadow-md",
                pkg.isPriorityListing
                  ? "border-[#C8A97A] bg-[#FDFBF7]"
                  : "border-[#E0E0E0] bg-white",
              ].join(" ")}
            >
              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {pkg.isTrial && (
                  <span className="font-ui text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 bg-[#F5F0E8] text-[#9A7329] border border-[#C8A97A]/40">
                    Free Trial
                  </span>
                )}
                {pkg.isPriorityListing && (
                  <span className="font-ui text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 bg-[#C8A97A] text-white">
                    Priority
                  </span>
                )}
              </div>

              {/* Name */}
              <h3 className="font-display text-lg font-light text-[#0A0A0A] leading-snug">
                {pkg.name}
              </h3>

              {/* Price */}
              <p className="font-display text-xl font-light text-[#C8A97A]">
                {pkg.price}
              </p>

              {/* Duration */}
              <p className="font-ui text-[9px] tracking-[0.1em] uppercase text-[#9A9A9A]">
                {pkg.durationMonths === 1
                  ? "1 month"
                  : pkg.durationMonths === 12
                    ? "1 year"
                    : `${pkg.durationMonths} months`}
              </p>

              {/* Features */}
              {pkg.features.length > 0 && (
                <ul className="space-y-1.5 mt-1 flex-1">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#C8A97A] text-xs mt-0.5 shrink-0">
                        &#10003;
                      </span>
                      <span className="font-ui text-[10px] text-[#4A4A4A] leading-relaxed">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex flex-col items-center gap-3">
          <p className="font-ui text-[10px] text-[#9A9A9A] text-center">
            Questions? Contact us at{" "}
            <a
              href="https://wa.me/94772117088"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C8A97A] hover:underline"
            >
              WhatsApp 0772117088
            </a>
          </p>
          <button
            onClick={close}
            className="font-ui text-[11px] tracking-[0.15em] uppercase px-10 py-3 bg-[#0A0A0A] text-white hover:bg-[#2A2A2A] transition-colors"
          >
            Continue Registration
          </button>
        </div>
      </div>
    </div>
  );
}
