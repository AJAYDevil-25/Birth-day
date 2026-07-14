// Animation helpers keep expensive effects respectful on mobile and reduced-motion devices.
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

export function prefersReducedMotion() {
  return reduceMotionQuery.matches;
}

export function enhancePageMotion() {
  document.documentElement.classList.add("js-ready");

  const revealItems = document.querySelectorAll(".hero-anim, .reveal");
  revealItems.forEach((el) => {
    el.style.willChange = "transform, opacity";
  });

  if (prefersReducedMotion()) {
    document.body.classList.add("reduce-motion");
    return;
  }

  window.addEventListener(
    "pageshow",
    () => document.body.classList.add("page-visible"),
    { once: true }
  );
}

export function installMobileAnimationBudget() {
  const isSmallScreen = window.matchMedia("(max-width: 680px)").matches;
  if (isSmallScreen || prefersReducedMotion()) {
    document.body.classList.add("motion-lite");
  }
}
