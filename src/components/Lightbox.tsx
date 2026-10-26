import { useEffect, useRef, useLayoutEffect, type JSX } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface LightboxImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}

function Lightbox(props: LightboxProps): JSX.Element | null {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnCloseRef = useRef<HTMLButtonElement>(null);
  const btnPrevRef = useRef<HTMLButtonElement>(null);
  const btnNextRef = useRef<HTMLButtonElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    first?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        props.onClose();
        return;
      }
      if (e.key !== 'Tab' || focusable.length === 0) return;
      const active = document.activeElement as HTMLElement | null;
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      if (e.shiftKey && active === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && active === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        const n = (props.index - 1 + props.images.length) % props.images.length;
        props.onNavigate(n);
      } else if (e.key === 'ArrowRight') {
        const n = (props.index + 1) % props.images.length;
        props.onNavigate(n);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
          const n =
            (props.index + 1) % props.images.length;
          props.onNavigate(n);
        } else {
          const n =
            (props.index - 1 + props.images.length) % props.images.length;
          props.onNavigate(n);
        }
      }
      touchStart.current = null;
    };

    document.addEventListener('keydown', trap);
    document.addEventListener('keydown', onKey);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', trap);
      document.removeEventListener('keydown', onKey);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
      document.body.style.overflow = '';
    };
  }, [props]);

  const current = props.images[props.index];
  if (!current) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      onClick={props.onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Galleria a schermo intero"
    >
      <button
        ref={btnCloseRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          props.onClose();
        }}
        aria-label="Chiudi"
        className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20"
      >
        ✕
      </button>

      <button
        ref={btnPrevRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          const n = (props.index - 1 + props.images.length) % props.images.length;
          props.onNavigate(n);
        }}
        aria-label="Immagine precedente"
        className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 sm:left-6"
      >
        ‹
      </button>

      <button
        ref={btnNextRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          const n = (props.index + 1) % props.images.length;
          props.onNavigate(n);
        }}
        aria-label="Immagine successiva"
        className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 sm:right-6"
      >
        ›
      </button>

      <img
        ref={imgRef}
        src={current.src}
        alt={current.alt}
        className="max-h-[85svh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default Lightbox;
