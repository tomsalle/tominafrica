'use client';

import Image from 'next/image';
import { photoSrc } from '@/lib/images';
import type { CartItem } from '@/lib/cart/types';

/**
 * Aperçu « sur un mur » du panier : les tirages sélectionnés, encadrés ou
 * non selon le choix fait sur chaque page produit, côte à côte sur le même
 * fond neutre que la page produit — à leur taille relative réelle, pour
 * juger s'ils vont ensemble avant de payer.
 */
export function CartWallPreview({ items }: { items: CartItem[] }) {
  const tallestCm = Math.max(...items.map((item) => item.heightCm));

  return (
    <div className="flex h-[45vh] max-h-[420px] items-end justify-center gap-4 overflow-x-auto bg-[#d9d7d2] px-6 py-10 sm:gap-8">
      {items.map((item) => {
        const heightPercent = (item.heightCm / tallestCm) * 100;
        const ratio = item.widthCm / item.heightCm;

        return (
          <div
            key={item.optionId}
            className="shrink-0"
            style={{ height: `${heightPercent}%`, aspectRatio: ratio }}
          >
            <div
              className={`h-full w-full shadow-[0_18px_35px_rgba(0,0,0,0.3)] ${
                item.framed ? 'bg-black p-[3%]' : ''
              }`}
            >
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={photoSrc(item.imagePath, item.imageWidth)}
                  alt={item.photoTitle}
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
