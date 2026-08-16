"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const DISMISS_KEY = "thewalk_models_roster_cta_dismissed";

interface ModelsRosterCtaProps {
  onVisibilityChange?: (visible: boolean) => void;
}

export default function ModelsRosterCta({
  onVisibilityChange,
}: ModelsRosterCtaProps) {
  const {
    isLoading,
    isModel,
    isInfluencer,
    isPhotographer,
    isBeautician,
  } = useAuth();
  const [visible, setVisible] = useState(false);

  const isTalent = isModel || isInfluencer || isPhotographer || isBeautician;

  useEffect(() => {
    if (isLoading) return;

    if (isTalent || localStorage.getItem(DISMISS_KEY)) {
      setVisible(false);
      return;
    }

    setVisible(true);
  }, [isLoading, isTalent]);

  useEffect(() => {
    onVisibilityChange?.(visible);
  }, [visible, onVisibilityChange]);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#C8A97A] border-t border-[#0A0A0A]/10">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss join roster"
        data-cursor="button"
        className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors"
      >
        <X size={16} strokeWidth={1.75} />
      </button>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-4 pr-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-ui text-[9px] tracking-[0.3em] uppercase text-[#0A0A0A] mb-1">
            ARE YOU A MODEL?
          </p>
          <p className="font-display italic text-[15px] md:text-[16px] text-[#0A0A0A]/80">
            Join our roster and connect with top clients.
          </p>
        </div>
        <Link
          href="/register/model"
          data-cursor="button"
          className="font-ui text-[9px] tracking-[0.3em] uppercase px-8 py-3 bg-[#0A0A0A] text-white hover:bg-white hover:text-[#0A0A0A] transition-colors duration-300 text-center shrink-0"
        >
          Join Our Roster
        </Link>
      </div>
    </div>
  );
}
