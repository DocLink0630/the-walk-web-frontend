"use client";

import { useState } from "react";
import { CTA_PRIMARY_FILLED } from "@/config/cta-styles";
import type { RegistrationStore } from "@/types/registration-form";
import {
  formActions,
  formBackBtn,
  formHint,
  formInput,
  formInputError,
  formInputReadOnly,
  formSectionHint,
  formSectionTitle,
  formSelect,
  formSelectError,
  formTextarea,
} from "../form-styles";
import { REFERRAL_SOURCE_OPTIONS, SKIN_COLOR_OPTIONS } from "./constants";
import { Field } from "./Field";

type ErrFn = (field: keyof import("@/types/registration-form").RegistrationFormState) => string | null;

interface SectionProps {
  store: RegistrationStore;
  idPrefix: string;
  err: ErrFn;
  handleDobChange: (value: string) => void;
}

export function IdentitySection({ store, idPrefix, err, handleDobChange }: SectionProps) {
  return (
    <section className="space-y-4">
      <h3 className={formSectionTitle}>Identity</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full name" required error={err("fullName")} htmlFor={`${idPrefix}-fullName`}>
          <input
            id={`${idPrefix}-fullName`}
            type="text"
            value={store.fullName}
            onChange={(e) => store.set({ fullName: e.target.value })}
            placeholder="Jane Doe"
            className={err("fullName") ? formInputError : formInput}
          />
        </Field>
        <Field label="Gender" required error={err("gender")} htmlFor={`${idPrefix}-gender`}>
          <select
            id={`${idPrefix}-gender`}
            value={store.gender}
            onChange={(e) => store.set({ gender: e.target.value })}
            className={err("gender") ? formSelectError : formSelect}
          >
            <option value="">Select…</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </Field>
        <Field label="Date of birth" required error={err("dob")} htmlFor={`${idPrefix}-dob`}>
          <input
            id={`${idPrefix}-dob`}
            type="date"
            value={store.dob}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => handleDobChange(e.target.value)}
            className={err("dob") ? formInputError : formInput}
          />
        </Field>
        <Field
          label="Age"
          required
          error={err("age")}
          hint="Calculated automatically from your date of birth"
          htmlFor={`${idPrefix}-age`}
        >
          <input
            id={`${idPrefix}-age`}
            type="text"
            inputMode="numeric"
            readOnly
            value={store.age}
            placeholder="—"
            aria-readonly="true"
            className={err("age") ? formInputError : formInputReadOnly}
          />
        </Field>
        <Field label="NIC number" required error={err("nic")} htmlFor={`${idPrefix}-nic`}>
          <input
            id={`${idPrefix}-nic`}
            type="text"
            value={store.nic}
            onChange={(e) => store.set({ nic: e.target.value })}
            placeholder="200012345678"
            className={err("nic") ? formInputError : formInput}
          />
        </Field>
      </div>
    </section>
  );
}

export function ContactSection({ store, idPrefix, err }: SectionProps) {
  const [whatsappSameAsContact, setWhatsappSameAsContact] = useState(false);

  const handleContactChange = (value: string) => {
    store.set({
      contactNumber: value,
      ...(whatsappSameAsContact ? { whatsappNumber: value } : {}),
    });
  };

  const handleWhatsappSameToggle = (checked: boolean) => {
    setWhatsappSameAsContact(checked);
    if (checked) {
      store.set({ whatsappNumber: store.contactNumber });
    }
  };

  return (
    <section className="space-y-4">
      <h3 className={formSectionTitle}>Contact</h3>
      <Field label="Address" required error={err("address")} htmlFor={`${idPrefix}-address`}>
        <textarea
          id={`${idPrefix}-address`}
          value={store.address}
          onChange={(e) => store.set({ address: e.target.value })}
          placeholder="No. 12, Main Street, Colombo"
          rows={2}
          className={(err("address") ? formInputError : formTextarea) + " min-h-[72px]"}
        />
      </Field>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Contact number" required error={err("contactNumber")} htmlFor={`${idPrefix}-contact`}>
          <input
            id={`${idPrefix}-contact`}
            type="tel"
            value={store.contactNumber}
            onChange={(e) => handleContactChange(e.target.value)}
            placeholder="+94 77 123 4567"
            className={err("contactNumber") ? formInputError : formInput}
          />
        </Field>
        <Field label="WhatsApp number" required error={err("whatsappNumber")} htmlFor={`${idPrefix}-whatsapp`}>
          <input
            id={`${idPrefix}-whatsapp`}
            type="tel"
            value={store.whatsappNumber}
            onChange={(e) => store.set({ whatsappNumber: e.target.value })}
            readOnly={whatsappSameAsContact}
            placeholder="+94 77 123 4567"
            className={
              err("whatsappNumber")
                ? formInputError
                : whatsappSameAsContact
                  ? formInputReadOnly
                  : formInput
            }
          />
        </Field>
        <label className="sm:col-span-2 flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={whatsappSameAsContact}
            onChange={(e) => handleWhatsappSameToggle(e.target.checked)}
            className="size-4 shrink-0 accent-[#0A0A0A] cursor-pointer"
          />
          <span className="font-ui text-[11px] text-[#4A4A4A] tracking-normal normal-case">
            WhatsApp number is the same as contact number
          </span>
        </label>
      </div>
    </section>
  );
}

