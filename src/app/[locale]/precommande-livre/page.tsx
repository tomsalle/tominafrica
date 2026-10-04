import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AuthorBio } from '@/components/book-preorder/AuthorBio';
import { BudgetBreakdown } from '@/components/book-preorder/BudgetBreakdown';
import { Faq } from '@/components/book-preorder/Faq';
import { HeroPanel } from '@/components/book-preorder/HeroPanel';
import { ShippingInfo } from '@/components/book-preorder/ShippingInfo';
import { StickyTabNav } from '@/components/book-preorder/StickyTabNav';
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

// Page accessible par lien direct uniquement (voir src/lib/book-preorder/flags.ts).
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

  const rewardTiers = tiers.filter((tier) => !tier.is_donation);
  const donationTier = tiers.find((tier) => tier.is_donation);
  const minPriceCents = rewardTiers.length > 0 ? Math.min(...rewardTiers.map((tier) => tier.price_cents)) : 0;

  // Contrepartie mise en avant, sur le modèle de la carte « Contrepartie à la
  // une » d'Ulule — le livre seul plutôt que l'early bird, souvent déjà épuisé.
  const featuredTier = rewardTiers.find((tier) => tier.slug === 'livre') ?? rewardTiers[0];
  const otherTiers = rewardTiers.filter((tier) => tier.id !== featuredTier?.id);

  return (
    <div className="pb-28">
      {/* Bandeau de couverture */}
      <div className="relative mt-16 h-[26vh] min-h-[10rem] w-full overflow-hidden sm:mt-20">
        <Image
          src="/precommande-livre/bandeau-voyage.avif"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/10 to-transparent" />
      </div>

      <StickyTabNav />

      {/* Hero + Le livre + Contreparties : une seule grille, colonne de
          droite collante en continu (jauge puis contreparties), comme sur
          Ulule — pas une section « Contreparties » séparée plus bas. */}
      <div id="le-livre" className="scroll-mt-32 pt-16">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-[1fr_22rem]">
            <div>
              <Reveal>
                <p className="eyebrow">{t('hero.eyebrow')}</p>
                <h1 className="mt-6 font-display text-5xl leading-[1.02] font-light sm:text-6xl lg:text-7xl">
                  {t('hero.title')}
                </h1>
                <p className="mt-4 text-lg text-paper-dim">{t('hero.subtitle')}</p>
              </Reveal>

              <Reveal delay={60} className="mt-10">
                <div className="relative aspect-square w-full max-w-md overflow-hidden bg-ink-soft">
                  <Image
                    src="/precommande-livre/livre-ouvert.avif"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 28rem"
                    className="object-cover"
                  />
                </div>
              </Reveal>

              <div className="mt-16 space-y-16">
                <Reveal>
                  <p className="eyebrow">{t('about.title')}</p>
                  <div className="mt-5">
                    <Prose>
                      <p className="font-medium text-paper">{t('about.lead')}</p>
                      <p>{t('about.p1')}</p>
                      <p>{t('about.p2')}</p>
                      <p>{t('about.p3')}</p>
                      <p>{t('about.p4')}</p>
                    </Prose>
                  </div>
                </Reveal>

                <Reveal>
                  <p className="eyebrow">{t('why.title')}</p>
                  <div className="mt-5">
                    <Prose>
                      <p>{t('why.p1')}</p>
                    </Prose>
                  </div>
                </Reveal>

                <Reveal>
                  <p className="eyebrow">{t('specs.title')}</p>
                  <ul className="mt-5 space-y-2 text-sm text-paper-dim">
                    {(['pages', 'format', 'printRun', 'delivery'] as const).map((key) => (
                      <li key={key}>{t(`specs.${key}`)}</li>
                    ))}
                  </ul>
                </Reveal>

                <Reveal>
                  <BudgetBreakdown />
                </Reveal>

                <Reveal>
                  <AuthorBio />
                </Reveal>

                <Reveal>
                  <p className="eyebrow">{t('follow.title')}</p>
                  <p className="mt-3 text-sm text-paper-dim">
                    <mark className="bg-accent/15 px-1.5 py-0.5 text-accent">{t('follow.placeholder')}</mark>
                  </p>
                </Reveal>
              </div>
            </div>

            {/* Colonne latérale collante : jauge, puis contreparties — ne
                change jamais de colonne pendant que la narration défile. */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <Reveal delay={90}>
                <HeroPanel
                  count={progress.bookUnitsTotal}
                  goal={BOOK_PREORDER_GOAL_COUNT}
                  pledgesCount={progress.pledgesCount}
                  minPriceCents={minPriceCents}
                />
              </Reveal>

              <div id="contreparties" className="scroll-mt-32">
                <Reveal delay={120} className="mt-10">
                  <p className="eyebrow">{t('nav.tiers')}</p>
                  <p className="mt-3 text-sm leading-relaxed text-paper-dim">{t('tiersIntro')}</p>
                </Reveal>

                {featuredTier ? (
                  <Reveal delay={150} className="mt-6">
                    <TierCard tier={featuredTier} checkoutEnabled={checkoutEnabled} featured />
                  </Reveal>
                ) : null}

                {otherTiers.length > 0 || donationTier ? (
                  <Reveal delay={180} className="mt-8">
                    <p className="eyebrow">{t('tierCommon.allTiers')}</p>
                    <div className="mt-4 space-y-4">
                      {otherTiers.map((tier) => (
                        <TierCard key={tier.id} tier={tier} checkoutEnabled={checkoutEnabled} />
                      ))}
                      {donationTier ? (
                        <TierCard tier={donationTier} checkoutEnabled={checkoutEnabled} />
                      ) : null}
                    </div>
                  </Reveal>
                ) : null}
              </div>

              <Reveal delay={210} className="mt-8">
                <ShippingInfo />
              </Reveal>
            </div>
          </div>
        </Container>
      </div>

      {/* FAQ */}
      <div id="faq" className="scroll-mt-32 pt-24">
        <Container width="prose">
          <Reveal>
            <Faq />
          </Reveal>

          <Reveal delay={60} className="mt-16 border-t border-ink-line pt-10">
            <p className="eyebrow">{t('howItWorks.title')}</p>
            <p className="mt-4 text-sm leading-relaxed text-paper-dim">{t('howItWorks.p1')}</p>
            <p className="mt-3 text-sm leading-relaxed text-paper-dim">{t('howItWorks.p2')}</p>
          </Reveal>
        </Container>
      </div>
    </div>
  );
}
