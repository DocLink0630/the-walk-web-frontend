"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ShoppingBag, Check } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import type { PublicServiceProvider, ServiceProviderType } from "@/types/public-service-provider";
import type { TalentProfile } from "@/types/talents";

interface ServiceProvidersPageContentProps {
  type: ServiceProviderType;
}

const COPY = {
  beautician: {
    title: "Beauticians",
    subtitle: "Professional beauty artists for runway, editorial, and events.",
    eyebrow: "The Walk — Beauty",
    emptyText: "No beauticians are available yet.",
    apiPath: "/api/public/beauticians",
  },
  photographer: {
    title: "Photographers",
    subtitle: "Talented photographers for fashion, editorial, and commercial shoots.",
    eyebrow: "The Walk — Photography",
    emptyText: "No photographers are available yet.",
    apiPath: "/api/public/photographers",
  },
} as const;

function mapToTalentProfile(provider: PublicServiceProvider, type: ServiceProviderType): TalentProfile {
  const mainImage = provider.imageUrl ?? "";
  const images = provider.portfolioImages.length > 0 ? provider.portfolioImages : mainImage ? [mainImage] : [];
  return {
    id: provider.userId,
    name: provider.name,
    type,
    images,
    mainImage,
    portfolio: images,
    bio: provider.shortBio ?? "",
    available: true,
    priceRate: provider.rateCard ?? undefined,
    specialty: provider.specialties.join(", "),
    experience: provider.yearsOfExperience != null ? `${provider.yearsOfExperience} years` : undefined,
  };
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] bg-[#F0F0F0] border border-[#E8E8E8] animate-pulse" />
          <div className="mt-3 h-3 w-2/3 bg-[#F0F0F0] animate-pulse" />
        </div>
      ))}
    </div>
  );
}

interface DetailModalProps {
  provider: PublicServiceProvider;
  type: ServiceProviderType;
  onClose: () => void;
}

