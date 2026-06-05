import type { AcademyPageContent } from "@/types/academy-page";

interface AcademyFeesSectionProps {
  fees: AcademyPageContent["fees"];
}

export default function AcademyFeesSection({ fees }: AcademyFeesSectionProps) {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <div
          data-academy-reveal-group
          data-academy-start="top 85%"
          className="text-center mb-12 md:mb-16"
        >
          <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A] mb-3">
            {fees.eyebrow}
          </p>
          <h2 className="font-display text-[42px] md:text-[56px] font-light text-[#0A0A0A] leading-[1]">
            {fees.heading}
          </h2>
        </div>

        <div
          data-academy-reveal
          data-academy-start="top 82%"
          className="bg-[#FAFAF9] border border-[#E5E3E0] overflow-hidden"
        >
          <div className="p-8 md:p-10 border-b border-[#E5E3E0] bg-white">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="font-ui text-[10px] tracking-[0.3em] uppercase text-[#9A9A9A] mb-2">
                  {fees.registration.label}
                </p>
                <p className="font-display text-[15px] font-light text-[#4A4A4A]">
                  {fees.registration.note}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-[48px] md:text-[56px] font-light text-[#0A0A0A] leading-[1]">
                  {fees.registration.amount}
                </p>
                <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A]">
                  LKR
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 lg:p-12">
            <p className="font-ui text-[10px] tracking-[0.3em] uppercase text-[#9A9A9A] mb-8 md:mb-10">
              Course Fee — Choose Your Payment Plan
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white border-2 border-[#E5E3E0] p-6 md:p-8 hover:border-[#C8A97A] transition-colors duration-300">
                <p className="font-ui text-[9px] tracking-[0.3em] uppercase text-[#4A4A4A] mb-6">
                  OPTION 1: Installments
                </p>
                <div className="space-y-3 mb-6">
                  {fees.installments.map((row, i) => (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between pb-3 ${i < fees.installments.length - 1 ? "border-b border-[#F0F0F0]" : ""}`}
                    >
                      <span className="font-display text-[16px] text-[#4A4A4A]">
                        {row.label}
                      </span>
                      <span className="font-display text-[20px] text-[#0A0A0A]">
                        {row.amount}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t-2 border-[#0A0A0A]">
                  <div className="flex items-baseline justify-between">
                    <span className="font-ui text-[10px] tracking-[0.25em] uppercase text-[#0A0A0A]">
                      TOTAL
                    </span>
                    <div className="text-right">
                      <span className="font-display text-[36px] md:text-[42px] font-light text-[#0A0A0A]">
                        {fees.installmentTotal}
                      </span>
                      <span className="font-ui text-[11px] tracking-[0.2em] uppercase text-[#9A9A9A] ml-2">
                        LKR
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0A0A0A] border-2 border-[#C8A97A] p-6 md:p-8 relative">
                <span className="absolute top-4 right-4 font-ui text-[8px] tracking-[0.25em] uppercase px-3 py-1.5 bg-[#C8A97A] text-white">
                  {fees.fullPayment.badge}
                </span>
                <p className="font-ui text-[9px] tracking-[0.3em] uppercase text-[#C8A97A] mb-6">
                  OPTION 2: Full Payment
                </p>
                <p className="font-display text-[15px] font-light text-white/70 mb-6">
                  {fees.fullPayment.note}
                </p>
                <div className="bg-white/5 backdrop-blur-sm p-5 mb-4">
                  <p className="font-ui text-[9px] tracking-[0.2em] uppercase text-white/50 mb-2 line-through">
                    {fees.fullPayment.regular}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-[48px] md:text-[56px] font-light text-[#C8A97A] leading-[1]">
                      {fees.fullPayment.amount}
                    </span>
                    <span className="font-ui text-[11px] tracking-[0.2em] uppercase text-white/60">
                      LKR
                    </span>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-[#C8A97A]">
                    <span className="font-ui text-[10px] tracking-[0.25em] uppercase">
                      YOU SAVE
                    </span>
                    <span className="font-display text-[28px] font-light">
                      {fees.fullPayment.savings}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F9F7F4] border-t border-[#E5E3E0] p-6 md:p-8 text-center">
            <p className="font-display text-[15px] font-light text-[#4A4A4A] leading-[1.7]">
              {fees.summary}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
