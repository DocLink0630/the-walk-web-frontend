"use client";

import { useRef, type ReactNode } from "react";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

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

  useMagneticEffect(buttonRef);

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
