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
}

export default function GalleryHeroSection({
  eyebrow,
  heading,
  categories,
  activeCategory,
  onCategoryChange,
}: GalleryHeroSectionProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    if (!heading || !subheading) return;

    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(heading, {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
    }).from(
      subheading,
      {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out",
      },
      "-=0.6",
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <p
          ref={subheadingRef}
          className="font-ui text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-[#C8A97A] mb-4 md:mb-5"
        >
          {eyebrow}
        </p>
        <h1
          ref={headingRef}
          className="font-display text-[64px] md:text-[100px] lg:text-[120px] font-light text-[#0A0A0A] leading-[0.9] mb-8 md:mb-12"
        >
          {heading}
        </h1>

        <div className="flex flex-wrap gap-2 md:gap-3">
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
