import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { BookOfferPanel, FORMULAS_PATH } from '@/components/book-preorder/BookOfferPanel';
import { BookSlideshow } from '@/components/book-preorder/BookSlideshow';
import { BudgetBreakdown } from '@/components/book-preorder/BudgetBreakdown';
import { ContributionsList } from '@/components/book-preorder/ContributionsList';
import { Faq } from '@/components/book-preorder/Faq';
import { PreorderSteps } from '@/components/book-preorder/PreorderSteps';
import { ShareButton } from '@/components/book-preorder/ShareButton';
import { ShippingInfo } from '@/components/book-preorder/ShippingInfo';
import { SimulationBanner } from '@/components/book-preorder/SimulationBanner';
import { StickyTabNav } from '@/components/book-preorder/StickyTabNav';
import { Container } from '@/components/ui/Container';
import { HandwrittenTitle } from '@/components/ui/HandwrittenTitle';
import { Prose } from '@/components/ui/Prose';
import { Link } from '@/i18n/navigation';
import { BOOK_PREORDER_PAGE_DISABLED } from '@/lib/book-preorder/flags';
import { loadPreorderData } from '@/lib/book-preorder/page-data';
import { formatPrice } from '@/lib/format';
import { languageAlternates } from '@/i18n/alternates';

// La jauge doit rester à jour — pas une page figée une heure comme le catalogue.
export const revalidate = 60;

const BOOK_IMAGE = '/precommande-livre/formules/livre.avif';

// Extraits du livre (maquettes provisoires), dans l'ordre des pages.
const BOOK_SPREADS = [
  { file: '01-pages-04-05', key: 'p0405', pages: '4 — 5' },
  { file: '02-pages-10-11', key: 'p1011', pages: '10 — 11' },
  { file: '03-portrait-caisses', key: 'portrait', pages: null },
  { file: '04-pages-62-63', key: 'p6263', pages: '62 — 63' },
  { file: '05-pages-64-65', key: 'p6465', pages: '64 — 65' },
  { file: '06-pages-74-75', key: 'p7475', pages: '74 — 75' },
] as const;

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
 * Page 1 de la précommande : le livre. Un seul article mis en avant, visible
 * sans défiler, avec un seul bouton qui mène au choix de la formule (page 2).
 * Le reste de la page raconte le livre.
 */
