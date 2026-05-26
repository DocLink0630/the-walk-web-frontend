"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  type = "button",
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const quickSetter = {
      x: gsap.quickSetter(button, "x", "px"),
      y: gsap.quickSetter(button, "y", "px"),
    };

    let isNear = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      if (distance < 80) {
        isNear = true;
        quickSetter.x((e.clientX - centerX) * 0.35);
        quickSetter.y((e.clientY - centerY) * 0.35);
      } else if (isNear) {
        isNear = false;
        gsap.to(button, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      data-cursor="button"
      className={className}
    >
      {children}
    </button>
  );
}