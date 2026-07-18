import { useState } from "react";
import { ageFromDateOfBirth } from "@/lib/age-from-dob";
import type { RegistrationFormState, RegistrationStore } from "@/types/registration-form";

export const REQUIRED_PERSONAL_FIELDS: (keyof RegistrationFormState)[] = [
  "firstName",
  "lastName",
  "contactNumber",
];

export function composeFullName(firstName: string, lastName: string): string {
  return [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
}

export function usePersonalStep(store: RegistrationStore) {
  const [submitted, setSubmitted] = useState(false);

  function err(field: keyof RegistrationFormState): string | null {
    if (!submitted) return null;
    const val = store[field];
    if (typeof val === "string" && !val.trim()) return "This field is required";
    if (field === "age" && store.dob && !store.age.trim()) {
      return "Enter a valid date of birth";
    }
    return null;
  }

  function handleDobChange(value: string) {
    const age = ageFromDateOfBirth(value);
    store.set({
      dob: value,
      age: age !== null ? String(age) : "",
    });
  }

  function setNamePart(part: "firstName" | "lastName", value: string) {
    const firstName = part === "firstName" ? value : store.firstName;
    const lastName = part === "lastName" ? value : store.lastName;
    store.set({
      [part]: value,
      fullName: composeFullName(firstName, lastName),
    });
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const missing = REQUIRED_PERSONAL_FIELDS.some((f) => {
      const v = store[f];
      return typeof v === "string" && !v.trim();
    });
    if (missing) return;
    store.set({ fullName: composeFullName(store.firstName, store.lastName) });
    store.nextStep();
  }

  return { submitted, err, handleDobChange, handleNext, setNamePart };
}
