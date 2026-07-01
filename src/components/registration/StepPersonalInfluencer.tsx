"use client";

import { useState } from "react";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import { INFLUENCER_REGISTRATION_COPY } from "@/lib/registration/influencer-copy";
import type { InfluencerRegistrationStore } from "@/types/influencer-registration";
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

interface StepPersonalInfluencerProps {
  store: InfluencerRegistrationStore;
  idPrefix?: string;
}

function SocialField({
  id,
  label,
  urlValue,
  metricLabel,
  metricValue,
  urlPlaceholder,
  metricPlaceholder,
  onUrlChange,
  onMetricChange,
}: {
  id: string;
  label: string;
  urlValue: string;
  metricLabel: string;
  metricValue: string;
  urlPlaceholder: string;
  metricPlaceholder: string;
  onUrlChange: (v: string) => void;
  onMetricChange: (v: string) => void;
}) {
  return (
    <div className="border border-[#E8E8E8] p-4 space-y-3">
      <p className="font-ui text-[10px] tracking-[0.15em] uppercase text-[#0A0A0A]">{label}</p>
      <div className="space-y-1.5">
        <label htmlFor={`${id}-url`} className={formLabel}>
          Profile URL
        </label>
        <input
          id={`${id}-url`}
          type="url"
          value={urlValue}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder={urlPlaceholder}
          className={formInput}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor={`${id}-metric`} className={formLabel}>
          {metricLabel}
        </label>
        <input
          id={`${id}-metric`}
          type="text"
          value={metricValue}
          onChange={(e) => onMetricChange(e.target.value)}
          placeholder={metricPlaceholder}
          className={formInput}
        />
      </div>
    </div>
  );
}

export default function StepPersonalInfluencer({
  store,
  idPrefix = "inf",
}: StepPersonalInfluencerProps) {
  const copy = INFLUENCER_REGISTRATION_COPY;
  const [submitted, setSubmitted] = useState(false);

  const fullNameError = submitted && !store.fullName.trim() ? "Full name is required" : null;
  const contactError =
    submitted && !store.contactNumber.trim() ? "Contact number is required" : null;
  const categoriesError =
    submitted && store.contentCategories.split(",").every((s) => !s.trim())
      ? "Enter at least one content category"
      : null;

  const hasSocialLink =
    store.instagramUrl.trim() ||
    store.tiktokUrl.trim() ||
    store.youtubeUrl.trim() ||
    store.facebookUrl.trim();

  const socialError =
    submitted && !hasSocialLink
      ? "Add at least one social media profile URL"
      : null;

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    store.set({ error: null });

    if (
      !store.fullName.trim() ||
      !store.contactNumber.trim() ||
      store.contentCategories.split(",").every((s) => !s.trim()) ||
      !hasSocialLink
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
        <label htmlFor={`${idPrefix}-categories`} className={formLabel}>
          {copy.categoriesLabel} <span className={formRequiredMark}>*</span>
        </label>
        <input
          id={`${idPrefix}-categories`}
          type="text"
          value={store.contentCategories}
          onChange={(e) => store.set({ contentCategories: e.target.value })}
          placeholder={copy.categoriesPlaceholder}
          className={categoriesError ? formInputError : formInput}
        />
        <p className={formHint}>Separate multiple categories with commas.</p>
        {categoriesError && <p className={formHint + " text-red-600"}>{categoriesError}</p>}
      </div>

      <div className="space-y-3">
        <p className="font-ui text-[10px] tracking-[0.15em] uppercase text-[#0A0A0A]">
          Social media links <span className={formRequiredMark}>*</span>
        </p>
        <p className={formHint}>Add at least one platform. Follower counts are optional.</p>

        <SocialField
          id={`${idPrefix}-instagram`}
          label="Instagram"
          urlValue={store.instagramUrl}
          metricValue={store.instagramFollowers}
          metricLabel="Followers"
          urlPlaceholder="https://instagram.com/yourhandle"
          metricPlaceholder="e.g. 25,000"
          onUrlChange={(v) => store.set({ instagramUrl: v })}
          onMetricChange={(v) => store.set({ instagramFollowers: v })}
        />
        <SocialField
          id={`${idPrefix}-tiktok`}
          label="TikTok"
          urlValue={store.tiktokUrl}
          metricValue={store.tiktokFollowers}
          metricLabel="Followers"
          urlPlaceholder="https://tiktok.com/@yourhandle"
          metricPlaceholder="e.g. 50,000"
          onUrlChange={(v) => store.set({ tiktokUrl: v })}
          onMetricChange={(v) => store.set({ tiktokFollowers: v })}
        />
        <SocialField
          id={`${idPrefix}-youtube`}
          label="YouTube"
          urlValue={store.youtubeUrl}
          metricValue={store.youtubeSubscribers}
          metricLabel="Subscribers"
          urlPlaceholder="https://youtube.com/@yourchannel"
          metricPlaceholder="e.g. 10,000"
          onUrlChange={(v) => store.set({ youtubeUrl: v })}
          onMetricChange={(v) => store.set({ youtubeSubscribers: v })}
        />
        <SocialField
          id={`${idPrefix}-facebook`}
          label="Facebook"
          urlValue={store.facebookUrl}
          metricValue={store.facebookFollowers}
          metricLabel="Followers"
          urlPlaceholder="https://facebook.com/yourpage"
          metricPlaceholder="e.g. 15,000"
          onUrlChange={(v) => store.set({ facebookUrl: v })}
          onMetricChange={(v) => store.set({ facebookFollowers: v })}
        />
        {socialError && <p className={formHint + " text-red-600"}>{socialError}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-rate`} className={formLabel}>
          Rate card
        </label>
        <input
          id={`${idPrefix}-rate`}
          type="text"
          value={store.rateCard}
          onChange={(e) => store.set({ rateCard: e.target.value })}
          placeholder="e.g. LKR 50,000 per sponsored post"
          className={formInput}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-brand-work`} className={formLabel}>
          Past brand work
        </label>
        <textarea
          id={`${idPrefix}-brand-work`}
          value={store.pastBrandWork}
          onChange={(e) => store.set({ pastBrandWork: e.target.value })}
          placeholder="Brands or campaigns you have worked with"
          className={formTextarea}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-bio`} className={formLabel}>
          Short bio
        </label>
        <textarea
          id={`${idPrefix}-bio`}
          value={store.shortBio}
          onChange={(e) => store.set({ shortBio: e.target.value })}
          placeholder="A short introduction about you and your content"
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
