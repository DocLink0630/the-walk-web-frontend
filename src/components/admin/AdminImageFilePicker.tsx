"use client";

import { useRef } from "react";
import {
  ACCEPTED_IMAGE_LABEL,
  ACCEPTED_IMAGE_MIME,
} from "@/lib/registration/accepted-image-types";
import { adminLabel } from "./admin-ui";

export default function AdminImageFilePicker({
  label,
  fileName,
  onPick,
  onClear,
  showClear,
}: {
  label: string;
  fileName: string | null;
  onPick: (file: File) => void;
  onClear?: () => void;
  showClear?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className={adminLabel}>{label}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border border-dashed border-[#D4D4D4] hover:border-[#C8A97A] px-3 py-4 text-left transition-colors bg-white"
      >
        {fileName ? (
          <span className="font-ui text-[10px] text-[#0A0A0A] truncate block">{fileName}</span>
        ) : (
          <span className="font-ui text-[10px] text-[#9A9A9A]">
            Choose file ({ACCEPTED_IMAGE_LABEL})
          </span>
        )}
      </button>
      {showClear && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="font-ui text-[9px] tracking-[0.1em] uppercase text-[#9A9A9A] hover:text-red-600 mt-1"
        >
          Remove
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_MIME}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
