"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface EventsHeroSectionProps {
  eyebrow: string;
  heading: string;
  subtitle: string;
  backgroundImage: string;
}

export default function EventsHeroSection({
  eyebrow,
  heading,
  subtitle,
  backgroundImage,
}: EventsHeroSectionProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const image = imageRef.current;
    const eyebrow = eyebrowRef.current;
    const heading = headingRef.current;
    const sub = subRef.current;
    if (!panel || !image || !eyebrow || !heading || !sub) return;

    const tl = gsap.timeline({ delay: 0.2 });
    tl.from(image, { scale: 1.06, opacity: 0, duration: 1.1, ease: "power4.out" })
      .from(panel, { x: -40, opacity: 0, duration: 0.9, ease: "power4.out" }, "-=0.7")
      .from(
        [eyebrow, heading, sub],
        { y: 32, opacity: 0, stagger: 0.12, duration: 0.85, ease: "power4.out" },
        "-=0.5",
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="relative grid grid-cols-1 lg:grid-cols-[42%_58%] min-h-[520px] md:min-h-[600px] lg:min-h-[70vh] w-full overflow-hidden border-b border-[#E0E0E0]">
      <div
        ref={panelRef}
        className="relative z-10 flex items-end bg-[#0A0A0A] px-4 py-12 md:px-8 md:py-16 lg:px-[80px] lg:py-20 order-2 lg:order-1"
      >
        <div className="max-w-[520px]">
          <p
            ref={eyebrowRef}
            className="font-ui text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-[#C8A97A] mb-4 md:mb-5"
          >
            {eyebrow}
          </p>
          <h1
            ref={headingRef}
            className="font-display text-[52px] md:text-[80px] lg:text-[96px] font-light tracking-[0.2em] md:tracking-[0.28em] text-white leading-[0.92] mb-5 md:mb-6"
          >
            {heading}
          </h1>
          <p
            ref={subRef}
            className="font-display italic text-[16px] md:text-[19px] lg:text-[21px] font-light text-white/75 leading-[1.65]"
          >
            {subtitle}
          </p>
        </div>
        <div className="absolute top-0 right-0 hidden lg:block w-px h-full bg-[#C8A97A]/30" />
      </div>

      <div ref={imageRef} className="relative h-[42vh] sm:h-[48vh] lg:h-auto order-1 lg:order-2">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/20 via-transparent to-transparent lg:from-[#0A0A0A]/10" />
      </div>
    </section>
  );
}
