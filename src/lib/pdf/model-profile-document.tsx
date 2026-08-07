import {
  Document,
  Image,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

import {
  PDF_CONTACT_PHONE,
  PDF_CONTACT_WEBSITE,
  PDF_GOLD,
  PDF_INK,
} from "./brand";
import type { ModelProfilePdfData } from "./types";

const GALLERY_PER_PAGE = 5;

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: PDF_INK,
    backgroundColor: "#ffffff",
    paddingTop: 56,
    paddingBottom: 48,
    paddingHorizontal: 48,
    position: "relative",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  nameBlock: {
    flex: 1,
    paddingRight: 16,
  },
  name: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: PDF_GOLD,
    marginBottom: 6,
  },
  email: {
    fontSize: 10,
    color: PDF_INK,
  },
  headerLogo: {
    width: 72,
    height: 72,
    objectFit: "contain",
  },
  profileRow: {
    flexDirection: "row",
    gap: 22,
    marginBottom: 28,
    alignItems: "flex-start",
  },
  profileImage: {
    width: 210,
    height: 280,
    objectFit: "cover",
    backgroundColor: "#f2f2f2",
  },
  bioBlock: {
    flex: 1,
    paddingTop: 4,
  },
  bioHeading: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: PDF_GOLD,
    letterSpacing: 1,
    marginBottom: 10,
  },
  bioText: {
    fontSize: 10,
    lineHeight: 1.55,
    color: PDF_INK,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: PDF_GOLD,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  galleryTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: PDF_GOLD,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 22,
    marginTop: 8,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  stat: {
    width: "31.5%",
    borderWidth: 1,
    borderColor: "#D8D0C0",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  statCenteredRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    marginTop: 10,
  },
  statCentered: {
    width: "31.5%",
    borderWidth: 1,
    borderColor: "#D8D0C0",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  statLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: PDF_GOLD,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 11,
    color: PDF_INK,
  },
  galleryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  galleryBottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  galleryImage: {
    width: 155,
    height: 210,
    objectFit: "cover",
    backgroundColor: "#f2f2f2",
  },
  footer: {
    position: "absolute",
    bottom: 36,
    left: 48,
    right: 48,
    alignItems: "center",
  },
  footerLogo: {
    width: 70,
    height: 70,
    objectFit: "contain",
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    width: "100%",
  },
  contactLine: {
    flex: 1,
    height: 1,
    backgroundColor: PDF_INK,
  },
  contactUs: {
    fontSize: 14,
    fontFamily: "Times-Italic",
    color: PDF_GOLD,
    marginHorizontal: 10,
  },
  contactInfo: {
    fontSize: 9,
    color: PDF_GOLD,
    textAlign: "center",
    lineHeight: 1.5,
  },
});

function chunkImages(images: string[], size = GALLERY_PER_PAGE): string[][] {
  const chunks: string[][] = [];
  for (let i = 0; i < images.length; i += size) {
    chunks.push(images.slice(i, i + size));
  }
  return chunks;
}

function ContactDiamond() {
  return (
    <Svg width={8} height={8} viewBox="0 0 8 8" style={{ marginHorizontal: 6 }}>
      <Path d="M4 0 L8 4 L4 8 L0 4 Z" fill={PDF_INK} />
    </Svg>
  );
}

function CornerAccents() {
  return (
    <>
      {/* Top-left: gold outer + black inner */}
      <Svg
        style={{ position: "absolute", top: 0, left: 0 }}
        width={160}
        height={160}
        viewBox="0 0 160 160"
      >
        <Path
          d="M0 0 H118 Q118 0 118 18 Q118 95 40 118 Q18 118 0 118 Z"
          fill={PDF_GOLD}
        />
        <Path
          d="M0 0 H92 Q92 0 92 14 Q92 78 32 98 Q14 98 0 98 Z"
          fill={PDF_INK}
        />
      </Svg>
      {/* Bottom-right: black outer + gold inner */}
      <Svg
        style={{ position: "absolute", bottom: 0, right: 0 }}
        width={160}
        height={160}
        viewBox="0 0 160 160"
      >
        <Path
          d="M160 160 H42 Q42 160 42 142 Q42 65 120 42 Q142 42 160 42 Z"
          fill={PDF_INK}
        />
        <Path
          d="M160 160 H68 Q68 160 68 146 Q68 82 128 62 Q146 62 160 62 Z"
          fill={PDF_GOLD}
        />
      </Svg>
    </>
  );
}

