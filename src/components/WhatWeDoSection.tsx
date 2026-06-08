"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { disciplines } from "@/data/discipline";
import {
  attachScrollTriggerResync,
  revealOnScroll,
} from "@/lib/gsap/scroll-trigger-setup";
import type { Discipline } from "@/types/discipline";
import SectionIntro from "@/components/ui/SectionIntro";
import ShowcaseCard from "@/components/ui/ShowcaseCard";

gsap.registerPlugin(ScrollTrigger);

/** Editorial offset — positive margins only, keeps grid gaps intact */
const CARD_LAYOUT = [
  "",
  "md:mt-14 lg:mt-16",
  "",
  "md:mt-10 lg:mt-12",
] as const;

function toShowcaseProps(d: Discipline) {
  return {
    index: d.number,
    eyebrow: d.tagline,
    title: d.title,
    description: d.description,
    href: d.link,
    ctaLabel: d.label,
    image: d.image,
    imagePosition: d.imagePosition,
    size: d.size,
  };
}

export interface WhatWeDoSectionProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  items?: Discipline[];
}

export default function WhatWeDoSection({
  id = "what-we-do",
  eyebrow = "THE PLATFORM",
  heading = "FIND HERE",
  description = "A single platform where clients discover and book models, beauty artists, and photographers  and where talent builds a public profile.",
  items = disciplines,
}: WhatWeDoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (introRef.current) {
        revealOnScroll(introRef.current.children, {
          trigger: introRef.current,
          start: "top 85%",
          y: 40,
          duration: 0.9,
          stagger: 0.12,
        });
      }

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        revealOnScroll(el, {
          trigger: el,
          start: "top 88%",
          y: 48,
          duration: 1,
          delay: i % 2 === 0 ? 0 : 0.15,
        });
      });
    }, section);

    const detachResync = attachScrollTriggerResync([section, document.body]);

    return () => {
      detachResync();
      ctx.revert();
    };
  }, [items]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="bg-white py-16 md:py-20 lg:py-24"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <div ref={introRef} className="mb-12 md:mb-14 lg:mb-16">
          <SectionIntro
            eyebrow={eyebrow}
            title={heading}
            description={description}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {items.map((item, i) => (
            <div
              key={item.number}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={CARD_LAYOUT[i] ?? ""}
            >
              <ShowcaseCard {...toShowcaseProps(item)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
