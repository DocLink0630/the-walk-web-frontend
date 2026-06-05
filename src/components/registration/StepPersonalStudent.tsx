"use client";

import type { RegistrationCopy } from "@/lib/registration/copy";
import type { RegistrationStore } from "@/types/registration-form";
import { formHeading, formSubtitle } from "./form-styles";
import {
  AppearanceSection,
  ContactSection,
  IdentitySection,
  MeasurementsSection,
  PersonalStepActions,
  StudentAcademySection,
} from "./personal/ProfileSections";
import { usePersonalStep } from "./personal/use-personal-step";

interface StepPersonalStudentProps {
  store: RegistrationStore;
  copy: RegistrationCopy;
  idPrefix?: string;
}

/** Step 2 for STUDENT — fields from walk-web-backend StudentProfileDto */
export default function StepPersonalStudent({
  store,
  copy,
  idPrefix = "stu",
}: StepPersonalStudentProps) {
  const { err, handleDobChange, handleNext } = usePersonalStep(store);
  const sectionProps = { store, idPrefix, err, handleDobChange };

  return (
    <form onSubmit={handleNext} noValidate className="space-y-8">
      <div>
        <h2 className={formHeading}>{copy.personalTitle}</h2>
        <p className={formSubtitle}>{copy.personalSubtitle}</p>
      </div>

      <IdentitySection {...sectionProps} />
      <ContactSection {...sectionProps} />
      <MeasurementsSection store={store} idPrefix={idPrefix} />
      <AppearanceSection store={store} idPrefix={idPrefix} />
      <StudentAcademySection store={store} idPrefix={idPrefix} />

      <PersonalStepActions onBack={store.prevStep} />
    </form>
  );
}
