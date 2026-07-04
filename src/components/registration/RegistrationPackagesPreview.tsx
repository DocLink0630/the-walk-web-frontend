"use client";

import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages().then((pkgs) => {
      setPackages(pkgs.length > 0 ? pkgs : DEFAULT_PACKAGES);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (packages.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      <div className="border-t border-[#E0E0E0] pt-6">
        <p className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#C8A97A] mb-1 text-center">
          Our Packages
        </p>
        <h3 className="font-display text-xl font-light text-[#0A0A0A] text-center">
          Membership Plans
        </h3>
        <p className="font-ui text-[10px] text-[#6B6B6B] mt-1 text-center max-w-sm mx-auto">
          After your application is approved, choose a plan to maximise your visibility with THE WALK Agency.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={[
              "border p-4 flex flex-col gap-2",
              pkg.isPriorityListing
                ? "border-[#C8A97A] bg-[#FDFBF7]"
                : "border-[#E0E0E0] bg-white",
            ].join(" ")}
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-1">
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

            {/* Name */}
            <h4 className="font-display text-base font-light text-[#0A0A0A] leading-snug">
              {pkg.name}
            </h4>

            {/* Price */}
            <p className="font-display text-lg font-light text-[#C8A97A]">{pkg.price}</p>

            {/* Duration */}
            <p className="font-ui text-[8px] tracking-[0.1em] uppercase text-[#9A9A9A]">
              {pkg.durationMonths === 1
                ? "1 month"
                : pkg.durationMonths === 12
                  ? "1 year"
                  : `${pkg.durationMonths} months`}
            </p>

            {/* Features */}
            {pkg.features.length > 0 && (
              <ul className="space-y-1 mt-1">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#C8A97A] text-[9px] mt-0.5 shrink-0">✓</span>
                    <span className="font-ui text-[9px] text-[#4A4A4A] leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <p className="font-ui text-[9px] text-[#9A9A9A] text-center">
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
    </div>
  );
}
