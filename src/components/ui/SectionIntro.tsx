
interface SectionIntroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  compact?: boolean;
  className?: string;
}

export default function SectionIntro({
  eyebrow,
  title,
  description,
  compact = false,
  className = "",
}: SectionIntroProps) {
  return (
    <div className={className}>
      <div className={compact ? "mb-4 md:mb-0" : "mb-8 md:mb-0"}>
        {eyebrow && (
          <p
            className={`font-ui text-[9px] md:text-[10px] font-light tracking-[0.35em] md:tracking-[0.45em] uppercase text-[#C8A97A] ${compact ? "mb-3" : "mb-4 md:mb-5"}`}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={`font-display font-light tracking-[0.04em] text-[#0A0A0A] leading-[0.9] ${compact ? "text-[40px] md:text-[56px] lg:text-[72px] mb-4 md:mb-0" : "text-[48px] md:text-[72px] lg:text-[96px] mb-6 md:mb-0"}`}
        >
          {title}
        </h2>
      </div>
        {description && (
          <div className="md:max-w-[500px] lg:max-w-none">
            <p className="font-display italic text-[16px] md:text-[18px] font-light text-[#4A4A4A] leading-[1.7]">
              {description}
            </p>
          </div>
        )}
      </div>
    );
  }