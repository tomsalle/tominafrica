import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { BudgetBreakdown } from '@/components/book-preorder/BudgetBreakdown';
import { FundingProgress } from '@/components/book-preorder/FundingProgress';
import { TierCard } from '@/components/book-preorder/TierCard';
import { Container } from '@/components/ui/Container';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';
import { BOOK_PREORDER_GOAL_COUNT } from '@/lib/book-preorder/config';
import { BOOK_PREORDER_PAGE_DISABLED } from '@/lib/book-preorder/flags';
import { getBookPreorderProgress, getPublishedTiers } from '@/lib/book-preorder/queries';
import { isCheckoutEnabled } from '@/lib/env';
import { languageAlternates } from '@/i18n/alternates';

// La jauge de progression doit rester à jour — pas une page figée pendant une
// heure comme le reste du catalogue (voir revalidate = 3600 ailleurs).
export const revalidate = 60;

// Page construite mais pas encore publiée (demande de Tom, contenu du livre
// et chiffres pas encore définitifs). Voir src/lib/book-preorder/flags.ts.
const PAGE_DISABLED = BOOK_PREORDER_PAGE_DISABLED;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bookPreorder' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { languages: languageAlternates('/precommande-livre') },
    robots: { index: false, follow: false },
  };
}

export default async function BookPreorderPage() {
  if (PAGE_DISABLED) notFound();

  const t = await getTranslations('bookPreorder');
  const checkoutEnabled = isCheckoutEnabled();
  const [tiers, progress] = await Promise.all([getPublishedTiers(), getBookPreorderProgress()]);

  return (
    <div className="pt-32 pb-28 sm:pt-40">
      <Container width="prose">
        <Reveal>
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1 className="mt-6 font-display text-5xl leading-[1.02] font-light sm:text-6xl">
            {t('title')}
          </h1>
        </Reveal>

        <Reveal delay={90} className="mt-10">
          <Prose>
            <p>
              <mark>{t('storyPlaceholder')}</mark>
            </p>
          </Prose>
        </Reveal>

        <Reveal delay={120} className="mt-16">
          <FundingProgress
            count={progress.bookUnitsTotal}
            goal={BOOK_PREORDER_GOAL_COUNT}
            pledgesCount={progress.pledgesCount}
          />
        </Reveal>

        <Reveal delay={150} className="mt-10">
          <BudgetBreakdown />
        </Reveal>
      </Container>

      <Container width="wide" className="mt-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <Reveal key={tier.id} delay={index * 60} className="h-full">
              <TierCard tier={tier} checkoutEnabled={checkoutEnabled} />
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
