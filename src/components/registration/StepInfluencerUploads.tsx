"use client";

import { useState } from "react";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import CroppableImageUpload from "@/components/shared/CroppableImageUpload";
import { INFLUENCER_REGISTRATION_COPY } from "@/lib/registration/influencer-copy";
import { submitInfluencerRegistration } from "@/lib/registration/submit-influencer-registration";
import type { InfluencerRegistrationStore } from "@/types/influencer-registration";
import {
  formActions,
  formBackBtn,
  formHeading,
  formHint,
  formSubtitle,
} from "./form-styles";

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
        <CroppableImageUpload
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
