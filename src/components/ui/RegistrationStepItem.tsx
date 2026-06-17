import type { RegistrationStep } from "@/types/model-registration";

export default function RegistrationStepItem({
  number,
  title,
  description,
}: RegistrationStep) {
  return (
    <div className="flex items-start gap-5">
      <div
        className="w-10 h-10 shrink-0 border border-[#C8A97A] flex items-center justify-center"
        aria-hidden
      >
        <span className="font-ui text-[12px] md:text-[13px] font-semibold text-[#C8A97A]">{number}</span>
      </div>
      <div>
        <h4 className="font-ui text-[14px] md:text-[15px] font-semibold tracking-[0.12em] uppercase text-[#0A0A0A] mb-2">
          {title}
        </h4>
        <p className="font-display text-[18px] md:text-[19px] text-[#4A4A4A] leading-[1.65]">
          {description}
        </p>
      </div>
    </div>
  );
}
