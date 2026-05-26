"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AGENCY_BACKGROUND_IMAGE,
  AGENCY_QUOTE,
  AGENCY_STATS,
} from "@/data/agency-stats";
import type { StatItem as StatItemType } from "@/types/stats";
import StatItem from "@/components/ui/StatItem";

gsap.registerPlugin(ScrollTrigger);

function buildAnimatedQuoteHtml(text: string) {
  const withLockedPhrases = text.replace(
    /Sri Lanka([\u2019'])s/gi,
    "Sri\u00A0Lanka$1s",
  );

  return withLockedPhrases
    .split(" ")
    .map((word) => {
      const chars = word
        .split("")
        .map((char) => `<span class="quote-char inline-block">${char}</span>`)
        .join("");
      return `<span class="inline-block whitespace-nowrap">${chars}</span>`;
    })
    .join('<span class="inline-block">&nbsp;</span>');
}

export interface BlackSectionProps {
  id?: string;
  eyebrow?: string;
  quote?: string;
  stats?: StatItemType[];
  backgroundImage?: string;
  registerHref?: string;
  registerLabel?: string;
}

export default function BlackSection({
  id = "about",
  eyebrow = "MODEL AGENCY",
  quote = AGENCY_QUOTE,
  stats = AGENCY_STATS,
  backgroundImage = AGENCY_BACKGROUND_IMAGE,
  registerHref = "/register",
  registerLabel = "Create your profile and get listed →",
}: BlackSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const quoteEl = quoteRef.current;
    if (!section || !quoteEl) return;

    quoteEl.innerHTML = buildAnimatedQuoteHtml(quote);

    const charElements = quoteEl.querySelectorAll(".quote-char");

    const ctx = gsap.context(() => {
      gsap.from(charElements, {
        y: 60,
        skewY: 4,
        opacity: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, [quote]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative bg-[#0A0A0A] py-20 md:py-32 lg:py-[200px] overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.95) 100%)",
        }}
      />

      <div className="relative z-20 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <div className="max-w-[1000px] mx-auto">
          <p className="font-ui text-[9px] md:text-[10px] lg:text-[11px] font-light tracking-[0.3em] md:tracking-[0.35em] uppercase text-[#C8A97A] mb-8 md:mb-10 lg:mb-12 text-center">
            {eyebrow}
          </p>

          <p
            ref={quoteRef}
            className="font-display italic text-[28px] md:text-[42px] lg:text-[56px] font-light tracking-[0.05em] text-white leading-[1.3] text-center"
          >
            {quote}
          </p>

          <div className="mt-12 md:mt-14 lg:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-16">
            {stats.map((stat, i) => (
              <StatItem
                key={stat.label}
                value={stat.value}
                label={stat.label}
                className={i === 1 ? "md:border-l md:border-r border-white/20" : ""}
              />
            ))}
          </div>

          <div className="mt-12 md:mt-14 lg:mt-16 pt-8 md:pt-10 border-t border-white/10 text-center">
            <p className="font-ui text-[8px] md:text-[9px] font-light tracking-[0.25em] md:tracking-[0.3em] uppercase text-white/30 leading-[1.6]">
              A model, beautician, or photographer?{" "}
              <Link
                href={registerHref}
                data-cursor="link"
                className="text-[#C8A97A]/70 hover:text-[#C8A97A] transition-colors duration-300 underline-offset-2 hover:underline inline-block md:inline"
              >
                {registerLabel}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}