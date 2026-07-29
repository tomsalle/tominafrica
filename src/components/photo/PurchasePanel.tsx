'use client';

import { useState } from 'react';
import { addItem } from '@/lib/cart/store';
import { Button } from '@/components/ui/Button';
import { formatAvailability, formatPrice } from '@/lib/format';
import type { PhotoWithOptions, PrintOptionRow } from '@/types/database';

/**
 * Bloc achat de la page produit : choix du format, disponibilité, ajout au panier.
 */
export function PurchasePanel({ photo }: { photo: PhotoWithOptions }) {
  const options = photo.print_options;

  // Premier format disponible sélectionné par défaut, sinon le premier tout court.
  const [selectedId, setSelectedId] = useState<string | undefined>(
    () =>
      options.find((o) => !formatAvailability(o.edition_size, o.editions_sold).soldOut)?.id ??
      options[0]?.id,
  );
  const [justAdded, setJustAdded] = useState(false);

  if (options.length === 0) {
    return (
      <section aria-labelledby="achat-titre">
        <h2 id="achat-titre" className="eyebrow">
          Tirages
        </h2>
        <p className="mt-6 text-sm text-paper-dim">
          Aucun tirage n’est proposé pour cette photographie.
        </p>
      </section>
    );
  }

  const selected = options.find((o) => o.id === selectedId);
  const availability = selected
    ? formatAvailability(selected.edition_size, selected.editions_sold)
    : null;

  function handleAdd() {
    if (!selected || availability?.soldOut) return;

    addItem({
      optionId: selected.id,
      quantity: 1,
      photoSlug: photo.slug,
      photoTitle: photo.title,
      imagePath: photo.image_path,
      optionLabel: selected.label,
      unitPriceCents: selected.price_cents,
    });

    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2200);
  }

  return (
    <section aria-labelledby="achat-titre">
      <h2 id="achat-titre" className="eyebrow">
        Tirages
      </h2>

      <fieldset className="mt-7">
        <legend className="sr-only">Choisir un format</legend>

        <div className="divide-y divide-ink-line border-y border-ink-line">
          {options.map((option) => (
            <OptionRow
              key={option.id}
              option={option}
              checked={option.id === selectedId}
              onSelect={() => setSelectedId(option.id)}
            />
          ))}
        </div>
      </fieldset>

      {selected ? (
        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <span className="eyebrow">Prix</span>
            <span className="font-display text-4xl leading-none font-light tabular-nums">
              {formatPrice(selected.price_cents)}
            </span>
          </div>

          {selected.paper ? (
            <p className="mt-4 text-xs text-paper-faint">Papier {selected.paper}</p>
          ) : null}

          <Button
            className="mt-6 w-full"
            onClick={handleAdd}
            disabled={availability?.soldOut}
            aria-live="polite"
          >
            {availability?.soldOut ? 'Épuisé' : justAdded ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
          </Button>
        </div>
      ) : null}

      <dl className="mt-10 space-y-3 border-t border-ink-line pt-7 text-xs text-paper-faint">
        <Detail term="Tirage" detail="Réalisé à la commande, sous 5 à 10 jours ouvrés." />
        <Detail term="Signature" detail="Signé au dos, avec certificat d’authenticité." />
        <Detail term="Expédition" detail="Sous tube rigide, suivie et assurée." />
        <Detail term="Rétractation" detail="14 jours après réception (voir CGV)." />
      </dl>
    </section>
  );
}

function OptionRow({
  option,
  checked,
  onSelect,
}: {
  option: PrintOptionRow;
  checked: boolean;
  onSelect: () => void;
}) {
  const availability = formatAvailability(option.edition_size, option.editions_sold);

  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-4 py-4 transition-colors ${
        availability.soldOut ? 'cursor-not-allowed opacity-45' : 'hover:bg-ink-soft/60'
      }`}
    >
      <span className="flex items-center gap-4">
        <input
          type="radio"
          name="print-option"
          value={option.id}
          checked={checked}
          disabled={availability.soldOut}
          onChange={onSelect}
          className="sr-only"
        />

        {/* Puce de sélection dessinée à la main : le radio natif ne se stylise
            pas de façon fiable entre navigateurs. */}
        <span
          aria-hidden
          className={`grid h-3.5 w-3.5 place-items-center rounded-full border transition-colors ${
            checked ? 'border-paper' : 'border-ink-line'
          }`}
        >
          {checked ? <span className="h-1.5 w-1.5 rounded-full bg-paper" /> : null}
        </span>

        <span>
          <span className="block text-sm text-paper">{option.label}</span>
          <span
            className={`mt-0.5 block text-xs ${
              availability.soldOut
                ? 'text-accent'
                : availability.remaining !== null && availability.remaining <= 3
                  ? 'text-accent'
                  : 'text-paper-faint'
            }`}
          >
            {availability.label}
          </span>
        </span>
      </span>

      <span className="text-sm tabular-nums text-paper-dim">{formatPrice(option.price_cents)}</span>
    </label>
  );
}

function Detail({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-24 shrink-0 text-paper-dim">{term}</dt>
      <dd>{detail}</dd>
    </div>
  );
}
