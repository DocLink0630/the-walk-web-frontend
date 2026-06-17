"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BRAND_STORY_COPY,
  BRAND_STORY_CTAS,
  BRAND_STORY_IMAGE,
  BRAND_STORY_PARAGRAPHS,
} from "@/data/brand-story";
import type { BrandStorySectionProps } from "@/types/brand-story";
import Image from "next/image";
import BrandStoryContent from "@/components/ui/BrandStoryContent";

gsap.registerPlugin(ScrollTrigger);

export default function BrandStorySection({
  id = "brand-story",
  eyebrow = BRAND_STORY_COPY.eyebrow,
  heading = BRAND_STORY_COPY.heading,
  paragraphs = BRAND_STORY_PARAGRAPHS,
  ctas = BRAND_STORY_CTAS,
  image = BRAND_STORY_IMAGE,
  imageAlt = BRAND_STORY_COPY.imageAlt,
}: BrandStorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.from(imageRef.current, {
          clipPath: "inset(0 100% 0 0)",
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          y: 80,
          opacity: 0,
          stagger: 0.2,
          duration: 1,
          delay: 0.3,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [eyebrow, heading, paragraphs, ctas, image, imageAlt]);

  return (
    <section ref={sectionRef} id={id} className="bg-white py-16 md:py-24 lg:py-[160px] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div ref={contentRef} className="lg:col-span-5 lg:col-start-1 min-w-0">
            <BrandStoryContent
              eyebrow={eyebrow}
              heading={heading}
              paragraphs={paragraphs}
              ctas={ctas}
            />
          </div>

          <div
            ref={imageRef}
            className="lg:col-span-7 lg:col-start-6 flex items-center justify-center min-w-0"
          >
            <Image
              src={image}
              alt={imageAlt}
              className="w-full max-w-[320px] md:max-w-[400px] h-auto"
              sizes="(max-width: 768px) 280px, 400px"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export type { BrandStorySectionProps };
