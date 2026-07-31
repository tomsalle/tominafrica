'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type FramePreferenceContextValue = {
  framed: boolean;
  setFramed: (value: boolean) => void;
};

const FramePreferenceContext = createContext<FramePreferenceContextValue | null>(null);

/**
 * Partage le choix « encadré / sans cadre » entre la photo (colonne collante)
 * et le panneau d'achat, sur la page produit. Les deux vivent dans des zones
 * de grille séparées mais doivent rester synchrones : la photo prévisualise
 * ce que le panneau d'achat facture. Un contexte scoped à la page suffit —
 * pas besoin d'un magasin global comme le panier, cet état n'a pas vocation
 * à survivre à la navigation vers une autre photo.
 */
export function FramePreferenceProvider({ children }: { children: ReactNode }) {
  const [framed, setFramed] = useState(false);
  return (
    <FramePreferenceContext.Provider value={{ framed, setFramed }}>
      {children}
    </FramePreferenceContext.Provider>
  );
}

export function useFramePreference(): FramePreferenceContextValue {
  const context = useContext(FramePreferenceContext);
  if (!context) {
    throw new Error('useFramePreference doit être utilisé dans un FramePreferenceProvider');
  }
  return context;
}
