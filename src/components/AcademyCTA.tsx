"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACADEMY_COPY, ACADEMY_IMAGES } from "@/data/academy";
import { CTA_SECONDARY_OUTLINE } from "@/config/cta-styles";
import { renderMultilineHeading } from "@/lib/render-multiline-heading";
import type { AcademyCTAProps, AcademyImage } from "@/types/academy";
import AccentDivider from "@/components/ui/AccentDivider";
import DiagonalImageComposition from "@/components/ui/DiagonalImageComposition";
import MagneticLink from "@/components/ui/MagneticLink";

gsap.registerPlugin(ScrollTrigger);

export default function AcademyCTA({
  id = "academy",
  eyebrow = ACADEMY_COPY.eyebrow,
  heading = ACADEMY_COPY.heading,
  description = ACADEMY_COPY.description,
  ctaLabel = ACADEMY_COPY.ctaLabel,
  ctaHref = ACADEMY_COPY.ctaHref,
  images = ACADEMY_IMAGES,
}: AcademyCTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      if (contentRef.current) {
        timeline.from(contentRef.current, {
          x: -60,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
        });
      }

      imageRefs.current.forEach((image, index) => {
        if (!image) return;

        timeline.from(
          image,
          {
            scale: 0.9,
            opacity: 0,
            duration: 1.4,
            ease: "power4.out",
          },
          `-=${index === 0 ? 0.6 : 0.4}`,
        );
      });

      if (lineRef.current) {
        timeline.from(
          lineRef.current,
          {
            scaleX: 0,
            transformOrigin: "left",
            duration: 1,
            ease: "power4.out",
          },
          "-=0.8",
        );
      }
    }, section);

    return () => ctx.revert();
  }, [images, eyebrow, heading, description, ctaLabel, ctaHref]);

  const handleImageRef = (index: number, element: HTMLDivElement | null) => {
    imageRefs.current[index] = element;
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className="bg-white py-16 md:py-24 lg:py-[160px] overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 relative order-2 lg:order-1">
            <DiagonalImageComposition
              images={images}
              onImageRef={handleImageRef}
            />
          </div>

          <div
            ref={contentRef}
            className="lg:col-span-5 flex items-center order-1 lg:order-2 lg:pl-16 mb-12 lg:mb-0"
          >
            <div className="max-w-[480px]">
              <p className="font-ui text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-[#C8A97A] mb-8">
                {eyebrow}
              </p>

              <h2 className="font-display text-[68px] md:text-[84px] lg:text-[96px] font-light text-[#0A0A0A] leading-[0.88] tracking-[0.02em] mb-12">
                {renderMultilineHeading(heading)}
              </h2>

              <AccentDivider ref={lineRef} className="h-px bg-[#C8A97A] w-24 mb-12" />

              <p className="font-display italic text-[20px] md:text-[22px] text-[#4A4A4A] leading-[1.8] mb-16">
                {description}
              </p>

              <MagneticLink href={ctaHref} className={CTA_SECONDARY_OUTLINE}>
                {ctaLabel}
              </MagneticLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { AcademyCTAProps, AcademyImage };
