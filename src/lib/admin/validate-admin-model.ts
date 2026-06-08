import type { RegistrationFormState } from "@/types/registration-form";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export function validateAdminModelForm(state: RegistrationFormState): string[] {
  const errors: string[] = [];

  if (!state.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    errors.push("Enter a valid email address.");
  }
  if (!state.password || !PASSWORD_REGEX.test(state.password)) {
    errors.push(
      "Password must be 8+ characters with uppercase, lowercase, number, and special character.",
    );
  }
  if (!state.fullName.trim()) errors.push("Full name is required.");
  if (!state.gender) errors.push("Gender is required.");
  if (!state.dob) errors.push("Date of birth is required.");
  if (!state.age.trim()) errors.push("Age could not be calculated — check date of birth.");
  if (!state.nic.trim()) errors.push("NIC number is required.");
  if (!state.address.trim()) errors.push("Address is required.");
  if (!state.contactNumber.trim()) errors.push("Contact number is required.");
  if (!state.whatsappNumber.trim()) errors.push("WhatsApp number is required.");
  if (!state.tier) errors.push("Select a listing tier.");
  if (!state.rate.trim()) errors.push("Official rate is required.");
  if (!state.talents.trim() && !state.shortBio.trim()) {
    errors.push("Talents or short bio is required for approval.");
  }
  if (!state.profilePhoto) errors.push("Profile photo is required.");
  if (!state.nicFront) errors.push("NIC front image is required.");
  if (!state.nicBack) errors.push("NIC back image is required.");
  if (state.portfolioPhotos.length === 0) {
    errors.push("At least one portfolio photo is required.");
  }

  return errors;
}
