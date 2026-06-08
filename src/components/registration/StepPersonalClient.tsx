"use client";

import { useState } from "react";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import { CLIENT_REGISTRATION_COPY } from "@/lib/registration/client-copy";
import { submitClientRegistration } from "@/lib/registration/submit-client-registration";
import type { ClientRegistrationStore } from "@/types/client-registration";
import {
  formActions,
  formBackBtn,
  formHeading,
  formHint,
  formInput,
  formInputError,
  formLabel,
  formRequiredMark,
  formSubtitle,
} from "./form-styles";

interface StepPersonalClientProps {
  store: ClientRegistrationStore;
  idPrefix?: string;
}

export default function StepPersonalClient({
  store,
  idPrefix = "cli",
}: StepPersonalClientProps) {
  const [submitted, setSubmitted] = useState(false);
  const copy = CLIENT_REGISTRATION_COPY;

  const fullNameError =
    submitted && !store.fullName.trim() ? "Name or company name is required" : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    store.set({ error: null });

    if (!store.fullName.trim()) return;

    store.set({ isSubmitting: true });
    const result = await submitClientRegistration(store);

    if (result.ok) {
      store.set({ success: true, isSubmitting: false });
    } else {
      store.set({ error: result.message, isSubmitting: false });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <h2 className={formHeading}>{copy.profileTitle}</h2>
        <p className={formSubtitle}>{copy.profileSubtitle}</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-fullName`} className={formLabel}>
          Full name or company <span className={formRequiredMark}>*</span>
        </label>
        <input
          id={`${idPrefix}-fullName`}
          type="text"
          value={store.fullName}
          onChange={(e) => store.set({ fullName: e.target.value })}
          placeholder="e.g. Acme Events Pvt Ltd"
          autoComplete="organization"
          className={fullNameError ? formInputError : formInput}
        />
        <p className={formHint}>
          Use your legal name or the company you represent when booking talent.
        </p>
        {fullNameError && <p className={formHint + " text-red-600"}>{fullNameError}</p>}
      </div>

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
          {store.isSubmitting ? "Creating account…" : copy.submitLabel}
        </button>
      </div>
    </form>
  );
}
