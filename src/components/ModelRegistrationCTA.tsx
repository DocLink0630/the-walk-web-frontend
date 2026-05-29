"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MODEL_REGISTRATION_COPY,
  MODEL_REGISTRATION_IMAGES,
  MODEL_REGISTRATION_STEPS,
} from "@/data/model-registration";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import { renderMultilineHeading } from "@/lib/render-multiline-heading";
import type {
  ModelRegistrationCTAProps,
  ModelRegistrationImage,
  RegistrationStep,
} from "@/types/model-registration";
import AccentDivider from "@/components/ui/AccentDivider";
import AsymmetricImageComposition from "@/components/ui/AsymmetricImageComposition";
import MagneticLink from "@/components/ui/MagneticLink";
import RegistrationStepItem from "@/components/ui/RegistrationStepItem";

gsap.registerPlugin(ScrollTrigger);

export default function ModelRegistrationCTA({
  id = "model-registration",
  eyebrow = MODEL_REGISTRATION_COPY.eyebrow,
  heading = MODEL_REGISTRATION_COPY.heading,
  description = MODEL_REGISTRATION_COPY.description,
  steps = MODEL_REGISTRATION_STEPS,
  ctaLabel = MODEL_REGISTRATION_COPY.ctaLabel,
  ctaHref = MODEL_REGISTRATION_COPY.ctaHref,
  images = MODEL_REGISTRATION_IMAGES,
  decorativeText = MODEL_REGISTRATION_COPY.decorativeText,
}: ModelRegistrationCTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      imageRefs.current.forEach((image, index) => {
        if (!image) return;

        timeline.from(
          image,
          {
            clipPath: "inset(100% 0 0 0)",
            duration: 1.2,
            ease: "power4.out",
          },
          index * 0.15,
        );
      });

      if (contentRef.current) {
        timeline.from(
          contentRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.8",
        );
      }
    }, section);

    return () => ctx.revert();
  }, [images, steps, eyebrow, heading, description]);

  const handleImageRef = (index: number, element: HTMLDivElement | null) => {
    imageRefs.current[index] = element;
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className="bg-white py-16 md:py-24 lg:py-[140px] overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0">
          <div className="lg:col-span-6 relative">
            <AsymmetricImageComposition
              images={images}
              decorativeText={decorativeText}
              onImageRef={handleImageRef}
            />
          </div>

          <div
            ref={contentRef}
            className="lg:col-span-6 flex items-center lg:pl-20"
          >
            <div className="max-w-[600px]">
              <p className="font-ui text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-[#C8A97A] mb-6">
                {eyebrow}
              </p>

              <h2 className="font-display text-[48px] md:text-[64px] lg:text-[72px] font-light text-[#0A0A0A] leading-[0.95] tracking-[0.02em] mb-8">
                {renderMultilineHeading(heading)}
              </h2>

              <AccentDivider className="h-px w-20 bg-[#C8A97A] mb-10" />

              <p className="font-display italic text-[18px] md:text-[20px] text-[#4A4A4A] leading-[1.8] mb-12">
                {description}
              </p>

              <div className="space-y-6 mb-12">
                {steps.map((step: RegistrationStep) => (
                  <RegistrationStepItem key={step.number} {...step} />
                ))}
              </div>

              <MagneticLink href={ctaHref} className={CTA_PRIMARY_FILLED}>
                {ctaLabel}
              </MagneticLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { ModelRegistrationCTAProps, ModelRegistrationImage, RegistrationStep };
