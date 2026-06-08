import type { EventStat } from "@/types/events-page";

interface EventDetailStatsSectionProps {
  stats: EventStat[];
}

export default function EventDetailStatsSection({ stats }: EventDetailStatsSectionProps) {
  return (
    <section className="border-y border-[#E5E3E0] bg-[#FAFAF9]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <p className="font-display text-[40px] md:text-[52px] font-light text-[#C8A97A] leading-[1] mb-2">
                {stat.value}
              </p>
              <p className="font-ui text-[8px] md:text-[9px] tracking-[0.3em] uppercase text-[#9A9A9A]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
