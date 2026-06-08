import Image from "next/image";
import { ACADEMY_PAGE_CONTAINER } from "@/data/academy-page";
import type { AcademyPageContent } from "@/types/academy-page";

interface AcademyTestimonialsSectionProps {
  testimonials: AcademyPageContent["testimonials"];
}

export default function AcademyTestimonialsSection({
  testimonials,
}: AcademyTestimonialsSectionProps) {
  return (
    <section className="py-16 md:py-24 lg:py-[120px] bg-[#0A0A0A]">
      <div className={ACADEMY_PAGE_CONTAINER}>
        <div
          data-academy-reveal-group
          data-academy-start="top 85%"
          className="mb-12 md:mb-16 lg:mb-20 text-center max-w-[800px] mx-auto"
        >
          <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A] mb-4 md:mb-5">
            {testimonials.eyebrow}
          </p>
          <h2 className="font-display text-[42px] md:text-[60px] lg:text-[72px] font-light text-white leading-[0.95] mb-5 md:mb-6">
            {testimonials.heading}
          </h2>
          <div className="w-12 md:w-16 h-px bg-[#C8A97A] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-7">
          {testimonials.items.map((t, i) => (
            <div
              key={t.name}
              data-academy-testimonial
              data-academy-delay={i * 0.15}
              className="border border-white/8 p-6 md:p-9 lg:p-11 flex flex-col hover:border-[#C8A97A]/30 hover:bg-white/[0.02] transition-all duration-400"
            >
              <div className="font-display text-[70px] md:text-[90px] leading-[0.6] text-[#C8A97A]/25 mb-5 md:mb-7 select-none">
                &ldquo;
              </div>
              <p className="font-display italic text-[17px] md:text-[19px] font-light text-white/85 leading-[1.7] flex-1 mb-8 md:mb-10">
                {t.quote}
              </p>
              <div className="flex items-center gap-3 md:gap-4 pt-6 md:pt-7 border-t border-white/8">
                {t.image && (
                  <div className="relative w-10 md:w-11 h-10 md:h-11 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                )}
                <div>
                  <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-white/85 mb-1">
                    {t.name}
                  </p>
                  {t.course && (
                    <p className="font-ui text-[8px] tracking-[0.18em] uppercase text-[#C8A97A] mb-0.5">
                      {t.course}
                    </p>
                  )}
                  {t.year && (
                    <p className="font-ui text-[8px] tracking-[0.15em] uppercase text-white/25">
                      {t.year}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
