"use client";

import Link from "next/link";
import { useRef, type ComponentProps } from "react";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

interface MagneticLinkProps extends ComponentProps<typeof Link> {
  magneticStrength?: number;
}

export default function MagneticLink({
  children,
  className = "",
  magneticStrength = 0.3,
  ...props
}: MagneticLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useMagneticEffect(linkRef, { strength: magneticStrength });

  return (
    <Link
      ref={linkRef}
      data-cursor="button"
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}
