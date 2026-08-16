"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getClientToken } from "@/lib/client/token";
import type { AdminModelRegistrationMedia } from "@/types/admin";
import type { ServiceProviderType } from "@/types/public-service-provider";
import ModelProfileMediaSection from "@/components/model/ModelProfileMediaSection";

interface ServiceProviderOwnProfile {
  id: string;
  email: string;
  status: string;
  registrationMedia?: AdminModelRegistrationMedia | null;
  beauticianProfile?: {
    fullName?: string;
    specialties?: string[];
    yearsOfExperience?: number | null;
    location?: string | null;
    rateCard?: string | null;
    shortBio?: string | null;
  } | null;
  photographerProfile?: {
    fullName?: string;
    specialties?: string[];
    yearsOfExperience?: number | null;
    equipmentOverview?: string | null;
    location?: string | null;
    rateCard?: string | null;
    shortBio?: string | null;
  } | null;
}

async function fetchOwnProfile(token: string): Promise<ServiceProviderOwnProfile | null> {
  try {
    const res = await fetch("/api/model/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

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
      <p className="font-ui text-[11px] text-[#0A0A0A]">{String(value)}</p>
    </div>
  );
}

const COPY: Record<
  ServiceProviderType,
  { eyebrow: string; reviewBody: string }
> = {
  beautician: {
    eyebrow: "Beautician account",
    reviewBody:
      "Your beautician profile has been submitted and is being reviewed. You will be notified once your account is activated.",
  },
  photographer: {
    eyebrow: "Photographer account",
    reviewBody:
      "Your photographer profile has been submitted and is being reviewed. You will be notified once your account is activated.",
  },
};

interface ServiceProviderProfilePageProps {
  type: ServiceProviderType;
}

export default function ServiceProviderProfilePage({
  type,
}: ServiceProviderProfilePageProps) {
  const { user, isAuthenticated, isBeautician, isPhotographer, isLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ServiceProviderOwnProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [registrationMedia, setRegistrationMedia] =
    useState<AdminModelRegistrationMedia | null>(null);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const isAllowed = type === "beautician" ? isBeautician : isPhotographer;

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/?login=1");
      return;
    }
    if (!isAllowed) {
      router.replace("/");
      return;
    }

    const token = getClientToken();
    if (!token) return;

    void fetchOwnProfile(token).then((data) => {
      setProfile(data);
      setRegistrationMedia(data?.registrationMedia ?? null);
      setLoadingProfile(false);
    });
  }, [isAuthenticated, isLoading, isAllowed, router]);

  const details =
    type === "beautician" ? profile?.beauticianProfile : profile?.photographerProfile;
  const isActive = profile?.status === "ACTIVE";
  const copy = COPY[type];

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
          {copy.eyebrow}
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
              Under admin review
            </p>
            <p className="font-ui text-[10px] text-[#0A0A0A] leading-relaxed">
              {copy.reviewBody}
            </p>
          </div>
        )}

        <div className="bg-white border border-[#E0E0E0] p-6 space-y-5">
          <h2 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
            Your profile
          </h2>

          {details?.specialties && details.specialties.length > 0 && (
            <div>
              <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-1">
                Specialties
              </p>
              <p className="font-ui text-[11px] text-[#0A0A0A]">
                {details.specialties.join(", ")}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailRow label="Years of experience" value={details?.yearsOfExperience} />
            <DetailRow label="Location" value={details?.location} />
            <DetailRow label="Rate" value={details?.rateCard} />
            {type === "photographer" && (
              <DetailRow
                label="Equipment"
                value={profile?.photographerProfile?.equipmentOverview}
              />
            )}
          </div>

          <DetailRow label="Bio" value={details?.shortBio} />
        </div>

        <div className="mt-6 space-y-6">
          {banner && (
            <div
              className={
                banner.type === "ok"
                  ? "border border-[#C8A97A] bg-[#C8A97A]/10 px-5 py-3"
                  : "border border-red-300 bg-red-50 px-5 py-3"
              }
            >
              <p
                className={
                  "font-ui text-[10px] " +
                  (banner.type === "ok" ? "text-[#0A0A0A]" : "text-red-700")
                }
              >
                {banner.text}
              </p>
            </div>
          )}
          <ModelProfileMediaSection
            media={registrationMedia}
            showWorkExperience={false}
            allowEmptyPortfolio
            onMediaChange={setRegistrationMedia}
            onError={(message) => setBanner({ type: "err", text: message })}
          />
        </div>
      </div>
    </main>
  );
}
