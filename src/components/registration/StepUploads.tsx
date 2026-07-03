"use client";

import { useEffect, useState } from "react";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import CroppableImageUpload, {
  useCropImagePicker,
} from "@/components/shared/CroppableImageUpload";
import type { RegistrationCopy } from "@/lib/registration/copy";
import { validateWorkExperienceDrafts } from "@/lib/registration/build-work-experience-payload";
import { submitRegistration } from "@/lib/registration/submit-registration";
import type { RegistrationStore } from "@/types/registration-form";
import type { RegistrationVariant } from "@/types/registration-form";
import WorkExperienceSection from "./WorkExperienceSection";

export type RegistrationSubmitResult =
  | { ok: true }
  | { ok: false; message: string };

export type RegistrationSubmitHandler = (
  store: RegistrationStore,
  variant: RegistrationVariant,
  onUploadProgress?: (completed: number, total: number) => void,
) => Promise<RegistrationSubmitResult>;
import {
  formActions,
  formBackBtn,
  formHeading,
  formHint,
  formLabel,
  formSubtitle,
} from "./form-styles";

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
  const MAX = 5;
  const { openPicker, cropModal, hiddenInput } = useCropImagePicker((file) => {
    if (portfolioPhotos.length < MAX) {
      onChange([...portfolioPhotos, file]);
    }
  });

  return (
    <div className="space-y-2">
      <p className={formLabel}>
        {label}
        <span className="text-[#6B6B6B] normal-case tracking-normal font-normal ml-2">
          ({portfolioPhotos.length}/{MAX})
        </span>
      </p>
      {hint && <p className={formHint}>{hint}</p>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {portfolioPhotos.map((file, i) => (
          <PortfolioThumb
            key={`${file.name}-${file.size}-${i}`}
            file={file}
            index={i}
            onRemove={() => onChange(portfolioPhotos.filter((_, idx) => idx !== i))}
          />
        ))}
        {portfolioPhotos.length < MAX && (
          <button
            type="button"
            onClick={openPicker}
            data-cursor="button"
            className="border border-dashed border-[#E0E0E0] hover:border-[#C8A97A] transition-colors flex flex-col items-center justify-center gap-1"
            style={{ aspectRatio: "3/4" }}
          >
            <span className="text-[#C8A97A] text-2xl">+</span>
            <span className="font-ui text-[11px] tracking-[0.1em] uppercase text-[#6B6B6B]">Add</span>
          </button>
        )}
      </div>
      {hiddenInput}
      {cropModal}
    </div>
  );
}

function PortfolioThumb({
  file,
  index,
  onRemove,
}: {
  file: File;
  index: number;
  onRemove: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="relative group" style={{ aspectRatio: "3/4" }}>
      {url && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={url}
          alt={`Portfolio ${index + 1}`}
          className="w-full h-full object-cover border border-[#E0E0E0]"
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white font-ui text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
      >
        ×
      </button>
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
  const [uploadProgress, setUploadProgress] = useState<{ completed: number; total: number } | null>(null);

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

  const isStudent = variant === "student";
  const secondPhoto = store.portfolioPhotos[0] ?? null;

  const hasPhoto = isStudent
    ? !!store.profilePhoto && !!secondPhoto
    : !!store.profilePhoto || store.portfolioPhotos.length > 0;

  const photoError = submitted
    ? isStudent
      ? !store.profilePhoto
        ? "Profile photo is required"
        : !secondPhoto
          ? "Second photo is required"
          : null
      : !hasPhoto
        ? "At least one photo (profile or portfolio) is required"
        : null
    : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    store.set({ error: null });

    if (!hasPhoto || workExperienceError) {
      return;
    }

    store.set({ isSubmitting: true });
    setUploadProgress(null);
    try {
      const submitFn = onSubmit ?? submitRegistration;
      const result = await submitFn(store, variant, (completed, total) => {
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

      <div className={isStudent ? "grid grid-cols-1 gap-6 sm:grid-cols-2" : "max-w-[200px]"}>
        <CroppableImageUpload
          label="Profile photo"
          required={isStudent}
          file={store.profilePhoto}
          onFile={(f) => store.set({ profilePhoto: f })}
          error={submitted && isStudent && !store.profilePhoto ? "Required" : null}
        />
        {isStudent ? (
          <CroppableImageUpload
            label="Second photo"
            required
            file={secondPhoto}
            onFile={(f) => store.set({ portfolioPhotos: f ? [f] : [] })}
            error={submitted && !secondPhoto ? "Required" : null}
          />
        ) : null}
      </div>

      {!isStudent && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <CroppableImageUpload
              label="NIC — Front (optional)"
              file={store.nicFront}
              onFile={(f) => store.set({ nicFront: f })}
            />
            <CroppableImageUpload
              label="NIC — Back (optional)"
              file={store.nicBack}
              onFile={(f) => store.set({ nicBack: f })}
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
        </>
      )}
      {photoError && <p className={formHint + " text-red-600"}>{photoError}</p>}

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
