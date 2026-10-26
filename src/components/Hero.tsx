import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export interface HeroProps {
  titolo: string;
  sottotitolo: string;
  ctaPrincipale: string;
  ctaSecondaria: string;
  ctaPrincipaleHref: string;
  ctaSecondariaHref: string;
  immagineSrc: string;
  immagineAlt: string;
  immagineWidth: number;
  immagineHeight: number;
  layout: 'split' | 'fullbleed';
}

export default function Hero(props: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      const intensity = parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--motion-intensity')
          .trim() || '0.5',
      );

      if (reduced) {
        gsap.set(titleRef.current, { opacity: 1 });
        gsap.set('[data-hero-sub]', { opacity: 1, y: 0 });
        gsap.set('[data-hero-cta]', { opacity: 1, y: 0 });
        gsap.set(imgRef.current, { clipPath: 'inset(0% 0% 0% 0%)' });
        return;
      }

      const split = new SplitText(titleRef.current, { type: 'lines' });
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(
        split.lines,
        { opacity: 0, yPercent: 100 * intensity },
        {
          opacity: 1,
          yPercent: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
        },
      )
        .fromTo(
          '[data-hero-sub]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.4',
        )
        .fromTo(
          '[data-hero-cta]',
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1,
          },
          '-=0.3',
        );

      gsap.fromTo(
        imgRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.1,
          ease: 'power3.out',
          delay: 0.1,
        },
      );

      gsap.to(imgRef.current, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: containerRef },
  );

  const isFullbleed = props.layout === 'fullbleed';

  if (isFullbleed) {
    return (
      <section
        ref={containerRef}
        id="top"
        className="relative flex min-h-[100svh] items-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            ref={imgRef}
            src={props.immagineSrc}
            alt={props.immagineAlt}
            width={props.immagineWidth}
            height={props.immagineHeight}
            fetchPriority="high"
            className="h-[112%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32 sm:px-8">
          <h1
            ref={titleRef}
            className="max-w-4xl font-[family-name:var(--font-display)] font-semibold leading-[1.05] text-white"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
          >
            {props.titolo}
          </h1>
          <p
            data-hero-sub
            className="mt-6 max-w-xl text-lg text-white/85"
          >
            {props.sottotitolo}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              data-hero-cta
              href={props.ctaPrincipaleHref}
              className="inline-block rounded-[var(--radius-full)] bg-white px-7 py-3.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              {props.ctaPrincipale}
            </a>
            <a
              data-hero-cta
              href={props.ctaSecondariaHref}
              className="inline-block rounded-[var(--radius-full)] border border-white/40 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              {props.ctaSecondaria}
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="top"
      className="relative grid min-h-[100svh] grid-cols-1 items-center gap-8 px-6 pt-24 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:pt-0"
    >
      <div className="order-2 lg:order-1">
        <h1
          ref={titleRef}
          className="font-[family-name:var(--font-display)] font-semibold leading-[1.05]"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
        >
          {props.titolo}
        </h1>
        <p
          data-hero-sub
          className="mt-6 max-w-lg text-lg text-[var(--color-text-muted)]"
        >
          {props.sottotitolo}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            data-hero-cta
            href={props.ctaPrincipaleHref}
            className="inline-block rounded-[var(--radius-full)] bg-[var(--color-accent)] px-7 py-3.5 text-sm font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-90"
          >
            {props.ctaPrincipale}
          </a>
          <a
            data-hero-cta
            href={props.ctaSecondariaHref}
            className="inline-block rounded-[var(--radius-full)] border border-[var(--color-border)] px-7 py-3.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-alt)]"
          >
            {props.ctaSecondaria}
          </a>
        </div>
      </div>
      <div
        className="order-1 overflow-hidden rounded-[var(--radius-lg)] lg:order-2"
        data-hero-img-wrap
      >
        <img
          ref={imgRef}
          src={props.immagineSrc}
          alt={props.immagineAlt}
          width={props.immagineWidth}
          height={props.immagineHeight}
          fetchPriority="high"
          className="h-[112%] w-full object-cover"
        />
      </div>
    </section>
  );
}
