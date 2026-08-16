"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getClientToken } from "@/lib/client/token";
import {
  fetchPublicInfluencerRoster,
  mapInfluencerToPublicModel,
} from "@/lib/public/influencers";
import {
  DEFAULT_MODEL_FILTERS,
  filterModels,
  loadModelsPageData,
  type ModelFilters,
} from "@/lib/public/models";
import type { PublicInfluencer } from "@/types/public-influencer";
import type { PublicModel } from "@/types/public-model";
import InfluencerPublicModal from "@/components/influencer/InfluencerPublicModal";
import ModelDetailModal from "./ModelDetailModal";
import ModelsFilterBar from "./ModelsFilterBar";
import ModelsHeroSection from "./ModelsHeroSection";
import ModelsMasonryGrid from "./ModelsMasonryGrid";
import ModelsRosterCta from "./ModelsRosterCta";

gsap.registerPlugin(ScrollTrigger);

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] bg-[#F0F0F0] border border-[#E8E8E8] animate-pulse" />
          <div className="mt-3 h-3 w-2/3 bg-[#F0F0F0] animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function ModelsPageContent() {
  const { isAuthenticated } = useAuth();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const [showRosterCta, setShowRosterCta] = useState(false);

  const [models, setModels] = useState<PublicModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [restricted, setRestricted] = useState(true);

  const [influencers, setInfluencers] = useState<PublicInfluencer[]>([]);
  const [influencersLoaded, setInfluencersLoaded] = useState(false);
  const [influencersLoading, setInfluencersLoading] = useState(false);
  const [influencersError, setInfluencersError] = useState<string | undefined>();

  const [filters, setFilters] = useState<ModelFilters>(DEFAULT_MODEL_FILTERS);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedModel, setSelectedModel] = useState<PublicModel | null>(null);
  const [selectedInfluencer, setSelectedInfluencer] = useState<PublicInfluencer | null>(
    null,
  );

  const isInfluencerFilter = filters.category === "Influencer";

  const loadModels = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    const result = await loadModelsPageData({
      token: getClientToken(),
    });

    setModels(result.models);
    setRestricted(result.restricted);
    setNotice(result.notice);
    setError(result.error);
    setLoading(false);
  }, [isAuthenticated]);

  const loadInfluencers = useCallback(async () => {
    setInfluencersLoading(true);
    setInfluencersError(undefined);

    const result = await fetchPublicInfluencerRoster();
    if (result.ok) {
      setInfluencers(result.data);
    } else {
      setInfluencersError(result.message);
    }
    setInfluencersLoaded(true);
    setInfluencersLoading(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "auto";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    if (!isInfluencerFilter || influencersLoaded) return;
    void loadInfluencers();
  }, [isInfluencerFilter, influencersLoaded, loadInfluencers]);

  useEffect(() => {
    if (!isInfluencerFilter) setSelectedInfluencer(null);
  }, [isInfluencerFilter]);

  const displayedModels = useMemo(() => {
    if (isInfluencerFilter) {
      return influencers.map(mapInfluencerToPublicModel);
    }
    return filterModels(models, filters);
  }, [isInfluencerFilter, influencers, models, filters]);

  const gridLoading = isInfluencerFilter
    ? !influencersLoaded || influencersLoading
    : loading;
  const gridError = isInfluencerFilter ? influencersError : error;

  function handleSelect(model: PublicModel) {
    if (model.isInfluencer) {
      const influencer = influencers.find(
        (item) => item.userId === model.userId || item.userId === model.id,
      );
      if (influencer) setSelectedInfluencer(influencer);
      return;
    }
    setSelectedModel(model);
  }

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    triggersRef.current.forEach((trigger) => trigger.kill());
    triggersRef.current = [];

    cardRefs.current.forEach((cardEl) => {
      if (!cardEl) return;
      const card = cardEl;

      const cardInner = card.querySelector(".card-inner");
      const cardImage = card.querySelector(".card-image");
      if (!cardInner || !cardImage) return;

      const trigger = ScrollTrigger.create({
        trigger: card,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.from(cardInner, {
            y: 24,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          });
          gsap.from(cardImage, {
            scale: 1.05,
            duration: 1,
            ease: "power3.out",
          });
        },
      });
      triggersRef.current.push(trigger);

      function handleMouseEnter(e: Event) {
        const mouse = e as MouseEvent;
        const rect = card.getBoundingClientRect();
        const rotateY =
          ((mouse.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
        const rotateX =
          ((rect.height / 2 - (mouse.clientY - rect.top)) / (rect.height / 2)) * 8;
        gsap.to(cardInner, {
          rotateX,
          rotateY,
          transformPerspective: 1000,
          duration: 0.5,
          ease: "power2.out",
        });
      }

      function handleMouseMove(e: Event) {
        const mouse = e as MouseEvent;
        const rect = card.getBoundingClientRect();
        const rotateY =
          ((mouse.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
        const rotateX =
          ((rect.height / 2 - (mouse.clientY - rect.top)) / (rect.height / 2)) * 8;
        gsap.to(cardInner, {
          rotateX,
          rotateY,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      function handleMouseLeave() {
        gsap.to(cardInner, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
        });
      }

      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      cleanups.push(() => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
      triggersRef.current.forEach((trigger) => trigger.kill());
      triggersRef.current = [];
    };
  }, [displayedModels]);

  return (
    <div
      className={`min-h-screen bg-white pt-[88px] md:pt-[96px] ${
        showRosterCta ? "pb-36 md:pb-40" : "pb-8"
      }`}
    >
      <ModelsHeroSection />

      <ModelsFilterBar
        filters={filters}
        onChange={setFilters}
        count={displayedModels.length}
        showAdvanced={showAdvancedFilters}
        onToggleAdvanced={() => setShowAdvancedFilters((v) => !v)}
        showAdvancedFilters={!restricted}
      />

      <section className="py-6 md:py-20 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]">
          {notice && !isInfluencerFilter && (
            <div className="mb-6 border border-[#C8A97A]/30 bg-[#C8A97A]/10 px-4 py-3">
              <p className="font-ui text-[10px] text-[#4A4A4A] leading-relaxed">
                {notice}
                {!isAuthenticated && notice.includes("client account") && (
                  <>
                    {" "}
                    <Link href="/?login=1" className="text-[#9A7329] underline">
                      Sign in
                    </Link>{" "}
                    or{" "}
                    <Link href="/register/client" className="text-[#9A7329] underline">
                      register as a client
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          )}

          {gridError && displayedModels.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <p className="font-ui text-sm text-[#4A4A4A]">{gridError}</p>
              <button
                type="button"
                onClick={isInfluencerFilter ? loadInfluencers : loadModels}
                className="font-ui text-[9px] tracking-[0.2em] uppercase px-6 py-3 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
              >
                Retry
              </button>
            </div>
          ) : gridLoading ? (
            <GridSkeleton />
          ) : (
            <ModelsMasonryGrid
              models={displayedModels}
              cardRefs={cardRefs}
              onSelect={handleSelect}
              emptyMessage={
                isInfluencerFilter
                  ? "No influencers found."
                  : "No models match these filters."
              }
            />
          )}

          {!loading && !isInfluencerFilter && models.length === 0 && !error && (
            <div className="text-center py-16 space-y-4">
              <p className="font-display text-[20px] font-light text-[#9A9A9A] italic">
                New models will appear here once approved.
              </p>
              <Link
                href="/register/model"
                className="inline-block font-ui text-[9px] tracking-[0.2em] uppercase text-[#9A7329] underline"
              >
                Apply as a model
              </Link>
            </div>
          )}
        </div>
      </section>

      <ModelsRosterCta onVisibilityChange={setShowRosterCta} />

      {selectedModel && (
        <ModelDetailModal
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
        />
      )}

      {selectedInfluencer && (
        <InfluencerPublicModal
          influencer={selectedInfluencer}
          onClose={() => setSelectedInfluencer(null)}
        />
      )}
    </div>
  );
}
