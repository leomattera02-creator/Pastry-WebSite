import { useState, useRef, useLayoutEffect, type JSX } from 'react';
import { gsap } from 'gsap';
import {
  StepOccasione,
  StepData,
  StepPersone,
  StepGusti,
  StepContatto,
  type QuoteData,
  type QuoteErrors,
} from './QuoteSteps';
import QuoteSummary from './QuoteSummary';

export interface QuoteWizardProps {
  occasions: string[];
  giorniMinimiAnticipo: number;
  whatsapp: string;
  email: string;
  template: string;
  brandName: string;
}

const emptyData: QuoteData = {
  occasione: '',
  dataEvento: '',
  numeroPersone: '',
  gustiStile: '',
  chipSelezionate: [],
  nome: '',
  contatto: '',
};

const stepLabels = [
  'Occasione',
  'Data',
  'Persone',
  'Gusti',
  'Contatti',
  'Riepilogo',
];

export default function QuoteWizard(props: QuoteWizardProps): JSX.Element {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuoteData>(emptyData);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [direction, setDirection] = useState(1);
  const stepRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    return () => ctxRef.current?.revert();
  }, []);

  useLayoutEffect(() => {
    const el = stepRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    ctxRef.current?.revert();
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('[data-step-content]', { opacity: 1, x: 0 });
        return;
      }
      const xIn = direction > 0 ? 40 : -40;
      gsap.fromTo(
        '[data-step-content]',
        { opacity: 0, x: xIn },
        { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' },
      );
    }, stepRef);
    ctxRef.current = ctx;
    return () => ctx.revert();
  }, [step, direction]);

  function update(field: keyof QuoteData, value: string | string[]): void {
    setData((d) => ({ ...d, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: QuoteErrors = {};
    if (step === 0 && !data.occasione) e.occasione = 'Seleziona un\u2019occasione';
    if (step === 1 && !data.dataEvento) e.dataEvento = 'Scegli una data';
    if (step === 2 && (!data.numeroPersone || parseInt(data.numeroPersone) < 1))
      e.numeroPersone = 'Inserisci il numero di persone';
    if (step === 3 && !data.gustiStile.trim() && data.chipSelezionate.length === 0)
      e.gustiStile = 'Scrivi almeno un dettaglio o scegli un suggerimento';
    if (step === 4) {
      if (!data.nome.trim()) e.nome = 'Inserisci il tuo nome';
      if (!data.contatto.trim()) e.contatto = 'Inserisci un contatto';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next(): void {
    if (!validate()) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, stepLabels.length - 1));
  }

  function prev(): void {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  const isLast = step === stepLabels.length - 1;

  return (
    <section
      id="ordini"
      className="px-5 py-20 sm:px-8 sm:py-28"
      data-reveal
    >
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center sm:mb-12">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
            Richiedi un preventivo
          </p>
          <h2
            className="font-[family-name:var(--font-display)] font-semibold leading-[1.1]"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
          >
            Costruisci la tua richiesta
          </h2>
        </header>

        <div className="mb-8" role="progressbar" aria-valuenow={step + 1} aria-valuemax={stepLabels.length} aria-valuemin={1} aria-label="Avanzamento">
          <div className="flex gap-1.5">
            {stepLabels.map((label, i) => (
              <div
                key={label}
                className="h-1 flex-1 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor:
                    i <= step
                      ? 'var(--color-primary)'
                      : 'var(--color-border)',
                }}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Passo {step + 1} di {stepLabels.length} — {stepLabels[step]}
          </p>
        </div>

        <div ref={stepRef}>
          <div data-step-content className="min-h-[280px]">
            {step === 0 && (
              <StepOccasione data={data} errors={errors} update={update} giorniMinimiAnticipo={props.giorniMinimiAnticipo} occasions={props.occasions} />
            )}
            {step === 1 && (
              <StepData data={data} errors={errors} update={update} giorniMinimiAnticipo={props.giorniMinimiAnticipo} />
            )}
            {step === 2 && (
              <StepPersone data={data} errors={errors} update={update} giorniMinimiAnticipo={props.giorniMinimiAnticipo} />
            )}
            {step === 3 && (
              <StepGusti data={data} errors={errors} update={update} giorniMinimiAnticipo={props.giorniMinimiAnticipo} />
            )}
            {step === 4 && (
              <StepContatto data={data} errors={errors} update={update} giorniMinimiAnticipo={props.giorniMinimiAnticipo} />
            )}
            {isLast && (
              <QuoteSummary
                data={data}
                whatsapp={props.whatsapp}
                email={props.email}
                template={props.template}
                brandName={props.brandName}
              />
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={prev}
              className="rounded-[var(--radius-full)] px-6 py-3 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              ← Indietro
            </button>
          ) : (
            <span />
          )}
          {!isLast && (
            <button
              type="button"
              onClick={next}
              className="rounded-[var(--radius-full)] bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-[var(--color-primary-fg)] transition-opacity hover:opacity-90"
            >
              Avanti →
            </button>
          )}
        </div>

        <div aria-live="polite" className="sr-only">
          {Object.values(errors).filter(Boolean).length > 0 &&
            'Sono presenti errori nel modulo. Controlla i campi evidenziati.'}
        </div>
      </div>
    </section>
  );
}
