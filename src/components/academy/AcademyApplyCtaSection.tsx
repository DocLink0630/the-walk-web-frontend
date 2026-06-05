import Link from "next/link";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import { ACADEMY_PAGE_CONTAINER } from "@/data/academy-page";
import type { AcademyPageContent } from "@/types/academy-page";

interface AcademyApplyCtaSectionProps {
  cta: AcademyPageContent["cta"];
}

export default function AcademyApplyCtaSection({ cta }: AcademyApplyCtaSectionProps) {
  return (
    <section className="py-16 md:py-24 lg:py-[120px] bg-white">
      <div className={ACADEMY_PAGE_CONTAINER}>
        <div
          data-academy-reveal-group
          data-academy-start="top 80%"
          className="max-w-[900px] mx-auto text-center"
        >
          <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A] mb-5 md:mb-6">
            {cta.eyebrow}
          </p>
          <h2 className="font-display text-[36px] md:text-[52px] lg:text-[64px] font-light text-[#0A0A0A] leading-[1.05] mb-6 md:mb-8">
            {cta.heading}
          </h2>
          <p className="font-display text-[17px] md:text-[20px] font-light text-[#4A4A4A] leading-[1.7] max-w-[680px] mx-auto mb-10 md:mb-12">
            {cta.description}
          </p>
          <Link href={cta.href} data-cursor="button" className={CTA_PRIMARY_FILLED}>
            {cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
