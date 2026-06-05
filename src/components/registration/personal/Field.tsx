import { formHint, formLabel, formRequiredMark } from "../form-styles";

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string | null;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

export function Field({ label, required, error, hint, htmlFor, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={formLabel}>
        {label} {required && <span className={formRequiredMark}>*</span>}
      </label>
      {children}
      {hint && !error && <p className={formHint}>{hint}</p>}
      {error && <p className={formHint + " text-red-600"}>{error}</p>}
    </div>
  );
}
