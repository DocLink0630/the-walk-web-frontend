"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACADEMY_COURSES, ACADEMY_PAGE } from "@/data/academy-page";
import { setupAcademyScrollAnimations } from "@/lib/gsap/academy-scroll-animations";
import type { AcademyCourseId } from "@/types/academy-page";
import AcademyApplyCtaSection from "./AcademyApplyCtaSection";
import AcademyFeesSection from "./AcademyFeesSection";
import AcademyHeroSection from "./AcademyHeroSection";
import AcademyProgrammeSection from "./AcademyProgrammeSection";
import AcademyStatsSection from "./AcademyStatsSection";
import AcademyTestimonialsSection from "./AcademyTestimonialsSection";
import AcademyWhySection from "./AcademyWhySection";

export default function AcademyPageContent() {
  const mainRef = useRef<HTMLElement>(null);
  const [courseId, setCourseId] = useState<AcademyCourseId>("normal");
  const activeCourse = ACADEMY_COURSES[courseId];

  const hero = {
    ...ACADEMY_PAGE.hero,
    ...activeCourse.hero,
  };

  const programme = {
    ...ACADEMY_PAGE.programme,
    course: activeCourse.programme.course,
    classTimes: {
      ...ACADEMY_PAGE.programme.classTimes,
      description:
        activeCourse.programme.classTimes?.description ??
        ACADEMY_PAGE.programme.classTimes.description,
    },
  };

  const cta = {
    ...ACADEMY_PAGE.cta,
    ...activeCourse.cta,
  };

  const handleCourseChange = useCallback((nextCourseId: AcademyCourseId) => {
    setCourseId(nextCourseId);
    document.getElementById("academy-programme")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const root = mainRef.current;
    if (!root) return;

    const cleanup = setupAcademyScrollAnimations(root);
    return cleanup;
  }, []);

  useEffect(() => {
    document.title = activeCourse.meta.title;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", activeCourse.meta.description);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, [courseId, activeCourse.meta.title, activeCourse.meta.description]);

  return (
    <main ref={mainRef} className="flex-1 min-h-screen bg-white">
      <AcademyHeroSection
        hero={hero}
        applyHref={cta.href}
        applyLabel={cta.label}
      />
      <AcademyStatsSection stats={ACADEMY_PAGE.stats} />
      <AcademyWhySection why={ACADEMY_PAGE.why} />
      <AcademyProgrammeSection
        programme={programme}
        courseId={courseId}
        onCourseChange={handleCourseChange}
        applyHref={cta.href}
        skills={activeCourse.skills}
        outcomes={activeCourse.outcomes}
      />
      <AcademyFeesSection key={courseId} fees={activeCourse.fees} />
      <AcademyTestimonialsSection testimonials={ACADEMY_PAGE.testimonials} />
      <AcademyApplyCtaSection cta={cta} />
    </main>
  );
}
