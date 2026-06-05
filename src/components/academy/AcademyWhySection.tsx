import Image from "next/image";
import { ACADEMY_PAGE_CONTAINER } from "@/data/academy-page";
import type { AcademyPageContent } from "@/types/academy-page";

interface AcademyWhySectionProps {
  why: AcademyPageContent["why"];
}

export default function AcademyWhySection({ why }: AcademyWhySectionProps) {
  const [mainImage, ...gridImages] = why.images;

  return (
    <section className="py-16 md:py-24 lg:py-[120px] bg-white">
      <div className={ACADEMY_PAGE_CONTAINER}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 lg:gap-20 items-start">
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-32">
              <div data-academy-reveal-group data-academy-start="top 80%">
                <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A] mb-5 md:mb-6">
                  {why.eyebrow}
                </p>
                <h2 className="font-display text-[36px] md:text-[52px] lg:text-[64px] font-light text-[#0A0A0A] leading-[1] mb-6 md:mb-8">
                  {why.heading}
                </h2>
                <div className="w-16 md:w-20 h-px bg-[#E0E0E0] mb-10 md:mb-16" />
              </div>
              <div className="space-y-8 md:space-y-12">
                {why.items.map((item) => (
                  <div key={item.title} className="group" data-academy-reveal data-academy-y="35">
                    <h3 className="font-ui text-[9px] tracking-[0.28em] uppercase text-[#C8A97A] mb-3 md:mb-4 group-hover:text-[#0A0A0A] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="font-display text-[16px] md:text-[18px] font-light text-[#4A4A4A] leading-[1.7] max-w-[540px]">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div data-academy-clip-group className="space-y-4 md:space-y-5">
              <div data-academy-clip className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={mainImage.src}
                  alt={mainImage.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-5">
                {gridImages.map((img) => (
                  <div
                    key={img.src}
                    data-academy-clip
                    className="relative aspect-square overflow-hidden"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 50vw, 20vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
