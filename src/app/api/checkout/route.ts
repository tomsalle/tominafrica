import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
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
  if (!isCheckoutEnabled()) {
    return NextResponse.json(
      { error: "Le paiement en ligne n'est pas encore activé sur ce site." },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const parsed = checkoutRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Panier invalide.' },
      { status: 400 },
    );
  }

  const { items } = parsed.data;

  // --- Rechargement autoritatif depuis la base ------------------------------
  const options = await getPrintOptionsByIds(items.map((item) => item.optionId));

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const metadataItems: { sku: string; qty: number; optionId: string }[] = [];

  for (const item of items) {
    const option = options.get(item.optionId);

    if (!option || !option.available) {
      return NextResponse.json(
        { error: 'Un des tirages de votre panier n’est plus disponible.' },
        { status: 409 },
      );
    }

    const availability = formatAvailability(option.edition_size, option.editions_sold);

    if (availability.soldOut) {
      return NextResponse.json(
        { error: `« ${option.photo.title} — ${option.label} » est épuisé.` },
        { status: 409 },
      );
    }

    if (availability.remaining !== null && item.quantity > availability.remaining) {
      return NextResponse.json(
        {
          error: `Il ne reste que ${availability.remaining} exemplaire(s) de « ${option.photo.title} — ${option.label} ».`,
        },
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
          images: [photoAbsoluteSrc(option.photo.image_path)],
          metadata: { sku: option.sku, photo_slug: option.photo.slug },
        },
      },
    });

    metadataItems.push({ sku: option.sku, qty: item.quantity, optionId: option.id });
  }

  // --- Création de la session ----------------------------------------------
  try {
    const stripe = getStripe();
    const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      locale: 'fr',
      billing_address_collection: 'required',
      shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
      shipping_options: SHIPPING_OPTIONS,
      phone_number_collection: { enabled: true },
      success_url: `${siteUrl}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/panier`,
      // Le webhook reconstitue la commande à partir de ces métadonnées.
      // (Limite Stripe : 500 caractères par valeur — d'où le format compact.)
      metadata: {
        items: JSON.stringify(metadataItems),
      },
    });

    if (!session.url) {
      throw new Error('Stripe n’a pas renvoyé d’URL de paiement.');
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[checkout] création de session impossible', error);
    return NextResponse.json(
      { error: 'Le paiement est momentanément indisponible. Réessayez dans un instant.' },
      { status: 502 },
    );
  }
}
