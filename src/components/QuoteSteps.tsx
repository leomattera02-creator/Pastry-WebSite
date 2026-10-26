import type { JSX } from 'react';

export interface QuoteData {
  occasione: string;
  dataEvento: string;
  numeroPersone: string;
  gustiStile: string;
  chipSelezionate: string[];
  nome: string;
  contatto: string;
}

export interface QuoteErrors {
  occasione?: string;
  dataEvento?: string;
  numeroPersone?: string;
  gustiStile?: string;
  nome?: string;
  contatto?: string;
}

export interface StepProps {
  data: QuoteData;
  errors: QuoteErrors;
  update: (field: keyof QuoteData, value: string | string[]) => void;
  giorniMinimiAnticipo: number;
  occasions?: string[];
}

const inputClass =
  'w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)]';

const labelClass =
  'mb-2 block text-sm font-medium text-[var(--color-text)]';

const errorClass =
  'mt-1.5 text-sm text-[var(--color-error)]';

const chipSuggestions = [
  'Cioccolato fondente',
  'Vaniglia',
  'Frutta fresca',
  'Crema pasticcera',
  'Lamponi',
  'Pistacchio',
  'Mandorla',
  'Caramello salato',
];

export function StepOccasione(props: StepProps): JSX.Element {
  const occasions = props.occasions ?? [
    'Compleanno',
    'Matrimonio',
    'Battesimo',
    'Laurea',
    'Aziendale',
    'Altro',
  ];
  return (
    <fieldset className="space-y-4">
      <legend className="mb-4 font-[family-name:var(--font-display)] text-xl font-medium">
        Per quale occasione?
      </legend>
      <div className="flex flex-wrap gap-2">
        {occasions.map((occ) => {
          const active = props.data.occasione === occ;
          return (
            <button
              key={occ}
              type="button"
              onClick={() => props.update('occasione', occ)}
              aria-pressed={active}
              className={`rounded-[var(--radius-full)] px-5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-[var(--color-primary)] text-[var(--color-primary-fg)]'
                  : 'border border-[var(--color-border)] hover:border-[var(--color-text)]'
              }`}
            >
              {occ}
            </button>
          );
        })}
      </div>
      {props.errors.occasione && (
        <p className={errorClass} role="alert">{props.errors.occasione}</p>
      )}
    </fieldset>
  );
}

export function StepData(props: StepProps): JSX.Element {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + props.giorniMinimiAnticipo);
  const minStr = minDate.toISOString().split('T')[0];
  const selectedMs = props.data.dataEvento
    ? new Date(props.data.dataEvento).getTime()
    : NaN;
  const tooClose =
    !isNaN(selectedMs) &&
    selectedMs - minDate.getTime() <= 3 * 86400000;

  return (
    <fieldset className="space-y-4">
      <legend className="mb-4 font-[family-name:var(--font-display)] text-xl font-medium">
        Quando si svolge l'evento?
      </legend>
      <div>
        <label htmlFor="dataEvento" className={labelClass}>
          Data dell'evento
        </label>
        <input
          id="dataEvento"
          type="date"
          min={minStr}
          value={props.data.dataEvento}
          onChange={(e) => props.update('dataEvento', e.target.value)}
          className={inputClass}
          aria-describedby="dataHint"
        />
        <p id="dataHint" className="mt-2 text-sm text-[var(--color-text-muted)]">
          Ti chiediamo almeno {props.giorniMinimiAnticipo} giorni di anticipo per preparare tutto al meglio.
        </p>
        {props.errors.dataEvento && (
          <p className={errorClass} role="alert">{props.errors.dataEvento}</p>
        )}
        {tooClose && (
          <p className="mt-2 rounded-[var(--radius-md)] bg-[var(--color-warning-bg)] px-4 py-3 text-sm text-[var(--color-warning-fg)]" role="status">
            Hai pochissimo tempo! Chiamaci al telefono per vedere se riusciamo ad accontentarti.
          </p>
        )}
      </div>
    </fieldset>
  );
}

export function StepPersone(props: StepProps): JSX.Element {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-4 font-[family-name:var(--font-display)] text-xl font-medium">
        Quante persone?
      </legend>
      <div>
        <label htmlFor="numeroPersone" className={labelClass}>
          Numero di invitati
        </label>
        <input
          id="numeroPersone"
          type="number"
          min="1"
          inputMode="numeric"
          value={props.data.numeroPersone}
          onChange={(e) => props.update('numeroPersone', e.target.value)}
          className={inputClass}
          placeholder="es. 30"
        />
        {props.errors.numeroPersone && (
          <p className={errorClass} role="alert">{props.errors.numeroPersone}</p>
        )}
      </div>
    </fieldset>
  );
}

export function StepGusti(props: StepProps): JSX.Element {
  function toggleChip(chip: string): void {
    const current = props.data.chipSelezionate;
    const next = current.includes(chip)
      ? current.filter((c) => c !== chip)
      : [...current, chip];
    props.update('chipSelezionate', next);
  }

  return (
    <fieldset className="space-y-4">
      <legend className="mb-4 font-[family-name:var(--font-display)] text-xl font-medium">
        Gusti e stile
      </legend>
      <div>
        <label htmlFor="gustiStile" className={labelClass}>
          Descrivi i gusti e lo stile che immagini
        </label>
        <textarea
          id="gustiStile"
          rows={3}
          value={props.data.gustiStile}
          onChange={(e) => props.update('gustiStile', e.target.value)}
          className={inputClass}
          placeholder="es. Torta a due piani, decori floreali, gusto vaniglia e lamponi..."
        />
        {props.errors.gustiStile && (
          <p className={errorClass} role="alert">{props.errors.gustiStile}</p>
        )}
      </div>
      <div>
        <p className="mb-2 text-sm text-[var(--color-text-muted)]">Oppure scegli tra i suggeriti:</p>
        <div className="flex flex-wrap gap-2">
          {chipSuggestions.map((chip) => {
            const active = props.data.chipSelezionate.includes(chip);
            return (
              <button
                key={chip}
                type="button"
                onClick={() => toggleChip(chip)}
                aria-pressed={active}
                className={`rounded-[var(--radius-full)] px-4 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-[var(--color-accent)] text-[var(--color-accent-fg)]'
                    : 'border border-[var(--color-border)] hover:border-[var(--color-text)]'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}

export function StepContatto(props: StepProps): JSX.Element {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-4 font-[family-name:var(--font-display)] text-xl font-medium">
        Come ti chiami?
      </legend>
      <div>
        <label htmlFor="nome" className={labelClass}>
          Nome e cognome
        </label>
        <input
          id="nome"
          type="text"
          value={props.data.nome}
          onChange={(e) => props.update('nome', e.target.value)}
          className={inputClass}
          autoComplete="name"
        />
        {props.errors.nome && (
          <p className={errorClass} role="alert">{props.errors.nome}</p>
        )}
      </div>
      <div>
        <label htmlFor="contatto" className={labelClass}>
          Email o telefono
        </label>
        <input
          id="contatto"
          type="text"
          value={props.data.contatto}
          onChange={(e) => props.update('contatto', e.target.value)}
          className={inputClass}
          autoComplete="tel email"
          placeholder="es. 333 1234567 oppure giulia@email.it"
        />
        {props.errors.contatto && (
          <p className={errorClass} role="alert">{props.errors.contatto}</p>
        )}
      </div>
    </fieldset>
  );
}
