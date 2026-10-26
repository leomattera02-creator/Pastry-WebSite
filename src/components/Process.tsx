import { useRef, useLayoutEffect, useState, type JSX } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface ProcessStepData {
  id: string;
  titolo: string;
  descrizione: string;
  immagine: { src: string; alt: string; width: number; height: number };
}

export interface ProcessProps {
  steps: ProcessStepData[];
}

export default function Process(props: ProcessProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(
    () => {
      const container = containerRef.current;
      const imgWrap = imgRef.current;
      if (!container || !imgWrap) return;

      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      const isDesktop = window.matchMedia('(min-width: 768px)').matches;

      if (reduced || !isDesktop) return;

      const triggers: ScrollTrigger[] = [];
      const stepEls = container.querySelectorAll<HTMLElement>('[data-step]');

      stepEls.forEach((el, i) => {
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          end: 'bottom 60%',
          onEnter: () => setActiveStep(i),
          onEnterBack: () => setActiveStep(i),
        });
        triggers.push(trigger);
      });

      gsap.to(imgWrap, {
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
        yPercent: -8,
        ease: 'none',
      });

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef },
  );

  useLayoutEffect(() => {
    const imgs = imgRef.current?.querySelectorAll('img');
    if (!imgs) return;
    imgs.forEach((img, i) => {
      img.style.opacity = i === activeStep ? '1' : '0';
    });
  }, [activeStep]);

  return (
    <section id="processo" className="px-5 py-20 sm:px-8 sm:py-28" data-reveal>
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 sm:mb-14">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
            Dietro le quinte
          </p>
          <h2
            className="font-[family-name:var(--font-display)] font-semibold leading-[1.1]"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
          >
            Il nostro laboratorio
          </h2>
        </header>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div
            ref={imgRef}
            className="relative order-1 overflow-hidden rounded-[var(--radius-lg)] lg:sticky lg:top-24 lg:h-[60vh]"
            data-process-img
          >
            {props.steps.map((step, i) => (
              <img
                key={step.id}
                src={step.immagine.src}
                alt={step.immagine.alt}
                width={step.immagine.width}
                height={step.immagine.height}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                style={{ opacity: i === activeStep ? 1 : 0 }}
              />
            ))}
          </div>

          <div className="order-2 flex flex-col gap-16 lg:gap-28">
            {props.steps.map((step, i) => (
              <div key={step.id} data-step className="lg:min-h-[50vh] lg:flex lg:flex-col lg:justify-center">
                <span
 className="mb-4 font-[family-name:var(--font-display)] text-5xl font-light text-[var(--color-text-muted)]"
                  style={{ opacity: i === activeStep ? 0.5 : 0.2 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  className="font-[family-name:var(--font-display)] text-2xl font-medium sm:text-3xl"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
                >
                  {step.titolo}
                </h3>
                <p className="mt-4 max-w-md text-[var(--color-text-muted)] sm:text-lg">
                  {step.descrizione}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
