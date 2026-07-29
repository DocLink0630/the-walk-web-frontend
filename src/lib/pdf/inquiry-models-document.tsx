import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

import type { InquiryModelsPdfData, InquiryTalentPdfData } from "./types";

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
    fontSize: 22,
    marginBottom: 4,
  },
  titleLarge: {
    fontSize: 26,
    marginBottom: 6,
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
  imageGridLarge: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  portfolioImageLarge: {
    width: 240,
    height: 300,
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

function talentDisplayName(talent: InquiryTalentPdfData): string {
  return (
    talent.fullName?.trim() ||
    talent.modelName?.trim() ||
    "Talent"
  );
}

function TalentDetailPage({ talent, index }: { talent: InquiryTalentPdfData; index: number }) {
  const name = talentDisplayName(talent);

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.talentHeader}>
        <Text style={styles.eyebrow}>Talent {index + 1}</Text>
        <Text style={styles.titleLarge}>{name}</Text>
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
    </Page>
  );
}

function TalentPhotosPage({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  if (images.length === 0) return null;

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.imageGridLarge}>
        {images.map((src, imageIndex) => (
          <Image
            key={`${src}-${imageIndex}`}
            src={src}
            style={styles.portfolioImageLarge}
          />
        ))}
      </View>
    </Page>
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
        {talents.map((talent, listIndex) => (
          <Text key={`${talent.modelUserId ?? talent.modelName}-${listIndex}`}>
            · {talentDisplayName(talent)} ({talent.modelType}
            {talent.category ? ` · ${talent.category}` : ""})
          </Text>
        ))}
      </Page>

      {talents.flatMap((talent, index) => {
        const name = talentDisplayName(talent);
        const pages: React.ReactElement[] = [
          <TalentDetailPage
            key={`detail-${talent.modelUserId ?? name}-${index}`}
            talent={talent}
            index={index}
          />,
        ];

        if (talent.images.length > 0) {
          pages.push(
            <TalentPhotosPage
              key={`photos-${talent.modelUserId ?? name}-${index}`}
              title={`Portfolio — ${name}`}
              images={talent.images}
            />,
          );
        }

        for (const [workIndex, entry] of talent.workExperience.entries()) {
          if (entry.images.length > 0) {
            pages.push(
              <TalentPhotosPage
                key={`work-${index}-${workIndex}`}
                title={`${entry.title} — ${name}`}
                images={entry.images}
              />,
            );
          }
        }

        return pages;
      })}
    </Document>
  );
}
