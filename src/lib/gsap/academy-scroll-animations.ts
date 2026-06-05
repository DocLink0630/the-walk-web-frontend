import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Same reversible scroll pattern as homepage sections (WhatWeDo, BrandStory, etc.) */
const SCROLL_TOGGLE = "play none none reverse";

function revealGroup(root: HTMLElement, selector: string) {
  root.querySelectorAll<HTMLElement>(selector).forEach((group) => {
    const children = group.querySelectorAll(":scope > *");
    if (!children.length) return;

    gsap.from(children, {
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      ease: "power4.out",
      scrollTrigger: {
        trigger: group,
        start: group.dataset.academyStart ?? "top 85%",
        toggleActions: SCROLL_TOGGLE,
      },
    });
  });
}

function revealElements(
  root: HTMLElement,
  selector: string,
  defaults: { y?: number; duration?: number; start?: string },
) {
  root.querySelectorAll<HTMLElement>(selector).forEach((el, i) => {
    const delay = Number(el.dataset.academyDelay ?? i * 0.1);
    gsap.from(el, {
      y: Number(el.dataset.academyY ?? defaults.y ?? 50),
      opacity: 0,
      duration: Number(el.dataset.academyDuration ?? defaults.duration ?? 1),
      ease: "power4.out",
      delay,
      scrollTrigger: {
        trigger: el,
        start: el.dataset.academyStart ?? defaults.start ?? "top 85%",
        toggleActions: SCROLL_TOGGLE,
      },
    });
  });
}

function clipRevealImages(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-academy-clip-group]").forEach((group) => {
    const images = group.querySelectorAll<HTMLElement>("[data-academy-clip]");
    gsap.from(images, {
      clipPath: "inset(0 0 100% 0)",
      duration: 1.1,
      stagger: 0.15,
      ease: "power4.out",
      scrollTrigger: {
        trigger: group,
        start: group.dataset.academyStart ?? "top 78%",
        toggleActions: SCROLL_TOGGLE,
      },
    });
  });
}

/**
 * Single gsap.context for the whole academy page — avoids per-section timing bugs
 * and keeps scroll-down + scroll-up behaviour consistent with the rest of the site.
 */
export function setupAcademyScrollAnimations(root: HTMLElement): () => void {
  const ctx = gsap.context(() => {
    revealElements(root, "[data-academy-stat]", { y: 30, duration: 0.8, start: "top 88%" });
    revealGroup(root, "[data-academy-reveal-group]");
    clipRevealImages(root);
    revealElements(root, "[data-academy-reveal]", { y: 60, duration: 1, start: "top 85%" });
    revealElements(root, "[data-academy-month]", { y: 40, duration: 0.85, start: "top 90%" });
    revealElements(root, "[data-academy-testimonial]", {
      y: 50,
      duration: 1,
      start: "top 82%",
    });
  }, root);

  const refresh = () => ScrollTrigger.refresh(true);
  requestAnimationFrame(refresh);

  const onLoad = () => refresh();
  window.addEventListener("load", onLoad);

  const resizeObserver =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => refresh())
      : null;
  resizeObserver?.observe(root);

  return () => {
    window.removeEventListener("load", onLoad);
    resizeObserver?.disconnect();
    ctx.revert();
  };
}
