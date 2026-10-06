import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { BudgetBreakdown } from '@/components/book-preorder/BudgetBreakdown';
import { ContributionsList } from '@/components/book-preorder/ContributionsList';
import { Faq } from '@/components/book-preorder/Faq';
import { HeroPanel } from '@/components/book-preorder/HeroPanel';
import { PreorderSteps } from '@/components/book-preorder/PreorderSteps';
import { ShareButton } from '@/components/book-preorder/ShareButton';
import { ShippingInfo } from '@/components/book-preorder/ShippingInfo';
import { StickyTabNav } from '@/components/book-preorder/StickyTabNav';
import { TierCard } from '@/components/book-preorder/TierCard';
import { TierPledgeForm } from '@/components/book-preorder/TierPledgeForm';
import { Container } from '@/components/ui/Container';
import { HandwrittenTitle } from '@/components/ui/HandwrittenTitle';
import { Prose } from '@/components/ui/Prose';
import { getPreorderStepState } from '@/lib/book-preorder/config';
import { BOOK_PREORDER_PAGE_DISABLED } from '@/lib/book-preorder/flags';
import { getBookPreorderProgress, getPublicContributions, getPublishedTiers } from '@/lib/book-preorder/queries';
import { isCheckoutEnabled } from '@/lib/env';
import { languageAlternates } from '@/i18n/alternates';

// La jauge doit rester à jour — pas une page figée une heure comme le catalogue.
export const revalidate = 60;

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

/**
 * Page de précommande calquée, bloc pour bloc, sur une collecte Ulule
 * (fr.ulule.com/lueur) : bandeau, carte d'en-tête (titre, visuel, compteur,
 * porteur), onglets collants, puis la collecte à gauche et les contreparties
 * à droite. Seules la palette et les polices sont celles du site.
 */
