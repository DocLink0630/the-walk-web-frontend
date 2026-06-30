import { create } from "zustand";
import type {
  ServiceRegistrationFormState,
  ServiceRegistrationStore,
} from "@/types/service-registration";

const defaultState = (): ServiceRegistrationFormState => ({
  email: "",
  password: "",
  fullName: "",
  contactNumber: "",
  specialties: "",
  yearsOfExperience: "",
  rateCard: "",
  location: "",
  shortBio: "",
  equipmentOverview: "",
  profilePhoto: null,
  portfolioPhotos: [],
  step: 1,
  isSubmitting: false,
  error: null,
  success: false,
});

function createServiceRegistrationStore() {
  return create<ServiceRegistrationStore>((set) => ({
    ...defaultState(),

    set: (partial) => set((state) => ({ ...state, ...partial })),

    nextStep: () =>
      set((state) => ({ step: Math.min(3, state.step + 1) as 1 | 2 | 3 })),

    prevStep: () =>
      set((state) => ({ step: Math.max(1, state.step - 1) as 1 | 2 | 3 })),

    reset: () => set(defaultState()),
  }));
}

export const useBeauticianRegistrationStore = createServiceRegistrationStore();
export const usePhotographerRegistrationStore = createServiceRegistrationStore();
