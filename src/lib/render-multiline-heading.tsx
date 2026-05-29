import type { ReactNode } from "react";

export function renderMultilineHeading(heading: string | ReactNode) {
  if (typeof heading !== "string") return heading;

  const lines = heading.split("\n");
  return lines.map((line, index) => (
    <span key={line}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}
