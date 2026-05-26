interface ContactDetailItemProps {
    label: string;
    lines: string[];
  }
  
  export default function ContactDetailItem({ label, lines }: ContactDetailItemProps) {
    return (
      <div className="border-t border-[#E0E0E0] pt-6 md:pt-8">
        <p className="font-ui text-[10px] md:text-[11px] font-light tracking-[0.25em] uppercase text-[#6A6A6A] mb-2 md:mb-3">
          {label}
        </p>
        <p className="font-display text-[18px] md:text-[20px] lg:text-[22px] font-light text-[#0A0A0A] leading-[1.5]">
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