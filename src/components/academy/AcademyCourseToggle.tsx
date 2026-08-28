"use client";

import type { KeyboardEvent } from "react";
import type { AcademyCourseId } from "@/types/academy-page";

const OPTIONS: { id: AcademyCourseId; label: string }[] = [
  { id: "normal", label: "Normal Course" },
  { id: "advanced", label: "Advanced Course" },
];

interface AcademyCourseToggleProps {
  value: AcademyCourseId;
  onChange: (value: AcademyCourseId) => void;
  className?: string;
}

export default function AcademyCourseToggle({
  value,
  onChange,
  className = "",
}: AcademyCourseToggleProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, id: AcademyCourseId) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(id);
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Select course type"
      className={`flex flex-wrap justify-center gap-3 md:gap-4 ${className}`}
    >
      {OPTIONS.map((option) => {
        const isActive = value === option.id;
        const isAdvanced = option.id === "advanced";

        let buttonClass =
          "font-ui text-[10px] md:text-[11px] tracking-[0.25em] uppercase px-6 md:px-8 py-3 md:py-3.5 border transition-colors duration-300 shrink-0";

        if (isAdvanced) {
          buttonClass += isActive
            ? " bg-[#C8A97A] text-white border-[#C8A97A]"
            : " text-[#C8A97A] border-[#C8A97A] hover:bg-[#C8A97A] hover:text-white";
        } else {
          buttonClass += isActive
            ? " bg-[#0A0A0A] text-white border-[#0A0A0A]"
            : " text-[#0A0A0A] border-[#E0E0E0] hover:border-[#0A0A0A]";
        }

        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            data-cursor="button"
            onClick={() => onChange(option.id)}
            onKeyDown={(e) => handleKeyDown(e, option.id)}
            className={buttonClass}
          >
            {isAdvanced && (
              <span className="block font-ui text-[8px] md:text-[9px] tracking-[0.3em] uppercase mb-1 opacity-90">
                Popular
              </span>
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
