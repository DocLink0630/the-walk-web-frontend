"use client";

import { useEffect } from "react";
import { attachScrollTriggerResync } from "@/lib/gsap/scroll-trigger-setup";

/** Site-wide ScrollTrigger resync when layout height changes (async images, API data). */
export default function ScrollTriggerResync() {
  useEffect(() => {
    return attachScrollTriggerResync([document.body]);
  }, []);

  return null;
}
