"use client";

import { useState } from "react";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import type { ServiceRegistrationCopy } from "@/lib/registration/service-copy";
import type {
  ServiceRegistrationStore,
  ServiceRegistrationVariant,
} from "@/types/service-registration";
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
  formTextarea,
} from "./form-styles";

interface StepPersonalServiceProps {
  store: ServiceRegistrationStore;
  copy: ServiceRegistrationCopy;
  variant: ServiceRegistrationVariant;
  idPrefix?: string;
}

export default function StepPersonalService({
  store,
  copy,
  variant,
  idPrefix = "svc",
}: StepPersonalServiceProps) {
  const [submitted, setSubmitted] = useState(false);

  const fullNameError = submitted && !store.fullName.trim() ? "Full name is required" : null;
  const contactError =
    submitted && !store.contactNumber.trim() ? "Contact number is required" : null;
  const specialtiesError =
    submitted && store.specialties.split(",").every((s) => !s.trim())
      ? "Enter at least one specialty"
      : null;
  const yearsError =
    submitted && store.yearsOfExperience.trim() && Number.isNaN(Number(store.yearsOfExperience))
      ? "Enter a valid number of years"
      : null;

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    store.set({ error: null });

    if (
      !store.fullName.trim() ||
      !store.contactNumber.trim() ||
      store.specialties.split(",").every((s) => !s.trim()) ||
      yearsError
    ) {
      return;
    }

    store.nextStep();
  }

  return (
    <form onSubmit={handleNext} noValidate className="space-y-6">
      <div>
        <h2 className={formHeading}>{copy.personalTitle}</h2>
        <p className={formSubtitle}>{copy.personalSubtitle}</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-fullName`} className={formLabel}>
          Full name <span className={formRequiredMark}>*</span>
        </label>
        <input
          id={`${idPrefix}-fullName`}
          type="text"
          value={store.fullName}
          onChange={(e) => store.set({ fullName: e.target.value })}
          placeholder="e.g. Jane Doe"
          autoComplete="name"
          className={fullNameError ? formInputError : formInput}
        />
        {fullNameError && <p className={formHint + " text-red-600"}>{fullNameError}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-contact`} className={formLabel}>
          Contact number <span className={formRequiredMark}>*</span>
        </label>
        <input
          id={`${idPrefix}-contact`}
          type="tel"
          value={store.contactNumber}
          onChange={(e) => store.set({ contactNumber: e.target.value })}
          placeholder="e.g. 077 123 4567"
          autoComplete="tel"
          className={contactError ? formInputError : formInput}
        />
        {contactError && <p className={formHint + " text-red-600"}>{contactError}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-specialties`} className={formLabel}>
          {copy.specialtiesLabel} <span className={formRequiredMark}>*</span>
        </label>
        <input
          id={`${idPrefix}-specialties`}
          type="text"
          value={store.specialties}
          onChange={(e) => store.set({ specialties: e.target.value })}
          placeholder={copy.specialtiesPlaceholder}
          className={specialtiesError ? formInputError : formInput}
        />
        <p className={formHint}>Separate multiple specialties with commas.</p>
        {specialtiesError && <p className={formHint + " text-red-600"}>{specialtiesError}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor={`${idPrefix}-years`} className={formLabel}>
            Years of experience
          </label>
          <input
            id={`${idPrefix}-years`}
            type="number"
            min={0}
            inputMode="numeric"
            value={store.yearsOfExperience}
            onChange={(e) => store.set({ yearsOfExperience: e.target.value })}
            placeholder="e.g. 5"
            className={yearsError ? formInputError : formInput}
          />
          {yearsError && <p className={formHint + " text-red-600"}>{yearsError}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${idPrefix}-rate`} className={formLabel}>
            Rate
          </label>
          <input
            id={`${idPrefix}-rate`}
            type="text"
            value={store.rateCard}
            onChange={(e) => store.set({ rateCard: e.target.value })}
            placeholder="e.g. LKR 25,000 / day"
            className={formInput}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-location`} className={formLabel}>
          Location
        </label>
        <input
          id={`${idPrefix}-location`}
          type="text"
          value={store.location}
          onChange={(e) => store.set({ location: e.target.value })}
          placeholder="e.g. Colombo — available islandwide"
          className={formInput}
        />
      </div>

      {variant === "photographer" && (
        <div className="space-y-1.5">
          <label htmlFor={`${idPrefix}-equipment`} className={formLabel}>
            Equipment overview
          </label>
          <textarea
            id={`${idPrefix}-equipment`}
            value={store.equipmentOverview}
            onChange={(e) => store.set({ equipmentOverview: e.target.value })}
            placeholder="Cameras, lenses, lighting, etc."
            className={formTextarea}
          />
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-bio`} className={formLabel}>
          Short bio
        </label>
        <textarea
          id={`${idPrefix}-bio`}
          value={store.shortBio}
          onChange={(e) => store.set({ shortBio: e.target.value })}
          placeholder="A short introduction about you and your work"
          className={formTextarea}
        />
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
          data-cursor="button"
          className={CTA_PRIMARY_FILLED + " flex-1 text-center block"}
        >
          Continue
        </button>
      </div>
    </form>
  );
}
