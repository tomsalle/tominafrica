/**
 * Connexion à l'espace privé (formulaire classique, sans JavaScript). `next`
 * indique la page privée où revenir une fois connecté.
 */
export function AdminLoginForm({
  title,
  next,
  error,
  configured,
}: {
  title: string;
  next: string;
  error: boolean;
  configured: boolean;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-5 pt-20">
      <form action="/api/admin/login" method="post" className="w-full max-w-sm border border-ink-line bg-ink-soft p-7">
        <input type="hidden" name="next" value={next} />
        <p className="eyebrow">Espace privé</p>
        <h1 className="mt-3 font-display text-3xl font-light">{title}</h1>
        {configured ? (
          <>
            <label htmlFor="admin-password" className="mt-8 block text-xs text-paper-dim">
              Mot de passe
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              autoFocus
              aria-invalid={error || undefined}
              aria-describedby={error ? 'admin-error' : undefined}
              className="mt-2 block min-h-12 w-full border border-ink-line bg-transparent px-3 text-base text-paper focus:border-paper-dim focus:outline-none"
            />
            {error ? (
              <p id="admin-error" role="alert" className="mt-2 text-xs text-brand-text">
                Mot de passe incorrect.
              </p>
            ) : null}
            <button
              type="submit"
              className="mt-6 flex min-h-12 w-full items-center justify-center bg-brand px-6 text-[0.6875rem] font-medium tracking-[0.24em] text-paper uppercase transition-[background-color,transform] duration-200 hover:bg-brand-hover active:scale-[0.98]"
            >
              Se connecter
            </button>
          </>
        ) : (
          <p className="mt-6 text-sm leading-relaxed text-paper-dim">
            Le mot de passe n’est pas encore configuré : ajoutez la variable <code>ADMIN_PASSWORD</code> dans les
            réglages du site (Vercel), puis redéployez.
          </p>
        )}
      </form>
    </div>
  );
}

/** Liens entre les pages de l'espace privé. */
export function AdminNav({ current }: { current: 'precommandes' | 'tirages' }) {
  const links = [
    { key: 'precommandes', href: '/admin/precommandes', label: 'Précommandes' },
    { key: 'tirages', href: '/admin/tirages', label: 'Tirages de l’expo' },
  ] as const;
  return (
    <nav aria-label="Espace privé" className="flex gap-6 text-sm">
      {links.map((link) => (
        <a
          key={link.key}
          href={link.href}
          aria-current={current === link.key ? 'page' : undefined}
          className={`min-h-11 py-3 underline-offset-4 ${
            current === link.key ? 'text-paper underline' : 'text-paper-dim hover:text-paper hover:underline'
          }`}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
