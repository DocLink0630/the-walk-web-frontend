"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { eventCategoryColor } from "@/lib/events/category-colors";
import type { AgencyEvent } from "@/types/events-page";

interface EventDetailHeroSectionProps {
  event: AgencyEvent;
}

export default function EventDetailHeroSection({ event }: EventDetailHeroSectionProps) {
  const heroImageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const categoryColor = eventCategoryColor(event.category);

  useEffect(() => {
    const image = heroImageRef.current;
    const content = contentRef.current;
    if (!image || !content) return;

    const tl = gsap.timeline({ delay: 0.25 });
    tl.from(image, { scale: 1.08, opacity: 0, duration: 1.2, ease: "power4.out" })
      .from(content, { y: 48, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.7");

    return () => {
      tl.kill();
    };
  }, [event.id]);

  return (
    <section className="relative h-[72vh] md:h-[80vh] w-full overflow-hidden">
      <div ref={heroImageRef} className="absolute inset-0">
        <Image
          src={event.image}
          alt={event.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      <div className="absolute top-[65px] md:top-[73px] left-0 right-0 z-20 px-4 md:px-8 lg:px-[80px] pt-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 font-ui text-[9px] tracking-[0.25em] uppercase text-white/80 hover:text-[#C8A97A] transition-colors duration-300"
          data-cursor="link"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to Events
        </Link>
      </div>

      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex items-end pb-12 md:pb-16 lg:pb-20"
      >
        <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-[80px]">
          <div className="max-w-[900px]">
            <div className="flex flex-wrap items-center gap-3 mb-5 md:mb-6">
              <span
                className="font-ui text-[10px] tracking-[0.3em] uppercase px-4 py-2"
                style={{
                  backgroundColor: `${categoryColor}30`,
                  color: categoryColor,
                  border: `1px solid ${categoryColor}50`,
                }}
              >
                {event.category}
              </span>
              <span
                className={`font-ui text-[9px] tracking-[0.25em] uppercase px-4 py-2 ${
                  event.status === "UPCOMING"
                    ? "bg-[#C8A97A]/25 text-[#C8A97A] border border-[#C8A97A]/50"
                    : "bg-white/10 text-white/80 border border-white/25"
                }`}
              >
                {event.status}
              </span>
            </div>

            <h1 className="font-display text-[48px] md:text-[72px] lg:text-[88px] font-light text-white leading-[0.95] mb-6 md:mb-8">
              {event.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-8 border-t border-white/20 pt-6">
              <div className="flex items-center gap-3 text-white">
                <Calendar size={16} strokeWidth={1.5} className="text-[#C8A97A] shrink-0" />
                <span className="font-ui text-[11px] tracking-[0.15em]">{event.date}</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <MapPin size={16} strokeWidth={1.5} className="text-[#C8A97A] shrink-0" />
                <span className="font-ui text-[10px] tracking-[0.15em]">{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
