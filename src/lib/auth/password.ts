export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export const PASSWORD_HINT =
  "At least 8 characters with uppercase, lowercase, a number, and a special character.";

export function validatePassword(password: string): string | null {
  if (!PASSWORD_REGEX.test(password)) return PASSWORD_HINT;
  return null;
}
