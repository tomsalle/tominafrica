import Link from 'next/link';

const LEGAL = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/cgv', label: 'CGV' },
  { href: '/confidentialite', label: 'Confidentialité' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-line">
      <div className="mx-auto w-full max-w-[110rem] px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-xl font-light tracking-[0.16em] uppercase">
              Tom in Africa
            </p>
            <p className="mt-4 text-sm leading-relaxed text-paper-dim">
              Tirages d’art réalisés sur papier fine art, signés et expédiés depuis la France.
            </p>
          </div>

          <nav className="flex flex-col gap-3" aria-label="Informations légales">
            {LEGAL.map((item) => (
              <Link key={item.href} href={item.href} className="eyebrow link-underline self-start">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-14 text-xs text-paper-faint">
          © {new Date().getFullYear()} Tom in Africa. Toutes les photographies sont protégées par le
          droit d’auteur et ne peuvent être reproduites sans autorisation écrite.
        </p>
      </div>
    </footer>
  );
}
