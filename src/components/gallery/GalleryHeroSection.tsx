"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { GalleryPageContent } from "@/types/gallery-page";

interface GalleryHeroSectionProps {
  eyebrow: string;
  heading: string;
  categories: GalleryPageContent["categories"];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  imageCount: number;
}

export default function GalleryHeroSection({
  eyebrow,
  heading,
  categories,
  activeCategory,
  onCategoryChange,
  imageCount,
}: GalleryHeroSectionProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    const filters = filtersRef.current;
    const count = countRef.current;
    if (!heading || !subheading) return;

    const tl = gsap.timeline({ delay: 0.2 });
    tl.from(heading, {
      y: 60,
      opacity: 0,
      duration: 1.1,
      ease: "power4.out",
    })
      .from(
        subheading,
        { y: 24, opacity: 0, duration: 0.75, ease: "power4.out" },
        "-=0.7",
      )
      .from(
        count,
        { y: 16, opacity: 0, duration: 0.6, ease: "power4.out" },
        "-=0.5",
      );

    if (filters) {
      tl.from(
        filters.children,
        {
          y: 20,
          opacity: 0,
          duration: 0.55,
          stagger: 0.05,
          ease: "power3.out",
        },
        "-=0.4",
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const count = countRef.current;
    if (!count) return;

    gsap.fromTo(
      count,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
    );
  }, [imageCount, activeCategory]);

  return (
    <section className="pt-32 md:pt-40 pb-10 md:pb-14 bg-white border-b border-[#F0F0F0]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12 mb-10 md:mb-12">
          <div>
            <p
              ref={subheadingRef}
              className="font-ui text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-[#C8A97A] mb-4 md:mb-5"
            >
              {eyebrow}
            </p>
            <h1
              ref={headingRef}
              className="font-display text-[64px] md:text-[100px] lg:text-[120px] font-light text-[#0A0A0A] leading-[0.9]"
            >
              {heading}
            </h1>
          </div>
          <p
            ref={countRef}
            className="font-ui text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] lg:pb-2"
          >
            {imageCount} {imageCount === 1 ? "Image" : "Images"}
            {activeCategory !== "All" ? ` · ${activeCategory}` : ""}
          </p>
        </div>

        <div ref={filtersRef} className="flex flex-wrap gap-2 md:gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              data-cursor="button"
              className={`font-ui text-[9px] tracking-[0.25em] uppercase px-4 md:px-6 py-2 md:py-2.5 border transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                  : "bg-white text-[#0A0A0A] border-[#E0E0E0] hover:border-[#0A0A0A]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
