import { Document } from "@react-pdf/renderer";
import React from "react";

import { renderModelProfilePages } from "./portfolio-layout";
import type { ModelProfilePdfData } from "./types";

export function ModelProfileDocument({
  data,
  logoSrc,
}: {
  data: ModelProfilePdfData;
  logoSrc?: string | null;
}) {
  return <Document>{renderModelProfilePages({ data, logoSrc })}</Document>;
}
