import type { AcademyPageContent } from "@/types/academy-page";

interface AcademyFeesSectionProps {
  fees: AcademyPageContent["fees"];
}

export default function AcademyFeesSection({ fees }: AcademyFeesSectionProps) {
  const gold = "#9A7329";
  const goldBright = "#B8941F";

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <div
          data-academy-reveal-group
          data-academy-start="top 85%"
          className="text-center mb-12 md:mb-16"
        >
          <p className="font-ui text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-[#9A7329] mb-3 font-medium">
            {fees.eyebrow}
          </p>
          <h2 className="font-display text-[42px] md:text-[56px] font-normal text-[#0A0A0A] leading-[1]">
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
                <p className="font-ui text-[11px] md:text-[12px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-2 font-medium">
                  {fees.registration.label}
                </p>
                <p className="font-display text-[16px] md:text-[17px] font-normal text-[#4A4A4A]">
                  {fees.registration.note}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-[52px] md:text-[60px] font-normal text-[#0A0A0A] leading-[1]">
                  {fees.registration.amount}
                </p>
                <p className="font-ui text-[11px] md:text-[12px] tracking-[0.2em] uppercase text-[#6B6B6B] font-medium">
                  LKR
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 lg:p-12">
            <p className="font-ui text-[11px] md:text-[12px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-8 md:mb-10 font-medium">
              Course Fee — Choose Your Payment Plan
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white border-2 border-[#E5E3E0] p-6 md:p-8 hover:border-[#9A7329] transition-colors duration-300">
                <p className="font-ui text-[11px] md:text-[12px] tracking-[0.3em] uppercase text-[#4A4A4A] mb-6 font-semibold">
                  OPTION 1: Installments
                </p>
                <div className="space-y-3 mb-6">
                  {fees.installments.map((row, i) => (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between pb-3 ${i < fees.installments.length - 1 ? "border-b border-[#F0F0F0]" : ""}`}
                    >
                      <span className="font-display text-[17px] md:text-[18px] font-normal text-[#4A4A4A]">
                        {row.label}
                      </span>
                      <span className="font-display text-[22px] md:text-[24px] font-medium text-[#0A0A0A]">
                        {row.amount}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t-2 border-[#0A0A0A]">
                  <div className="flex items-baseline justify-between">
                    <span className="font-ui text-[11px] md:text-[12px] tracking-[0.25em] uppercase text-[#0A0A0A] font-semibold">
                      TOTAL
                    </span>
                    <div className="text-right">
                      <span className="font-display text-[40px] md:text-[46px] font-normal text-[#0A0A0A]">
                        {fees.installmentTotal}
                      </span>
                      <span className="font-ui text-[12px] tracking-[0.2em] uppercase text-[#6B6B6B] ml-2 font-medium">
                        LKR
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="bg-[#0A0A0A] border-2 p-6 md:p-8 relative"
                style={{ borderColor: gold }}
              >
                <span
                  className="absolute top-4 right-4 font-ui text-[10px] md:text-[11px] tracking-[0.2em] uppercase px-3 py-1.5 text-white font-semibold"
                  style={{ backgroundColor: gold }}
                >
                  {fees.fullPayment.badge}
                </span>
                <p
                  className="font-ui text-[11px] md:text-[12px] tracking-[0.3em] uppercase mb-6 font-semibold"
                  style={{ color: goldBright }}
                >
                  OPTION 2: Full Payment
                </p>
                <p className="font-display text-[16px] md:text-[18px] font-normal text-white/90 mb-6">
                  {fees.fullPayment.note}
                </p>
                <div className="bg-white/10 p-5 md:p-6 mb-4">
                  <p className="font-ui text-[11px] md:text-[12px] tracking-[0.15em] uppercase text-white/75 mb-3 line-through font-medium">
                    {fees.fullPayment.regular}
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-display text-[52px] md:text-[64px] font-medium leading-[1]"
                      style={{ color: goldBright }}
                    >
                      {fees.fullPayment.amount}
                    </span>
                    <span className="font-ui text-[12px] md:text-[13px] tracking-[0.2em] uppercase text-white/85 font-semibold">
                      LKR
                    </span>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/20">
                  <div
                    className="flex items-center justify-between"
                    style={{ color: goldBright }}
                  >
                    <span className="font-ui text-[11px] md:text-[12px] tracking-[0.25em] uppercase font-semibold">
                      YOU SAVE
                    </span>
                    <span className="font-display text-[32px] md:text-[36px] font-medium">
                      {fees.fullPayment.savings}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F9F7F4] border-t border-[#E5E3E0] p-6 md:p-8 text-center">
            <p className="font-display text-[16px] md:text-[17px] font-normal text-[#4A4A4A] leading-[1.7]">
              {fees.summary}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
