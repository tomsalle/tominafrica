import { getTranslations } from 'next-intl/server';
import { NextResponse } from 'next/server';
import { bookPreorderCheckoutRequestSchema } from '@/lib/book-preorder/types';
import { getPublishedTiers, getTierById } from '@/lib/book-preorder/queries';
import { isEarlyBirdAvailable } from '@/lib/book-preorder/tiers';
import { isCheckoutEnabled, publicEnv } from '@/lib/env';
import { getStripe } from '@/lib/stripe/server';

export const runtime = 'nodejs';

/**
 * Création de la session Stripe Checkout pour une précommande du livre.
 *
 * Même principe que /api/checkout : le corps de la requête ne contient
 * qu'un identifiant de palier et une quantité (ou un montant libre pour le
 * don). Le prix est toujours relu en base ici — jamais fait confiance au
 * client.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    const t = await getTranslations({ locale: 'fr', namespace: 'bookPreorderCheckout' });
    return NextResponse.json({ error: t('invalidRequest') }, { status: 400 });
  }

  const locale =
    typeof payload === 'object' && payload !== null && 'locale' in payload
      ? String((payload as { locale?: unknown }).locale) === 'en'
        ? 'en'
        : 'fr'
      : 'fr';
  const t = await getTranslations({ locale, namespace: 'bookPreorderCheckout' });

  if (!isCheckoutEnabled()) {
    return NextResponse.json({ error: t('serviceDisabled') }, { status: 503 });
  }

  const parsed = bookPreorderCheckoutRequestSchema.safeParse(payload);
  if (!parsed.success) {
    console.error('[book-preorder] validation échouée', parsed.error.issues[0]?.message);
    return NextResponse.json({ error: t('invalidRequest') }, { status: 400 });
  }

  const { tierId, quantity, customAmountCents, publicName, publicMessage } = parsed.data;

  // --- Rechargement autoritatif depuis la base ------------------------------
  const tier = await getTierById(tierId);

  if (!tier) {
    return NextResponse.json({ error: t('tierUnavailable') }, { status: 409 });
  }

  // « Le livre » ne se vend qu'une fois l'early bird épuisé (même règle que la page).
  if (tier.slug === 'livre' && isEarlyBirdAvailable(await getPublishedTiers())) {
    return NextResponse.json({ error: t('tierUnavailable') }, { status: 409 });
  }

  if (tier.is_donation) {
    if (!customAmountCents || customAmountCents < tier.price_cents) {
      return NextResponse.json({ error: t('invalidDonationAmount') }, { status: 400 });
    }
  } else {
    if (customAmountCents !== undefined) {
      return NextResponse.json({ error: t('invalidRequest') }, { status: 400 });
    }

    if (tier.stock_limit !== null && tier.claimed_count + quantity > tier.stock_limit) {
      const remaining = Math.max(0, tier.stock_limit - tier.claimed_count);
      return remaining === 0
        ? NextResponse.json({ error: t('tierSoldOut', { tier: tier.name }) }, { status: 409 })
        : NextResponse.json(
            { error: t('tierLowStock', { remaining, tier: tier.name }) },
            { status: 409 },
          );
    }
  }

  const effectiveQuantity = tier.is_donation ? 1 : quantity;
  const unitAmount = tier.is_donation ? customAmountCents! : tier.price_cents;

  // --- Création de la session ----------------------------------------------
  try {
    const stripe = getStripe();
    const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL;
    const localePath = locale === 'en' ? '/en' : '';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: effectiveQuantity,
          price_data: {
            currency: 'eur',
            unit_amount: unitAmount,
            product_data: {
              name: tier.name,
              description: tier.description ?? undefined,
              metadata: { tier_slug: tier.slug },
            },
          },
        },
      ],
      locale: locale === 'en' ? 'en' : 'fr',
      billing_address_collection: 'required',
      // Aucun frais de port sur le site : le livre se récupère à l'exposition
      // (gratuit) ou part via Vinted (l'acheteur paie l'envoi sur l'app). Le
      // choix est demandé ici et enregistré par le webhook. Rien pour le don.
      ...(tier.is_donation
        ? {}
        : {
            phone_number_collection: { enabled: true },
            custom_fields: [
              {
                key: 'livraison',
                label: { type: 'custom' as const, custom: t('deliveryFieldLabel') },
                type: 'dropdown' as const,
                dropdown: {
                  options: [
                    { label: t('deliveryPickup'), value: 'retraitexposition' },
                    { label: t('deliveryVinted'), value: 'envoivinted' },
                  ],
                },
              },
            ],
          }),
      success_url: `${siteUrl}${localePath}/precommande-livre/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${localePath}/precommande-livre/formules`,
      // Seul discriminant lu par le webhook — jamais posé par /api/checkout,
      // donc sans effet sur les commandes de tirages.
      metadata: {
        type: 'book_preorder',
        tierId: tier.id,
        tierSlug: tier.slug,
        quantity: String(effectiveQuantity),
        isDonation: String(tier.is_donation),
        // Relus par le webhook, qui les enregistre sur la précommande payée.
        // (Stripe limite chaque valeur à 500 caractères ; le schéma plafonne à 280.)
        ...(publicName ? { publicName } : {}),
        ...(publicMessage ? { publicMessage } : {}),
      },
    });

    if (!session.url) {
      throw new Error('Stripe n’a pas renvoyé d’URL de paiement.');
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[book-preorder] création de session impossible', error);
    return NextResponse.json({ error: t('stripeUnavailable') }, { status: 502 });
  }
}
