"use client";

import { REGISTRATION_COPY, type RegistrationCopy } from "@/lib/registration/copy";
import type { RegistrationVariant } from "@/types/registration-form";
import type { RegistrationStore } from "@/types/registration-form";
import RegistrationProgress from "./RegistrationProgress";
import StepAccount from "./StepAccount";
import StepPersonalModel from "./StepPersonalModel";
import StepPersonalStudent from "./StepPersonalStudent";
import StepUploads, { type RegistrationSubmitHandler } from "./StepUploads";
import {
  formCard,
  formDisclaimer,
  formDisclaimerLink,
  formEyebrow,
  formPanel,
} from "./form-styles";

interface RegistrationWizardProps {
  store: RegistrationStore;
  variant: RegistrationVariant;
  idPrefix?: string;
  copy?: RegistrationCopy;
  onSubmit?: RegistrationSubmitHandler;
  showDisclaimer?: boolean;
  onSuccess?: () => void;
}

function SuccessPanel({
  store,
  copy,
  onSuccess,
}: {
  store: RegistrationStore;
  copy: RegistrationCopy;
  onSuccess?: () => void;
}) {

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
      {onSuccess ? (
        <button
          type="button"
          onClick={onSuccess}
          data-cursor="button"
          className="font-ui text-[11px] tracking-[0.15em] uppercase text-[#0A0A0A] border border-[#0A0A0A] px-8 py-3 hover:bg-[#0A0A0A] hover:text-white transition-colors"
        >
          Done
        </button>
      ) : (
        <button
          type="button"
          onClick={store.reset}
          data-cursor="button"
          className="font-ui text-[11px] tracking-[0.15em] uppercase text-[#4A4A4A] hover:text-[#0A0A0A] transition-colors underline underline-offset-4"
        >
          {copy.resetLabel}
        </button>
      )}
    </div>
  );
}

export default function RegistrationWizard({
  store,
  variant,
  idPrefix = "reg",
  copy: copyOverride,
  onSubmit,
  showDisclaimer = true,
  onSuccess,
}: RegistrationWizardProps) {
  const copy = copyOverride ?? REGISTRATION_COPY[variant];

  return (
    <div className={formCard}>
      <p className={formEyebrow}>{copy.eyebrow}</p>
      <div className={formPanel}>
        {store.success ? (
          <SuccessPanel store={store} copy={copy} onSuccess={onSuccess} />
        ) : (
          <>
            <RegistrationProgress step={store.step} />
            {store.step === 1 && (
              <StepAccount store={store} copy={copy} idPrefix={idPrefix} />
            )}
            {store.step === 2 &&
              (variant === "model" ? (
                <StepPersonalModel store={store} copy={copy} idPrefix={idPrefix} />
              ) : (
                <StepPersonalStudent store={store} copy={copy} idPrefix={idPrefix} />
              ))}
            {store.step === 3 && (
              <StepUploads
                store={store}
                copy={copy}
                variant={variant}
                onSubmit={onSubmit}
              />
            )}
          </>
        )}
      </div>
      {!store.success && showDisclaimer && (
        <p className={formDisclaimer}>
          By submitting you agree to our{" "}
          <a href="/privacy" className={formDisclaimerLink}>
            Privacy Policy
          </a>
          . Your information is encrypted and handled securely.
        </p>
      )}
    </div>
  );
}
