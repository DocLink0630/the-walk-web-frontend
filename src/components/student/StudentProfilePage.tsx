"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ChangePasswordSection from "@/components/auth/ChangePasswordSection";
import { SKIN_COLOR_OPTIONS } from "@/components/registration/personal/constants";
import { formatModelTier } from "@/lib/admin/model-tiers";
import { STUDENT_STATUS_LABELS } from "@/lib/admin/student-user-status";
import {
  fetchOwnStudentProfile,
  type StudentOwnProfile,
} from "@/lib/student/profile-api";
import type { UserStatus } from "@/types/admin";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (value == null || value === "") return null;
  return (
    <div>
      <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-0.5">
        {label}
      </p>
      <p className="font-ui text-[11px] text-[#0A0A0A] whitespace-pre-line break-words">
        {String(value)}
      </p>
    </div>
  );
}

function skinColorLabel(id?: string | null) {
  if (!id) return null;
  return SKIN_COLOR_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

function statusLabel(status?: string | null) {
  if (!status) return null;
  return STUDENT_STATUS_LABELS[status as UserStatus] ?? status;
}

function MediaCard({
  label,
  url,
  alt,
  aspect,
}: {
  label: string;
  url: string;
  alt: string;
  aspect: string;
}) {
  return (
    <div className="border border-[#E0E0E0] bg-white p-3 space-y-2">
      <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A]">
        {label}
      </p>
      <div className={`relative ${aspect} overflow-hidden bg-[#F5F5F5]`}>
        <Image src={url} alt={alt} fill className="object-cover" sizes="240px" />
      </div>
    </div>
  );
}

export default function StudentProfilePage() {
  const { user, isAuthenticated, isStudent, isLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<StudentOwnProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/?login=1");
      return;
    }
    if (!isStudent) {
      router.replace("/");
      return;
    }

    void fetchOwnStudentProfile().then((data) => {
      setProfile(data);
      setLoadingProfile(false);
    });
  }, [isAuthenticated, isLoading, isStudent, router]);

  const details = profile?.studentProfile;
  const media = profile?.registrationMedia;
  const isActive = profile?.status === "ACTIVE";

  if (isLoading || loadingProfile) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A]">
          Loading…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="font-ui text-[8px] tracking-[0.35em] uppercase text-[#C8A97A] mb-2">
          Student account
        </p>
        <h1 className="font-display text-3xl font-light text-[#0A0A0A] mb-1">
          {details?.fullName ?? user?.name ?? user?.email}
        </h1>
        <p className="font-ui text-[9px] tracking-[0.1em] text-[#9A9A9A] mb-8">
          {user?.email}
        </p>

        {!isActive && (
          <div className="border border-[#C8A97A] bg-[#C8A97A]/10 px-5 py-4 mb-8">
            <p className="font-ui text-[9px] tracking-[0.2em] uppercase text-[#9A7329] mb-1">
              {statusLabel(profile?.status) ?? "Application in progress"}
            </p>
            <p className="font-ui text-[10px] text-[#0A0A0A] leading-relaxed">
              Your student application has been submitted. You will be notified once
              your account status is updated.
            </p>
          </div>
        )}

        <div className="bg-white border border-[#E0E0E0] p-6 space-y-5 mb-6">
          <h2 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
            Account
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailRow label="Status" value={statusLabel(profile?.status)} />
            <DetailRow label="Student code" value={details?.modelCode} />
            <DetailRow label="Tier" value={formatModelTier(details?.tier)} />
            <DetailRow label="Referral source" value={details?.source} />
          </div>
        </div>

        <div className="bg-white border border-[#E0E0E0] p-6 space-y-5">
          <h2 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
            Your profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailRow label="Full name" value={details?.fullName} />
            <DetailRow label="Gender" value={details?.gender} />
            <DetailRow
              label="Age"
              value={details?.age != null ? String(details.age) : null}
            />
            <DetailRow label="Date of birth" value={details?.dobEnc} />
            <DetailRow label="NIC" value={details?.nicEnc} />
            <DetailRow label="Contact number" value={details?.contactNumberEnc} />
            <DetailRow label="WhatsApp" value={details?.whatsappNumberEnc} />
            <DetailRow label="Address" value={details?.addressEnc} />
            <DetailRow label="Height" value={details?.heightEnc} />
            <DetailRow label="Weight" value={details?.weightEnc} />
            <DetailRow label="Chest" value={details?.chestEnc} />
            <DetailRow label="Shoulder" value={details?.shoulderEnc} />
            <DetailRow label="Waist" value={details?.waistEnc} />
            <DetailRow label="Shoe size" value={details?.shoeSizeEnc} />
            <DetailRow label="Eye color" value={details?.eyeColorEnc} />
            <DetailRow label="Hair color" value={details?.hairColorEnc} />
            <DetailRow
              label="Skin color"
              value={skinColorLabel(details?.skinColorOptionId)}
            />
            <DetailRow label="Preferred branch" value={details?.preferredBranchRaw} />
            <DetailRow label="Preferred class time" value={details?.preferredDate} />
            <DetailRow label="Talents" value={details?.talentsEnc} />
          </div>
          <DetailRow label="Short bio" value={details?.shortBio} />
        </div>

        {media &&
          (media.profilePhoto?.url ||
            media.nicFront?.url ||
            media.nicBack?.url ||
            (media.portfolioPhotos?.length ?? 0) > 0) && (
            <div className="mt-6 space-y-4">
              <h2 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
                Uploaded photos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {media.profilePhoto?.url && (
                  <MediaCard
                    label="Profile photo"
                    url={media.profilePhoto.url}
                    alt="Profile photo"
                    aspect="aspect-[3/4]"
                  />
                )}
                {media.nicFront?.url && (
                  <MediaCard
                    label="NIC front"
                    url={media.nicFront.url}
                    alt="NIC front"
                    aspect="aspect-[4/3]"
                  />
                )}
                {media.nicBack?.url && (
                  <MediaCard
                    label="NIC back"
                    url={media.nicBack.url}
                    alt="NIC back"
                    aspect="aspect-[4/3]"
                  />
                )}
                {media.portfolioPhotos?.map((photo, index) =>
                  photo.url ? (
                    <MediaCard
                      key={photo.storageFileId ?? photo.url}
                      label={`Portfolio ${index + 1}`}
                      url={photo.url}
                      alt={`Portfolio photo ${index + 1}`}
                      aspect="aspect-[3/4]"
                    />
                  ) : null,
                )}
              </div>
            </div>
          )}

        <div className="mt-8">
          <ChangePasswordSection />
        </div>
      </div>
    </main>
  );
}
