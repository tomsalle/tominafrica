'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type PrintFormat = { widthCm: number; heightCm: number };

type FramePreferenceContextValue = {
  framed: boolean;
  setFramed: (value: boolean) => void;
  /** Dimensions réelles du format sélectionné dans le panneau d'achat — la
   *  photo s'en sert pour prévisualiser le tirage à son vrai ratio, pas à
   *  celui du fichier source. */
  format: PrintFormat | null;
  setFormat: (format: PrintFormat | null) => void;
};

const FramePreferenceContext = createContext<FramePreferenceContextValue | null>(null);

/**
 * Partage le format et le choix « encadré / sans cadre » entre la photo (en
 * haut de la page produit) et le panneau d'achat plus bas. Un contexte
 * scoped à la page suffit — pas besoin d'un magasin global comme le panier,
 * cet état n'a pas vocation à survivre à la navigation vers une autre photo.
 */
export function FramePreferenceProvider({ children }: { children: ReactNode }) {
  const [framed, setFramed] = useState(false);
  const [format, setFormat] = useState<PrintFormat | null>(null);

  return (
    <FramePreferenceContext.Provider value={{ framed, setFramed, format, setFormat }}>
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
