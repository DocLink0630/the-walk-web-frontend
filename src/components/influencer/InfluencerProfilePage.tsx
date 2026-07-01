"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getClientToken } from "@/lib/client/token";

interface InfluencerOwnProfile {
  id: string;
  email: string;
  status: string;
  influencerProfile?: {
    fullName?: string;
    contentCategories?: string[];
    instagramUrl?: string | null;
    instagramFollowers?: string | null;
    tiktokUrl?: string | null;
    tiktokFollowers?: string | null;
    youtubeUrl?: string | null;
    youtubeSubscribers?: string | null;
    facebookUrl?: string | null;
    facebookFollowers?: string | null;
    pastBrandWork?: string | null;
    rateCard?: string | null;
    shortBio?: string | null;
  } | null;
}

async function fetchOwnProfile(token: string): Promise<InfluencerOwnProfile | null> {
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

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-0.5">{label}</p>
      {value.startsWith("http") ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="font-ui text-[11px] text-[#9A7329] underline underline-offset-2 break-all"
        >
          {value}
        </a>
      ) : (
        <p className="font-ui text-[11px] text-[#0A0A0A]">{value}</p>
      )}
    </div>
  );
}

export default function InfluencerProfilePage() {
  const { user, isAuthenticated, isInfluencer, isLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<InfluencerOwnProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/?login=1");
      return;
    }
    if (!isInfluencer) {
      router.replace("/");
      return;
    }

    const token = getClientToken();
    if (!token) return;

    void fetchOwnProfile(token).then((data) => {
      setProfile(data);
      setLoadingProfile(false);
    });
  }, [isAuthenticated, isLoading, isInfluencer, router]);

  const influencer = profile?.influencerProfile;
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
      <div className="max-w-xl mx-auto">
        <p className="font-ui text-[8px] tracking-[0.35em] uppercase text-[#C8A97A] mb-2">
          Influencer account
        </p>
        <h1 className="font-display text-3xl font-light text-[#0A0A0A] mb-1">
          {influencer?.fullName ?? user?.name ?? user?.email}
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
              Your influencer profile has been submitted and is being reviewed. You will be
              notified once your account is activated.
            </p>
          </div>
        )}

        <div className="bg-white border border-[#E0E0E0] p-6 space-y-5">
          <h2 className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#0A0A0A]">
            Your profile
          </h2>

          {influencer?.contentCategories && influencer.contentCategories.length > 0 && (
            <div>
              <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-1">
                Content categories
              </p>
              <p className="font-ui text-[11px] text-[#0A0A0A]">
                {influencer.contentCategories.join(", ")}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailRow label="Instagram" value={influencer?.instagramUrl} />
            <DetailRow label="Instagram followers" value={influencer?.instagramFollowers} />
            <DetailRow label="TikTok" value={influencer?.tiktokUrl} />
            <DetailRow label="TikTok followers" value={influencer?.tiktokFollowers} />
            <DetailRow label="YouTube" value={influencer?.youtubeUrl} />
            <DetailRow label="YouTube subscribers" value={influencer?.youtubeSubscribers} />
            <DetailRow label="Facebook" value={influencer?.facebookUrl} />
            <DetailRow label="Facebook followers" value={influencer?.facebookFollowers} />
          </div>

          <DetailRow label="Rate card" value={influencer?.rateCard} />
          <DetailRow label="Past brand work" value={influencer?.pastBrandWork} />
          <DetailRow label="Bio" value={influencer?.shortBio} />
        </div>
      </div>
    </main>
  );
}
