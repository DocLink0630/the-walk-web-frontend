"use client";

import { X } from "lucide-react";
import Image from "next/image";
import ReviewsList from "@/components/reviews/ReviewsList";

export interface PublicInfluencer {
  userId: string;
  name: string;
  imageUrl: string | null;
  portfolioImages: string[];
  contentCategories: string[];
  instagramUrl: string | null;
  instagramFollowers: string | null;
  tiktokUrl: string | null;
  tiktokFollowers: string | null;
  youtubeUrl: string | null;
  youtubeSubscribers: string | null;
  facebookUrl: string | null;
  facebookFollowers: string | null;
  pastBrandWork: string | null;
  rateCard: string | null;
  shortBio: string | null;
}

interface InfluencerPublicModalProps {
  influencer: PublicInfluencer;
  onClose: () => void;
}

function SocialRow({
  url,
  label,
  followers,
  icon: Icon,
}: {
  url: string | null;
  label: string;
  followers: string | null;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}) {
  if (!url && !followers) return null;
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-[#9A9A9A] shrink-0" />
      <span className="font-ui text-[10px] text-[#4A4A4A]">{label}</span>
      {followers && (
        <span className="font-ui text-[10px] text-[#737373]">{followers}</span>
      )}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto font-ui text-[9px] uppercase tracking-[0.1em] text-[#C8A97A] underline"
        >
          Visit
        </a>
      )}
    </div>
  );
}

// Simple social icons as SVG since lucide-react does not ship brand icons
function InstagramIcon({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YouTubeIcon({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.6 15.5V8.5L15.8 12l-6.2 3.5z" />
    </svg>
  );
}

function TikTokIcon({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.97a8.22 8.22 0 0 0 4.8 1.54V7.06a4.85 4.85 0 0 1-1.03-.37z" />
    </svg>
  );
}

export default function InfluencerPublicModal({ influencer, onClose }: InfluencerPublicModalProps) {
  const coverImage = influencer.imageUrl ?? influencer.portfolioImages[0] ?? null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg max-h-[90vh] bg-white flex flex-col overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 bg-white/80 hover:bg-white transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Cover image */}
        {coverImage ? (
          <div className="relative h-56 shrink-0 bg-[#0A0A0A]">
            <Image src={coverImage} alt={influencer.name} fill className="object-cover opacity-90" />
          </div>
        ) : (
          <div className="h-56 shrink-0 bg-[#0A0A0A]" />
        )}

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          <div>
            <p className="font-ui text-[8px] tracking-[0.3em] uppercase text-[#C8A97A] mb-1">
              Influencer
            </p>
            <h2 className="font-display text-2xl font-light text-[#0A0A0A]">{influencer.name}</h2>
            {influencer.contentCategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {influencer.contentCategories.map((cat) => (
                  <span
                    key={cat}
                    className="font-ui text-[8px] tracking-[0.1em] uppercase px-2 py-0.5 border border-[#EBEBEB] text-[#6B6B6B]"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          {influencer.shortBio && (
            <div>
              <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-1">About</p>
              <p className="font-ui text-[11px] text-[#4A4A4A] leading-relaxed">{influencer.shortBio}</p>
            </div>
          )}

          {/* Social channels */}
          <div className="space-y-2">
            <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A]">Channels</p>
            <SocialRow
              url={influencer.instagramUrl}
              label="Instagram"
              followers={influencer.instagramFollowers}
              icon={InstagramIcon}
            />
            <SocialRow
              url={influencer.tiktokUrl}
              label="TikTok"
              followers={influencer.tiktokFollowers}
              icon={TikTokIcon}
            />
            <SocialRow
              url={influencer.youtubeUrl}
              label="YouTube"
              followers={influencer.youtubeSubscribers}
              icon={YouTubeIcon}
            />
          </div>

          {influencer.rateCard && (
            <div>
              <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-1">Rate</p>
              <p className="font-ui text-[11px] text-[#0A0A0A]">{influencer.rateCard}</p>
            </div>
          )}

          {/* Reviews */}
          <div>
            <p className="font-ui text-[8px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-3">
              Client reviews
            </p>
            <ReviewsList talentUserId={influencer.userId} />
          </div>
        </div>
      </div>
    </div>
  );
}
