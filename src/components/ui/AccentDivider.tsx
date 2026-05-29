import { forwardRef } from "react";

interface AccentDividerProps {
  className?: string;
}

const AccentDivider = forwardRef<HTMLDivElement, AccentDividerProps>(
  ({ className = "h-px w-24 bg-[#C8A97A]" }, ref) => (
    <div ref={ref} className={className} aria-hidden />
  ),
);

AccentDivider.displayName = "AccentDivider";

export default AccentDivider;
