import Link from "next/link";
import type { EventsPageContent } from "@/types/events-page";

interface EventsCtaSectionProps {
  cta: EventsPageContent["cta"];
}

export default function EventsCtaSection({ cta }: EventsCtaSectionProps) {
  return (
    <section className="bg-[#0A0A0A] py-12 md:py-16 lg:py-[80px]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-center">
          <div>
            <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A] mb-4">
              {cta.eyebrow}
            </p>
            <h2 className="font-display text-[36px] md:text-[48px] lg:text-[56px] font-light text-white leading-[1.05] mb-5 md:mb-6">
              {cta.heading}
            </h2>
            <p className="font-display italic text-[16px] md:text-[18px] font-light text-white/60 leading-[1.7]">
              {cta.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 md:gap-4 items-start">
            <Link
              href={cta.primaryHref}
              data-cursor="button"
              className="w-full md:w-auto inline-block text-center font-ui text-[9px] tracking-[0.3em] uppercase px-8 md:px-10 py-3 md:py-4 bg-[#C8A97A] text-white hover:bg-white hover:text-[#0A0A0A] transition-colors duration-300"
            >
              {cta.primaryLabel}
            </Link>
            <Link
              href={cta.secondaryHref}
              data-cursor="button"
              className="w-full md:w-auto inline-block text-center font-ui text-[9px] tracking-[0.3em] uppercase px-8 md:px-10 py-3 md:py-4 border border-white/30 text-white/70 hover:border-white hover:text-white transition-colors duration-300"
            >
              {cta.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
