import type { Metadata } from 'next';
import { ClearCartOnSuccess } from '@/components/cart/ClearCartOnSuccess';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Commande confirmée',
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage() {
  return (
    <div className="flex min-h-dvh items-center pt-32 pb-28">
      <Container width="prose">
        <ClearCartOnSuccess />

        <p className="eyebrow">Merci</p>

        <h1 className="mt-6 font-display text-5xl leading-[1.05] font-light sm:text-6xl">
          Votre commande est confirmée.
        </h1>

        <p className="mt-8 text-base leading-relaxed text-paper-dim">
          Un e-mail de confirmation vient de vous être envoyé. Votre tirage est réalisé à la
          commande : comptez cinq à dix jours ouvrés avant l’expédition, puis un envoi suivi sous
          tube rigide.
        </p>

        <p className="mt-5 text-sm leading-relaxed text-paper-faint">
          Une question sur votre commande ? Répondez simplement à l’e-mail de confirmation.
        </p>

        <ButtonLink href="/" variant="outline" className="mt-12">
          Retour aux séries
        </ButtonLink>
      </Container>
    </div>
  );
}
