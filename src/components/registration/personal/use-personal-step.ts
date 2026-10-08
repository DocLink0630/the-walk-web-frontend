import { useState } from "react";
import { ageFromDateOfBirth } from "@/lib/age-from-dob";
import { nicValidationMessage } from "@/lib/validation/nic";
import { isValidPhone } from "@/lib/validation/phone";
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

  function getError(field: keyof RegistrationFormState): string | null {
    if (field === "nic") return nicValidationMessage(store.nic);
    const val = store[field];
    if (REQUIRED_PERSONAL_FIELDS.includes(field) && typeof val === "string" && !val.trim()) {
      return "This field is required";
    }
    if ((field === "firstName" || field === "lastName") && val && !/^[a-zA-Z\s'-]+$/.test(val as string)) {
      return "Only letters, spaces, hyphens, and apostrophes are allowed";
    }
    if ((field === "contactNumber" || field === "whatsappNumber") && typeof val === "string" && val.trim() && !isValidPhone(val)) {
      return "Enter a valid Sri Lankan mobile number";
    }
    if (field === "age" && store.dob && !store.age.trim()) {
      return "Enter a valid date of birth";
    }
    if (field === "height" || field === "weight" || field === "chest" || field === "shoulder" || field === "waist" || field === "shoeSize") {
      const v = store[field];
      if (typeof v === "string" && v.trim() !== "") {
        const num = Number(v);
        if (field === "height" && (num < 50 || num > 300)) return "Invalid height (50-300)";
        if (field === "weight" && (num < 20 || num > 300)) return "Invalid weight (20-300)";
        if (field === "chest" && (num < 10 || num > 80)) return "Invalid chest size (10-80)";
        if (field === "shoulder" && (num < 10 || num > 40)) return "Invalid shoulder (10-40)";
        if (field === "waist" && (num < 10 || num > 80)) return "Invalid waist size (10-80)";
        if (field === "shoeSize" && (num < 1 || num > 20)) return "Invalid shoe size (1-20)";
      }
    }
    return null;
  }

  function err(field: keyof RegistrationFormState): string | null {
    if (!submitted) return null;
    return getError(field);
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
    const fieldsToCheck: (keyof RegistrationFormState)[] = [
      "firstName", "lastName", "contactNumber", "whatsappNumber", "nic", "age",
      "height", "weight", "chest", "shoulder", "waist", "shoeSize"
    ];
    if (fieldsToCheck.some(f => getError(f) !== null)) return;
    store.set({ fullName: composeFullName(store.firstName, store.lastName) });
    store.nextStep();
  }

  return { submitted, err, handleDobChange, handleNext, setNamePart };
}
