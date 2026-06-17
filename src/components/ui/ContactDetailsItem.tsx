interface ContactDetailItemProps {
    label: string;
    lines: string[];
  }
  
  export default function ContactDetailItem({ label, lines }: ContactDetailItemProps) {
    return (
      <div className="border-t border-[#E0E0E0] pt-6 md:pt-8">
        <p className="font-ui text-[13px] md:text-[14px] font-semibold tracking-[0.15em] uppercase text-[#0A0A0A] mb-3 md:mb-4">
          {label}
        </p>
        <p className="font-display text-[22px] md:text-[24px] lg:text-[26px] font-normal text-[#0A0A0A] leading-[1.55]">
          {lines.map((line, i) => (
            <span key={line}>
              {line}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>
    );
  }