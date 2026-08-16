import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";

import {
  inquiryExtraMeasurements,
  talentSubtitle,
  talentToModelProfilePdfData,
} from "./normalize-inquiry-talent";
import {
  CornerAccents,
  MeasurementCell,
  PageFooter,
  portfolioStyles,
  renderModelProfilePages,
} from "./portfolio-layout";
import type { InquiryModelsPdfData } from "./types";

const styles = StyleSheet.create({
  coverBottom: {
    paddingBottom: 160,
  },
  subtitle: {
    fontSize: 10,
    color: "#4A4A4A",
    marginBottom: 22,
  },
  message: {
    fontSize: 10,
    lineHeight: 1.55,
    marginBottom: 16,
  },
  talentLine: {
    fontSize: 10,
    lineHeight: 1.6,
    marginBottom: 2,
  },
});

export function InquiryModelsDocument({
  data,
  logoSrc,
}: {
  data: InquiryModelsPdfData;
  logoSrc?: string | null;
}) {
  const { inquiry, talents } = data;
  const created = inquiry.createdAt
    ? new Date(inquiry.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const coverDetails = [
    { label: "Client", value: inquiry.clientName || inquiry.clientEmail },
    { label: "Phone", value: inquiry.phone },
    { label: "Event date", value: inquiry.eventDate },
    { label: "Status", value: inquiry.status },
    { label: "Inquiry", value: inquiry.id?.slice(0, 8) },
    { label: "Submitted", value: created },
  ];

  return (
    <Document>
      <Page size="A4" style={[portfolioStyles.page, styles.coverBottom]}>
        <CornerAccents />

        <View style={portfolioStyles.headerRow}>
          <View style={portfolioStyles.nameBlock}>
            <Text style={portfolioStyles.name}>Inquiry talent pack</Text>
            <Text style={styles.subtitle}>
              Inquiry {inquiry.id.slice(0, 8)}
              {created ? ` · Submitted ${created}` : ""}
            </Text>
          </View>
        </View>

        <Text style={portfolioStyles.sectionTitle}>Inquiry details</Text>
        <View style={portfolioStyles.statGrid}>
          {coverDetails.map((item) => (
            <MeasurementCell
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </View>

        {inquiry.message?.trim() ? (
          <>
            <Text style={[portfolioStyles.sectionTitle, { marginTop: 18 }]}>
              Message
            </Text>
            <Text style={styles.message}>{inquiry.message.trim()}</Text>
          </>
        ) : null}

        <Text style={[portfolioStyles.sectionTitle, { marginTop: 10 }]}>
          Selected talent ({talents.length})
        </Text>
        {talents.map((talent, listIndex) => (
          <Text
            key={`${talent.modelUserId ?? talent.modelName}-${listIndex}`}
            style={styles.talentLine}
          >
            {listIndex + 1}. {talent.fullName}
            {talent.modelType
              ? ` (${talent.modelType}${talent.category ? ` · ${talent.category}` : ""})`
              : ""}
          </Text>
        ))}

        <PageFooter logoSrc={logoSrc} />
      </Page>

      {talents.flatMap((talent, index) =>
        renderModelProfilePages({
          data: talentToModelProfilePdfData(talent),
          logoSrc,
          idPrefix: talent.modelUserId ?? `talent-${index}`,
          extraMeasurements: inquiryExtraMeasurements(talent),
          subtitle: talentSubtitle(talent),
        }),
      )}
    </Document>
  );
}
