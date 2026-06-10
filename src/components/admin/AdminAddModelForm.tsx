"use client";

import { useRef, useState } from "react";
import { ageFromDateOfBirth } from "@/lib/age-from-dob";
import {
  submitAdminModelWithApproval,
  type AdminModelSubmitPhase,
} from "@/lib/admin/submit-admin-model";
import { validateAdminModelForm } from "@/lib/admin/validate-admin-model";
import { ADMIN_ASSIGNABLE_TIERS } from "@/lib/admin/model-tiers";
import {
  ACCEPTED_IMAGE_LABEL,
  ACCEPTED_IMAGE_MIME,
} from "@/lib/registration/accepted-image-types";
import { useAdminModelAddStore } from "@/stores/adminModelAddStore";
import {
  adminHint,
  adminInput,
  adminLabel,
  adminRequired,
  adminSectionTitle,
  adminTextarea,
} from "./admin-form-styles";

interface AdminAddModelFormProps {
  onSuccess: () => void;
}

function AdminField({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={adminLabel}>
        {label}
        {required && <span className={adminRequired}> *</span>}
      </label>
      {children}
      {hint && !error && <p className={adminHint}>{hint}</p>}
      {error && <p className={adminHint + " text-red-600"}>{error}</p>}
    </div>
  );
}