function MeasurementCell({
  label,
  value,
  centered,
}: {
  label: string;
  value?: string | null;
  centered?: boolean;
}) {
  const display = value?.trim() || "—";
  return (
    <View style={centered ? styles.statCentered : styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{display}</Text>
    </View>
  );
}

function GalleryGrid({ images }: { images: string[] }) {
  const top = images.slice(0, 3);
  const bottom = images.slice(3, 5);

  return (
    <View>
      {top.length > 0 ? (
        <View style={styles.galleryTopRow}>
          {top.map((src, index) => (
            <Image
              key={`top-${src}-${index}`}
              src={src}
              style={styles.galleryImage}
            />
          ))}
        </View>
      ) : null}
      {bottom.length > 0 ? (
        <View style={styles.galleryBottomRow}>
          {bottom.map((src, index) => (
            <Image
              key={`bottom-${src}-${index}`}
              src={src}
              style={styles.galleryImage}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function PageFooter({ logoSrc }: { logoSrc?: string | null }) {
  return (
    <View style={styles.footer}>
      {logoSrc ? <Image src={logoSrc} style={styles.footerLogo} /> : null}
      <View style={styles.contactRow}>
        <View style={styles.contactLine} />
        <ContactDiamond />
        <Text style={styles.contactUs}>Contact Us</Text>
        <ContactDiamond />
        <View style={styles.contactLine} />
      </View>
      <Text style={styles.contactInfo}>{PDF_CONTACT_PHONE}</Text>
      <Text style={styles.contactInfo}>{PDF_CONTACT_WEBSITE}</Text>
    </View>
  );
}

function GalleryPage({
  title,
  images,
  logoSrc,
}: {
  title: string;
  images: string[];
  logoSrc?: string | null;
}) {
  return (
    <Page size="A4" style={styles.page}>
      <CornerAccents />
      <Text style={styles.galleryTitle}>{title}</Text>
      <GalleryGrid images={images} />
      <PageFooter logoSrc={logoSrc} />
    </Page>
  );
}

export function ModelProfileDocument({
  data,
  logoSrc,
}: {
  data: ModelProfilePdfData;
  logoSrc?: string | null;
}) {
  const displayName = data.fullName?.trim() || "Model";
  const email = data.email?.trim() || "";

  const measurementsRow1 = [
    { label: "Gender", value: data.gender },
    { label: "Height", value: data.height },
    { label: "Weight", value: data.weight },
  ];
  const measurementsRow2 = [
    { label: "Chest", value: data.chest },
    { label: "Shoulder", value: data.shoulder },
    { label: "Waist", value: data.waist },
  ];
  const measurementsRow3 = [
    { label: "Eyes", value: data.eyeColor },
    { label: "Hair", value: data.hairColor },
  ];

  const portfolioChunks = chunkImages(data.portfolioImages.filter(Boolean));
  const workImages = data.workExperience.flatMap((entry) =>
    entry.images.filter(Boolean),
  );
  const workChunks = chunkImages(workImages);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <CornerAccents />

        <View style={styles.headerRow}>
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{displayName}</Text>
            {email ? <Text style={styles.email}>{email}</Text> : null}
          </View>
          {logoSrc ? (
            <Image src={logoSrc} style={styles.headerLogo} />
          ) : null}
        </View>

        <View style={styles.profileRow}>
          {data.profileImage ? (
            <Image src={data.profileImage} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImage} />
          )}
          <View style={styles.bioBlock}>
            <Text style={styles.bioHeading}>BIO-</Text>
            {data.shortBio?.trim() ? (
              <Text style={styles.bioText}>{data.shortBio.trim()}</Text>
            ) : null}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Measurements & Details</Text>
        <View style={styles.statGrid}>
          {measurementsRow1.map((item) => (
            <MeasurementCell
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
          {measurementsRow2.map((item) => (
            <MeasurementCell
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </View>
        <View style={styles.statCenteredRow}>
          {measurementsRow3.map((item) => (
            <MeasurementCell
              key={item.label}
              label={item.label}
              value={item.value}
              centered
            />
          ))}
        </View>
      </Page>

      {portfolioChunks.map((images, index) => (
        <GalleryPage
          key={`portfolio-${index}`}
          title="Portfolio"
          images={images}
          logoSrc={logoSrc}
        />
      ))}

      {workChunks.map((images, index) => (
        <GalleryPage
          key={`work-${index}`}
          title="Work Experience"
          images={images}
          logoSrc={logoSrc}
        />
      ))}
    </Document>
  );
}
