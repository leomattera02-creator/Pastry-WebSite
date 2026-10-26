import { useState, useRef, useLayoutEffect, type JSX } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

export type AllergeneLabel =
  | 'glutine'
  | 'crostacei'
  | 'uova'
  | 'pesce'
  | 'arachidi'
  | 'soia'
  | 'latte'
  | 'frutta_a_guscio'
  | 'sedano'
  | 'senape'
  | 'sesamo'
  | 'solfiti'
  | 'lupini'
  | 'molluschi';

export interface CatalogProduct {
  id: string;
  nome: string;
  descrizione: string;
  categoriaId: string;
  prezzo: string;
  prezzoSuPreventivo?: boolean;
  allergeni: AllergeneLabel[];
  immagine: { src: string; alt: string; width: number; height: number };
  inEvidenza: boolean;
}

export interface CatalogCategory {
  id: string;
  nome: string;
}

export interface CatalogProps {
  products: CatalogProduct[];
  categories: CatalogCategory[];
}

const allergenLabels: Record<AllergeneLabel, string> = {
  glutine: 'Glutine',
  crostacei: 'Crostacei',
  uova: 'Uova',
  pesce: 'Pesce',
  arachidi: 'Arachidi',
  soia: 'Soia',
  latte: 'Latte',
  frutta_a_guscio: 'Frutta a guscio',
  sedano: 'Sedano',
  senape: 'Senape',
  sesamo: 'Sesamo',
  solfiti: 'Solfiti',
  lupini: 'Lupini',
  molluschi: 'Molluschi',
};

function ProductCard({
  product,
  onAllergeni,
}: {
  product: CatalogProduct;
  onAllergeni: (p: CatalogProduct) => void;
}): JSX.Element {
  return (
    <article
      className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]"
      data-flip-id={product.id}
    >
      <div className="overflow-hidden">
        <img
          src={product.immagine.src}
          alt={product.immagine.alt}
          width={product.immagine.width}
          height={product.immagine.height}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-medium">
          {product.nome}
        </h3>
        <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
          {product.descrizione}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-sm font-medium">
            {product.prezzoSuPreventivo ? 'Su preventivo' : `da ${product.prezzo}`}
          </span>
          <button
            type="button"
            onClick={() => onAllergeni(product)}
            className="flex items-center gap-1 rounded-[var(--radius-full)] border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            aria-label={`Allergeni di ${product.nome}`}
          >
            <span aria-hidden="true">⚠</span>
            Allergeni
            {product.allergeni.length > 0 && (
              <span className="font-medium text-[var(--color-text)]">
                {product.allergeni.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

function AllergeniDialog({
  product,
  onClose,
}: {
  product: CatalogProduct | null;
  onClose: () => void;
}): JSX.Element | null {
  const dialogRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!product) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Allergeni di ${product.nome}`}
        tabIndex={-1}
        className="relative z-10 w-full max-w-md rounded-t-[var(--radius-lg)] bg-[var(--color-surface)] p-6 sm:rounded-[var(--radius-lg)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="font-[family-name:var(--font-display)] text-xl font-medium">
            Allergeni — {product.nome}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="text-2xl leading-none text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            ✕
          </button>
        </div>
        {product.allergeni.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            Nessun allergene dichiarato.
          </p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-2">
            {product.allergeni.map((a) => (
              <li
                key={a}
                className="rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-3 py-1.5 text-sm"
              >
                {allergenLabels[a]}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Catalog(props: CatalogProps): JSX.Element {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [allergeniProduct, setAllergeniProduct] =
    useState<CatalogProduct | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeFilter === 'all'
      ? props.products
      : props.products.filter((p) => p.categoriaId === activeFilter);

  const filterButtons = [{ id: 'all', nome: 'Tutti' }, ...props.categories];

  function handleFilterChange(id: string): void {
    const grid = gridRef.current;
    if (!grid) {
      setActiveFilter(id);
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setActiveFilter(id);
      return;
    }
    const state = Flip.getState('[data-flip-id]');
    setActiveFilter(id);
    requestAnimationFrame(() => {
      Flip.from(state, {
        targets: '[data-flip-id]',
        duration: 0.5,
        ease: 'power2.out',
        absolute: true,
        stagger: 0.03,
      });
    });
  }

  return (
    <section id="catalogo" className="px-5 py-20 sm:px-8 sm:py-28" data-reveal>
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 sm:mb-12">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
            Le nostre creazioni
          </p>
          <h2
            className="font-[family-name:var(--font-display)] font-semibold leading-[1.1]"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
          >
            Catalogo
          </h2>
        </header>

        <div
          className="mb-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filtra per categoria"
        >
          {filterButtons.map((cat) => {
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleFilterChange(cat.id)}
                className={`rounded-[var(--radius-full)] px-5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-[var(--color-primary-fg)]'
                    : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]'
                }`}
              >
                {cat.nome}
              </button>
            );
          })}
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          data-flip-grid
        >
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAllergeni={setAllergeniProduct}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-[var(--color-text-muted)]">
            Nessun prodotto in questa categoria.
          </p>
        )}
      </div>

      <AllergeniDialog
        product={allergeniProduct}
        onClose={() => setAllergeniProduct(null)}
      />
    </section>
  );
}
