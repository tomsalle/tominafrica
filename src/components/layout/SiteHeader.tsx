'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { openCart, useCartHydrated, useCartItems } from '@/lib/cart/store';
import { cartCount } from '@/lib/cart/types';

const NAV = [
  { href: '/', label: 'Séries' },
  { href: '/a-propos', label: 'À propos' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const items = useCartItems();
  const hydrated = useCartHydrated();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const count = cartCount(items);

  // Le header est transparent sur les grandes images, puis se solidifie dès
  // qu'on quitte le haut de page — sans quoi il devient illisible. Observer
  // la sentinelle plutôt qu'écouter le scroll évite de recalculer l'état à
  // chaque frame.
  useEffect(() => {
    const sentinel = document.getElementById('scroll-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => setScrolled(!entries[0]?.isIntersecting),
      { rootMargin: '-24px 0px 0px 0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || menuOpen
          ? 'bg-ink/92 backdrop-blur-md'
          : 'bg-linear-to-b from-black/45 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[110rem] items-center justify-between px-5 sm:h-20 sm:px-8">
        <Link
          href="/"
          className="font-display text-lg leading-none font-light tracking-[0.18em] uppercase sm:text-xl"
        >
          Tom in Africa
        </Link>

        <nav className="hidden items-center gap-10 sm:flex" aria-label="Navigation principale">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`eyebrow link-underline ${
                pathname === item.href ? 'text-paper' : 'hover:text-paper'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <CartButton count={count} hydrated={hydrated} onClick={openCart} />
        </nav>

        <div className="flex items-center gap-5 sm:hidden">
          <CartButton count={count} hydrated={hydrated} onClick={openCart} />
          <button
            type="button"
            className="eyebrow text-paper"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? 'Fermer' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Toujours dans le DOM (plutôt qu'un rendu conditionnel) pour pouvoir
          animer la fermeture, pas seulement l'ouverture. `inert` retire les
          liens du parcours clavier/lecteur d'écran tant que le menu est
          refermé, même si sa hauteur n'est pas encore tout à fait à zéro. */}
      <nav
        className={`overflow-hidden border-t px-5 transition-[max-height,opacity,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:hidden ${
          menuOpen
            ? 'max-h-96 border-ink-line pb-6 opacity-100'
            : 'max-h-0 border-transparent pb-0 opacity-0'
        }`}
        aria-label="Navigation mobile"
        inert={!menuOpen}
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            // Fermeture au clic plutôt que par un effet sur le pathname : la
            // navigation est l'événement, autant y réagir directement.
            onClick={() => setMenuOpen(false)}
            className="block py-4 font-display text-2xl font-light"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function CartButton({
  count,
  hydrated,
  onClick,
}: {
  count: number;
  hydrated: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="eyebrow hover:text-paper"
      aria-label={`Panier — ${count} article${count > 1 ? 's' : ''}`}
    >
      {/* Tant que le localStorage n'est pas lu, on n'affiche pas de compteur :
          le serveur ne peut pas le connaître, l'afficher créerait un écart
          d'hydratation. */}
      Panier{hydrated && count > 0 ? ` (${count})` : ''}
    </button>
  );
}
