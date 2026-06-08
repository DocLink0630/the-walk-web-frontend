"use client";

import Link from "next/link";
import { CLIENT_REGISTRATION_COPY } from "@/lib/registration/client-copy";
import type { ClientRegistrationStore } from "@/types/client-registration";
import ClientRegistrationProgress from "./ClientRegistrationProgress";
import StepAccount from "./StepAccount";
import StepPersonalClient from "./StepPersonalClient";
import {
  formCard,
  formDisclaimer,
  formDisclaimerLink,
  formEyebrow,
  formPanel,
} from "./form-styles";

interface ClientRegistrationWizardProps {
  store: ClientRegistrationStore;
  idPrefix?: string;
}

function SuccessPanel({ store }: { store: ClientRegistrationStore }) {
  const copy = CLIENT_REGISTRATION_COPY;

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
      <Link
        href="/inquiry"
        data-cursor="button"
        className="font-ui text-[11px] tracking-[0.15em] uppercase text-[#0A0A0A] border border-[#0A0A0A] px-8 py-3 hover:bg-[#0A0A0A] hover:text-white transition-colors"
      >
        Go to booking inquiry
      </Link>
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

const accountCopy = {
  accountTitle: CLIENT_REGISTRATION_COPY.accountTitle,
  accountSubtitle: CLIENT_REGISTRATION_COPY.accountSubtitle,
};

export default function ClientRegistrationWizard({
  store,
  idPrefix = "cli",
}: ClientRegistrationWizardProps) {
  const copy = CLIENT_REGISTRATION_COPY;

  return (
    <div className={formCard}>
      <p className={formEyebrow}>{copy.eyebrow}</p>
      <div className={formPanel}>
        {store.success ? (
          <SuccessPanel store={store} />
        ) : (
          <>
            <ClientRegistrationProgress step={store.step} />
            {store.step === 1 && (
              <StepAccount
                store={store}
                copy={accountCopy}
                idPrefix={idPrefix}
              />
            )}
            {store.step === 2 && (
              <StepPersonalClient store={store} idPrefix={idPrefix} />
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
    </div>
  );
}
