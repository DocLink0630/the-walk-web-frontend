"use client";

import type { RegistrationCopy } from "@/lib/registration/copy";
import type { RegistrationStore } from "@/types/registration-form";
import { formHeading, formSubtitle } from "./form-styles";
import {
  AppearanceSection,
  ContactSection,
  IdentitySection,
  MeasurementsSection,
  ModelExperienceSection,
  ModelReferralSection,
  PersonalStepActions,
} from "./personal/ProfileSections";
import { useModelPersonalStep } from "./personal/use-model-personal-step";

interface StepPersonalModelProps {
  store: RegistrationStore;
  copy: RegistrationCopy;
  idPrefix?: string;
}

/** Step 2 for MODEL — fields from walk-web-backend ModelProfileDto only */
export default function StepPersonalModel({
  store,
  copy,
  idPrefix = "mod",
}: StepPersonalModelProps) {
  const { err, tierError, handleDobChange, handleNext } = useModelPersonalStep(store);
  const sectionProps = { store, idPrefix, err, handleDobChange };

  return (
    <form onSubmit={handleNext} noValidate className="space-y-8">
      <div>
        <h2 className={formHeading}>{copy.personalTitle}</h2>
        <p className={formSubtitle}>{copy.personalSubtitle}</p>
      </div>

      <IdentitySection {...sectionProps} />
      <ContactSection {...sectionProps} />
      <ModelExperienceSection store={store} idPrefix={idPrefix} tierError={tierError} />
      <MeasurementsSection store={store} idPrefix={idPrefix} />
      <AppearanceSection store={store} idPrefix={idPrefix} />
      <ModelReferralSection store={store} idPrefix={idPrefix} />

      <PersonalStepActions onBack={store.prevStep} />
    </form>
  );
}
