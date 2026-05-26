interface StatItemProps {
    value: string;
    label: string;
    className?: string;
  }
  
  export default function StatItem({ value, label, className = "" }: StatItemProps) {
    return (
      <div className={`text-center ${className}`}>
        <div className="font-display text-[56px] md:text-[64px] lg:text-[72px] font-light text-white leading-none">
          {value}
        </div>
        <p className="font-ui text-[8px] md:text-[9px] font-light tracking-[0.25em] md:tracking-[0.3em] uppercase text-[#9A9A9A] mt-2">
          {label}
        </p>
      </div>
    );
  }