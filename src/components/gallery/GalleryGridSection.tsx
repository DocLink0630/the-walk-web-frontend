"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  attachScrollTriggerResync,
  revealOnScroll,
} from "@/lib/gsap/scroll-trigger-setup";
import type { GalleryItem } from "@/types/gallery-page";

gsap.registerPlugin(ScrollTrigger);

interface GalleryGridSectionProps {
  items: GalleryItem[];
  onItemClick: (index: number) => void;
}

export default function GalleryGridSection({
  items,
  onItemClick,
}: GalleryGridSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || items.length === 0) return;

    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        revealOnScroll(card, {
          trigger: card,
          start: "top 92%",
          y: 32,
          scale: 0.97,
          duration: 0.85,
          delay: (index % 4) * 0.06,
        });

        const image = card.querySelector<HTMLElement>(".gallery-card-image");
        if (!image) return;

        const handleEnter = () => {
          gsap.to(image, { scale: 1.06, duration: 0.7, ease: "power2.out" });
        };
        const handleLeave = () => {
          gsap.to(image, { scale: 1, duration: 0.7, ease: "power2.out" });
        };

        card.addEventListener("mouseenter", handleEnter);
        card.addEventListener("mouseleave", handleLeave);
        cleanups.push(() => {
          card.removeEventListener("mouseenter", handleEnter);
          card.removeEventListener("mouseleave", handleLeave);
        });
      });
    }, section);

    const detachResync = attachScrollTriggerResync([section, gridRef.current]);

    return () => {
      cleanups.forEach((fn) => fn());
      detachResync();
      ctx.revert();
    };
  }, [items]);

  return (
    <section ref={sectionRef} className="pb-20 md:pb-28">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-[80px]">
        {items.length > 0 ? (
          <div
            ref={gridRef}
            className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-5"
          >
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onClick={() => onItemClick(index)}
                data-cursor="view"
                aria-label={`View ${item.category} image`}
                className="gallery-card group relative block w-full break-inside-avoid mb-4 md:mb-5 overflow-hidden bg-[#0A0A0A] text-left"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <div className="gallery-card-image absolute inset-0">
                    <Image
                      src={item.url}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    <span className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/70 flex items-center justify-center">
                      <span className="font-ui text-[18px] text-white leading-none">+</span>
                    </span>
                  </div>

                  <div className="absolute top-3 left-3 md:top-4 md:left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    <span className="font-ui text-[8px] md:text-[9px] tracking-[0.28em] uppercase text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1">
                      {item.category}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-display text-[20px] font-light text-[#9A9A9A] italic">
              No images found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
