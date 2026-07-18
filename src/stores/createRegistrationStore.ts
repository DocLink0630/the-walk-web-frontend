import { create } from "zustand";
import type { RegistrationFormState, RegistrationStore } from "@/types/registration-form";
import { generateRegistrationCode } from "@/lib/registration/generate-registration-code";

const defaultFormState = (prefix: "STU" | "MOD"): RegistrationFormState => ({
  modelCode: generateRegistrationCode(prefix),
  email: "",
  password: "",
  firstName: "",
  lastName: "",
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
  rate: "",
  source: "",
  preferredBranch: "",
  preferredDate: "",
  profilePhoto: null,
  nicFront: null,
  nicBack: null,
  portfolioPhotos: [],
  workExperiences: [],
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
