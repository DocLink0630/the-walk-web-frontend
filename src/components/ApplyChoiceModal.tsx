"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

interface ApplyChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APPLY_PATHS = [
  {
    href: "/register/model",
    eyebrow: "The Walk Agency",
    title: "Model",
    description: "Join our roster for runway, editorial, and commercial bookings.",
    cta: "Apply as model",
    image: "/images/Gallery/DSC09407.webp",
    cardClass:
      "border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white group-hover:border-[#0A0A0A]",
    eyebrowClass: "text-[#9A7329] group-hover:text-[#C8A97A]",
    ctaClass:
      "bg-[#0A0A0A] text-white group-hover:bg-white group-hover:text-[#0A0A0A]",
  },
  {
    href: "/register",
    eyebrow: "The Walk Academy",
    title: "Student",
    description: "Apply for professional modelling training and industry placement.",
    cta: "Apply as student",
    image: "/images/abothero.jpeg",
    cardClass:
      "border-[#C8A97A] hover:bg-[#C8A97A]/10 group-hover:border-[#9A7329]",
    eyebrowClass: "text-[#9A7329]",
    ctaClass: "bg-[#C8A97A] text-[#0A0A0A] hover:bg-[#9A7329] hover:text-white",
  },
  {
    href: "/register/beautician",
    eyebrow: "Service provider",
    title: "Beautician",
    description: "List your beauty services for fashion, editorial, and event bookings.",
    cta: "Apply as beautician",
    image: "/images/Gallery/DSC09407.webp",
    cardClass:
      "border-[#E0E0E0] hover:border-[#0A0A0A] hover:bg-[#FAFAFA]",
    eyebrowClass: "text-[#9A7329]",
    ctaClass: "bg-[#0A0A0A] text-white hover:bg-[#C8A97A]",
  },
  {
    href: "/register/photographer",
    eyebrow: "Service provider",
    title: "Photographer",
    description: "Showcase your portfolio for fashion, commercial, and editorial shoots.",
    cta: "Apply as photographer",
    image: "/images/Gallery/DSC09407.webp",
    cardClass:
      "border-[#E0E0E0] hover:border-[#0A0A0A] hover:bg-[#FAFAFA]",
    eyebrowClass: "text-[#9A7329]",
    ctaClass: "bg-[#0A0A0A] text-white hover:bg-[#C8A97A]",
  },
  {
    href: "/register/influencer",
    eyebrow: "Brand partnerships",
    title: "Influencer",
    description: "Connect with brands — share your social channels and content categories.",
    cta: "Apply as influencer",
    image: "/images/abothero.jpeg",
    cardClass:
      "border-[#E0E0E0] hover:border-[#0A0A0A] hover:bg-[#FAFAFA] sm:col-span-2 lg:col-span-1",
    eyebrowClass: "text-[#9A7329]",
    ctaClass: "bg-[#0A0A0A] text-white hover:bg-[#C8A97A]",
  },
] as const;

export default function ApplyChoiceModal({ isOpen, onClose }: ApplyChoiceModalProps) {
  if (!isOpen) return null;

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

      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white border border-[#E0E0E0] shadow-[0_8px_40px_rgba(0,0,0,0.15)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#E0E0E0] px-6 py-5 md:px-8 sticky top-0 bg-white z-10">
          <div>
            <h2
              id="apply-choice-title"
              className="font-display text-2xl md:text-3xl font-light text-[#0A0A0A] tracking-[0.02em]"
            >
              How would you like to apply?
            </h2>
            <p className="mt-2 font-ui text-sm text-[#4A4A4A] leading-relaxed max-w-2xl">
              Choose your path — agency, academy, service provider, or influencer partnerships.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 md:p-8">
          {APPLY_PATHS.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              onClick={onClose}
              data-cursor="button"
              className={`group flex flex-col border-2 p-5 transition-colors duration-300 ${path.cardClass}`}
            >
              <div className="relative w-full aspect-[16/9] mb-4 overflow-hidden bg-[#F5F5F5]">
                <Image
                  src={path.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 320px"
                />
              </div>
              <p
                className={`font-ui text-[9px] tracking-[0.3em] uppercase mb-2 ${path.eyebrowClass}`}
              >
                {path.eyebrow}
              </p>
              <h3 className="font-display text-xl font-light text-[#0A0A0A] group-hover:text-inherit mb-2">
                {path.title}
              </h3>
              <p className="font-ui text-xs text-[#4A4A4A] group-hover:text-inherit leading-relaxed flex-1 mb-5">
                {path.description}
              </p>
              <span
                className={`inline-flex self-start font-ui text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 transition-colors duration-300 ${path.ctaClass}`}
              >
                {path.cta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
