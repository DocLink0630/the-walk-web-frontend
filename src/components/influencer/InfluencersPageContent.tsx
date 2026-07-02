"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import InfluencerPublicModal, { type PublicInfluencer } from "./InfluencerPublicModal";

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

export default function InfluencersPageContent() {
  const [influencers, setInfluencers] = useState<PublicInfluencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PublicInfluencer | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams({ limit: "100" });
      if (search.trim()) sp.set("search", search.trim());
      const res = await fetch(`/api/public/influencers?${sp}`);
      if (res.ok) {
        const json = (await res.json()) as { data: PublicInfluencer[] };
        setInfluencers(json.data ?? []);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-20 px-4">
        <div className="max-w-screen-xl mx-auto">
          {/* Hero */}
          <div className="mb-12 text-center space-y-2">
            <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A]">
              The Walk — Brand Partnerships
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-[#0A0A0A]">
              Influencers
            </h1>
            <p className="font-ui text-[11px] tracking-[0.08em] text-[#6B6B6B] max-w-md mx-auto">
              Connect with Sri Lanka&apos;s top content creators for authentic brand partnerships.
            </p>
          </div>

          {/* Search */}
          <div className="mb-8 flex justify-center">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search influencers…"
              className="w-full max-w-sm border border-[#E0E0E0] px-4 py-2.5 font-ui text-[10px] tracking-[0.05em] bg-white outline-none focus:border-[#C8A97A] transition-colors"
            />
          </div>

          {loading ? (
            <GridSkeleton />
          ) : influencers.length === 0 ? (
            <p className="text-center font-ui text-[10px] text-[#9A9A9A] tracking-[0.1em]">
              No influencers found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {influencers.map((inf) => (
                <button
                  key={inf.userId}
                  type="button"
                  className="group text-left"
                  onClick={() => setSelected(inf)}
                >
                  <div className="relative aspect-[3/4] bg-[#1A1A1A] overflow-hidden">
                    {inf.imageUrl ? (
                      <Image
                        src={inf.imageUrl}
                        alt={inf.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-ui text-[8px] tracking-[0.2em] uppercase text-white/40">
                          No photo
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="font-display text-sm font-light text-[#0A0A0A]">{inf.name}</p>
                    {inf.contentCategories.length > 0 && (
                      <p className="font-ui text-[9px] tracking-[0.05em] text-[#9A9A9A] mt-0.5">
                        {inf.contentCategories.slice(0, 2).join(" · ")}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {selected && (
        <InfluencerPublicModal
          influencer={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
