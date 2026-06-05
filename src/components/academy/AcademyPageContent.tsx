"use client";

import { useLayoutEffect, useRef } from "react";
import { ACADEMY_PAGE } from "@/data/academy-page";
import { setupAcademyScrollAnimations } from "@/lib/gsap/academy-scroll-animations";
import AcademyApplyCtaSection from "./AcademyApplyCtaSection";
import AcademyFeesSection from "./AcademyFeesSection";
import AcademyHeroSection from "./AcademyHeroSection";
import AcademyProgrammeSection from "./AcademyProgrammeSection";
import AcademyStatsSection from "./AcademyStatsSection";
import AcademyTestimonialsSection from "./AcademyTestimonialsSection";
import AcademyWhySection from "./AcademyWhySection";

export default function AcademyPageContent() {
  const mainRef = useRef<HTMLElement>(null);
  const content = ACADEMY_PAGE;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const root = mainRef.current;
    if (!root) return;

    const cleanup = setupAcademyScrollAnimations(root);
    return cleanup;
  }, []);

  return (
    <main ref={mainRef} className="flex-1 min-h-screen bg-white">
      <AcademyHeroSection hero={content.hero} />
      <AcademyStatsSection stats={content.stats} />
      <AcademyWhySection why={content.why} />
      <AcademyProgrammeSection programme={content.programme} applyHref={content.cta.href} />
      <AcademyFeesSection fees={content.fees} />
      <AcademyTestimonialsSection testimonials={content.testimonials} />
      <AcademyApplyCtaSection cta={content.cta} />
    </main>
  );
}