function FilePicker({
  label,
  required,
  file,
  onChange,
  error,
}: {
  label: string;
  required?: boolean;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className={adminLabel}>
        {label}
        {required && <span className={adminRequired}> *</span>}
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border border-dashed border-[#D4D4D4] hover:border-[#C8A97A] px-3 py-4 text-left transition-colors bg-white"
      >
        {file ? (
          <span className="font-ui text-[10px] text-[#0A0A0A] truncate block">{file.name}</span>
        ) : (
          <span className="font-ui text-[10px] text-[#9A9A9A]">
            Choose file ({ACCEPTED_IMAGE_LABEL})
          </span>
        )}
      </button>
      {file && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="font-ui text-[9px] tracking-[0.1em] uppercase text-[#9A9A9A] hover:text-red-600 mt-1"
        >
          Remove
        </button>
      )}
      {error && <p className={adminHint + " text-red-600"}>{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_MIME}
        className="hidden"
        onChange={(e) => {
          onChange(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export default function AdminAddModelForm({ onSuccess }: AdminAddModelFormProps) {
  const store = useAdminModelAddStore();
  const [submitted, setSubmitted] = useState(false);
  const [phase, setPhase] = useState<"idle" | AdminModelSubmitPhase | "done">("idle");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ completed: number; total: number } | null>(null);

  function handleDobChange(value: string) {
    const age = ageFromDateOfBirth(value);
    store.set({
      dob: value,
      age: age !== null ? String(age) : "",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setValidationErrors([]);
    store.set({ error: null });

    const errors = validateAdminModelForm(store);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setPhase("uploading");
    setUploadProgress(null);
    const result = await submitAdminModelWithApproval(store, setPhase, (completed, total) => {
      setUploadProgress({ completed, total });
    });

    if (result.ok) {
      setPhase("done");
      store.set({ success: true });
      onSuccess();
      return;
    }

    setPhase("idle");
    setUploadProgress(null);
    store.set({ error: result.message });
    if (result.partial) {
      setValidationErrors([
        result.message,
        "The model account was created — open Review to finish approval.",
      ]);
    }
  }

  if (store.success || phase === "done") {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-12 h-12 border-2 border-[#C8A97A] mx-auto flex items-center justify-center mb-4">
          <span className="text-[#C8A97A] text-lg">✓</span>
        </div>
        <p className="font-ui text-[11px] tracking-[0.15em] uppercase text-[#0A0A0A] mb-2">
          Model added
        </p>
        <p className="font-ui text-[10px] text-[#4A4A4A] leading-relaxed max-w-sm mx-auto">
          Profile saved with tier and price range, approved, and set to Active.
        </p>
      </div>
    );
  }

  const isSaving = phase !== "idle";

  const phaseLabel =
    phase === "uploading"
      ? uploadProgress
        ? `Uploading files (${uploadProgress.completed} / ${uploadProgress.total})…`
        : "Uploading files and creating account…"
      : phase === "approving"
        ? "Applying tier and rate…"
        : phase === "activating"
          ? "Setting status to Active…"
          : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8 pb-28">
      {(validationErrors.length > 0 || store.error) && (
        <div className="border border-red-300 bg-red-50 px-4 py-3 space-y-1">
          {validationErrors.map((msg) => (
            <p key={msg} className="font-ui text-[10px] text-red-700 leading-relaxed">
              {msg}
            </p>
          ))}
          {store.error && !validationErrors.includes(store.error) && (
            <p className="font-ui text-[10px] text-red-700 leading-relaxed">{store.error}</p>
          )}
        </div>
      )}

      {/* Account */}
      <section className="space-y-4">
        <h3 className={adminSectionTitle}>Login credentials</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Email" required>
            <input
              type="email"
              value={store.email}
              onChange={(e) => store.set({ email: e.target.value })}
              className={adminInput}
              placeholder="model@example.com"
              autoComplete="off"
            />
          </AdminField>
          <AdminField
            label="Password"
            required
            hint="Min. 8 chars with upper, lower, number, and special character"
          >
            <input
              type="password"
              value={store.password}
              onChange={(e) => store.set({ password: e.target.value })}
              className={adminInput}
              placeholder="Set initial password"
              autoComplete="new-password"
            />
          </AdminField>
        </div>
        <p className={adminHint}>
          Model code: <span className="text-[#0A0A0A]">{store.modelCode}</span>
        </p>
      </section>

      {/* Identity */}
      <section className="space-y-4">
        <h3 className={adminSectionTitle}>Personal details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Full name" required>
            <input
              type="text"
              value={store.fullName}
              onChange={(e) => store.set({ fullName: e.target.value })}
              className={adminInput}
            />
          </AdminField>
          <AdminField label="Gender" required>
            <select
              value={store.gender}
              onChange={(e) => store.set({ gender: e.target.value })}
              className={adminInput}
            >
              <option value="">Select…</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </AdminField>
          <AdminField label="Date of birth" required>
            <input
              type="date"
              value={store.dob}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => handleDobChange(e.target.value)}
              className={adminInput}
            />
          </AdminField>
          <AdminField label="Age" required hint="Auto-calculated from DOB">
            <input type="text" value={store.age} readOnly className={adminInput + " bg-[#F5F5F5]"} />
          </AdminField>
          <AdminField label="NIC number" required>
            <input
              type="text"
              value={store.nic}
              onChange={(e) => store.set({ nic: e.target.value })}
              className={adminInput}
            />
          </AdminField>
        </div>
        <AdminField label="Address" required>
          <textarea
            value={store.address}
            onChange={(e) => store.set({ address: e.target.value })}
            rows={2}
            className={adminTextarea}
          />
        </AdminField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Contact number" required>
            <input
              type="tel"
              value={store.contactNumber}
              onChange={(e) => store.set({ contactNumber: e.target.value })}
              className={adminInput}
            />
          </AdminField>
          <AdminField label="WhatsApp" required>
            <input
              type="tel"
              value={store.whatsappNumber}
              onChange={(e) => store.set({ whatsappNumber: e.target.value })}
              className={adminInput}
            />
          </AdminField>
        </div>
      </section>

      {/* Listing */}
      <section className="space-y-4">
        <h3 className={adminSectionTitle}>Listing & approval</h3>
        <p className={adminHint}>
          Tier and rate are applied immediately after save — the model is set to Active.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Listing tier" required>
            <select
              value={store.tier}
              onChange={(e) => store.set({ tier: e.target.value as typeof store.tier })}
              className={adminInput}
            >
              <option value="">Select tier…</option>
              {ADMIN_ASSIGNABLE_TIERS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Official rate" required hint="e.g. 15,000 LKR per event">
            <input
              type="text"
              value={store.rate}
              onChange={(e) => store.set({ rate: e.target.value })}
              className={adminInput}
              placeholder="15,000 LKR / event"
            />
          </AdminField>
        </div>
        <AdminField label="Talents" required hint="Or fill short bio below">
          <input
            type="text"
            value={store.talents}
            onChange={(e) => store.set({ talents: e.target.value })}
            className={adminInput}
            placeholder="Runway, editorial, commercial"
          />
        </AdminField>
        <AdminField label="Short bio">
          <textarea
            value={store.shortBio}
            onChange={(e) => store.set({ shortBio: e.target.value })}
            rows={2}
            className={adminTextarea}
            maxLength={300}
          />
        </AdminField>
      </section>

      {/* Measurements — optional */}
      <section className="space-y-4">
        <h3 className={adminSectionTitle}>
          Measurements <span className="text-[#9A9A9A] font-normal normal-case tracking-normal">(optional)</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {(
            [
              ["height", "Height (cm)"],
              ["weight", "Weight (kg)"],
              ["chest", "Chest (in)"],
              ["waist", "Waist (in)"],
              ["shoeSize", "Shoe size"],
            ] as const
          ).map(([key, label]) => (
            <AdminField key={key} label={label}>
              <input
                type="text"
                value={store[key]}
                onChange={(e) => store.set({ [key]: e.target.value })}
                className={adminInput}
              />
            </AdminField>
          ))}
        </div>
      </section>

      {/* Documents */}
      <section className="space-y-4">
        <h3 className={adminSectionTitle}>Photos & documents</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FilePicker
            label="Profile photo"
            required
            file={store.profilePhoto}
            onChange={(f) => store.set({ profilePhoto: f })}
            error={submitted && !store.profilePhoto ? "Required" : null}
          />
          <FilePicker
            label="NIC — front"
            required
            file={store.nicFront}
            onChange={(f) => store.set({ nicFront: f })}
            error={submitted && !store.nicFront ? "Required" : null}
          />
          <FilePicker
            label="NIC — back"
            required
            file={store.nicBack}
            onChange={(f) => store.set({ nicBack: f })}
            error={submitted && !store.nicBack ? "Required" : null}
          />
        </div>
        <div>
          <p className={adminLabel}>
            Portfolio photos <span className={adminRequired}>*</span>
            <span className="text-[#9A9A9A] normal-case tracking-normal font-normal ml-2">
              ({store.portfolioPhotos.length}/5)
            </span>
          </p>
          <input
            type="file"
            accept={ACCEPTED_IMAGE_MIME}
            multiple
            className="block w-full font-ui text-[10px] text-[#4A4A4A] file:mr-4 file:py-2 file:px-4 file:border file:border-[#E0E0E0] file:bg-white file:font-ui file:text-[9px] file:uppercase file:tracking-wider hover:file:border-[#C8A97A]"
            onChange={(e) => {
              if (!e.target.files) return;
              const added = Array.from(e.target.files).slice(
                0,
                5 - store.portfolioPhotos.length,
              );
              store.set({ portfolioPhotos: [...store.portfolioPhotos, ...added] });
              e.target.value = "";
            }}
          />
          {store.portfolioPhotos.length > 0 && (
            <ul className="mt-2 space-y-1">
              {store.portfolioPhotos.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex justify-between font-ui text-[10px] text-[#4A4A4A]">
                  <span className="truncate">{f.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      store.set({
                        portfolioPhotos: store.portfolioPhotos.filter((_, idx) => idx !== i),
                      })
                    }
                    className="text-[#9A9A9A] hover:text-red-600 ml-2 shrink-0"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          {submitted && store.portfolioPhotos.length === 0 && (
            <p className={adminHint + " text-red-600"}>At least one portfolio photo is required.</p>
          )}
        </div>
      </section>

      <div className="sticky bottom-0 -mx-4 md:-mx-6 px-4 md:px-6 py-4 bg-white border-t border-[#E0E0E0]">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full font-ui text-[10px] tracking-[0.2em] uppercase px-6 py-3.5 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Working…" : "Save & activate model"}
        </button>
        {isSaving && phaseLabel && (
          <p className={adminHint + " text-center mt-2"}>{phaseLabel}</p>
        )}
        {isSaving && (
          <p className={adminHint + " text-center mt-1 text-[#9A9A9A]"}>
            File uploads to storage can take 1–3 minutes. Do not close this panel.
          </p>
        )}
      </div>
    </form>
  );
}
