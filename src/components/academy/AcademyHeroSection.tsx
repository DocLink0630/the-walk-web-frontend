"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import type { AcademyPageContent } from "@/types/academy-page";

interface AcademyHeroSectionProps {
  hero: AcademyPageContent["hero"];
}

export default function AcademyHeroSection({ hero }: AcademyHeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    const description = descriptionRef.current;
    const overlay = overlayRef.current;
    const image = imageRef.current;
    const scrollHint = scrollHintRef.current;
    if (!section || !heading || !subheading || !description || !overlay || !image) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.6 });

      tl.from(image, {
        clipPath: "inset(100% 0 0 0)",
        duration: 1.2,
        ease: "power4.out",
      })
        .from(overlay, { opacity: 0, duration: 0.8 }, "-=0.6")
        .from(heading, { y: 60, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.4")
        .from(
          [subheading, description],
          {
            y: 30,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power4.out",
          },
          "-=0.5",
        );

      if (scrollHint) {
        tl.from(scrollHint, { opacity: 0, y: 12, duration: 0.6, ease: "power4.out" }, "-=0.3");
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]">
      <div
        ref={imageRef}
        className="absolute inset-0 z-0 overflow-hidden"
        data-cursor="image"
      >
        <Image
          src={hero.image}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      <div className="absolute inset-0 z-20 flex items-end pb-16 md:pb-28">
        <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-[80px]">
          <div className="max-w-[900px]">
            <p
              ref={subheadingRef}
              className="font-ui text-[9px] md:text-[10px] font-light tracking-[0.35em] uppercase text-[#C8A97A] mb-4 md:mb-6"
            >
              {hero.eyebrow}
            </p>
            <h1
              ref={headingRef}
              className="font-display text-[60px] md:text-[90px] lg:text-[120px] font-light tracking-[0.35em] text-white leading-[0.9] mb-5 md:mb-7"
            >
              {hero.heading}
            </h1>
            <p
              ref={descriptionRef}
              className="font-display text-[16px] md:text-[20px] lg:text-[22px] font-light text-white/90 leading-[1.6]"
            >
              {hero.description}
            </p>
          </div>
        </div>
      </div>
      <div
        ref={scrollHintRef}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2.5"
      >
        <div className="w-px h-12 md:h-16 bg-white/25" />
        <span className="font-ui text-[8px] tracking-[0.3em] text-white/40 uppercase">
          Scroll
        </span>
      </div>
    </section>
  );
}
