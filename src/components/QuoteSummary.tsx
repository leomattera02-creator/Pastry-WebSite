import { useState, type JSX } from 'react';
import type { QuoteData } from './QuoteSteps';

export interface QuoteSummaryProps {
  data: QuoteData;
  whatsapp: string;
  email: string;
  template: string;
  brandName: string;
}

function buildMessage(
  data: QuoteData,
  template: string,
  brandName: string,
): string {
  const gustiCompleti = [
    data.gustiStile,
    data.chipSelezionate.length > 0
      ? `Suggerimenti: ${data.chipSelezionate.join(', ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  const formatDate = (s: string): string => {
    if (!s) return 'Non specificata';
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return template
    .replace('{brandName}', brandName)
    .replace('{prodotto}', data.occasione)
    .replace('{data}', formatDate(data.dataEvento))
    .replace('{persone}', data.numeroPersone || 'Non specificato')
    .replace('{gusti}', gustiCompleti || 'Non specificato')
    .replace('{nome}', data.nome)
    .replace('{contatto}', data.contatto);
}

function Row({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex flex-col gap-0.5 border-b border-[var(--color-border)] py-3 last:border-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
        {label}
      </dt>
      <dd className="text-[var(--color-text)]">{value}</dd>
    </div>
  );
}

export default function QuoteSummary(props: QuoteSummaryProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const message = buildMessage(props.data, props.template, props.brandName);

  const waNumber = props.whatsapp.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  const mailtoUrl = `mailto:${props.email}?subject=${encodeURIComponent(
    `Richiesta preventivo — ${props.data.occasione}`,
  )}&body=${encodeURIComponent(message)}`;

  function handleCopy(): void {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const gustiText = [
    props.data.gustiStile,
    props.data.chipSelezionate.length > 0
      ? props.data.chipSelezionate.join(', ')
      : '',
  ]
    .filter(Boolean)
    .join(' — ') || 'Non specificato';

  return (
    <div className="space-y-6">
      <h3 className="font-[family-name:var(--font-display)] text-xl font-medium">
        Riepilogo della tua richiesta
      </h3>

      <dl className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-5">
        <Row label="Occasione" value={props.data.occasione} />
        <Row label="Data evento" value={props.data.dataEvento ? new Date(props.data.dataEvento).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non specificata'} />
        <Row label="Numero persone" value={props.data.numeroPersone} />
        <Row label="Gusti e stile" value={gustiText} />
        <Row label="Nome" value={props.data.nome} />
        <Row label="Contatto" value={props.data.contatto} />
      </dl>

      <div className="space-y-3">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-primary)] px-6 py-3.5 text-sm font-medium text-[var(--color-primary-fg)] transition-opacity hover:opacity-90"
        >
          Invia su WhatsApp
        </a>
        <a
          href={mailtoUrl}
          className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-border)] px-6 py-3.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-alt)]"
        >
          Invia via email
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-border)] px-6 py-3.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-alt)]"
        >
          {copied ? 'Testo copiato!' : 'Copia testo'}
        </button>
      </div>

      <p className="text-sm text-[var(--color-text-muted)]">
        Per mandare foto di riferimento, allegale direttamente su WhatsApp.
      </p>
    </div>
  );
}
