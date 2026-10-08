export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, "");
  return /^(?:0|\+?94)[0-9]{9}$/.test(cleaned);
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
