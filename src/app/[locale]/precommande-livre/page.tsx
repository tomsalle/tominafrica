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

  return (
    <div className="pb-28">
      {/* Hero */}
      <div className="pt-32 sm:pt-40">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-[1fr_22rem]">
            <Reveal>
              <p className="eyebrow">{t('hero.eyebrow')}</p>
              <h1 className="mt-6 font-display text-5xl leading-[1.02] font-light sm:text-6xl lg:text-7xl">
                {t('hero.title')}
              </h1>
            </Reveal>

            <Reveal delay={90} className="lg:row-span-2">
              <div className="lg:sticky lg:top-32">
                <HeroPanel
                  count={progress.bookUnitsTotal}
                  goal={BOOK_PREORDER_GOAL_COUNT}
                  pledgesCount={progress.pledgesCount}
                  minPriceCents={minPriceCents}
                />
              </div>
            </Reveal>

            <Reveal delay={60}>
              <div className="relative aspect-3/4 w-full max-w-md overflow-hidden bg-ink-soft">
                <Image
                  src="/placeholders/tsingy.svg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 28rem"
                  className="object-cover opacity-70"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </div>

      <StickyTabNav />

      {/* Le livre */}
      <div id="le-livre" className="scroll-mt-32 pt-20">
        <Container width="wide">
          <div className="grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-16">
              <Reveal>
                <p className="eyebrow">{t('about.title')}</p>
                <div className="mt-5">
                  <Prose>
                    <p>
                      <mark>{t('about.p1')}</mark>
                    </p>
                  </Prose>
                </div>
              </Reveal>

              <Reveal>
                <p className="eyebrow">{t('why.title')}</p>
                <div className="mt-5">
                  <Prose>
                    <p>
                      <mark>{t('why.p1')}</mark>
                    </p>
                  </Prose>
                </div>
              </Reveal>

              <Reveal>
                <p className="eyebrow">{t('specs.title')}</p>
                <ul className="mt-5 space-y-2 text-sm text-paper-dim">
                  {(['format', 'pages', 'paper', 'binding', 'cover', 'printRun'] as const).map((key) => (
                    <li key={key}>
                      {key === 'printRun' ? (
                        t(`specs.${key}`)
                      ) : (
                        <mark className="bg-accent/15 px-1.5 py-0.5 text-accent">{t(`specs.${key}`)}</mark>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-paper-dim">{t('specs.note')}</p>
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

            <div className="hidden lg:block" />
          </div>
        </Container>
      </div>

      {/* Contreparties */}
      <div id="contreparties" className="scroll-mt-32 pt-24">
        <Container width="wide">
          <Reveal>
            <p className="eyebrow">{t('nav.tiers')}</p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-paper-dim">{t('tiersIntro')}</p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-5">
              {rewardTiers.map((tier, index) => (
                <Reveal key={tier.id} delay={index * 50}>
                  <TierCard tier={tier} checkoutEnabled={checkoutEnabled} />
                </Reveal>
              ))}

              {donationTier ? (
                <Reveal delay={rewardTiers.length * 50}>
                  <TierCard tier={donationTier} checkoutEnabled={checkoutEnabled} />
                </Reveal>
              ) : null}
            </div>

            <Reveal>
              <ShippingInfo />
            </Reveal>
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
