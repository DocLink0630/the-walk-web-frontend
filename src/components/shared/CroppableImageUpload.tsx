"use client";

import { useEffect, useRef, useState } from "react";
import {
  ACCEPTED_IMAGE_LABEL,
  ACCEPTED_IMAGE_MIME,
} from "@/lib/registration/accepted-image-types";
import ImageCropModal from "./ImageCropModal";
import { formHint, formLabel, formRequiredMark } from "@/components/registration/form-styles";

interface CroppableImageUploadProps {
  label: string;
  file: File | null;
  onFile: (file: File | null) => void;
  required?: boolean;
  error?: string | null;
  previewAspectRatio?: string;
}

interface PendingCrop {
  src: string;
  fileName: string;
}

export default function CroppableImageUpload({
  label,
  file,
  onFile,
  required = false,
  error = null,
  previewAspectRatio = "4 / 3",
}: CroppableImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingCrop, setPendingCrop] = useState<PendingCrop | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFileSelect(selected: File | null) {
    if (!selected) return;
    const src = URL.createObjectURL(selected);
    setPendingCrop({ src, fileName: selected.name });
  }

  function closePendingCrop() {
    if (pendingCrop) {
      URL.revokeObjectURL(pendingCrop.src);
      setPendingCrop(null);
    }
  }

  function handleCropConfirm(cropped: File) {
    onFile(cropped);
    closePendingCrop();
  }

  return (
    <>
      <div className="space-y-1">
        <p className={formLabel}>
          {label} {required && <span className={formRequiredMark}>*</span>}
        </p>
        <button
          type="button"
          onClick={openPicker}
          data-cursor="button"
          className={[
            "relative w-full border transition-colors overflow-hidden group",
            error ? "border-red-400" : "border-[#E0E0E0] hover:border-[#C8A97A]",
          ].join(" ")}
          style={{ aspectRatio: previewAspectRatio }}
        >
          {previewUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt={label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 font-ui text-[9px] tracking-[0.2em] uppercase text-white transition-opacity">
                  Replace
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 py-8">
              <span className="text-[#C8A97A] text-2xl">+</span>
              <span className="font-ui text-[11px] tracking-[0.1em] uppercase text-[#4A4A4A]">
                Click to upload
              </span>
              <span className="font-ui text-[11px] text-[#6B6B6B]">{ACCEPTED_IMAGE_LABEL}</span>
            </div>
          )}
        </button>
        {file && (
          <div className="flex items-center justify-between">
            <p className="font-ui text-[11px] text-[#4A4A4A] truncate max-w-[70%]">{file.name}</p>
            <button
              type="button"
              onClick={() => onFile(null)}
              className="font-ui text-[9px] tracking-[0.15em] uppercase text-[#9A9A9A] hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          </div>
        )}
        {error && <p className={formHint + " text-red-600"}>{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_MIME}
          className="hidden"
          onChange={(e) => {
            handleFileSelect(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
      </div>

      {pendingCrop && (
        <ImageCropModal
          imageSrc={pendingCrop.src}
          fileName={pendingCrop.fileName}
          onConfirm={handleCropConfirm}
          onCancel={closePendingCrop}
        />
      )}
    </>
  );
}

/** Opens crop modal for a file, then calls onCropped. For portfolio grids / multi-add flows. */
export function useCropImagePicker(onCropped: (file: File) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingCrop, setPendingCrop] = useState<PendingCrop | null>(null);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFileSelect(selected: File | null) {
    if (!selected) return;
    const src = URL.createObjectURL(selected);
    setPendingCrop({ src, fileName: selected.name });
  }

  function closePendingCrop() {
    if (pendingCrop) {
      URL.revokeObjectURL(pendingCrop.src);
      setPendingCrop(null);
    }
  }

  function handleCropConfirm(cropped: File) {
    onCropped(cropped);
    closePendingCrop();
  }

  const cropModal = pendingCrop ? (
    <ImageCropModal
      imageSrc={pendingCrop.src}
      fileName={pendingCrop.fileName}
      onConfirm={handleCropConfirm}
      onCancel={closePendingCrop}
    />
  ) : null;

  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPTED_IMAGE_MIME}
      className="hidden"
      onChange={(e) => {
        handleFileSelect(e.target.files?.[0] ?? null);
        e.target.value = "";
      }}
    />
  );

  return { openPicker, cropModal, hiddenInput };
}
