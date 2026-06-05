import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Run GSAP setup after layout so ref callbacks have populated. */
export function afterLayoutReady(callback: () => void): () => void {
  const timeout = window.setTimeout(callback, 100);
  return () => window.clearTimeout(timeout);
}

export function refreshScrollTriggers(): void {
  requestAnimationFrame(() => ScrollTrigger.refresh());
}
