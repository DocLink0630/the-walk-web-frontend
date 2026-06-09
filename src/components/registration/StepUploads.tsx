"use client";

import { useRef, useState } from "react";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import type { RegistrationCopy } from "@/lib/registration/copy";
import { validateWorkExperienceDrafts } from "@/lib/registration/build-work-experience-payload";
import { submitRegistration } from "@/lib/registration/submit-registration";
import type { RegistrationStore } from "@/types/registration-form";
import type { RegistrationVariant } from "@/types/registration-form";
import {
  ACCEPTED_IMAGE_LABEL,
  ACCEPTED_IMAGE_MIME,
} from "@/lib/registration/accepted-image-types";
import WorkExperienceSection from "./WorkExperienceSection";

export type RegistrationSubmitResult =
  | { ok: true }
  | { ok: false; message: string };

export type RegistrationSubmitHandler = (
  store: RegistrationStore,
  variant: RegistrationVariant,
) => Promise<RegistrationSubmitResult>;
import {
  formActions,
  formBackBtn,
  formHeading,
  formHint,
  formLabel,
  formRequiredMark,
  formSubtitle,
} from "./form-styles";

interface FileDropZoneProps {
  label: string;
  required?: boolean;
  file: File | null;
  onFile: (file: File | null) => void;
  error?: string | null;
}

function FileDropZone({ label, required, file, onFile, error }: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <div className="space-y-1">
      <p className={formLabel}>
        {label} {required && <span className={formRequiredMark}>*</span>}
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        data-cursor="button"
        className={[
          "relative w-full border transition-colors overflow-hidden group",
          error ? "border-red-400" : "border-[#E0E0E0] hover:border-[#C8A97A]",
        ].join(" ")}
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
      {error && <p className={formHint + " text-red-600"}>{error}</p>}
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
  label = "Portfolio photos",
  hint,
}: {
  portfolioPhotos: File[];
  onChange: (photos: File[]) => void;
  label?: string;
  hint?: string;
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
        {label} <span className={formRequiredMark}>*</span>
        <span className="text-[#6B6B6B] normal-case tracking-normal font-normal ml-2">
          ({portfolioPhotos.length}/{MAX})
        </span>
      </p>
      {hint && <p className={formHint}>{hint}</p>}
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

interface StepUploadsProps {
  store: RegistrationStore;
  copy: RegistrationCopy;
  variant: RegistrationVariant;
  onSubmit?: RegistrationSubmitHandler;
}

export default function StepUploads({
  store,
  copy,
  variant,
  onSubmit,
}: StepUploadsProps) {
  const [submitted, setSubmitted] = useState(false);

  const workExperienceError =
    submitted && variant === "model"
      ? validateWorkExperienceDrafts(store.workExperiences)
      : null;

  const workFieldErrors: Record<string, string | null> = {};
  if (submitted && variant === "model") {
    for (const entry of store.workExperiences) {
      const title = entry.title.trim();
      const hasImages = entry.images.length > 0;
      if (!title && !hasImages) continue;
      if (!title) {
        workFieldErrors[`title-${entry.id}`] = "Enter a title for this experience";
      }
      if (!hasImages) {
        workFieldErrors[`images-${entry.id}`] = "Add at least one photo";
      }
    }
  }

  const profilePhotoError = submitted && !store.profilePhoto ? "Profile photo is required" : null;
  const nicFrontError = submitted && !store.nicFront ? "NIC front image is required" : null;
  const nicBackError = submitted && !store.nicBack ? "NIC back image is required" : null;
  const portfolioError =
    submitted && store.portfolioPhotos.length === 0
      ? "At least 1 portfolio photo is required"
      : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    store.set({ error: null });

    if (
      !store.profilePhoto ||
      !store.nicFront ||
      !store.nicBack ||
      store.portfolioPhotos.length === 0 ||
      workExperienceError
    ) {
      return;
    }

    store.set({ isSubmitting: true });
    try {
      const submitFn = onSubmit ?? submitRegistration;
      const result = await submitFn(store, variant);

      if (result.ok) {
        store.set({ success: true, isSubmitting: false });
      } else {
        store.set({ error: result.message, isSubmitting: false });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      store.set({ error: msg, isSubmitting: false });
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
          label="Profile photo"
          required
          file={store.profilePhoto}
          onFile={(f) => store.set({ profilePhoto: f })}
          error={profilePhotoError}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FileDropZone
          label="NIC — Front"
          required
          file={store.nicFront}
          onFile={(f) => store.set({ nicFront: f })}
          error={nicFrontError}
        />
        <FileDropZone
          label="NIC — Back"
          required
          file={store.nicBack}
          onFile={(f) => store.set({ nicBack: f })}
          error={nicBackError}
        />
      </div>

      <PortfolioGrid
        portfolioPhotos={store.portfolioPhotos}
        onChange={(photos) => store.set({ portfolioPhotos: photos })}
        label={
          variant === "model"
            ? "Work / portfolio photos"
            : "Portfolio photos"
        }
        hint={
          variant === "model"
            ? "Upload examples of your runway, editorial, or commercial work"
            : undefined
        }
      />
      {portfolioError && <p className={formHint + " text-red-600"}>{portfolioError}</p>}

      {variant === "model" && (
        <WorkExperienceSection
          entries={store.workExperiences}
          onChange={(workExperiences) => store.set({ workExperiences })}
          errors={workFieldErrors}
        />
      )}
      {workExperienceError && (
        <p className={formHint + " text-red-600"}>{workExperienceError}</p>
      )}

      {store.error && (
        <div className="border border-red-300 bg-red-50 px-4 py-3">
          <p className="font-ui text-sm text-red-700 leading-relaxed">{store.error}</p>
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
          {store.isSubmitting ? "Submitting…" : copy.submitLabel}
        </button>
      </div>
    </form>
  );
}
