export interface AccountStepStore {
  email: string;
  password: string;
  set: (partial: { email?: string; password?: string }) => void;
  nextStep: () => void;
}
