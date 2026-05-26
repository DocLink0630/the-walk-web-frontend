"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const text = textRef.current;
    if (!cursor || !text) return;

    const quickSetter = {
      x: gsap.quickSetter(cursor, "x", "px"),
      y: gsap.quickSetter(cursor, "y", "px"),
    };

    const onMouseMove = (e: MouseEvent) => {
      quickSetter.x(e.clientX);
      quickSetter.y(e.clientY);
    };

    const onMouseEnter = (e: MouseEvent) => {
      const target = e.target;

      if (!(target instanceof Element)) return;

      if (target.closest('[data-cursor="image"]')) {
        text.textContent = "VIEW";
        gsap.to(cursor, {
          width: 56,
          height: 56,
          duration: 0.3,
          ease: "power2.out",
        });
      } else if (target.closest('[data-cursor="button"]')) {
        text.textContent = "→";
        gsap.to(cursor, {
          width: 28,
          height: 28,
          backgroundColor: "#FFFFFF",
          borderColor: "transparent",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(text, { color: "#0A0A0A", duration: 0.3 });
      } else if (target.closest('[data-cursor="link"]')) {
        gsap.to(cursor, {
          width: 20,
          height: 8,
          borderRadius: 4,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const onMouseLeave = (e: MouseEvent) => {
      const target = e.target;

      if (!(target instanceof Element)) return;

      const isLeavingHoverElement =
        target.closest('[data-cursor="image"]') ||
        target.closest('[data-cursor="button"]') ||
        target.closest('[data-cursor="link"]');

      if (isLeavingHoverElement) {
        text.textContent = "";
        gsap.to(cursor, {
          width: 28,
          height: 28,
          backgroundColor: "transparent",
          borderColor: "#FFFFFF",
          borderRadius: "50%",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(text, { color: "#FFFFFF", duration: 0.3 });
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter, true);
    document.addEventListener("mouseleave", onMouseLeave, true);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter, true);
      document.removeEventListener("mouseleave", onMouseLeave, true);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-[28px] h-[28px] pointer-events-none z-[9999] flex items-center justify-center mix-blend-difference"
      style={{
        border: "1px solid #FFFFFF",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <span
        ref={textRef}
        className="text-[8px] font-ui font-light text-white"
      />
    </div>
  );
}
