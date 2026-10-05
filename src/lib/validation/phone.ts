export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function phoneValidationMessage(
  phone: string,
  label: string,
): string | null {
  if (!phone.trim()) return `${label} is required.`;
  if (!isValidPhone(phone)) {
    return `Enter a valid ${label.toLowerCase()} (7–15 digits).`;
  }
  return null;
}
