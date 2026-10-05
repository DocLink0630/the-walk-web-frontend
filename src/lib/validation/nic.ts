const OLD_NIC_REGEX = /^\d{9}[VvXx]$/;
const NEW_NIC_REGEX = /^\d{12}$/;

export function isValidSriLankanNic(value: string): boolean {
  const nic = value.trim();
  return OLD_NIC_REGEX.test(nic) || NEW_NIC_REGEX.test(nic);
}

export function nicValidationMessage(value: string): string | null {
  if (!value.trim()) return "NIC number is required.";
  if (!isValidSriLankanNic(value)) {
    return "Enter a valid NIC number (9 digits + V/X, or 12 digits).";
  }
  return null;
}
