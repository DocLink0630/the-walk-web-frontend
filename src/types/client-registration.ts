export interface ClientRegistrationFormState {
  email: string;
  password: string;
  fullName: string;
  step: 1 | 2;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

export interface ClientRegistrationStore extends ClientRegistrationFormState {
  set: (
    partial: Partial<
      ClientRegistrationFormState & {
        isSubmitting?: boolean;
        error?: string | null;
        success?: boolean;
      }
    >,
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}
