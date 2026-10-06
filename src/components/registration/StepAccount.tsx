"use client";

import { useState } from "react";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import type { AccountStepStore } from "@/types/account-step";
import {
  formHeading,
  formHint,
  formInput,
  formInputError,
  formLabel,
  formRequiredMark,
  formSubtitle,
} from "./form-styles";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Lowercase", ok: /[a-z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
    {
      label: "Special character",
      ok: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {checks.map(({ label, ok }) => (
        <span
          key={label}
          className={[
            "font-ui text-[11px] tracking-normal px-2.5 py-1 border",
            ok
              ? "border-[#C8A97A] text-[#0A0A0A] bg-[#C8A97A]/15"
              : "border-[#D4D4D4] text-[#6B6B6B] bg-white",
          ].join(" ")}
        >
          {ok ? "✓ " : "○ "}
          {label}
        </span>
      ))}
    </div>
  );
}

interface StepAccountCopy {
  accountTitle: string;
  accountSubtitle: string;
}

interface StepAccountProps {
  store: AccountStepStore;
  copy: StepAccountCopy;
  idPrefix?: string;
  /** Return an error message to block Continue, or null to proceed. */
  beforeNext?: (email: string) => Promise<string | null>;
}

export default function StepAccount({
  store,
  copy,
  idPrefix = "reg",
  beforeNext,
}: StepAccountProps) {
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [emailAvailabilityError, setEmailAvailabilityError] = useState<
    string | null
  >(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const formatEmailError =
    touched.email && !store.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      ? "Enter a valid email address"
      : null;

  const emailError = formatEmailError ?? emailAvailabilityError;

  const passwordError =
    touched.password && !PASSWORD_REGEX.test(store.password)
      ? "Password must be 8+ characters with uppercase, lowercase, number, and special character"
      : null;

  async function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setEmailAvailabilityError(null);

    const emailInvalid = !store.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    const passwordInvalid = !PASSWORD_REGEX.test(store.password);
    if (emailInvalid || passwordInvalid) return;
    if (!store.email || !store.password) return;

    if (beforeNext) {
      setIsCheckingEmail(true);
      try {
        const availabilityError = await beforeNext(store.email);
        if (availabilityError) {
          setEmailAvailabilityError(availabilityError);
          return;
        }
      } finally {
        setIsCheckingEmail(false);
      }
    }

    store.nextStep();
  }

  return (
    <form onSubmit={handleNext} noValidate className="space-y-6">
      <div>
        <h1 className={formHeading}>{copy.accountTitle}</h1>
        <p className={formSubtitle}>{copy.accountSubtitle}</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-email`} className={formLabel}>
          Email address <span className={formRequiredMark}>*</span>
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          value={store.email}
          onChange={(e) => {
            setEmailAvailabilityError(null);
            store.set({ email: e.target.value });
          }}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isCheckingEmail}
          className={emailError ? formInputError : formInput}
        />
        {emailError && <p className={formHint + " text-red-600"}>{emailError}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-password`} className={formLabel}>
          Password <span className={formRequiredMark}>*</span>
        </label>
        <div className="relative">
          <input
            id={`${idPrefix}-password`}
            type={showPassword ? "text" : "password"}
            value={store.password}
            onChange={(e) => store.set({ password: e.target.value })}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            disabled={isCheckingEmail}
            className={(passwordError ? formInputError : formInput) + " pr-20"}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 font-ui text-[11px] tracking-[0.1em] uppercase text-[#4A4A4A] hover:text-[#0A0A0A] transition-colors"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <PasswordStrength password={store.password} />
        {passwordError && (
          <p className={formHint + " text-red-600"}>{passwordError}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isCheckingEmail}
        data-cursor="button"
        className={CTA_PRIMARY_FILLED + " w-full text-center block disabled:opacity-60"}
      >
        {isCheckingEmail ? "Checking…" : "Continue"}
      </button>
    </form>
  );
}
