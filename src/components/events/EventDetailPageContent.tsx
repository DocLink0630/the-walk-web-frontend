"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { attachScrollTriggerResync, revealOnScroll } from "@/lib/gsap/scroll-trigger-setup";
import type { AgencyEvent } from "@/types/events-page";
import EventDetailDescriptionSection from "./EventDetailDescriptionSection";
import EventDetailGallerySection from "./EventDetailGallerySection";
import EventDetailHeroSection from "./EventDetailHeroSection";
import EventDetailStatsSection from "./EventDetailStatsSection";

gsap.registerPlugin(ScrollTrigger);

interface EventDetailPageContentProps {
  event: AgencyEvent;
}

export default function EventDetailPageContent({ event }: EventDetailPageContentProps) {
  const hasStats = (event.stats?.length ?? 0) > 0;
  const mainRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [event.id]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const ctx = gsap.context(() => {
      const sections = [
        ...(hasStats ? [statsRef.current] : []),
        descriptionRef.current,
        galleryRef.current,
      ];

      sections.forEach((el, index) => {
        if (!el) return;
        revealOnScroll(el, {
          trigger: el,
          start: "top 85%",
          y: 56,
          duration: 1,
          delay: index * 0.08,
        });
      });
    }, main);

    const detachResync = attachScrollTriggerResync([main]);

    return () => {
      detachResync();
      ctx.revert();
    };
  }, [event.id, hasStats]);

  return (
    <main ref={mainRef} className="flex-1 min-h-screen bg-white">
      <EventDetailHeroSection event={event} />
      {hasStats && (
        <div ref={statsRef}>
          <EventDetailStatsSection stats={event.stats!} />
        </div>
      )}
      <div ref={descriptionRef}>
        <EventDetailDescriptionSection event={event} />
      </div>
      <div ref={galleryRef}>
        <EventDetailGallerySection event={event} />
      </div>
    </main>
  );
}
