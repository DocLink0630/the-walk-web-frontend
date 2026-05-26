"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTACT_DETAILS } from "@/data/contact";
import type { ContactDetail } from "@/types/contact";
import ContactDetailItem from "@/components/ui/ContactDetailsItem";
import MagneticButton from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

export interface ContactSectionProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  buttonLabel?: string;
  details?: ContactDetail[];
  onInquiry?: () => void;
}

export default function ContactSection({
  id = "contact",
  eyebrow = "GET IN TOUCH",
  heading = "LET'S TALK",
  description = "Book models. Apply as talent. Partner with us.",
  buttonLabel = "MAKE INQUIRY",
  details = CONTACT_DETAILS,
  onInquiry,
}: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (introRef.current) {
        gsap.from(introRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: introRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }

      detailRefs.current.forEach((el, i) => {
        if (!el) return;

        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.85,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [details, eyebrow, heading, description, buttonLabel]);

  return (
    <section
      ref={sectionRef}
      className="bg-white py-16 md:py-24 lg:py-[160px]"
      id={id}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12">
          <div ref={introRef} className="lg:col-span-7">
            <p className="font-ui text-[11px] md:text-[12px] font-light tracking-[0.25em] md:tracking-[0.3em] uppercase text-[#C8A97A] mb-4 md:mb-6">
              {eyebrow}
            </p>
            <h2 className="font-display text-[48px] md:text-[64px] lg:text-[84px] font-light tracking-[0.05em] text-[#0A0A0A] leading-[0.9] mb-6 md:mb-10 lg:mb-12">
              {heading}
            </h2>
            <p className="font-display italic text-[16px] md:text-[20px] lg:text-[24px] font-light tracking-[0.05em] text-[#4A4A4A] leading-[1.5] max-w-[500px]">
              {description}
            </p>

            <MagneticButton
              onClick={onInquiry}
              className="mt-8 md:mt-10 lg:mt-12 font-ui text-[11px] md:text-[12px] font-light tracking-[0.2em] uppercase px-8 md:px-10 lg:px-12 py-4 md:py-4.5 lg:py-5 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors duration-300 w-full sm:w-auto text-center"
            >
              {buttonLabel}
            </MagneticButton>
          </div>

          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            {details.map((detail, i) => (
              <div
                key={detail.label}
                ref={(el) => {
                  detailRefs.current[i] = el;
                }}
              >
                <ContactDetailItem {...detail} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