function ServiceProviderDetailModal({ provider, type, onClose }: DetailModalProps) {
  const { addToCart, removeFromCart, isInCart } = useBooking();
  const talent = mapToTalentProfile(provider, type);
  const inCart = isInCart(talent.id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-white w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-[#9A9A9A] hover:text-[#0A0A0A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row gap-0">
          {provider.imageUrl ? (
            <div className="relative w-full sm:w-56 shrink-0 aspect-[3/4] sm:aspect-auto bg-[#F5F5F5]">
              <Image
                src={provider.imageUrl}
                alt={provider.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 224px"
              />
            </div>
          ) : (
            <div className="w-full sm:w-56 shrink-0 aspect-[3/4] sm:aspect-auto bg-[#F5F5F5] flex items-center justify-center">
              <span className="font-display text-4xl text-[#C8A97A]">
                {provider.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="flex-1 p-6 space-y-4">
            <div>
              <p className="font-ui text-[9px] tracking-[0.3em] uppercase text-[#C8A97A] mb-1">
                {type === "beautician" ? "Beauty Artist" : "Photographer"}
              </p>
              <h2 className="font-display text-2xl font-light text-[#0A0A0A]">{provider.name}</h2>
            </div>

            {provider.specialties.length > 0 && (
              <div>
                <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-1">Specialties</p>
                <p className="font-ui text-[11px] text-[#0A0A0A]">{provider.specialties.join(", ")}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {provider.yearsOfExperience != null && (
                <div>
                  <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-0.5">Experience</p>
                  <p className="font-ui text-[11px] text-[#0A0A0A]">{provider.yearsOfExperience} years</p>
                </div>
              )}
              {provider.location && (
                <div>
                  <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-0.5">Location</p>
                  <p className="font-ui text-[11px] text-[#0A0A0A]">{provider.location}</p>
                </div>
              )}
              {provider.rateCard && (
                <div>
                  <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-0.5">Rate</p>
                  <p className="font-ui text-[11px] text-[#0A0A0A]">{provider.rateCard}</p>
                </div>
              )}
              {type === "photographer" && provider.equipmentOverview && (
                <div className="col-span-2">
                  <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-0.5">Equipment</p>
                  <p className="font-ui text-[11px] text-[#0A0A0A]">{provider.equipmentOverview}</p>
                </div>
              )}
            </div>

            {provider.shortBio && (
              <div>
                <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-1">About</p>
                <p className="font-ui text-[11px] text-[#4A4A4A] leading-relaxed">{provider.shortBio}</p>
              </div>
            )}

            {provider.portfolioImages.length > 1 && (
              <div>
                <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-2">Portfolio</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {provider.portfolioImages.slice(0, 6).map((url, i) => (
                    <div key={i} className="relative aspect-square bg-[#F5F5F5]">
                      <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => inCart ? removeFromCart(talent.id) : addToCart(talent)}
              className={`w-full font-ui text-[10px] tracking-[0.2em] uppercase px-6 py-3 transition-colors flex items-center justify-center gap-2 ${
                inCart
                  ? "bg-[#C8A97A] text-white hover:bg-[#b8985e]"
                  : "bg-[#0A0A0A] text-white hover:bg-[#C8A97A]"
              }`}
            >
              {inCart ? <><Check className="w-3.5 h-3.5" /> Added to inquiry</> : <><ShoppingBag className="w-3.5 h-3.5" /> Add to inquiry</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceProvidersPageContent({ type }: ServiceProvidersPageContentProps) {
  const copy = COPY[type];
  const { isInCart } = useBooking();

  const [providers, setProviders] = useState<PublicServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PublicServiceProvider | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const sp = new URLSearchParams({ limit: "100" });
      if (search.trim()) sp.set("search", search.trim());
      const res = await fetch(`${copy.apiPath}?${sp}`);
      if (!res.ok) { setError("Failed to load."); setLoading(false); return; }
      const json = (await res.json()) as { data: PublicServiceProvider[] };
      setProviders(json.data ?? []);
    } catch {
      setError("Network error.");
    }
    setLoading(false);
  }, [copy.apiPath, search]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Hero */}
        <div className="mb-12 text-center space-y-2">
          <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A]">{copy.eyebrow}</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-[#0A0A0A]">{copy.title}</h1>
          <p className="font-ui text-[11px] tracking-[0.08em] text-[#6B6B6B] max-w-md mx-auto">{copy.subtitle}</p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-sm mx-auto">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${copy.title.toLowerCase()}…`}
            className="w-full border border-[#E0E0E0] bg-white px-4 py-2.5 font-ui text-[11px] outline-none focus:border-[#C8A97A] transition-colors"
          />
        </div>

        {loading ? (
          <GridSkeleton />
        ) : error ? (
          <p className="text-center font-ui text-sm text-red-600 py-16">{error}</p>
        ) : providers.length === 0 ? (
          <p className="text-center font-ui text-sm text-[#9A9A9A] py-16">{copy.emptyText}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {providers.map((p) => {
              const talent = mapToTalentProfile(p, type);
              const inCart = isInCart(talent.id);
              return (
                <div
                  key={p.id}
                  className="group cursor-pointer"
                  onClick={() => setSelected(p)}
                >
                  <div className="relative aspect-[3/4] bg-[#F0F0F0] overflow-hidden border border-[#E8E8E8]">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-display text-5xl text-[#C8A97A]">
                          {p.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {inCart && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[#C8A97A] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="mt-3 space-y-0.5">
                    <p className="font-display text-base text-[#0A0A0A] group-hover:text-[#C8A97A] transition-colors">
                      {p.name}
                    </p>
                    {p.specialties.length > 0 && (
                      <p className="font-ui text-[9px] tracking-[0.1em] uppercase text-[#9A9A9A] truncate">
                        {p.specialties.slice(0, 2).join(" · ")}
                      </p>
                    )}
                    {p.rateCard && (
                      <p className="font-ui text-[10px] text-[#6B6B6B]">{p.rateCard}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <ServiceProviderDetailModal
          provider={selected}
          type={type}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}
