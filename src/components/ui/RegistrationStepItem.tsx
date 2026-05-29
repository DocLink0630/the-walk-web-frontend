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
        <span className="font-ui text-[10px] text-[#C8A97A]">{number}</span>
      </div>
      <div>
        <h4 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A] mb-2">
          {title}
        </h4>
        <p className="font-display text-[16px] text-[#6A6A6A] leading-[1.7]">
          {description}
        </p>
      </div>
    </div>
  );
}
