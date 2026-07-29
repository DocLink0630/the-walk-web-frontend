import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

import type { ModelProfilePdfData } from "./types";

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
    fontSize: 26,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  profileImage: {
    width: 140,
    height: 180,
    objectFit: "cover",
    backgroundColor: "#f2f2f2",
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
  bio: {
    lineHeight: 1.45,
    color: "#333333",
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
  workTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
});

function Stat({ label, value }: { label: string; value?: string | null }) {
  if (!value?.trim()) return null;
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export function ModelProfileDocument({ data }: { data: ModelProfilePdfData }) {
  const displayName = data.fullName?.trim() || "Model";
  const tierSubtitle = data.tier?.trim() || null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>The Walk Agency</Text>
        <Text style={styles.title}>{displayName}</Text>
        {tierSubtitle ? <Text style={styles.subtitle}>{tierSubtitle}</Text> : null}

        <View style={styles.row}>
          {data.profileImage ? (
            <Image src={data.profileImage} style={styles.profileImage} />
          ) : null}
          <View style={{ flex: 1 }}>
            {data.shortBio ? (
              <>
                <Text style={styles.sectionTitle}>Bio</Text>
                <Text style={styles.bio}>{data.shortBio}</Text>
              </>
            ) : null}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Measurements & details</Text>
        <View style={styles.statGrid}>
          <Stat label="Gender" value={data.gender} />
          <Stat label="Height" value={data.height} />
          <Stat label="Weight" value={data.weight} />
          <Stat label="Chest" value={data.chest} />
          <Stat label="Shoulder" value={data.shoulder} />
          <Stat label="Waist" value={data.waist} />
          <Stat label="Eyes" value={data.eyeColor} />
          <Stat label="Hair" value={data.hairColor} />
        </View>
      </Page>

      {data.portfolioImages.length > 0 ? (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Portfolio — {displayName}</Text>
          <View style={styles.imageGridLarge}>
            {data.portfolioImages.map((src, index) => (
              <Image key={`${src}-${index}`} src={src} style={styles.portfolioImageLarge} />
            ))}
          </View>
        </Page>
      ) : null}

      {data.workExperience.map((entry, index) =>
        entry.images.length > 0 ? (
          <Page key={`${entry.title}-${index}`} size="A4" style={styles.page}>
            <Text style={styles.sectionTitle}>Work experience</Text>
            <Text style={styles.workTitle}>{entry.title}</Text>
            <View style={styles.imageGridLarge}>
              {entry.images.map((src, imageIndex) => (
                <Image
                  key={`${src}-${imageIndex}`}
                  src={src}
                  style={styles.portfolioImageLarge}
                />
              ))}
            </View>
          </Page>
        ) : null,
      )}
    </Document>
  );
}
