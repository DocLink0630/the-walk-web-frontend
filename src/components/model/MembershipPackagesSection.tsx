"use client";

import { useEffect, useState } from "react";

export interface MembershipPackage {
  id: string;
  name: string;
  price: string;
  durationMonths: number;
  isTrial: boolean;
  isPriorityListing: boolean;
  description: string | null;
  features: string[];
  sortOrder: number;
  isActive: boolean;
}

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

export default function MembershipPackagesSection() {
  const [packages, setPackages] = useState<MembershipPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages().then((pkgs) => {
      setPackages(pkgs);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="space-y-4">
        <h2 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
          Membership Packages
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-[#E0E0E0] p-6 animate-pulse space-y-3">
              <div className="h-3 bg-[#E0E0E0] rounded w-2/3" />
              <div className="h-8 bg-[#E0E0E0] rounded w-1/3" />
              <div className="h-2 bg-[#E0E0E0] rounded w-full" />
              <div className="h-2 bg-[#E0E0E0] rounded w-4/5" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (packages.length === 0) return null;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
          Membership Packages
        </h2>
        <p className="font-ui text-[10px] text-[#6B6B6B] mt-1">
          Choose a plan to boost your visibility and opportunities with THE WALK Agency.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      <p className="font-ui text-[9px] text-[#9A9A9A] text-center">
        To subscribe or inquire about a package, contact us at{" "}
        <a
          href="https://wa.me/94772117088"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C8A97A] hover:underline"
        >
          WhatsApp
        </a>
        .
      </p>
    </section>
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
        "relative bg-white border p-6 flex flex-col gap-4 transition-shadow hover:shadow-md",
        pkg.isPriorityListing
          ? "border-[#C8A97A]"
          : "border-[#E0E0E0]",
      ].join(" ")}
    >
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {pkg.isTrial && (
          <span className="font-ui text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 bg-[#F5F0E8] text-[#9A7329] border border-[#C8A97A]/40">
            Trial
          </span>
        )}
        {pkg.isPriorityListing && (
          <span className="font-ui text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 bg-[#C8A97A] text-white">
            Priority Listing
          </span>
        )}
      </div>

      {/* Name & duration */}
      <div>
        <p className="font-ui text-[9px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-0.5">
          {durationLabel}
        </p>
        <h3 className="font-display text-xl font-light text-[#0A0A0A] leading-snug">
          {pkg.name}
        </h3>
      </div>

      {/* Price */}
      <div className="border-t border-[#E0E0E0] pt-4">
        <p className="font-display text-2xl font-light text-[#C8A97A]">{pkg.price}</p>
        <p className="font-ui text-[9px] text-[#9A9A9A] mt-0.5">per {durationLabel}</p>
      </div>

      {/* Description */}
      {pkg.description && (
        <p className="font-ui text-[10px] text-[#4A4A4A] leading-relaxed">{pkg.description}</p>
      )}

      {/* Features */}
      {pkg.features.length > 0 && (
        <ul className="space-y-1.5 flex-1">
          {pkg.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#C8A97A] text-xs mt-0.5 shrink-0">✓</span>
              <span className="font-ui text-[10px] text-[#4A4A4A] leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <a
        href="https://wa.me/94772117088"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto block text-center font-ui text-[9px] tracking-[0.2em] uppercase px-4 py-3 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
      >
        Contact to Subscribe
      </a>
    </div>
  );
}
