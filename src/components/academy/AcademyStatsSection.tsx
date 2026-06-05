import { ACADEMY_PAGE_CONTAINER } from "@/data/academy-page";
import type { AcademyStat } from "@/types/academy-page";

interface AcademyStatsSectionProps {
  stats: AcademyStat[];
}

export default function AcademyStatsSection({ stats }: AcademyStatsSectionProps) {
  return (
    <section className="bg-[#0A0A0A]">
      <div className={ACADEMY_PAGE_CONTAINER}>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              data-academy-stat
              data-academy-delay={i * 0.1}
              className="py-10 md:py-14 px-6 md:px-12 text-center"
            >
              <p className="font-display text-[48px] md:text-[68px] font-light text-[#C8A97A] leading-[1] mb-2 md:mb-3">
                {stat.value}
              </p>
              <p className="font-ui text-[8px] md:text-[9px] tracking-[0.3em] uppercase text-white/35 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
