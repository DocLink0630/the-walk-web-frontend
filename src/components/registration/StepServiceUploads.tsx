"use client";

import { useRef, useState } from "react";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import type { ServiceRegistrationCopy } from "@/lib/registration/service-copy";
import { submitServiceRegistration } from "@/lib/registration/submit-service-registration";
import {
  ACCEPTED_IMAGE_LABEL,
  ACCEPTED_IMAGE_MIME,
} from "@/lib/registration/accepted-image-types";
import type {
  ServiceRegistrationStore,
  ServiceRegistrationVariant,
} from "@/types/service-registration";
import {
  formActions,
  formBackBtn,
  formHeading,
  formHint,
  formLabel,
  formSubtitle,
} from "./form-styles";

interface FileDropZoneProps {
  label: string;
  file: File | null;
  onFile: (file: File | null) => void;
}

function FileDropZone({ label, file, onFile }: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <div className="space-y-1">
      <p className={formLabel}>{label}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        data-cursor="button"
        className="relative w-full border border-[#E0E0E0] hover:border-[#C8A97A] transition-colors overflow-hidden group"
        style={{ aspectRatio: "4 / 3" }}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={label} className="w-full h-full object-cover" />
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
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_MIME}
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function PortfolioGrid({
  portfolioPhotos,
  onChange,
}: {
  portfolioPhotos: File[];
  onChange: (photos: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX = 5;

  function addFiles(files: FileList) {
    const toAdd = Array.from(files).slice(0, MAX - portfolioPhotos.length);
    onChange([...portfolioPhotos, ...toAdd]);
  }

  return (
    <div className="space-y-2">
      <p className={formLabel}>
        Portfolio photos
        <span className="text-[#6B6B6B] normal-case tracking-normal font-normal ml-2">
          ({portfolioPhotos.length}/{MAX})
        </span>
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {portfolioPhotos.map((file, i) => {
          const url = URL.createObjectURL(file);
          return (
            <div key={`${file.name}-${i}`} className="relative group" style={{ aspectRatio: "3/4" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover border border-[#E0E0E0]" />
              <button
                type="button"
                onClick={() => onChange(portfolioPhotos.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white font-ui text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                ×
              </button>
            </div>
          );
        })}
        {portfolioPhotos.length < MAX && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            data-cursor="button"
            className="border border-dashed border-[#E0E0E0] hover:border-[#C8A97A] transition-colors flex flex-col items-center justify-center gap-1"
            style={{ aspectRatio: "3/4" }}
          >
            <span className="text-[#C8A97A] text-2xl">+</span>
            <span className="font-ui text-[11px] tracking-[0.1em] uppercase text-[#6B6B6B]">Add</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_MIME}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

interface StepServiceUploadsProps {
  store: ServiceRegistrationStore;
  copy: ServiceRegistrationCopy;
  variant: ServiceRegistrationVariant;
}

export default function StepServiceUploads({
  store,
  copy,
  variant,
}: StepServiceUploadsProps) {
  const [uploadProgress, setUploadProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    store.set({ error: null, isSubmitting: true });
    setUploadProgress(null);

    try {
      const result = await submitServiceRegistration(store, variant, (completed, total) => {
        setUploadProgress({ completed, total });
      });

      if (result.ok) {
        store.set({ success: true, isSubmitting: false });
      } else {
        store.set({ error: result.message, isSubmitting: false });
        setUploadProgress(null);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      store.set({ error: msg, isSubmitting: false });
      setUploadProgress(null);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <h2 className={formHeading}>{copy.uploadsTitle}</h2>
        <p className={formSubtitle}>{copy.uploadsSubtitle}</p>
      </div>

      <div className="max-w-[200px]">
        <FileDropZone
          label="Profile photo (optional)"
          file={store.profilePhoto}
          onFile={(f) => store.set({ profilePhoto: f })}
        />
      </div>

      <PortfolioGrid
        portfolioPhotos={store.portfolioPhotos}
        onChange={(photos) => store.set({ portfolioPhotos: photos })}
      />
      <p className={formHint}>
        Photos are optional — you can submit now and add work samples later.
      </p>

      {store.error && (
        <div className="border border-red-300 bg-red-50 px-4 py-3">
          {store.error.split("\n").map((line, i) => (
            <p key={i} className="font-ui text-sm text-red-700 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      )}

      <div className={formActions}>
        <button
          type="button"
          onClick={store.prevStep}
          disabled={store.isSubmitting}
          className={formBackBtn + " disabled:opacity-40"}
        >
          Back
        </button>
        <button
          type="submit"
          disabled={store.isSubmitting}
          data-cursor="button"
          className={CTA_PRIMARY_FILLED + " flex-1 text-center block disabled:opacity-60"}
        >
          {store.isSubmitting
            ? uploadProgress
              ? `Uploading image ${uploadProgress.completed} of ${uploadProgress.total}…`
              : "Submitting…"
            : copy.submitLabel}
        </button>
      </div>
    </form>
  );
}
