/**
 * Full years between date of birth (YYYY-MM-DD) and today.
 */
export function ageFromDateOfBirth(dob: string): number | null {
  if (!dob.trim()) return null;

  const birth = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  if (age < 0 || age > 120) return null;
  return age;
}
