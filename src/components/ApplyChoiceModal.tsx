"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { disciplines } from "@/data/discipline";
import influencerPortrait from "@/assets/images/influencer-portrait.jpg";

interface ApplyChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const [modelsCard, academyCard, photographersCard, beauticiansCard] = disciplines;

const APPLY_PATHS = [
  {
    href: "/register/model",
    eyebrow: "The Walk Agency",
    title: "Model",
    description: "Join our roster for runway, editorial, and commercial bookings.",
    cta: "Apply as model",
    image: modelsCard.image,
    accent: "border-l-[#0A0A0A]",
  },
  {
    href: "/register",
    eyebrow: "The Walk Academy",
    title: "Student",
    description: "Professional modelling training and industry placement.",
    cta: "Apply as student",
    image: academyCard.image,
    accent: "border-l-[#C8A97A]",
  },
  {
    href: "/register/beautician",
    eyebrow: "Service provider",
    title: "Beautician",
    description: "Beauty services for fashion, editorial, and events.",
    cta: "Apply as beautician",
    image: beauticiansCard.image,
    accent: "border-l-[#9A7329]",
  },
  {
    href: "/register/photographer",
    eyebrow: "Service provider",
    title: "Photographer",
    description: "Fashion, commercial, and editorial photography.",
    cta: "Apply as photographer",
    image: photographersCard.image,
    accent: "border-l-[#6B6B6B]",
  },
  {
    href: "/register/influencer",
    eyebrow: "Brand partnerships",
    title: "Influencer",
    description: "Connect with brands through your social channels.",
    cta: "Apply as influencer",
    image: influencerPortrait,
    accent: "border-l-[#C8A97A]",
  },
] as const;

export default function ApplyChoiceModal({ isOpen, onClose }: ApplyChoiceModalProps) {
  if (!isOpen) return null;

  const [featured, ...rest] = APPLY_PATHS;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-choice-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close apply options"
      />

      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white border border-[#E0E0E0] shadow-[0_8px_40px_rgba(0,0,0,0.15)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#E0E0E0] px-6 py-5 md:px-8 sticky top-0 bg-white z-10">
          <div>
            <h2
              id="apply-choice-title"
              className="font-display text-2xl md:text-3xl font-light text-[#0A0A0A] tracking-[0.02em]"
            >
              How would you like to apply?
            </h2>
            <p className="mt-2 font-ui text-sm text-[#4A4A4A] leading-relaxed">
              Pick the path that fits you each application is reviewed separately.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1 text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
            aria-label="Close"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Featured — Model */}
          <Link
            href={featured.href}
            onClick={onClose}
            data-cursor="button"
            className={`group relative flex flex-col sm:flex-row overflow-hidden border border-[#E0E0E0] hover:border-[#0A0A0A] transition-colors duration-300 border-l-4 ${featured.accent}`}
          >
            <div className="relative w-full sm:w-[42%] aspect-[16/10] sm:aspect-auto sm:min-h-[220px] shrink-0 bg-[#F5F5F5]">
              <Image
                src={featured.image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, 360px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/50 sm:from-black/30 to-transparent" />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 flex-1 bg-[#FAFAFA] group-hover:bg-[#0A0A0A] group-hover:text-white transition-colors duration-300">
              <p className="font-ui text-[9px] tracking-[0.3em] uppercase text-[#9A7329] group-hover:text-[#C8A97A] mb-2">
                {featured.eyebrow}
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-light mb-2">
                {featured.title}
              </h3>
              <p className="font-ui text-sm text-[#4A4A4A] group-hover:text-white/80 leading-relaxed mb-5 max-w-md">
                {featured.description}
              </p>
              <span className="inline-flex items-center gap-2 self-start font-ui text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 bg-[#0A0A0A] text-white group-hover:bg-white group-hover:text-[#0A0A0A] transition-colors">
                {featured.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Remaining four — 2×2 compact tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rest.map((path) => (
              <Link
                key={path.href}
                href={path.href}
                onClick={onClose}
                data-cursor="button"
                className={`group flex overflow-hidden border border-[#E0E0E0] hover:border-[#0A0A0A] transition-colors duration-300 border-l-4 ${path.accent}`}
              >
                <div className="relative w-24 sm:w-28 shrink-0 self-stretch min-h-[108px] bg-[#F5F5F5]">
                  <Image
                    src={path.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="112px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center min-w-0 py-4 pl-4 pr-3">
                  <p className="font-ui text-[8px] tracking-[0.25em] uppercase text-[#9A7329] mb-1 truncate">
                    {path.eyebrow}
                  </p>
                  <h3 className="font-display text-lg font-light text-[#0A0A0A] mb-0.5">
                    {path.title}
                  </h3>
                  <p className="font-ui text-[11px] text-[#6B6B6B] leading-snug line-clamp-2 mb-2">
                    {path.description}
                  </p>
                  <span className="font-ui text-[9px] tracking-[0.15em] uppercase text-[#0A0A0A] group-hover:text-[#C8A97A] transition-colors inline-flex items-center gap-1">
                    {path.cta}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
