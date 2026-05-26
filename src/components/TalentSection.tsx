"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredTalents } from "@/data/featured-talents";
import type { FeaturedTalent } from "@/types/featured-talents";
import SectionHeading from "@/components/ui/SectionHeading";
import PortraitCard from "@/components/ui/PortraitCard";

gsap.registerPlugin(ScrollTrigger);

export interface TalentSectionProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  items?: FeaturedTalent[];
}

export default function TalentSection({
  id = "talent",
  eyebrow = "REPRESENTED MODELS",
  heading = "Signature Models",
  ctaLabel = "VIEW FULL ROSTER",
  ctaHref = "/models",
  items = featuredTalents,
}: TalentSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card) => {
        if (!card) return;

        const cardInner = card.querySelector<HTMLElement>(".portrait-card-inner");
        const cardImage = card.querySelector<HTMLElement>(".portrait-card-image");

        if (!cardInner || !cardImage) return;

        const revealTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        revealTl
          .from(cardInner, {
            clipPath: "inset(100% 0 0 0)",
            duration: 1.1,
            ease: "power4.out",
          })
          .from(
            cardImage,
            { scale: 1.2, duration: 1.4, ease: "power4.out" },
            0,
          );

        const handleMouseEnter = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
          const rotateX = ((rect.height / 2 - (e.clientY - rect.top)) / (rect.height / 2)) * 8;
          gsap.to(cardInner, {
            rotateX,
            rotateY,
            transformPerspective: 1000,
            duration: 0.5,
            ease: "power2.out",
          });
        };

        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
          const rotateX = ((rect.height / 2 - (e.clientY - rect.top)) / (rect.height / 2)) * 8;
          gsap.to(cardInner, { rotateX, rotateY, duration: 0.3, ease: "power2.out" });
        };

        const handleMouseLeave = () => {
          gsap.to(cardInner, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)",
          });
        };

        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);

        cleanups.push(() => {
          card.removeEventListener("mouseenter", handleMouseEnter);
          card.removeEventListener("mousemove", handleMouseMove);
          card.removeEventListener("mouseleave", handleMouseLeave);
        });
      });
    }, section);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [items]);

  return (
    <section ref={sectionRef} id={id} className="bg-white py-16 md:py-24 lg:py-[160px]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <SectionHeading
          className="mb-12 md:mb-16 lg:mb-[80px]"
          eyebrow={eyebrow}
          title={heading}
          action={
            <Link
              href={ctaHref}
              data-cursor="button"
              className="inline-block text-center md:text-left font-ui text-[9px] md:text-[10px] lg:text-[11px] font-light tracking-[0.25em] uppercase px-6 md:px-8 py-3 md:py-4 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors duration-300"
            >
              {ctaLabel}
            </Link>
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
          {items.map((talent, index) => (
            <PortraitCard
              key={talent.name}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              title={talent.name}
              subtitle={talent.specialty}
              image={talent.image}
              offset={talent.offset}
            />
          ))}
        </div>
      </div>
    </section>
  );
}