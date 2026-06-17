"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "@/context/AuthContext";
import ModelDetailModal from "@/components/models/ModelDetailModal";
import NavLinkWithStatus from "@/components/ui/NavLinkWithStatus";
import {
  attachScrollTriggerResync,
  refreshScrollTriggers,
} from "@/lib/gsap/scroll-trigger-setup";
import {
  fetchFeaturedModels,
  getFirstName,
  PORTRAIT_OFFSETS,
} from "@/lib/public/featured-models";
import { featuredModelToPublicModel } from "@/lib/public/models";
import type { PublicFeaturedModel, PublicModel } from "@/types/public-model";
import SectionHeading from "@/components/ui/SectionHeading";
import PortraitCard from "@/components/ui/PortraitCard";

gsap.registerPlugin(ScrollTrigger);

export interface TalentSectionProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

function SkeletonCard({ offset }: { offset: number }) {
  return (
    <div style={{ marginTop: offset > 0 ? `${offset}px` : undefined }}>
      <div className="aspect-[3/4] bg-[#F0F0F0] border border-[#E8E8E8] animate-pulse" />
      <div className="mt-3 h-3 w-2/3 bg-[#F0F0F0] animate-pulse" />
    </div>
  );
}

export default function TalentSection({
  id = "talent",
  eyebrow = "REPRESENTED MODELS",
  heading = "Signature Models",
  ctaLabel = "VIEW ALL MODELS",
  ctaHref = "/models",
}: TalentSectionProps) {
  const { isAuthenticated } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | HTMLButtonElement | null)[]>([]);

  const [models, setModels] = useState<PublicFeaturedModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<PublicModel | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const result = await fetchFeaturedModels();
      if (cancelled) return;

      if (!result.ok) {
        setError(result.message);
        setModels([]);
      } else {
        setModels(result.data);
      }
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const setupAnimations = useCallback(() => {
    const section = sectionRef.current;
    if (!section || loading) return;

    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card) => {
        if (!card) return;

        const cardInner = card.querySelector<HTMLElement>(".portrait-card-inner");
        const cardImage = card.querySelector<HTMLElement>(".portrait-card-image");

        if (!cardInner || !cardImage) return;

        const revealTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            invalidateOnRefresh: true,
            toggleActions: "play none none none",
          },
        });

        revealTl
          .from(cardInner, {
            y: 36,
            opacity: 0,
            duration: 1.1,
            ease: "power4.out",
            immediateRender: false,
          })
          .from(
            cardImage,
            { scale: 1.08, duration: 1.4, ease: "power4.out", immediateRender: false },
            0,
          );

        const handleMouseEnter = (e: Event) => {
          const me = e as globalThis.MouseEvent;
          const rect = card.getBoundingClientRect();
          const rotateY = ((me.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
          const rotateX = ((rect.height / 2 - (me.clientY - rect.top)) / (rect.height / 2)) * 8;
          gsap.to(cardInner, {
            rotateX,
            rotateY,
            transformPerspective: 1000,
            duration: 0.5,
            ease: "power2.out",
          });
        };

        const handleMouseMove = (e: Event) => {
          const me = e as globalThis.MouseEvent;
          const rect = card.getBoundingClientRect();
          const rotateY = ((me.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
          const rotateX = ((rect.height / 2 - (me.clientY - rect.top)) / (rect.height / 2)) * 8;
          gsap.to(cardInner, { rotateX, rotateY, duration: 0.3, ease: "power2.out" });
        };

        const handleMouseLeave = () => {
          gsap.to(cardInner, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)",
          });
        };

        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);

        cleanups.push(() => {
          card.removeEventListener("mouseenter", handleMouseEnter);
          card.removeEventListener("mousemove", handleMouseMove);
          card.removeEventListener("mouseleave", handleMouseLeave);
        });
      });
    }, section);

    const detachResync = attachScrollTriggerResync([section, document.body]);

    return () => {
      detachResync();
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [loading, models.length]);

  useEffect(() => {
    return setupAnimations();
  }, [setupAnimations]);

  useEffect(() => {
    if (loading) return;
    refreshScrollTriggers();
  }, [loading, models.length]);

  const displayItems = loading
    ? Array.from({ length: 8 }, (_, i) => ({ skeleton: true as const, index: i }))
    : models.map((model, index) => ({ skeleton: false as const, model, index }));

  return (
    <>
      <section ref={sectionRef} id={id} className="bg-white py-16 md:py-24 lg:py-[160px]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]">
          <SectionHeading
            className="mb-12 md:mb-16 lg:mb-[80px]"
            eyebrow={eyebrow}
            title={heading}
          />

          {error && (
            <p className="font-ui text-[10px] text-[#9A9A9A] mb-6">
              Our featured roster is updating. Please refresh in a moment.
            </p>
          )}

          {!loading && !error && models.length === 0 && (
            <div className="border border-[#E0E0E0] bg-[#FAFAFA] px-8 py-16 text-center">
              <p className="font-ui text-sm text-[#4A4A4A] mb-4">
                New signature faces will be featured here soon.
              </p>
              <NavLinkWithStatus
                href={ctaHref}
                className="inline-flex items-center gap-2 font-ui text-[10px] tracking-[0.2em] uppercase text-[#9A7329] underline underline-offset-4"
              >
                Browse roster
              </NavLinkWithStatus>
            </div>
          )}

          {(loading || models.length > 0) && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                {displayItems.map((item) => {
                  const offset = PORTRAIT_OFFSETS[item.index % PORTRAIT_OFFSETS.length];

                  if (item.skeleton) {
                    return <SkeletonCard key={`skel-${item.index}`} offset={offset} />;
                  }

                  const { model } = item;
                  const cardTitle = isAuthenticated
                    ? model.name.toUpperCase()
                    : getFirstName(model.name).toUpperCase();

                  return (
                    <PortraitCard
                      key={`${model.name}-${item.index}`}
                      ref={(el) => {
                        cardRefs.current[item.index] = el;
                      }}
                      title={cardTitle}
                      image={model.imageUrl}
                      offset={offset}
                      interactive
                      onClick={() =>
                        setSelectedModel(featuredModelToPublicModel(model, item.index))
                      }
                    />
                  );
                })}
              </div>

              <div className="flex justify-center mt-12 md:mt-16 lg:mt-20">
                <NavLinkWithStatus
                  href={ctaHref}
                  data-cursor="button"
                  className="inline-flex items-center justify-center gap-2 text-center font-ui text-[9px] md:text-[10px] lg:text-[11px] font-light tracking-[0.25em] uppercase px-8 md:px-10 py-3 md:py-4 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors duration-300"
                >
                  {ctaLabel}
                </NavLinkWithStatus>
              </div>
            </>
          )}
        </div>
      </section>

      {selectedModel && (
        <ModelDetailModal
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </>
  );
}
