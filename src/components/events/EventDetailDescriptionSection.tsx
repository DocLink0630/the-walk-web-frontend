import Link from "next/link";
import type { AgencyEvent } from "@/types/events-page";

interface EventDetailDescriptionSectionProps {
  event: AgencyEvent;
}

export default function EventDetailDescriptionSection({
  event,
}: EventDetailDescriptionSectionProps) {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4">
            <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A] mb-6">
              Event Highlights
            </p>
            <p className="font-ui text-[11px] md:text-[12px] font-semibold tracking-[0.18em] uppercase text-[#0A0A0A] leading-[1.8]">
              {event.highlight}
            </p>
          </div>

          <div className="lg:col-span-8">
            <p className="font-display text-[20px] md:text-[24px] font-light text-[#4A4A4A] leading-[1.8] mb-8">
              {event.fullDescription}
            </p>

            {event.status === "UPCOMING" && (
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-[#E5E3E0]">
                <Link
                  href="/register"
                  data-cursor="button"
                  className="inline-block text-center font-ui text-[9px] tracking-[0.3em] uppercase px-8 py-4 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors duration-300"
                >
                  Register for Event
                </Link>
                <Link
                  href="/inquiry"
                  data-cursor="button"
                  className="inline-block text-center font-ui text-[9px] tracking-[0.3em] uppercase px-8 py-4 border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors duration-300"
                >
                  Contact for Details
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