export default async function BookPreorderPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (BOOK_PREORDER_PAGE_DISABLED) notFound();

  // Simulation locale uniquement : en production, l'URL n'est jamais lue
  // (la page reste mise en cache).
  const devParams = process.env.NODE_ENV === 'development' ? await searchParams : {};
  const { simulated, progress, contributions, stepState, offer, closed, daysLeft } = await loadPreorderData(
    devParams.simulation,
    devParams.cloture,
  );

  const t = await getTranslations('bookPreorder');
  const photos = await getTranslations('notreAventure');
  const ctaHref = simulated !== null ? `${FORMULAS_PATH}?simulation=${simulated}` : FORMULAS_PATH;

  // Bouton repris à la fin des sections longues (absent une fois la précommande close).
  const inlineCta = closed ? null : (
    <div className="mt-10">
      <Link
        href={ctaHref}
        className="inline-flex min-h-12 items-center justify-center bg-brand px-8 text-xs font-medium tracking-[0.24em] text-paper uppercase transition-[background-color,transform] duration-200 hover:bg-brand-hover active:scale-[0.98]"
      >
        {t('product.cta')}
      </Link>
    </div>
  );

  return (
    <div className="pb-28">
      {simulated !== null ? <SimulationBanner count={simulated} /> : null}

      {/* En-tête : bandeau + carte qui le chevauche, avec l'article et son bouton. */}
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

        <Container className="relative pt-16 sm:pt-20">
          <div className="border border-ink-line bg-ink-soft px-5 py-7 sm:px-10 sm:py-8">
            <header className="text-center">
              <h1>
                <HandwrittenTitle
                  text={t('hero.title')}
                  priority
                  className="mx-auto w-[min(72vw,18rem)] sm:w-[24rem] lg:w-[26rem]"
                />
              </h1>
              <p className="mt-2 text-base text-paper-dim sm:text-lg">{t('hero.subtitle')}</p>
            </header>

            <div className="mt-6 grid grid-cols-1 items-start gap-6 sm:mt-8 lg:grid-cols-[1fr_22rem] lg:gap-12">
              <Link
                href={ctaHref}
                className="relative block h-44 overflow-hidden bg-white sm:h-72 lg:h-[23rem]"
                aria-label={t('product.cta')}
              >
                <Image
                  src={BOOK_IMAGE}
                  alt={t('product.imageAlt')}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 44rem"
                  className="object-contain"
                />
              </Link>

              <BookOfferPanel
                offer={offer}
                count={progress.bookUnitsTotal}
                stepState={stepState}
                ordersCount={progress.pledgesCount}
                closed={closed}
                daysLeft={daysLeft}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <ShareButton />
            </div>
          </div>
        </Container>
      </div>

      <StickyTabNav
        ctaHref={closed ? null : ctaHref}
        priceLabel={offer && !closed ? `${t('product.name')} · ${formatPrice(offer.priceCents)}` : null}
      />

      <Container className="pt-12">
        <div className="grid grid-cols-1 gap-x-14 gap-y-20 lg:grid-cols-[1fr_18rem]">
          <div id="le-livre" className="min-w-0 scroll-mt-36 space-y-20">
            {/* 1. L'essentiel, pour ceux qui ne liront pas plus loin. */}
            <section>
              <h2 className="font-display text-3xl font-light text-paper sm:text-4xl">{t('specs.title')}</h2>
              <ul className="mt-6 space-y-3 text-base leading-relaxed text-paper-dim">
                {(['pages', 'format', 'printRun', 'deadline', 'delivery'] as const).map((key) => (
                  <SpecLine key={key} text={t(`specs.${key}`, { count: stepState.target })} />
                ))}
              </ul>

              {/* Les pages du livre défilent seules, comme un GIF. */}
              <figure className="mt-10">
                <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                  <BookSlideshow
                    slides={[
                      { src: '/precommande-livre/livre-ouvert.avif', alt: t('slideshow.cover'), label: t('slideshow.coverLabel') },
                      ...BOOK_SPREADS.map((spread) => ({
                        src: `/precommande-livre/extraits/${spread.file}.avif`,
                        alt: t(`slideshow.spreads.${spread.key}`),
                        label: spread.pages ? t('slideshow.pages', { pages: spread.pages }) : t('slideshow.extract'),
                      })),
                    ]}
                  />
                </div>
                <figcaption className="mt-3 text-xs text-paper-faint">{t('slideshow.caption')}</figcaption>
              </figure>
            </section>

            {/* 2. Pourquoi précommander : financer l'impression, et surtout savoir combien imprimer. */}
            <section className="space-y-12">
              <div>
                <h2 className="font-display text-3xl font-light text-paper sm:text-4xl">{t('preorderWhy.title')}</h2>
                <div className="mt-6">
                  <Prose>
                    <p>{t('preorderWhy.p1')}</p>
                    <p>{t('preorderWhy.p2')}</p>
                  </Prose>
                </div>
              </div>

              <BudgetBreakdown bookCount={stepState.target} />

              <PreorderSteps count={progress.bookUnitsTotal} stepState={stepState} />

              {inlineCta}
            </section>

            {/* 3. Les détails, pour ceux qui veulent en savoir plus. */}
            <section>
              <h2 className="font-display text-3xl font-light text-paper sm:text-4xl">{t('about.title')}</h2>
              <p className="mt-6 text-lg font-medium text-paper">{t('about.lead')}</p>

              <div className="mt-6">
                <Prose>
                  <p>{t('about.p1')}</p>
                  <p>{t('about.p2')}</p>
                  <p>{t('about.p3')}</p>
                  <p>{t('about.p4')}</p>
                </Prose>
              </div>

              <StoryPhoto src="/notre-aventure/rencontre-chef-village.jpg" alt={photos('villageChiefPhotoAlt')} width={2000} height={1125} />

              <h3 className="text-lg font-medium text-paper">{t('why.title')}</h3>
              <div className="mt-4">
                <Prose>
                  <p>{t('why.p1')}</p>
                </Prose>
              </div>

              <StoryPhoto src="/notre-aventure/traversee-riviere.jpg" alt={photos('riverPhotoAlt')} width={2000} height={1292} />

              {inlineCta}
            </section>

            <ShippingInfo />

            <ContributionsList contributions={contributions} total={progress.pledgesCount} />
          </div>

          {/* Rappel collant (grand écran) : l'article et son bouton restent à portée. */}
          <aside className="hidden lg:block">
            <div className="sticky top-36 border border-ink-line bg-ink-soft p-5">
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <Image src={BOOK_IMAGE} alt="" fill sizes="18rem" className="object-contain" />
              </div>
              <p className="mt-4 font-display text-2xl font-light text-paper">{t('product.name')}</p>
              {closed ? (
                <p className="mt-3 text-sm text-paper-dim">{t('closed.title')}</p>
              ) : (
                <>
                  {offer ? (
                    <p className="mt-1 flex items-baseline gap-2 text-paper tabular-nums">
                      <span className="text-lg">{formatPrice(offer.priceCents)}</span>
                      {offer.compareAtCents ? (
                        <span className="text-sm text-paper-faint line-through">{formatPrice(offer.compareAtCents)}</span>
                      ) : null}
                    </p>
                  ) : null}
                  <Link
                    href={ctaHref}
                    className="mt-5 flex min-h-12 items-center justify-center bg-brand px-4 text-[0.6875rem] font-medium tracking-[0.2em] text-paper uppercase transition-[background-color,transform] duration-200 hover:bg-brand-hover active:scale-[0.98]"
                  >
                    {t('product.cta')}
                  </Link>
                  <p className="mt-3 text-center text-[0.6875rem] text-paper-faint">{t('product.formulasHint')}</p>
                  <p className="mt-4 border-t border-ink-line pt-3 text-center text-xs text-paper-dim">
                    {t('deadline.daysLeft', { count: daysLeft })} · {t('deadline.until')}
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>
      </Container>

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

/** Grande photo entre deux paragraphes. */
function StoryPhoto({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  return (
    <div className="my-10 bg-ink-soft">
      <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 1024px) 44rem, 100vw" className="h-auto w-full" />
    </div>
  );
}

/** « Format : … » → libellé en gras. */
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
