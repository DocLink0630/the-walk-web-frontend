"use client";

import {
  progressLabel,
  progressLabelActive,
  progressLabelInactive,
  progressStepCounter,
} from "./form-styles";

const STEPS = [
  { num: 1, label: "Account" },
  { num: 2, label: "Profile" },
  { num: 3, label: "Documents" },
];

interface RegistrationProgressProps {
  step: 1 | 2 | 3;
}

export default function RegistrationProgress({ step }: RegistrationProgressProps) {
  return (
    <div className="mb-8 pb-6 border-b border-[#E8E8E8]">
      <div className="flex justify-between items-end gap-2 mb-4">
        {STEPS.map(({ num, label }) => (
          <div
            key={num}
            className="flex-1 text-center min-w-0"
            aria-current={num === step ? "step" : undefined}
          >
            <span
              className={[
                progressLabel,
                num <= step ? progressLabelActive : progressLabelInactive,
              ].join(" ")}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-1.5" role="presentation">
        {STEPS.map(({ num }) => (
          <div
            key={num}
            className="flex-1 h-[3px] transition-colors duration-500 rounded-sm"
            style={{ backgroundColor: num <= step ? "#C8A97A" : "#D4D4D4" }}
          />
        ))}
      </div>

      <p className={`${progressStepCounter} mt-4 text-right`}>
        Step {step} of {STEPS.length}
      </p>
    </div>
  );
}
