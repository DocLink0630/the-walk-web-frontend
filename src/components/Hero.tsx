"use client";

import { useEffect, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import gsap from "gsap";

export interface HeroCta {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

export type HeroBackground =
  | { type: "image"; src: string | StaticImageData; alt?: string }
  | { type: "video"; src: string; poster?: string | StaticImageData };

export interface HeroProps {
  background: HeroBackground;
  heading: string;
  eyebrow?: string;
  tagline?: string;
  sideLabel?: string;
  ctas?: HeroCta[];
  showScrollIndicator?: boolean;
  className?: string;
}

const CTA_STYLES = {
  primary:
    "font-ui text-xs md:text-sm font-medium tracking-[0.2em] md:tracking-[0.25em] uppercase px-8 md:px-10 py-4 md:py-5 bg-[#C8A97A] text-[#0A0A0A] border-2 border-[#C8A97A] shadow-[0_4px_24px_rgba(0,0,0,0.35)] hover:bg-[#D4B88A] hover:border-[#D4B88A] transition-colors duration-300 text-center min-w-[200px]",
  secondary:
    "font-ui text-xs md:text-sm font-medium tracking-[0.2em] md:tracking-[0.25em] uppercase px-8 md:px-10 py-4 md:py-5 bg-white/10 text-white border-2 border-white backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.35)] hover:bg-white hover:text-[#0A0A0A] transition-colors duration-300 text-center min-w-[200px]",
};

function resolveMediaSrc(src: string | StaticImageData): string {
  return typeof src === "string" ? src : src.src;
}

function HeroBackgroundMedia({
  background,
  mediaRef,
}: {
  background: HeroBackground;
  mediaRef: React.RefObject<HTMLDivElement | null>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (background.type !== "video") return;

    const video = videoRef.current;
    if (!video) return;

    video.load();

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // Autoplay can still be blocked in some browser contexts.
      }
    };

    void playVideo();

    const resumeOnInteraction = () => {
      void playVideo();
    };

    document.addEventListener("touchstart", resumeOnInteraction, { once: true });
    document.addEventListener("click", resumeOnInteraction, { once: true });

    return () => {
      document.removeEventListener("touchstart", resumeOnInteraction);
      document.removeEventListener("click", resumeOnInteraction);
    };
  }, [background]);

  if (background.type === "video") {
    const posterSrc = background.poster
      ? resolveMediaSrc(background.poster)
      : undefined;

    return (
      <div ref={mediaRef} className="absolute inset-0 z-0" data-cursor="image">
        {background.poster && (
          <Image
            src={background.poster}
            alt=""
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
        )}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={posterSrc}
          className="absolute inset-0 h-full w-full object-cover object-top"
        >
          <source src={background.src} type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <div ref={mediaRef} className="absolute inset-0 z-0" data-cursor="image">
      <Image
        src={background.src}
        alt={background.alt ?? ""}
        fill
        priority
        className="object-cover object-top"
        sizes="100vw"
      />
    </div>
  );
}

export default function Hero({
  background,
  heading,
  eyebrow,
  tagline,
  sideLabel,
  ctas = [],
  showScrollIndicator = true,
  className = "",
}: HeroProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sideTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headingEl = headingRef.current;
    if (!headingEl) return;

    const words = heading.split(" ");
    headingEl.innerHTML = words
      .map(
        (word) =>
          `<span class="inline-block overflow-hidden pb-[0.12em] align-bottom"><span class="inline-block word-reveal">${word}</span></span>`,
      )
      .join('<span class="inline-block">&nbsp;</span>');

    const wordEls = headingEl.querySelectorAll(".word-reveal");

    const tl = gsap.timeline({ delay: 0.5 });

    tl.from(mediaRef.current, {
      clipPath: "inset(8% 4% 8% 4%)",
      duration: 1.6,
      ease: "power4.inOut",
    }).from(overlayRef.current, { opacity: 0, duration: 0.9 }, "-=0.9");

    if (subRef.current) {
      tl.from(
        subRef.current,
        { y: 18, opacity: 0, duration: 0.7, ease: "power3.out" },
        "-=0.5",
      );
    }

    tl.from(
      wordEls,
      { y: "110%", duration: 0.9, stagger: 0.12, ease: "power4.out" },
      subRef.current ? "-=0.4" : "-=0.5",
    );

    if (taglineRef.current) {
      tl.from(
        taglineRef.current,
        { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" },
        "-=0.3",
      );
    }

    if (ctaRef.current) {
      tl.from(
        ctaRef.current,
        { y: 16, opacity: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4",
      );
    }

    if (sideTextRef.current) {
      tl.from(sideTextRef.current, { opacity: 0, duration: 0.8 }, "-=0.6");
    }

    return () => {
      tl.kill();
    };
  }, [heading, eyebrow, tagline, sideLabel, ctas]);

  return (
    <section
      className={`relative h-screen w-full overflow-hidden bg-[#0A0A0A] ${className}`}
    >
      <HeroBackgroundMedia background={background} mediaRef={mediaRef} />

      <div
        ref={overlayRef}
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(105deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.65) 45%, rgba(10,10,10,0.25) 75%, rgba(10,10,10,0.15) 100%)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-[30%] z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 100%)",
        }}
      />

      <div className="absolute inset-0 z-20 flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-[60px] lg:px-[80px]">
          <div className="max-w-[680px]">
            {eyebrow && (
              <p
                ref={subRef}
                className="font-ui text-[9px] md:text-[10px] font-light tracking-[0.35em] md:tracking-[0.45em] uppercase text-[#C8A97A] mb-5 md:mb-7"
              >
                {eyebrow}
              </p>
            )}

            <h1
              ref={headingRef}
              className="font-display text-[clamp(72px,9vw,140px)] font-light tracking-[0.06em] text-white leading-[1.05] mb-6 md:mb-8 pb-1"
            >
              {heading}
            </h1>

            {tagline && (
              <p
                ref={taglineRef}
                className="font-display italic text-[clamp(17px,1.6vw,24px)] font-light text-white/80 leading-[1.6] max-w-[480px] mb-8 md:mb-10"
              >
                {tagline}
              </p>
            )}

            {ctas.length > 0 && (
              <div
                ref={ctaRef}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5"
              >
                {ctas.map((cta) => (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    data-cursor="button"
                    className={
                      CTA_STYLES[cta.variant ?? "primary"] ??
                      CTA_STYLES.primary
                    }
                  >
                    {cta.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {sideLabel && (
        <div
          ref={sideTextRef}
          className="absolute right-10 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-4"
        >
          <div className="w-px h-16 bg-white/20" />
          <p
            className="font-ui text-[9px] font-light tracking-[0.3em] uppercase text-white/40"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            {sideLabel}
          </p>
          <div className="w-px h-16 bg-white/20" />
        </div>
      )}

      {showScrollIndicator && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
          <div className="hero-scroll-line w-px h-14 bg-white/30" />
          <span className="font-ui text-[8px] tracking-[0.4em] text-white/40 uppercase">
            Scroll
          </span>
        </div>
      )}
    </section>
  );
}
