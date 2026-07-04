"use client";

import { useCallback, useEffect, useState } from "react";
import type { MembershipPackage } from "./MembershipPackagesSection";
import { DEFAULT_PACKAGES } from "./MembershipPackagesSection";

const DISMISS_KEY = "thewalk_membership_popup_dismissed";

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

interface MembershipPackagesModalProps {
  modelName: string;
}

export default function MembershipPackagesModal({ modelName }: MembershipPackagesModalProps) {
  const [packages, setPackages] = useState<MembershipPackage[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) return;

    fetchPackages().then((pkgs) => {
      setPackages(pkgs.length > 0 ? pkgs : DEFAULT_PACKAGES);
      setOpen(true);
    });
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  }, []);

  if (!open || packages.length === 0) return null;

  const firstName = modelName.split(/\s+/)[0] || "there";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && dismiss()}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white flex flex-col overflow-hidden">
        {/* Close button */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="bg-[#0A0A0A] px-6 py-8 text-center shrink-0">
          <p className="font-ui text-[8px] tracking-[0.35em] uppercase text-[#C8A97A] mb-2">
            Welcome to THE WALK
          </p>
          <h2 className="font-display text-2xl font-light text-white mb-2">
            Congratulations, {firstName}!
          </h2>
          <p className="font-ui text-[10px] text-white/70 leading-relaxed max-w-sm mx-auto">
            Your profile is now active. Explore our membership packages to boost your visibility
            and unlock premium opportunities.
          </p>
        </div>

        {/* Scrollable packages */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          <p className="font-ui text-[9px] text-[#9A9A9A] text-center mt-5">
            To subscribe, contact us at{" "}
            <a
              href="https://wa.me/94772117088"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C8A97A] hover:underline"
            >
              WhatsApp 0772117088
            </a>
          </p>
        </div>

        {/* Footer actions */}
        <div className="border-t border-[#E0E0E0] px-6 py-4 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={dismiss}
            className="flex-1 font-ui text-[9px] tracking-[0.2em] uppercase px-4 py-3 border border-[#E0E0E0] text-[#4A4A4A] hover:border-[#0A0A0A] transition-colors text-center"
          >
            Maybe later
          </button>
          <a
            href="https://wa.me/94772117088"
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="flex-1 font-ui text-[9px] tracking-[0.2em] uppercase px-4 py-3 bg-[#C8A97A] text-white hover:bg-[#9A7329] transition-colors text-center block"
          >
            Contact to Subscribe
          </a>
        </div>
      </div>
    </div>
  );
}

function PackageCard({ pkg }: { pkg: MembershipPackage }) {
  const durationLabel =
    pkg.durationMonths === 1
      ? "1 month"
      : pkg.durationMonths === 12
        ? "1 year"
        : `${pkg.durationMonths} months`;

  return (
    <div
      className={[
        "border p-5 flex flex-col gap-3",
        pkg.isPriorityListing ? "border-[#C8A97A] bg-[#FDFBF7]" : "border-[#E0E0E0] bg-white",
      ].join(" ")}
    >
      <div className="flex flex-wrap gap-1.5">
        {pkg.isTrial && (
          <span className="font-ui text-[7px] tracking-[0.15em] uppercase px-1.5 py-0.5 bg-[#F5F0E8] text-[#9A7329] border border-[#C8A97A]/40">
            Free Trial
          </span>
        )}
        {pkg.isPriorityListing && (
          <span className="font-ui text-[7px] tracking-[0.15em] uppercase px-1.5 py-0.5 bg-[#C8A97A] text-white">
            Priority
          </span>
        )}
      </div>

      <div>
        <h3 className="font-display text-lg font-light text-[#0A0A0A] leading-snug">{pkg.name}</h3>
        <p className="font-ui text-[9px] text-[#9A9A9A] mt-0.5">{durationLabel}</p>
      </div>

      <p className="font-display text-xl font-light text-[#C8A97A]">{pkg.price}</p>

      {pkg.description && (
        <p className="font-ui text-[10px] text-[#4A4A4A] leading-relaxed">{pkg.description}</p>
      )}

      {pkg.features.length > 0 && (
        <ul className="space-y-1">
          {pkg.features.map((f, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-[#C8A97A] text-[10px] mt-0.5 shrink-0">✓</span>
              <span className="font-ui text-[9px] text-[#4A4A4A] leading-relaxed">{f}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
