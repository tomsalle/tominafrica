import { getTranslations } from 'next-intl/server';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import {
  EXPO_PROMO_PERCENT,
  isExpoPromoCodeRedeemable,
  normalizeExpoPromoCode,
} from '@/lib/book-preorder/expo-promo';
import { checkoutRequestSchema } from '@/lib/cart/types';
import { isCheckoutEnabled, publicEnv } from '@/lib/env';
import { formatAvailability } from '@/lib/format';
import { photoAbsoluteSrc } from '@/lib/images';
import { getPrintOptionsByIds } from '@/lib/queries/photos';
import { getStripe, SHIPPING_COUNTRIES, SHIPPING_OPTIONS } from '@/lib/stripe/server';

export const runtime = 'nodejs';

/**
 * Création de la session Stripe Checkout.
 *
 * Le corps de la requête ne contient que des identifiants d'option et des
 * quantités. TOUT le reste — prix, libellé, disponibilité — est relu en base
 * ici. Un panier trafiqué dans le navigateur ne peut donc pas modifier le
 * montant réellement facturé.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    const t = await getTranslations({ locale: 'fr', namespace: 'checkout' });
    return NextResponse.json({ error: t('invalidRequest') }, { status: 400 });
  }

  const locale =
    typeof payload === 'object' && payload !== null && 'locale' in payload
      ? String((payload as { locale?: unknown }).locale) === 'en'
        ? 'en'
        : 'fr'
      : 'fr';
  const t = await getTranslations({ locale, namespace: 'checkout' });

  if (!isCheckoutEnabled()) {
    return NextResponse.json({ error: t('serviceDisabled') }, { status: 503 });
  }

  const parsed = checkoutRequestSchema.safeParse(payload);
  if (!parsed.success) {
    console.error('[checkout] validation échouée', parsed.error.issues[0]?.message);
    return NextResponse.json({ error: t('invalidCart') }, { status: 400 });
  }

  const { items } = parsed.data;
  const promoCode = parsed.data.promoCode ? normalizeExpoPromoCode(parsed.data.promoCode) : null;

  if (promoCode && !(await isExpoPromoCodeRedeemable(promoCode))) {
    return NextResponse.json({ error: t('promoInvalid'), field: 'promoCode' }, { status: 400 });
  }

  // --- Rechargement autoritatif depuis la base ------------------------------
  const options = await getPrintOptionsByIds(items.map((item) => item.optionId));

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const metadataItems: { sku: string; qty: number; optionId: string }[] = [];
  let mostExpensiveUnitCents = 0;

  for (const item of items) {
    const option = options.get(item.optionId);

    if (!option || !option.available) {
      return NextResponse.json({ error: t('itemUnavailable') }, { status: 409 });
    }

    const availability = formatAvailability(option.edition_size, option.editions_sold, locale);
    const itemLabel = `${option.photo.title} — ${option.label}`;

    if (availability.soldOut) {
      return NextResponse.json({ error: t('itemSoldOut', { item: itemLabel }) }, { status: 409 });
    }

    if (availability.remaining !== null && item.quantity > availability.remaining) {
      return NextResponse.json(
        { error: t('itemLowStock', { remaining: availability.remaining, item: itemLabel }) },
        { status: 409 },
      );
    }

    lineItems.push({
      quantity: item.quantity,
      price_data: {
        currency: 'eur',
        unit_amount: option.price_cents,
        product_data: {
          name: `${option.photo.title} — ${option.label}`,
          description: option.paper ? `Tirage sur ${option.paper}` : undefined,
          images: [photoAbsoluteSrc(option.photo.image_path, option.photo.image_width)],
          metadata: { sku: option.sku, photo_slug: option.photo.slug },
        },
      },
    });

    metadataItems.push({ sku: option.sku, qty: item.quantity, optionId: option.id });
    mostExpensiveUnitCents = Math.max(mostExpensiveUnitCents, option.price_cents);
  }

  // --- Création de la session ----------------------------------------------
  try {
    const stripe = getStripe();
    const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL;
    const localePath = locale === 'en' ? '/en' : '';

    // Code offert avec le livre : -10 % sur UN tirage (le plus cher du panier),
    // d'où une remise en montant fixe plutôt qu'un pourcentage sur tout le panier.
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (promoCode) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round((mostExpensiveUnitCents * EXPO_PROMO_PERCENT) / 100),
        currency: 'eur',
        duration: 'once',
        max_redemptions: 1,
        name: locale === 'en' ? `Book gift: ${EXPO_PROMO_PERCENT}% off a print` : `Cadeau du livre : -${EXPO_PROMO_PERCENT} % sur un tirage`,
        metadata: { expoPromoCode: promoCode },
      });
      discounts.push({ coupon: coupon.id });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      locale: locale === 'en' ? 'en' : 'fr',
      billing_address_collection: 'required',
      shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
      shipping_options: SHIPPING_OPTIONS,
      phone_number_collection: { enabled: true },
      ...(discounts.length > 0 ? { discounts } : {}),
      success_url: `${siteUrl}${localePath}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${localePath}/panier`,
      // Le webhook reconstitue la commande à partir de ces métadonnées.
      // (Limite Stripe : 500 caractères par valeur — d'où le format compact.)
      metadata: {
        items: JSON.stringify(metadataItems),
        ...(promoCode ? { expoPromoCode: promoCode } : {}),
      },
    });

    if (!session.url) {
      throw new Error('Stripe n’a pas renvoyé d’URL de paiement.');
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[checkout] création de session impossible', error);
    return NextResponse.json({ error: t('stripeUnavailable') }, { status: 502 });
  }
}
