"use client";

import { useRef, useState } from "react";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import { INFLUENCER_REGISTRATION_COPY } from "@/lib/registration/influencer-copy";
import { submitInfluencerRegistration } from "@/lib/registration/submit-influencer-registration";
import {
  ACCEPTED_IMAGE_LABEL,
  ACCEPTED_IMAGE_MIME,
} from "@/lib/registration/accepted-image-types";
import type { InfluencerRegistrationStore } from "@/types/influencer-registration";
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

interface StepInfluencerUploadsProps {
  store: InfluencerRegistrationStore;
}

export default function StepInfluencerUploads({ store }: StepInfluencerUploadsProps) {
  const copy = INFLUENCER_REGISTRATION_COPY;
  const [uploadProgress, setUploadProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    store.set({ error: null, isSubmitting: true });
    setUploadProgress(null);

    try {
      const result = await submitInfluencerRegistration(store, (completed, total) => {
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

      <p className={formHint}>
        Photos are optional — you can submit now and add content samples later.
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
