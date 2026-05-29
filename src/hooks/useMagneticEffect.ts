"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";

interface MagneticEffectOptions {
  strength?: number;
  threshold?: number;
}

export function useMagneticEffect<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { strength = 0.35, threshold = 80 }: MagneticEffectOptions = {},
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const quickSetter = {
      x: gsap.quickSetter(element, "x", "px"),
      y: gsap.quickSetter(element, "y", "px"),
    };

    let isNear = false;

    const onMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

      if (distance < threshold) {
        isNear = true;
        quickSetter.x((event.clientX - centerX) * strength);
        quickSetter.y((event.clientY - centerY) * strength);
      } else if (isNear) {
        isNear = false;
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
        });
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [ref, strength, threshold]);
}
