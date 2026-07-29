import type { ReactNode } from 'react';

/**
 * Colonne de lecture pour les pages de texte long (à propos, mentions, CGV).
 * Les styles sont appliqués aux balises enfants plutôt que classe par classe :
 * ces pages sont écrites en JSX brut et doivent rester lisibles à la relecture.
 */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        'max-w-[42rem] text-[0.9375rem] leading-[1.8] text-paper-dim',
        '[&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-light [&_h2]:text-paper',
        '[&_h3]:mt-9 [&_h3]:mb-3 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:tracking-wide [&_h3]:text-paper',
        '[&_p]:mt-4',
        '[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5',
        '[&_a]:text-paper [&_a]:underline [&_a]:underline-offset-4',
        '[&_strong]:font-medium [&_strong]:text-paper',
        // Marqueur visuel des informations restant à fournir.
        '[&_mark]:bg-accent/15 [&_mark]:px-1.5 [&_mark]:py-0.5 [&_mark]:text-accent',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