export default async function BookPreorderPage() {
  if (BOOK_PREORDER_PAGE_DISABLED) notFound();

  const t = await getTranslations('bookPreorder');
  const photos = await getTranslations('notreAventure');
  const checkoutEnabled = isCheckoutEnabled();
  const [tiers, progress, contributions] = await Promise.all([
    getPublishedTiers(),
    getBookPreorderProgress(),
    getPublicContributions(),
  ]);

  const rewardTiers = tiers.filter((tier) => !tier.is_donation);
  const donationTier = tiers.find((tier) => tier.is_donation);
  const minPriceCents = rewardTiers.length > 0 ? Math.min(...rewardTiers.map((tier) => tier.price_cents)) : 0;
  const stepState = getPreorderStepState(progress.bookUnitsTotal);
  const featuredTier = rewardTiers.find((tier) => tier.slug === 'livre') ?? rewardTiers[0];
  const otherTiers = rewardTiers.filter((tier) => tier.id !== featuredTier?.id);

  return (
    <div className="pb-28">
      {/* En-tête : bandeau de couverture + carte qui le chevauche */}
      <div className="relative pt-16 pb-10 sm:pt-20">
        <div className="absolute inset-x-0 top-16 h-72 overflow-hidden sm:top-20 sm:h-96">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            poster="/videos/namibie-hero-poster.jpg"
          >
            <source src="/videos/namibie-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-linear-to-b from-ink/10 via-ink/30 to-ink" />
        </div>

        <Container className="relative pt-40 sm:pt-56">
          <div className="border border-ink-line bg-ink-soft px-5 py-8 sm:px-10 sm:py-10">
            <header className="text-center">
              <h1>
                <HandwrittenTitle
                  text={t('hero.title')}
                  priority
                  className="mx-auto w-[min(80vw,20rem)] sm:w-[30rem] lg:w-[34rem]"
                />
              </h1>
              <p className="mt-3 text-base text-paper-dim sm:text-lg">{t('hero.subtitle')}</p>
            </header>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-[1fr_20rem] lg:gap-12">
              <div className="relative aspect-[4/3] overflow-hidden bg-ink sm:aspect-[16/10]">
                <Image
                  src="/precommande-livre/livre-ouvert.avif"
                  alt={t('hero.title')}
                  fill
                  sizes="(max-width: 1024px) 100vw, 44rem"
                  priority
                  className="object-cover object-[50%_60%]"
                />
              </div>

              <HeroPanel
                count={progress.bookUnitsTotal}
                stepState={stepState}
                pledgesCount={progress.pledgesCount}
                minPriceCents={minPriceCents}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <ShareButton />
            </div>
          </div>
        </Container>
      </div>

      <StickyTabNav />

      <Container className="pt-12">
        <div className="grid grid-cols-1 gap-x-14 gap-y-20 lg:grid-cols-[1fr_22rem]">
          {/* Collecte */}
          <div id="le-livre" className="min-w-0 scroll-mt-36 space-y-20">
            <section>
              <h2 className="font-display text-3xl font-light text-paper sm:text-4xl">{t('about.title')}</h2>
              <p className="mt-6 text-lg font-medium text-paper">{t('about.lead')}</p>

              <div className="mt-6">
                <Prose>
                  <p>{t('about.p1')}</p>
                  <p>{t('about.p2')}</p>
                </Prose>
              </div>

              <StoryPhoto src="/notre-aventure/vehicule-canyon.jpg" alt={photos('canyonPhotoAlt')} width={2000} height={1333} />

              <Prose>
                <p>{t('about.p3')}</p>
                <p>{t('about.p4')}</p>
              </Prose>

              <StoryPhoto src="/notre-aventure/rencontre-chef-village.jpg" alt={photos('villageChiefPhotoAlt')} width={2000} height={1125} />

              <h3 className="text-lg font-medium text-paper">{t('why.title')}</h3>
              <div className="mt-4">
                <Prose>
                  <p>{t('why.p1')}</p>
                </Prose>
              </div>

              <StoryPhoto src="/notre-aventure/traversee-riviere.jpg" alt={photos('riverPhotoAlt')} width={2000} height={1292} />

              <h3 className="text-lg font-medium text-paper">{t('specs.title')}</h3>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-paper-dim">
                {(['pages', 'format', 'printRun', 'delivery'] as const).map((key) => (
                  <SpecLine key={key} text={t(`specs.${key}`, { count: stepState.target })} />
                ))}
              </ul>
            </section>

            <BudgetBreakdown bookCount={stepState.target} />

            <PreorderSteps count={progress.bookUnitsTotal} stepState={stepState} />
          </div>

          {/* Contreparties */}
          <aside id="contreparties" className="scroll-mt-36">
            <h2 className="font-display text-3xl font-light text-paper">{t('tiersTitle')}</h2>
            <p className="mt-2 text-sm leading-relaxed text-paper-dim">{t('tiersIntro')}</p>

            {featuredTier ? (
              <div className="mt-6">
                <TierCard tier={featuredTier} checkoutEnabled={checkoutEnabled} featured />
              </div>
            ) : null}

            {otherTiers.length > 0 ? (
              <>
                <p className="mt-10 text-center text-sm font-medium text-paper">{t('tierCommon.allTiers')}</p>
                <div className="mt-4 space-y-6">
                  {otherTiers.map((tier) => (
                    <TierCard key={tier.id} tier={tier} checkoutEnabled={checkoutEnabled} />
                  ))}
                </div>
              </>
            ) : null}

            {donationTier ? (
              <div className="mt-6 border border-ink-line bg-ink-soft p-5">
                <h3 className="text-lg font-medium text-paper">{t('tierCommon.donationTitle')}</h3>
                <p className="mt-1 mb-4 text-sm text-paper-dim">{t('tiers.don.description')}</p>
                <TierPledgeForm tier={donationTier} checkoutEnabled={checkoutEnabled} soldOut={false} />
              </div>
            ) : null}

            <div className="mt-10">
              <ShippingInfo />
            </div>

            <div className="mt-10">
              <ContributionsList contributions={contributions} total={progress.pledgesCount} />
            </div>
          </aside>
        </div>
      </Container>

      {/* FAQ */}
      <div id="faq" className="scroll-mt-36 pt-24">
        <Container>
          <div className="max-w-[46rem]">
            <Faq />

            <div className="mt-16 border-t border-ink-line pt-10">
              <h3 className="text-lg font-medium text-paper">{t('howItWorks.title')}</h3>
              <p className="mt-4 text-sm leading-relaxed text-paper-dim">{t('howItWorks.p1')}</p>
              <p className="mt-3 text-sm leading-relaxed text-paper-dim">{t('howItWorks.p2')}</p>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

/** Grande photo entre deux paragraphes, comme les visuels intercalés d'Ulule. */
function StoryPhoto({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  return (
    <div className="my-10 bg-ink-soft">
      <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 1024px) 44rem, 100vw" className="h-auto w-full" />
    </div>
  );
}

/** « Format : … » → libellé en gras, comme les listes de caractéristiques d'Ulule. */
function SpecLine({ text }: { text: string }) {
  const separator = text.indexOf(' : ') >= 0 ? ' : ' : text.indexOf(': ') >= 0 ? ': ' : null;
  if (!separator) {
    return <li>• {text}</li>;
  }
  const [label, ...rest] = text.split(separator);
  return (
    <li>
      • <strong className="font-medium text-paper">{label}</strong>
      {separator}
      {rest.join(separator)}
    </li>
  );
}
