import { create } from "zustand";
import type { RegistrationFormState, RegistrationStore } from "@/types/registration-form";

function generateCode(prefix: "STU" | "MOD"): string {
  const now = new Date();
  const date =
    String(now.getFullYear()) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `${prefix}-${date}-${rand}`;
}

const defaultFormState = (prefix: "STU" | "MOD"): RegistrationFormState => ({
  modelCode: generateCode(prefix),
  email: "",
  password: "",
  fullName: "",
  gender: "",
  age: "",
  nic: "",
  dob: "",
  address: "",
  contactNumber: "",
  whatsappNumber: "",
  height: "",
  weight: "",
  chest: "",
  shoulder: "",
  waist: "",
  shoeSize: "",
  eyeColor: "",
  hairColor: "",
  talents: "",
  shortBio: "",
  skinColorOptionId: "",
  tier: prefix === "STU" ? "FRESHER" : "",
  source: "",
  preferredBranch: "",
  preferredDate: "",
  profilePhoto: null,
  nicFront: null,
  nicBack: null,
  portfolioPhotos: [],
  step: 1,
  isSubmitting: false,
  error: null,
  success: false,
});

export function createRegistrationStore(prefix: "STU" | "MOD") {
  return create<RegistrationStore>((set) => ({
    ...defaultFormState(prefix),

    set: (partial) => set((state) => ({ ...state, ...partial })),

    nextStep: () =>
      set((state) => ({
        step: Math.min(3, state.step + 1) as 1 | 2 | 3,
      })),

    prevStep: () =>
      set((state) => ({
        step: Math.max(1, state.step - 1) as 1 | 2 | 3,
      })),

    reset: () => set({ ...defaultFormState(prefix) }),
  }));
}
