"use client";

import { Lock } from "lucide-react";

interface ModelDetailFieldProps {
  label: string;
  value?: string | null;
  locked?: boolean;
  placeholder?: string;
}

export default function ModelDetailField({
  label,
  value,
  locked = false,
  placeholder = "Available soon",
}: ModelDetailFieldProps) {
  const display = value?.trim() || placeholder;

  return (
    <div className="border-b border-[#E8E8E8] py-3">
      <p className="font-ui text-[8px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-1.5">
        {label}
      </p>
      <div className="relative">
        <p
          className={[
            "font-ui text-[11px] tracking-[0.05em] text-[#0A0A0A]",
            locked ? "blur-[4px] select-none" : "",
          ].join(" ")}
        >
          {display}
        </p>
        {locked && (
          <div className="absolute inset-0 flex items-center justify-end">
            <Lock className="size-3 text-[#C8A97A]" strokeWidth={1.5} aria-hidden />
          </div>
        )}
      </div>
    </div>
  );
}
