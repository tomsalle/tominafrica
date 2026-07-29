import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center">
      <Container width="prose">
        <p className="eyebrow">Erreur 404</p>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] font-light sm:text-6xl">
          Cette page n’existe pas.
        </h1>
        <p className="mt-6 text-base text-paper-dim">
          Le lien est peut-être ancien, ou la photographie a été retirée du catalogue.
        </p>
        <ButtonLink href="/" variant="outline" className="mt-12">
          Retour aux séries
        </ButtonLink>
      </Container>
    </div>
  );
}
