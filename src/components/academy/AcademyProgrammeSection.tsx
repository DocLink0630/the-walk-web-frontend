import Image from "next/image";
import Link from "next/link";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import { ACADEMY_PAGE_CONTAINER } from "@/data/academy-page";
import type {
  AcademyCourseId,
  AcademyOutcomes,
  AcademyPageContent,
  AcademySkillCategory,
} from "@/types/academy-page";
import AcademyCourseToggle from "./AcademyCourseToggle";

interface AcademyProgrammeSectionProps {
  programme: AcademyPageContent["programme"];
  courseId: AcademyCourseId;
  onCourseChange: (courseId: AcademyCourseId) => void;
  applyHref?: string;
  skills?: AcademySkillCategory[];
  outcomes?: AcademyOutcomes;
}

export default function AcademyProgrammeSection({
  programme,
  courseId,
  onCourseChange,
  applyHref = "/register",
  skills,
  outcomes,
}: AcademyProgrammeSectionProps) {
  const { course } = programme;
  const isAdvanced = courseId === "advanced";
  const monthGridClass = isAdvanced
    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:divide-x divide-[#E5E3E0]"
    : "grid grid-cols-1 md:grid-cols-3 md:divide-x divide-[#E5E3E0]";

  return (
    <section
      id="academy-programme"
      className="py-16 md:py-24 lg:py-[120px] bg-[#F9F7F4] border-t border-[#E5E3E0]"
    >
      <div className={ACADEMY_PAGE_CONTAINER}>
        <div
          data-academy-reveal-group
          data-academy-start="top 88%"
          className="mb-12 md:mb-16 lg:mb-20 text-center max-w-[800px] mx-auto"
        >
          <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A] mb-4 md:mb-5">
            {programme.eyebrow}
          </p>
          <h2 className="font-display text-[42px] md:text-[60px] lg:text-[72px] font-light text-[#0A0A0A] leading-[0.95] mb-5 md:mb-6">
            {programme.heading}
          </h2>
          <div className="w-12 md:w-16 h-px bg-[#C8A97A] mx-auto mb-8 md:mb-10" />
          <AcademyCourseToggle value={courseId} onChange={onCourseChange} />
        </div>

        <div
          key={courseId}
          data-academy-reveal
          data-academy-start="top 85%"
          className="bg-white border border-[#E0E0E0] shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
        >
          <div className="relative aspect-[16/9] md:aspect-[21/8] overflow-hidden">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1440px) 100vw, 1440px"
            />
          </div>

          <div className="p-6 md:p-10 lg:p-14 border-b border-[#E5E3E0]">
            <div className="flex items-center gap-3 md:gap-3.5 mb-5 md:mb-6">
              <span className="font-ui text-[9px] tracking-[0.28em] uppercase text-[#C8A97A]">
                {course.duration}
              </span>
              <span className="text-[#D0D0D0]">·</span>
              <span className="font-ui text-[9px] tracking-[0.22em] uppercase text-[#9A9A9A]">
                {course.level}
              </span>
            </div>
            <h3 className="font-display text-[32px] md:text-[44px] lg:text-[52px] font-light text-[#0A0A0A] leading-[1.05] mb-4 md:mb-6">
              {course.title}
            </h3>
            <p className="font-display text-[16px] md:text-[18px] font-light text-[#4A4A4A] leading-[1.7] max-w-[720px]">
              {course.description}
            </p>
            <Link
              href={applyHref}
              data-cursor="button"
              className={CTA_PRIMARY_FILLED + " mt-8 md:mt-10"}
            >
              APPLY NOW
            </Link>
          </div>

          <div className={monthGridClass}>
            {course.months.map((month, index) => (
              <div
                key={month.number}
                data-academy-month
                data-academy-delay={index * 0.08}
                className={`p-6 md:p-10 lg:p-12 ${index % 2 === 0 ? "bg-white" : "bg-[#FAFAF9]"} border-t md:border-t-0 first:border-t-0`}
              >
                <div className="inline-flex items-center justify-center font-ui text-[11px] md:text-[12px] font-semibold tracking-[0.18em] uppercase px-3 md:px-4 py-1.5 md:py-2 border-2 border-[#0A0A0A] text-[#0A0A0A] mb-5 md:mb-6">
                  {month.number}
                </div>
                <h4 className="font-display text-[28px] md:text-[32px] lg:text-[36px] font-light text-[#0A0A0A] leading-[1.05] mb-6 md:mb-8">
                  {month.title}
                </h4>
                <ul className="space-y-3 md:space-y-3.5">
                  {month.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 md:gap-3.5">
                      <span className="w-1 h-1 bg-[#C8A97A] shrink-0 mt-[8px]" />
                      <span className="font-display text-[15px] md:text-[16px] font-light text-[#4A4A4A] leading-[1.65]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {skills && skills.length > 0 && (
            <div className="border-t border-[#E5E3E0] p-6 md:p-10 lg:p-14 bg-[#FAFAF9]">
              <div className="text-center max-w-[640px] mx-auto mb-8 md:mb-10">
                <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A] mb-3">
                  CORE SKILLS
                </p>
                <h4 className="font-display text-[28px] md:text-[36px] font-light text-[#0A0A0A] leading-[1.05]">
                  Core Skills Developed
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {skills.map((category, index) => (
                  <div
                    key={category.title}
                    className={`p-6 md:p-8 border border-[#E0E0E0] ${index % 2 === 0 ? "bg-white" : "bg-[#FAFAF9]"}`}
                  >
                    <h5 className="font-ui text-[11px] md:text-[12px] font-semibold tracking-[0.18em] uppercase text-[#0A0A0A] mb-5 md:mb-6">
                      {category.title}
                    </h5>
                    <ul className="space-y-3">
                      {category.items.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="w-1 h-1 bg-[#C8A97A] shrink-0 mt-[8px]" />
                          <span className="font-display text-[15px] md:text-[16px] font-light text-[#4A4A4A] leading-[1.65]">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {outcomes && (
            <div className="border-t border-[#E5E3E0] p-6 md:p-10 lg:p-14 bg-white">
              <div className="text-center max-w-[640px] mx-auto mb-8 md:mb-10">
                <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A] mb-3">
                  {outcomes.eyebrow}
                </p>
                <h4 className="font-display text-[28px] md:text-[36px] font-light text-[#0A0A0A] leading-[1.05]">
                  {outcomes.heading}
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-[960px] mx-auto">
                <div className="p-6 md:p-8 border border-[#E0E0E0] bg-[#FAFAF9]">
                  <p className="font-display text-[17px] md:text-[18px] font-light text-[#0A0A0A] mb-5 md:mb-6">
                    {outcomes.assessmentIntro}
                  </p>
                  <ul className="space-y-3">
                    {outcomes.assessmentItems.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="w-1 h-1 bg-[#C8A97A] shrink-0 mt-[8px]" />
                        <span className="font-display text-[15px] md:text-[16px] font-light text-[#4A4A4A] leading-[1.65]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 md:p-8 border border-[#E0E0E0] bg-white">
                  <p className="font-display text-[17px] md:text-[18px] font-light text-[#0A0A0A] mb-5 md:mb-6">
                    {outcomes.developmentIntro}
                  </p>
                  <ul className="space-y-3">
                    {outcomes.developmentItems.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="w-1 h-1 bg-[#C8A97A] shrink-0 mt-[8px]" />
                        <span className="font-display text-[15px] md:text-[16px] font-light text-[#4A4A4A] leading-[1.65]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {programme.classTimes && (
          <div
            key={`${courseId}-schedule`}
            data-academy-reveal
            data-academy-start="top 85%"
            className="mt-12 md:mt-16 lg:mt-20"
          >
            <div className="text-center max-w-[640px] mx-auto mb-8 md:mb-10">
              <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A] mb-3">
                {programme.classTimes.eyebrow}
              </p>
              <h3 className="font-display text-[32px] md:text-[44px] font-light text-[#0A0A0A] leading-[1.05] mb-3">
                {programme.classTimes.heading}
              </h3>
              <p className="font-ui text-sm md:text-base text-[#4A4A4A] leading-relaxed">
                {programme.classTimes.description}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {programme.classTimes.slots.map((slot) => (
                <div
                  key={slot.label}
                  className="border border-[#E0E0E0] bg-white px-6 py-8 text-center"
                >
                  <p className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#C8A97A] mb-2">
                    {slot.day}
                  </p>
                  <p className="font-display text-xl md:text-2xl font-light text-[#0A0A0A]">
                    {slot.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
