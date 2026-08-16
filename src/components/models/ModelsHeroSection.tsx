"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Runway fashion photography — same verified asset as Events hero */
const MODELS_HERO_IMAGE =
  "https://images.unsplash.com/photo-1635279474047-ab3cda78bbe8?w=1920&q=85";

interface ModelsHeroSectionProps {
  backgroundImage?: string;
}

export default function ModelsHeroSection({
  backgroundImage = MODELS_HERO_IMAGE,
}: ModelsHeroSectionProps) {
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 });
    if (heroImageRef.current) {
      tl.from(heroImageRef.current, {
        clipPath: "inset(100% 0 0 0)",
        duration: 1.2,
        ease: "power4.out",
      });
    }
    if (heroOverlayRef.current) {
      tl.from(heroOverlayRef.current, { opacity: 0, duration: 0.6 }, "-=0.4");
    }
    if (headingRef.current) {
      tl.from(
        headingRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
        },
        "-=0.3",
      );
    }
  }, []);

  return (
    <section className="relative h-[28vh] md:h-[60vh] w-full overflow-hidden">
      <div ref={heroImageRef} className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div
        ref={heroOverlayRef}
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      <div className="absolute inset-0 z-20 flex items-end pb-6 md:pb-16">
        <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-[80px]">
          <p className="font-ui text-[9px] md:text-[11px] tracking-[0.35em] uppercase text-[#C8A97A] mb-2 md:mb-4">
            TALENT ROSTER
          </p>
          <h1
            ref={headingRef}
            className="font-display text-[40px] md:text-[80px] lg:text-[100px] font-light tracking-[0.15em] md:tracking-[0.3em] text-white leading-[0.9]"
          >
            MODELS
          </h1>
        </div>
      </div>
    </section>
  );
}
