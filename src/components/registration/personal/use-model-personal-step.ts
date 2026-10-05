import { useState } from "react";
import { ageFromDateOfBirth } from "@/lib/age-from-dob";
import { nicValidationMessage } from "@/lib/validation/nic";
import type { RegistrationFormState, RegistrationStore } from "@/types/registration-form";
import { composeFullName, REQUIRED_PERSONAL_FIELDS } from "./use-personal-step";

export function useModelPersonalStep(store: RegistrationStore) {
  const [submitted, setSubmitted] = useState(false);

  function err(field: keyof RegistrationFormState): string | null {
    if (!submitted) return null;
    if (field === "nic") return nicValidationMessage(store.nic);
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
    const missingPersonal = REQUIRED_PERSONAL_FIELDS.some((f) => {
      const v = store[f];
      return typeof v === "string" && !v.trim();
    });
    if (missingPersonal) return;
    if (nicValidationMessage(store.nic)) return;
    store.set({ fullName: composeFullName(store.firstName, store.lastName) });
    store.nextStep();
  }

  return { submitted, err, handleDobChange, handleNext, setNamePart };
}
