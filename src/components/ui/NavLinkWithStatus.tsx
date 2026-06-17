"use client";

import Link, { useLinkStatus } from "next/link";
import type { ReactNode } from "react";

function NavLinkContent({
  idle,
  pending,
}: {
  idle: ReactNode;
  pending: ReactNode;
}) {
  const { pending: isPending } = useLinkStatus();
  return <>{isPending ? pending : idle}</>;
}

const spinner = (
  <span
    className="size-3 border border-current border-t-transparent rounded-full animate-spin"
    aria-hidden
  />
);

export interface NavLinkWithStatusProps {
  href: string;
  className?: string;
  children: ReactNode;
  pendingLabel?: string;
  "data-cursor"?: string;
  style?: React.CSSProperties;
}

export default function NavLinkWithStatus({
  href,
  className,
  children,
  pendingLabel = "Loading…",
  ...rest
}: NavLinkWithStatusProps) {
  return (
    <Link href={href} className={className} {...rest}>
      <NavLinkContent
        idle={children}
        pending={
          <span className="inline-flex items-center gap-2 opacity-80">
            {spinner}
            <span>{pendingLabel}</span>
          </span>
        }
      />
    </Link>
  );
}
