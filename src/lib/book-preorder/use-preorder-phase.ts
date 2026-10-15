'use client';

import { useEffect, useState } from 'react';
import { BOOK_PREORDER_START, getPreorderPhase, type PreorderPhase } from '@/lib/book-preorder/config';

/**
 * Phase de la précommande vue par le navigateur, recalculée chaque seconde
 * jusqu'à l'ouverture : à 12 h pile, les boutons apparaissent sans recharger.
 * Premier rendu = phase calculée par le serveur (pas d'écart d'hydratation).
 */
export function usePreorderPhase(serverPhase: PreorderPhase): { phase: PreorderPhase; msLeft: number | null } {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    if (Date.now() >= BOOK_PREORDER_START.getTime()) return;
    const id = window.setInterval(() => {
      tick();
      if (Date.now() >= BOOK_PREORDER_START.getTime()) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null) return { phase: serverPhase, msLeft: null };
  return { phase: getPreorderPhase(now), msLeft: Math.max(0, BOOK_PREORDER_START.getTime() - now) };
}
