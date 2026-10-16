import type { Metadata } from 'next';
import { isAdmin, isAdminConfigured } from '@/lib/admin/auth';
import { BOOK_PREORDER_STEPS } from '@/lib/book-preorder/config';
import { formatPrice } from '@/lib/format';
import { createAdminClient } from '@/lib/supabase/admin';

// Espace privé de Tom : toujours à jour, jamais mis en cache ni indexé.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Précommandes — espace privé',
  robots: { index: false, follow: false },
};

type Pledge = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  status: string;
  quantity: number;
  amount_cents: number;
  extra_donation_cents: number;
  tier_slug_snapshot: string;
  tier_name_snapshot: string;
  is_donation: boolean;
  notes: string | null;
  expo_promo_code: string | null;
  expo_promo_redeemed_at: string | null;
  public_name: string | null;
  public_message: string | null;
  stripe_checkout_session_id: string;
  created_at: string;
};

const dateFormat = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const isOffline = (p: Pledge) => p.stripe_checkout_session_id.startsWith('hors-site-');

function delivery(p: Pledge): string {
  if (p.is_donation) return '—';
  if (isOffline(p)) return 'Hors site';
  if (p.notes?.includes('retrait')) return 'Retrait à l’expo';
  if (p.notes?.includes('Vinted')) return 'Envoi Vinted';
  return 'Non précisée';
}

