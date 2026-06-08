import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Run GSAP setup after layout so ref callbacks have populated. */
export function afterLayoutReady(callback: () => void): () => void {
  const timeout = window.setTimeout(callback, 100);
  return () => window.clearTimeout(timeout);
}

export function refreshScrollTriggers(): void {
  requestAnimationFrame(() => ScrollTrigger.refresh(true));
}

export interface ScrollRevealOptions {
  trigger?: gsap.DOMTarget;
  start?: string;
  y?: number;
  x?: number;
  scale?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  once?: boolean;
}

/**
 * Cross-browser scroll reveal — opacity + transform instead of clip-path.
 * clip-path inset animations are unreliable in Firefox when layout shifts.
 */
export function revealOnScroll(
  targets: gsap.TweenTarget,
  options: ScrollRevealOptions = {},
) {
  const {
    trigger,
    start = "top 85%",
    y = 40,
    x = 0,
    scale,
    duration = 0.9,
    delay = 0,
    stagger,
    ease = "power4.out",
    once = true,
  } = options;

  const fromVars: gsap.TweenVars = {
    y,
    x,
    opacity: 0,
    duration,
    delay,
    stagger,
    ease,
    immediateRender: false,
    scrollTrigger: {
      trigger: (trigger ?? targets) as gsap.DOMTarget,
      start,
      invalidateOnRefresh: true,
      toggleActions: once ? "play none none none" : "play none none reverse",
    },
  };

  if (scale !== undefined) {
    fromVars.scale = scale;
  }

  return gsap.from(targets, fromVars);
}

/**
 * Keeps ScrollTrigger positions in sync when async content (images, API data)
 * changes page height — fixes sections appearing blank until over-scrolled.
 */
export function attachScrollTriggerResync(
  roots: (Element | null | undefined)[],
): () => void {
  let frame = 0;
  let resizeTimeout: number | undefined;

  const refresh = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => ScrollTrigger.refresh(true));
  };

  refresh();

  const onLoad = () => refresh();
  window.addEventListener("load", onLoad);
  window.addEventListener("orientationchange", refresh);

  const observer =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => {
          window.clearTimeout(resizeTimeout);
          resizeTimeout = window.setTimeout(refresh, 80);
        })
      : null;

  for (const root of roots) {
    if (root) observer?.observe(root);
  }

  return () => {
    window.removeEventListener("load", onLoad);
    window.removeEventListener("orientationchange", refresh);
    window.clearTimeout(resizeTimeout);
    cancelAnimationFrame(frame);
    observer?.disconnect();
  };
}
