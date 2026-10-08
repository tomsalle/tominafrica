import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { FormulaCard } from '@/components/book-preorder/FormulaCard';
import { CalendarIcon, CheckIcon, GiftIcon, HeartIcon } from '@/components/book-preorder/icons';
import { SimulationBanner } from '@/components/book-preorder/SimulationBanner';
import { TierPledgeForm } from '@/components/book-preorder/TierPledgeForm';
import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/navigation';
import { languageAlternates } from '@/i18n/alternates';
import { BOOK_PREORDER_PAGE_DISABLED } from '@/lib/book-preorder/flags';
import { loadPreorderData } from '@/lib/book-preorder/page-data';
import { isCheckoutEnabled } from '@/lib/env';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bookPreorder.chooser' });
  return {
    title: t('metaTitle'),
    alternates: { languages: languageAlternates('/precommande-livre/formules') },
    robots: { index: false, follow: false },
  };
}

/**
 * Page 2 de la précommande : choisir sa formule. Le livre seul d'abord, puis
 * les formules plus complètes, chacune achetable en un clic ; le don, pour
 * soutenir l'exposition, en fin de page.
 */
export default async function BookFormulasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (BOOK_PREORDER_PAGE_DISABLED) notFound();

  const devParams = process.env.NODE_ENV === 'development' ? await searchParams : {};
  const { simulated, formulas, donationTier, offer, closed, daysLeft } = await loadPreorderData(
    devParams.simulation,
    devParams.cloture,
  );
  const t = await getTranslations('bookPreorder.chooser');
  const deadline = await getTranslations('bookPreorder.deadline');
  const checkoutEnabled = isCheckoutEnabled();

  // Le livre seul (l'offre du moment) en premier, puis les autres formules
  // dans l'ordre défini en base ; un early bird épuisé passe en dernier.
  const ordered = offer
    ? [offer.tier, ...formulas.filter((tier) => tier.id !== offer.tier.id)]
    : formulas;
  const soldOutLast = [
    ...ordered.filter((tier) => tier.stock_limit === null || tier.claimed_count < tier.stock_limit),
    ...ordered.filter((tier) => tier.stock_limit !== null && tier.claimed_count >= tier.stock_limit),
  ];

  const reassurance = [
    { icon: GiftIcon, text: t('reassureGift') },
    { icon: CheckIcon, text: t('reassurePayment') },
    { icon: CheckIcon, text: t('reassureDelivery') },
    {
      icon: CalendarIcon,
      text: `${t('reassureDate')} · ${deadline('daysLeft', { count: daysLeft })}`,
    },
  ];

  return (
    <div className="pt-28 pb-28 sm:pt-36">
      {simulated !== null ? <SimulationBanner count={simulated} /> : null}

      <Container>
        <Link href="/precommande-livre" className="eyebrow link-underline">
          {t('back')}
        </Link>
        <h1 className="mt-6 font-display text-4xl leading-tight font-light text-paper sm:text-6xl">{t('title')}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-paper-dim sm:text-lg">{t('intro')}</p>

        {closed ? (
          <div role="status" className="mt-8 max-w-2xl border border-brand bg-ink-soft px-5 py-4">
            <p className="text-base text-paper">{t('closedTitle')}</p>
            <p className="mt-1 text-sm leading-relaxed text-paper-dim">{t('closedBody')}</p>
          </div>
        ) : (
          <ul className="mt-8 flex flex-col gap-3 text-sm text-paper-dim sm:flex-row sm:flex-wrap sm:gap-x-8">
            {reassurance.map(({ icon: Icon, text }, index) => (
              <li key={text} className={`flex items-center gap-2 ${index === 0 ? 'text-paper' : ''}`}>
                <Icon className="size-4 shrink-0 text-brand-text" />
                {text}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {soldOutLast.map((tier) => {
            const isOffer = tier.id === offer?.tier.id;
            return (
              <FormulaCard
                key={tier.id}
                tier={tier}
                checkoutEnabled={checkoutEnabled}
                closed={closed}
                compareAtCents={isOffer ? offer?.compareAtCents : null}
                badge={isOffer && !closed ? (offer?.compareAtCents ? t('badgeEarlyBird') : t('badgeBook')) : null}
              />
            );
          })}
        </div>

        {/* Le don : pour aider à monter l'exposition, sans rien acheter. */}
        {donationTier ? (
          <section
            aria-labelledby="don-titre"
            className="mt-20 grid grid-cols-1 gap-8 border border-ink-line bg-ink-soft p-6 sm:p-10 lg:grid-cols-[1fr_22rem] lg:gap-16"
          >
            <div>
              <p className="eyebrow flex items-center gap-2 text-paper">
                <HeartIcon className="size-4 text-brand-text" />
                {t('donationEyebrow')}
              </p>
              <h2 id="don-titre" className="mt-4 font-display text-3xl font-light text-paper sm:text-4xl">
                {t('donationTitle')}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-paper-dim">{t('donationBody')}</p>
            </div>
            <div className="lg:pt-10">
              <TierPledgeForm tier={donationTier} checkoutEnabled={checkoutEnabled} soldOut={false} closed={closed} />
            </div>
          </section>
        ) : null}

        <p className="mt-12 text-sm text-paper-dim">
          {t('questions')}{' '}
          <Link href="/precommande-livre#faq" className="link-underline text-paper">
            {t('faqLink')}
          </Link>
        </p>
      </Container>
    </div>
  );
}
