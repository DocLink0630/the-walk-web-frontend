"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PLATFORM_PANELS } from "@/data/platform-panel";
import type { PlatformPanel } from "@/types/platform";
import SplitFeaturePanel from "@/components/ui/SplitFeaturePanel";

gsap.registerPlugin(ScrollTrigger);

export interface PlatformStripProps {
  panels?: PlatformPanel[];
}

export default function PlatformStrip({
  panels = PLATFORM_PANELS,
}: PlatformStripProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      panelRefs.current.forEach((el, i) => {
        if (!el) return;

        gsap.from(el, {
          y: 48,
          x: i === 0 ? -32 : 32,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [panels]);

  return (
    <section
      ref={sectionRef}
      className="bg-[#F7F5F2] border-t border-b border-[#E0E0E0]"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-[#E0E0E0]">
          {panels.map((panel, i) => (
            <div
              key={panel.eyebrow}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
            >
              <SplitFeaturePanel
                {...panel}
                className={`py-12 md:py-16 lg:py-20 ${
                  i === 0
                    ? "md:pr-8 lg:pr-20 border-b md:border-b-0 border-[#E0E0E0]"
                    : "md:pl-8 lg:pl-20"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
