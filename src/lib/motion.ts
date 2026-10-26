import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;

const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function destroyMotion(): void {
  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

function initMotion(): void {
  destroyMotion();
  gsap.registerPlugin(ScrollTrigger);

  if (prefersReducedMotion()) {
    gsap.set('[data-reveal]', { opacity: 1, y: 0 });
    ScrollTrigger.refresh();
    return;
  }

  const intensity = parseFloat(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--motion-intensity')
      .trim() || '0.5',
  );

  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.lagSmoothing(0);
  tickerFn = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tickerFn);

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 24 * intensity },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      },
    );
  });
}

function setupLifecycle(): void {
  document.addEventListener('astro:page-load', initMotion);
  document.addEventListener('astro:before-swap', destroyMotion);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupLifecycle);
} else {
  setupLifecycle();
}
