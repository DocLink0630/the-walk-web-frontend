import { create } from "zustand";
import type {
  InfluencerRegistrationFormState,
  InfluencerRegistrationStore,
} from "@/types/influencer-registration";

const defaultState = (): InfluencerRegistrationFormState => ({
  email: "",
  password: "",
  fullName: "",
  contactNumber: "",
  contentCategories: "",
  instagramUrl: "",
  instagramFollowers: "",
  tiktokUrl: "",
  tiktokFollowers: "",
  youtubeUrl: "",
  youtubeSubscribers: "",
  facebookUrl: "",
  facebookFollowers: "",
  pastBrandWork: "",
  rateCard: "",
  shortBio: "",
  profilePhoto: null,
  portfolioPhotos: [],
  step: 1,
  isSubmitting: false,
  error: null,
  success: false,
});

export const useInfluencerRegistrationStore = create<InfluencerRegistrationStore>((set) => ({
  ...defaultState(),

  set: (partial) => set((state) => ({ ...state, ...partial })),

  nextStep: () =>
    set((state) => ({ step: Math.min(3, state.step + 1) as 1 | 2 | 3 })),

  prevStep: () =>
    set((state) => ({ step: Math.max(1, state.step - 1) as 1 | 2 | 3 })),

  reset: () => set(defaultState()),
}));
