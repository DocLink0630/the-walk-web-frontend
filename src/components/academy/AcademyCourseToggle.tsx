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
      className={`flex flex-col sm:flex-row justify-center gap-3 md:gap-4 p-2.5 md:p-3 bg-white border-2 border-[#0A0A0A] shadow-[0_8px_28px_rgba(10,10,10,0.08)] max-w-[640px] mx-auto ${className}`}
    >
      {OPTIONS.map((option) => {
        const isActive = value === option.id;
        const isAdvanced = option.id === "advanced";

        let buttonClass =
          "relative font-ui text-[12px] md:text-[14px] font-semibold tracking-[0.18em] md:tracking-[0.22em] uppercase px-6 md:px-10 py-4 md:py-5 border-2 transition-all duration-300 flex-1";

        if (isAdvanced) {
          buttonClass += isActive
            ? " bg-[#C8A97A] text-white border-[#C8A97A] shadow-[0_6px_20px_rgba(200,169,122,0.45)]"
            : " bg-[#F9F7F4] text-[#C8A97A] border-[#C8A97A] hover:bg-[#C8A97A] hover:text-white hover:shadow-[0_6px_20px_rgba(200,169,122,0.35)]";
        } else {
          buttonClass += isActive
            ? " bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-[0_6px_20px_rgba(10,10,10,0.28)]"
            : " bg-[#F9F7F4] text-[#0A0A0A] border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white hover:shadow-[0_6px_20px_rgba(10,10,10,0.2)]";
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
              <span
                className={`absolute -top-2.5 left-1/2 -translate-x-1/2 font-ui text-[8px] md:text-[9px] tracking-[0.22em] uppercase px-2 py-0.5 ${
                  isActive
                    ? "bg-[#0A0A0A] text-white"
                    : "bg-[#C8A97A] text-white"
                }`}
              >
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
