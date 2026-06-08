import { create } from "zustand";
import type {
  ClientRegistrationFormState,
  ClientRegistrationStore,
} from "@/types/client-registration";

const defaultState = (): ClientRegistrationFormState => ({
  email: "",
  password: "",
  fullName: "",
  step: 1,
  isSubmitting: false,
  error: null,
  success: false,
});

export const useClientRegistrationStore = create<ClientRegistrationStore>((set) => ({
  ...defaultState(),

  set: (partial) => set((state) => ({ ...state, ...partial })),

  nextStep: () =>
    set((state) => ({
      step: Math.min(2, state.step + 1) as 1 | 2,
    })),

  prevStep: () =>
    set((state) => ({
      step: Math.max(1, state.step - 1) as 1 | 2,
    })),

  reset: () => set(defaultState()),
}));
