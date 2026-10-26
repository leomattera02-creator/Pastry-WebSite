import { useState, useRef, useLayoutEffect, type JSX } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lightbox, { type LightboxImage } from './Lightbox';

gsap.registerPlugin(ScrollTrigger);

export interface GalleryProps {
  images: LightboxImage[];
}

export default function Gallery(props: GalleryProps): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const ctx = { cleanup: () => {} };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    let trigger: ScrollTrigger | null = null;

    if (isDesktop && !reduced) {
      const scrollWidth = track.scrollWidth - window.innerWidth;
      if (scrollWidth > 0) {
        const tween = gsap.to(track, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${scrollWidth}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
        trigger = tween.scrollTrigger ?? null;
      }
    }

    const cursor = cursorRef.current;
    const canHover = window.matchMedia('(hover: hover)').matches;
    if (cursor && canHover) {
      const onMove = (e: MouseEvent) => {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.15,
          ease: 'power2.out',
        });
      };
      const onEnter = () => gsap.to(cursor, { opacity: 1, scale: 1 });
      const onLeave = () => gsap.to(cursor, { opacity: 0, scale: 0.8 });

      section.addEventListener('mousemove', onMove);
      track.querySelectorAll('[data-gallery-item]').forEach((item) => {
        item.addEventListener('mouseenter', onEnter);
        item.addEventListener('mouseleave', onLeave);
      });

      ctx.cleanup = () => {
        section.removeEventListener('mousemove', onMove);
        track.querySelectorAll('[data-gallery-item]').forEach((item) => {
          item.removeEventListener('mouseenter', onEnter);
          item.removeEventListener('mouseleave', onLeave);
        });
      };
    }

    return () => {
      ctx.cleanup();
      trigger?.kill();
    };
  }, []);

  function openLightbox(i: number): void {
    setLightboxIndex(i);
  }

  return (
    <>
      <section
        ref={sectionRef}
        id="galleria"
        className="relative overflow-hidden bg-[var(--color-bg-alt)]"
        data-reveal
      >
        <div className="px-5 pt-20 sm:px-8 sm:pt-28">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
            Galleria
          </p>
          <h2
            className="font-[family-name:var(--font-display)] font-semibold leading-[1.1]"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
          >
            I nostri dolci da vicino
          </h2>
        </div>

        <div
          ref={trackRef}
          className="flex gap-4 px-5 pb-20 pt-10 sm:px-8 sm:pb-28 md:will-change-transform"
        >
          {props.images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => openLightbox(i)}
              data-gallery-item
              aria-label={`Apri immagine: ${img.alt}`}
              className="group relative block shrink-0 overflow-hidden rounded-[var(--radius-lg)] md:cursor-none"
              style={{ width: '80vw', maxWidth: '640px' }}
            >
              <img
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading="lazy"
                className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={props.images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}

      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-50 hidden -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-[var(--color-accent-fg)] opacity-0 md:block"
        style={{ transform: 'translate(-50%, -50%) scale(0.8)' }}
      >
        Guarda
      </div>
    </>
  );
}
