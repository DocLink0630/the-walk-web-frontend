"use client";

import { SERVICE_REGISTRATION_COPY } from "@/lib/registration/service-copy";
import type {
  ServiceRegistrationStore,
  ServiceRegistrationVariant,
} from "@/types/service-registration";
import RegistrationProgress from "./RegistrationProgress";
import StepAccount from "./StepAccount";
import StepPersonalService from "./StepPersonalService";
import StepServiceUploads from "./StepServiceUploads";
import RegistrationPackagesPreview from "./RegistrationPackagesPreview";
import {
  formCard,
  formDisclaimer,
  formDisclaimerLink,
  formEyebrow,
  formPanel,
} from "./form-styles";

interface ServiceRegistrationWizardProps {
  store: ServiceRegistrationStore;
  variant: ServiceRegistrationVariant;
  idPrefix?: string;
}

function SuccessPanel({
  store,
  variant,
}: {
  store: ServiceRegistrationStore;
  variant: ServiceRegistrationVariant;
}) {
  const copy = SERVICE_REGISTRATION_COPY[variant];

  return (
    <div className="flex flex-col items-center text-center space-y-6 py-4">
      <div className="w-16 h-16 border-2 border-[#C8A97A] flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
          <path
            d="M5 14l7 7L23 7"
            stroke="#C8A97A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="space-y-2">
        <h2 className="font-display text-2xl md:text-3xl font-light text-[#0A0A0A]">
          {copy.successTitle}
        </h2>
        <p className="font-ui text-sm text-[#4A4A4A] max-w-sm leading-relaxed">
          {copy.successMessage}
        </p>
      </div>
      <div className="w-full border-t border-[#E0E0E0]" />
      <div className="space-y-3 w-full text-left">
        <p className="font-ui text-[11px] tracking-[0.15em] uppercase text-[#0A0A0A]">
          What happens next?
        </p>
        {copy.successSteps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="font-ui text-xs text-[#9A7329] mt-0.5 shrink-0 font-normal">
              {i + 1}.
            </span>
            <p className="font-ui text-sm text-[#4A4A4A] leading-relaxed">{step}</p>
          </div>
        ))}
      </div>
      <RegistrationPackagesPreview />
      <button
        type="button"
        onClick={store.reset}
        data-cursor="button"
        className="font-ui text-[11px] tracking-[0.15em] uppercase text-[#4A4A4A] hover:text-[#0A0A0A] transition-colors underline underline-offset-4"
      >
        {copy.resetLabel}
      </button>
    </div>
  );
}

export default function ServiceRegistrationWizard({
  store,
  variant,
  idPrefix = "svc",
}: ServiceRegistrationWizardProps) {
  const copy = SERVICE_REGISTRATION_COPY[variant];

  return (
    <div className={formCard}>
      <p className={formEyebrow}>{copy.eyebrow}</p>
      <div className={formPanel}>
        {store.success ? (
          <SuccessPanel store={store} variant={variant} />
        ) : (
          <>
            <RegistrationProgress step={store.step} />
            {store.step === 1 && (
              <StepAccount store={store} copy={copy} idPrefix={idPrefix} />
            )}
            {store.step === 2 && (
              <StepPersonalService
                store={store}
                copy={copy}
                variant={variant}
                idPrefix={idPrefix}
              />
            )}
            {store.step === 3 && (
              <StepServiceUploads store={store} copy={copy} variant={variant} />
            )}
          </>
        )}
      </div>
      {!store.success && (
        <p className={formDisclaimer}>
          By submitting you agree to our{" "}
          <a href="/privacy" className={formDisclaimerLink}>
            Privacy Policy
          </a>
          . Your information is handled securely.
        </p>
      )}
      {!store.success && (
        <div className="mt-8">
          <RegistrationPackagesPreview />
        </div>
      )}
    </div>
  );
}
