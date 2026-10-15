'use client';

import { useEffect } from 'react';
import { BOOK_PREORDERED_KEY } from '@/components/layout/BookPopIn';

/** Après une précommande : la pop-in du livre ne s'affiche plus pour cette personne. */
export function RememberPreorder() {
  useEffect(() => {
    try {
      window.localStorage.setItem(BOOK_PREORDERED_KEY, '1');
    } catch {
      // Stockage indisponible : au pire, la pop-in pourra réapparaître.
    }
  }, []);
  return null;
}