export default async function AdminPreordersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!(await isAdmin())) {
    const { erreur } = await searchParams;
    return <LoginForm error={erreur === '1'} configured={isAdminConfigured()} />;
  }

  const supabase = createAdminClient();
  const [{ data: pledgesData }, { data: tiersData }] = await Promise.all([
    supabase
      .from('book_preorder_pledges')
      .select(
        'id,full_name,email,phone,status,quantity,amount_cents,extra_donation_cents,tier_slug_snapshot,tier_name_snapshot,is_donation,notes,expo_promo_code,expo_promo_redeemed_at,public_name,public_message,stripe_checkout_session_id,created_at',
      )
      .order('created_at', { ascending: false }),
    supabase.from('book_preorder_tiers').select('slug,book_units,stock_limit,claimed_count,published'),
  ]);

  const pledges = (pledgesData ?? []) as Pledge[];
  const tiers = tiersData ?? [];
  const unitsBySlug = new Map(tiers.map((t) => [t.slug, t.book_units]));
  const paid = pledges.filter((p) => p.status === 'paid');
  const orders = paid.filter((p) => !p.is_donation);
  const online = orders.filter((p) => !isOffline(p));
  const books = orders.reduce((sum, p) => sum + p.quantity * (unitsBySlug.get(p.tier_slug_snapshot) ?? 1), 0);
  const step = BOOK_PREORDER_STEPS.find((s) => books < s) ?? BOOK_PREORDER_STEPS.at(-1)!;
  const cashedOnline = paid.filter((p) => !isOffline(p)).reduce((sum, p) => sum + p.amount_cents, 0);
  const donations = paid.filter((p) => p.is_donation || p.extra_donation_cents > 0);
  const donationTotal = donations.reduce((sum, p) => sum + (p.is_donation ? p.amount_cents : p.extra_donation_cents), 0);
  const pickups = online.filter((p) => delivery(p) === 'Retrait à l’expo').length;
  const vinted = online.filter((p) => delivery(p) === 'Envoi Vinted').length;
  const earlyBird = tiers.find((t) => t.slug === 'early-bird');

  const stats = [
    { label: 'Livres précommandés', value: String(books), detail: `objectif en cours : ${step}` },
    { label: 'Commandes', value: String(orders.length), detail: `${online.length} en ligne · ${orders.length - online.length} hors site` },
    { label: 'Encaissé en ligne', value: formatPrice(cashedOnline), detail: 'via Stripe, dons compris' },
    { label: 'Dons', value: formatPrice(donationTotal), detail: `${donations.length} don${donations.length > 1 ? 's' : ''}` },
    {
      label: 'Early bird',
      value: earlyBird?.stock_limit ? `${earlyBird.claimed_count} / ${earlyBird.stock_limit}` : '—',
      detail: earlyBird?.stock_limit && earlyBird.claimed_count >= earlyBird.stock_limit ? 'épuisé' : 'vendus',
    },
    { label: 'Livraison (en ligne)', value: `${pickups} · ${vinted}`, detail: 'retraits à l’expo · envois Vinted' },
  ];

  return (
    <div className="pt-28 pb-28 sm:pt-36">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Espace privé</p>
            <h1 className="mt-3 font-display text-4xl font-light sm:text-5xl">Précommandes du livre</h1>
          </div>
          <form action="/api/admin/logout" method="post">
            <button type="submit" className="min-h-11 text-xs text-paper-dim underline underline-offset-4 hover:text-paper">
              Se déconnecter
            </button>
          </form>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-ink-line bg-ink-line lg:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-ink-soft p-5">
              <dt className="text-[0.6875rem] tracking-[0.14em] text-paper-faint uppercase">{s.label}</dt>
              <dd className="mt-2 font-display text-3xl font-light tabular-nums sm:text-4xl">{s.value}</dd>
              <dd className="mt-1 text-xs text-paper-dim">{s.detail}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-light sm:text-3xl">Commandes ({orders.length})</h2>
          <div className="mt-6 hidden grid-cols-[6.5rem_1.6fr_1.2fr_6rem_7.5rem_7rem] gap-4 border-b border-ink-line pb-3 text-[0.6875rem] tracking-[0.12em] text-paper-faint uppercase lg:grid">
            <span>Date</span>
            <span>Client</span>
            <span>Formule</span>
            <span className="text-right">Montant</span>
            <span>Livraison</span>
            <span>Code expo</span>
          </div>
          <ul className="divide-y divide-ink-line border-y border-ink-line lg:border-t-0">
            {pledges
              .filter((p) => !p.is_donation)
              .map((p) => (
                <li
                  key={p.id}
                  className="grid grid-cols-2 gap-x-4 gap-y-2 py-4 text-sm lg:grid-cols-[6.5rem_1.6fr_1.2fr_6rem_7.5rem_7rem] lg:items-start"
                >
                  <span className="text-paper-dim tabular-nums">{dateFormat.format(new Date(p.created_at))}</span>
                  <span className="order-first col-span-2 min-w-0 lg:order-none lg:col-span-1">
                    <span className="block truncate text-paper">{isOffline(p) ? 'Précommande hors site' : p.full_name || '—'}</span>
                    {isOffline(p) ? null : (
                      <span className="block truncate text-xs text-paper-dim">
                        <a href={`mailto:${p.email}`} className="hover:text-paper hover:underline">
                          {p.email}
                        </a>
                        {p.phone ? (
                          <>
                            {' · '}
                            <a href={`tel:${p.phone}`} className="hover:text-paper hover:underline">
                              {p.phone}
                            </a>
                          </>
                        ) : null}
                      </span>
                    )}
                    {p.public_message ? (
                      <span className="mt-1 block text-xs text-paper-faint italic">« {p.public_message} »</span>
                    ) : null}
                  </span>
                  <span translate="no" className="text-paper">
                    {p.tier_name_snapshot}
                    {p.quantity > 1 ? ` × ${p.quantity}` : ''}
                    {p.status !== 'paid' ? (
                      <span className="ml-2 bg-brand/25 px-1.5 py-0.5 text-[0.625rem] text-paper uppercase">{p.status}</span>
                    ) : null}
                  </span>
                  <span className="text-right text-paper tabular-nums lg:text-right">
                    {formatPrice(p.amount_cents)}
                    {p.extra_donation_cents > 0 ? (
                      <span className="block text-xs text-brand-text">dont don {formatPrice(p.extra_donation_cents)}</span>
                    ) : null}
                  </span>
                  <span className="text-paper-dim">{delivery(p)}</span>
                  <span className="text-xs text-paper-dim tabular-nums">
                    {p.expo_promo_code ?? '—'}
                    {p.expo_promo_redeemed_at ? <span className="block text-paper-faint">utilisé</span> : null}
                  </span>
                </li>
              ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-light sm:text-3xl">Dons ({donations.length})</h2>
          {donations.length === 0 ? (
            <p className="mt-4 text-sm text-paper-dim">Aucun don pour l’instant.</p>
          ) : (
            <ul className="mt-6 divide-y divide-ink-line border-y border-ink-line">
              {donations.map((p) => (
                <li key={p.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4 text-sm">
                  <span className="min-w-0">
                    <span className="text-paper">{p.full_name || p.public_name || 'Anonyme'}</span>
                    <span className="ml-2 text-xs text-paper-dim">
                      {p.is_donation ? 'don seul' : `avec « ${p.tier_name_snapshot} »`} · {dateFormat.format(new Date(p.created_at))}
                    </span>
                  </span>
                  <span className="font-display text-xl tabular-nums">
                    {formatPrice(p.is_donation ? p.amount_cents : p.extra_donation_cents)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function LoginForm({ error, configured }: { error: boolean; configured: boolean }) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-5 pt-20">
      <form action="/api/admin/login" method="post" className="w-full max-w-sm border border-ink-line bg-ink-soft p-7">
        <p className="eyebrow">Espace privé</p>
        <h1 className="mt-3 font-display text-3xl font-light">Précommandes du livre</h1>
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
