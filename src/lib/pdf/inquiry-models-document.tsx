import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

import type { InquiryModelsPdfData } from "./types";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111111",
    padding: 36,
    backgroundColor: "#ffffff",
  },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 2,
    color: "#9A7329",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 20,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#9A7329",
    marginBottom: 8,
    marginTop: 8,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  stat: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    padding: 8,
  },
  statLabel: {
    fontSize: 7,
    color: "#888888",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 10,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  portfolioImage: {
    width: 110,
    height: 140,
    objectFit: "cover",
    backgroundColor: "#f2f2f2",
  },
  talentHeader: {
    marginBottom: 10,
  },
});

function Stat({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined) return null;
  const text = typeof value === "string" ? value.trim() : String(value);
  if (!text) return null;
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{text}</Text>
    </View>
  );
}

export function InquiryModelsDocument({ data }: { data: InquiryModelsPdfData }) {
  const { inquiry, talents } = data;
  const created = new Date(inquiry.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>The Walk Agency</Text>
        <Text style={styles.title}>Inquiry talent pack</Text>
        <Text style={styles.subtitle}>
          Inquiry {inquiry.id.slice(0, 8)} · Submitted {created}
        </Text>

        <Text style={styles.sectionTitle}>Inquiry details</Text>
        <View style={styles.statGrid}>
          <Stat label="Client" value={inquiry.clientName || inquiry.clientEmail} />
          <Stat label="Phone" value={inquiry.phone} />
          <Stat label="Event date" value={inquiry.eventDate} />
          <Stat label="Status" value={inquiry.status} />
        </View>
        {inquiry.message ? (
          <>
            <Text style={styles.sectionTitle}>Message</Text>
            <Text>{inquiry.message}</Text>
          </>
        ) : null}

        <Text style={styles.sectionTitle}>Selected talent ({talents.length})</Text>
        {talents.map((talent) => (
          <Text key={talent.modelName + talent.modelType}>
            · {talent.fullName} ({talent.modelType}
            {talent.category ? ` · ${talent.category}` : ""})
          </Text>
        ))}
      </Page>

      {talents.map((talent, index) => (
        <Page key={`${talent.modelUserId ?? talent.modelName}-${index}`} size="A4" style={styles.page}>
          <View style={styles.talentHeader}>
            <Text style={styles.eyebrow}>Talent {index + 1}</Text>
            <Text style={styles.title}>{talent.fullName}</Text>
            <Text style={styles.subtitle}>
              {talent.modelType}
              {talent.category ? ` · ${talent.category}` : ""}
              {talent.priceRate ? ` · ${talent.priceRate}` : ""}
            </Text>
          </View>

          {talent.shortBio ? <Text style={{ marginBottom: 10 }}>{talent.shortBio}</Text> : null}

          <View style={styles.statGrid}>
            <Stat label="Tier" value={talent.tier} />
            <Stat label="Rate" value={talent.rate} />
            <Stat label="Height" value={talent.height} />
            <Stat label="Weight" value={talent.weight} />
            <Stat label="Chest" value={talent.chest} />
            <Stat label="Shoulder" value={talent.shoulder} />
            <Stat label="Waist" value={talent.waist} />
            <Stat label="Eyes" value={talent.eyeColor} />
            <Stat label="Hair" value={talent.hairColor} />
            <Stat label="Location" value={talent.location} />
            <Stat label="Experience (yrs)" value={talent.yearsOfExperience} />
            {talent.specialties && talent.specialties.length > 0 ? (
              <Stat label="Specialties" value={talent.specialties.join(", ")} />
            ) : null}
          </View>

          {talent.equipmentOverview ? (
            <>
              <Text style={styles.sectionTitle}>Equipment</Text>
              <Text>{talent.equipmentOverview}</Text>
            </>
          ) : null}

          {talent.images.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Images</Text>
              <View style={styles.imageGrid}>
                {talent.images.map((src, imageIndex) => (
                  <Image
                    key={`${src}-${imageIndex}`}
                    src={src}
                    style={styles.portfolioImage}
                  />
                ))}
              </View>
            </>
          ) : null}
        </Page>
      ))}
    </Document>
  );
}