export function MeasurementsSection({
  store,
  idPrefix,
  fields = "full",
}: Pick<SectionProps, "store" | "idPrefix"> & {
  fields?: "full" | "student";
}) {
  const allFields = [
    { key: "height" as const, label: "Height (cm)", placeholder: "165" },
    { key: "weight" as const, label: "Weight (kg)", placeholder: "55" },
    { key: "chest" as const, label: "Chest (in)", placeholder: "34" },
    { key: "shoulder" as const, label: "Shoulder (in)", placeholder: "15" },
    { key: "waist" as const, label: "Waist (in)", placeholder: "27" },
    { key: "shoeSize" as const, label: "Shoe size (UK)", placeholder: "6" },
  ] as const;

  const measurementFields =
    fields === "student"
      ? allFields.filter((field) => field.key === "height")
      : allFields;

  return (
    <section className="space-y-4">
      <h3 className={formSectionTitle}>
        Physical measurements <span className={formSectionHint}>(optional)</span>
      </h3>
      <div
        className={
          fields === "student" ? "max-w-xs" : "grid grid-cols-2 gap-4 sm:grid-cols-3"
        }
      >
        {measurementFields.map(({ key, label, placeholder }) => (
          <Field key={key} label={label} htmlFor={`${idPrefix}-${key}`}>
            <input
              id={`${idPrefix}-${key}`}
              type="number"
              value={store[key]}
              onChange={(e) => store.set({ [key]: e.target.value })}
              placeholder={placeholder}
              className={formInput}
            />
          </Field>
        ))}
      </div>
    </section>
  );
}

export function AppearanceSection({
  store,
  idPrefix,
  showColorFields = true,
  showBio = true,
}: Pick<SectionProps, "store" | "idPrefix"> & { showColorFields?: boolean; showBio?: boolean }) {
  return (
    <section className="space-y-4">
      <h3 className={formSectionTitle}>
        Appearance & traits <span className={formSectionHint}>(optional)</span>
      </h3>
      {showColorFields && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Eye color" htmlFor={`${idPrefix}-eyeColor`}>
            <input
              id={`${idPrefix}-eyeColor`}
              type="text"
              value={store.eyeColor}
              onChange={(e) => store.set({ eyeColor: e.target.value })}
              placeholder="Brown"
              className={formInput}
            />
          </Field>
          <Field label="Hair color" htmlFor={`${idPrefix}-hairColor`}>
            <input
              id={`${idPrefix}-hairColor`}
              type="text"
              value={store.hairColor}
              onChange={(e) => store.set({ hairColor: e.target.value })}
              placeholder="Black"
              className={formInput}
            />
          </Field>
        </div>
      )}
      <Field label="Talents" htmlFor={`${idPrefix}-talents`}>
        <textarea
          id={`${idPrefix}-talents`}
          value={store.talents}
          onChange={(e) => store.set({ talents: e.target.value })}
          placeholder="Dancing, acting, public speaking…"
          rows={2}
          className={formTextarea}
        />
      </Field>
      {showBio && (
        <Field label={`Short bio (${store.shortBio.length}/300)`} htmlFor={`${idPrefix}-bio`}>
          <textarea
            id={`${idPrefix}-bio`}
            value={store.shortBio}
            onChange={(e) => {
              if (e.target.value.length <= 300) store.set({ shortBio: e.target.value });
            }}
            placeholder="A brief description about yourself…"
            rows={3}
            maxLength={300}
            className={formTextarea}
          />
        </Field>
      )}
      <div className="space-y-2">
        <p className="font-ui text-[11px] tracking-[0.15em] uppercase text-[#0A0A0A]">Skin color</p>
        <div className="flex flex-wrap gap-2">
          {SKIN_COLOR_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => store.set({ skinColorOptionId: id })}
              className={[
                "font-ui text-[11px] tracking-[0.08em] uppercase px-4 py-2.5 border transition-colors",
                store.skinColorOptionId === id
                  ? "border-[#C8A97A] bg-[#C8A97A] text-white"
                  : "border-[#D4D4D4] text-[#0A0A0A] bg-white hover:border-[#C8A97A]",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ModelReferralSection({ store, idPrefix }: Pick<SectionProps, "store" | "idPrefix">) {
  return (
    <section className="space-y-4">
      <h3 className={formSectionTitle}>
        Referral <span className={formSectionHint}>(optional)</span>
      </h3>
      <Field
        label="How did you hear about The Walk Agency?"
        htmlFor={`${idPrefix}-source`}
      >
        <select
          id={`${idPrefix}-source`}
          value={store.source}
          onChange={(e) => store.set({ source: e.target.value })}
          className={formSelect}
        >
          <option value="">Select…</option>
          {REFERRAL_SOURCE_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
    </section>
  );
}

export function StudentAcademySection({ store, idPrefix }: Pick<SectionProps, "store" | "idPrefix">) {
  return (
    <section className="space-y-4">
      <h3 className={formSectionTitle}>
        Academy preferences <span className={formSectionHint}>(optional)</span>
      </h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="How did you hear about us?" htmlFor={`${idPrefix}-source`}>
          <select
            id={`${idPrefix}-source`}
            value={store.source}
            onChange={(e) => store.set({ source: e.target.value })}
            className={formSelect}
          >
            <option value="">Select…</option>
            {REFERRAL_SOURCE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Preferred branch" htmlFor={`${idPrefix}-branch`}>
          <input
            id={`${idPrefix}-branch`}
            type="text"
            value={store.preferredBranch}
            onChange={(e) => store.set({ preferredBranch: e.target.value })}
            placeholder="Colombo"
            className={formInput}
          />
        </Field>
      </div>
    </section>
  );
}

export function PersonalStepActions({ onBack }: { onBack: () => void }) {
  return (
    <div className={formActions}>
      <button type="button" onClick={onBack} className={formBackBtn}>
        Back
      </button>
      <button
        type="submit"
        data-cursor="button"
        className={CTA_PRIMARY_FILLED + " flex-1 text-center block sm:flex-1"}
      >
        Continue
      </button>
    </div>
  );
}
