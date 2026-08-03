import type { Metadata } from 'next';
import Link from 'next/link';
import { ExpositionForm } from '@/components/exhibition/ExpositionForm';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Inscription à l’exposition',
  description: 'Inscrivez-vous pour participer à l’exposition « Notre aventure » à Paris.',
  robots: { index: false, follow: false },
};

export default function ExpositionPage() {
  return (
    <div className="pt-32 pb-28 sm:pt-40">
      <Container width="prose">
        <Link href="/notre-aventure" className="eyebrow link-underline">
          ← Notre aventure
        </Link>

        <h1 className="mt-6 font-display text-5xl leading-none font-light sm:text-6xl">
          L’exposition
        </h1>
        <p className="mt-6 text-base leading-relaxed text-paper-dim sm:text-lg">
          Une exposition aura bientôt lieu à Paris, autour des photographies de cette traversée.
          Laissez vos coordonnées pour être invité·e — les détails pratiques (lieu, date, horaires)
          vous seront envoyés par e-mail.
        </p>

        <div className="mt-14">
          <ExpositionForm />
        </div>
      </Container>
    </div>
  );
}
