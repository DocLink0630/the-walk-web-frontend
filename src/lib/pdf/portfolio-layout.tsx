import {
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

export const portfolioStyles = StyleSheet.create({
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
    paddingLeft: 64,
    paddingTop: 8,
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
    textAlign: "center",
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
    width: 110,
    height: 110,
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

export function chunkImages(images: string[], size = GALLERY_PER_PAGE): string[][] {
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

export function CornerAccents() {
  return (
    <>
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

export function MeasurementCell({
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
    <View style={centered ? portfolioStyles.statCentered : portfolioStyles.stat}>
      <Text style={portfolioStyles.statLabel}>{label}</Text>
      <Text style={portfolioStyles.statValue}>{display}</Text>
    </View>
  );
}

function GalleryGrid({ images }: { images: string[] }) {
  const top = images.slice(0, 3);
  const bottom = images.slice(3, 5);

  return (
    <View>
      {top.length > 0 ? (
        <View style={portfolioStyles.galleryTopRow}>
          {top.map((src, index) => (
            <Image
              key={`top-${src}-${index}`}
              src={src}
              style={portfolioStyles.galleryImage}
            />
          ))}
        </View>
      ) : null}
      {bottom.length > 0 ? (
        <View style={portfolioStyles.galleryBottomRow}>
          {bottom.map((src, index) => (
            <Image
              key={`bottom-${src}-${index}`}
              src={src}
              style={portfolioStyles.galleryImage}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function PageFooter({ logoSrc }: { logoSrc?: string | null }) {
  return (
    <View style={portfolioStyles.footer}>
      {logoSrc ? <Image src={logoSrc} style={portfolioStyles.footerLogo} /> : null}
      <View style={portfolioStyles.contactRow}>
        <View style={portfolioStyles.contactLine} />
        <ContactDiamond />
        <Text style={portfolioStyles.contactUs}>Contact Us</Text>
        <ContactDiamond />
        <View style={portfolioStyles.contactLine} />
      </View>
      <Text style={portfolioStyles.contactInfo}>{PDF_CONTACT_PHONE}</Text>
      <Text style={portfolioStyles.contactInfo}>{PDF_CONTACT_WEBSITE}</Text>
    </View>
  );
}

function GalleryPage({
  title,
  images,
  logoSrc,
  pageKey,
}: {
  title: string;
  images: string[];
  logoSrc?: string | null;
  pageKey: string;
}) {
  return (
    <Page key={pageKey} size="A4" style={portfolioStyles.page}>
      <CornerAccents />
      <Text style={portfolioStyles.galleryTitle}>{title}</Text>
      <GalleryGrid images={images} />
      <PageFooter logoSrc={logoSrc} />
    </Page>
  );
}

function MeasurementRow({
  items,
  centered,
}: {
  items: { label: string; value?: string | null }[];
  centered?: boolean;
}) {
  if (items.length === 0) return null;

  if (centered) {
    return (
      <View style={portfolioStyles.statCenteredRow}>
        {items.map((item) => (
          <MeasurementCell
            key={item.label}
            label={item.label}
            value={item.value}
            centered
          />
        ))}
      </View>
    );
  }

  return (
    <>
      {items.map((item) => (
        <MeasurementCell
          key={item.label}
          label={item.label}
          value={item.value}
        />
      ))}
    </>
  );
}

export type ExtraMeasurement = { label: string; value?: string | null };

export function renderModelProfilePages({
  data,
  logoSrc,
  idPrefix = "model",
  extraMeasurements = [],
  subtitle,
}: {
  data: ModelProfilePdfData;
  logoSrc?: string | null;
  idPrefix?: string;
  extraMeasurements?: ExtraMeasurement[];
  subtitle?: string;
}): React.ReactElement[] {
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

  const extraRows: ExtraMeasurement[][] = [];
  for (let i = 0; i < extraMeasurements.length; i += 3) {
    extraRows.push(extraMeasurements.slice(i, i + 3));
  }

  const portfolioChunks = chunkImages(data.portfolioImages.filter(Boolean));
  const workImages = data.workExperience.flatMap((entry) =>
    entry.images.filter(Boolean),
  );
  const workChunks = chunkImages(workImages);

  const cover = (
    <Page key={`${idPrefix}-cover`} size="A4" style={portfolioStyles.page}>
      <CornerAccents />

      <View style={portfolioStyles.headerRow}>
        <View style={portfolioStyles.nameBlock}>
          <Text style={portfolioStyles.name}>{displayName}</Text>
          {email ? <Text style={portfolioStyles.email}>{email}</Text> : null}
          {subtitle ? <Text style={portfolioStyles.email}>{subtitle}</Text> : null}
        </View>
      </View>

      <View style={portfolioStyles.profileRow}>
        {data.profileImage ? (
          <Image src={data.profileImage} style={portfolioStyles.profileImage} />
        ) : (
          <View style={portfolioStyles.profileImage} />
        )}
        <View style={portfolioStyles.bioBlock}>
          <Text style={portfolioStyles.bioHeading}>BIO-</Text>
          {data.shortBio?.trim() ? (
            <Text style={portfolioStyles.bioText}>{data.shortBio.trim()}</Text>
          ) : null}
        </View>
      </View>

      <Text style={portfolioStyles.sectionTitle}>Measurements & Details</Text>
      <View style={portfolioStyles.statGrid}>
        <MeasurementRow items={measurementsRow1} />
        <MeasurementRow items={measurementsRow2} />
      </View>
      <MeasurementRow items={measurementsRow3} centered />
      {extraRows.map((row, index) =>
        row.length < 3 ? (
          <MeasurementRow
            key={`${idPrefix}-extra-${index}`}
            items={row}
            centered
          />
        ) : (
          <View
            key={`${idPrefix}-extra-${index}`}
            style={[portfolioStyles.statGrid, { marginTop: 10 }]}
          >
            <MeasurementRow items={row} />
          </View>
        ),
      )}
    </Page>
  );

  return [
    cover,
    ...portfolioChunks.map((images, index) => (
      <GalleryPage
        key={`${idPrefix}-portfolio-${index}`}
        pageKey={`${idPrefix}-portfolio-${index}`}
        title="Portfolio"
        images={images}
        logoSrc={logoSrc}
      />
    )),
    ...workChunks.map((images, index) => (
      <GalleryPage
        key={`${idPrefix}-work-${index}`}
        pageKey={`${idPrefix}-work-${index}`}
        title="Work Experience"
        images={images}
        logoSrc={logoSrc}
      />
    )),
  ];
}
