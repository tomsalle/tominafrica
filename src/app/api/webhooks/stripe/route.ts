import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { serverEnv } from '@/lib/env';
import { getStripe } from '@/lib/stripe/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
// Le corps brut est nécessaire pour vérifier la signature : aucune mise en cache.
export const dynamic = 'force-dynamic';

/**
 * Webhook Stripe.
 *
 * C'est ici, et nulle part ailleurs, que naît une commande. On ne crée jamais
 * de commande depuis la page de succès : le client peut fermer son navigateur
 * avant la redirection, et cette page n'est pas une preuve de paiement.
 *
 * Deux garde-fous :
 *  - la signature est vérifiée avant toute lecture du contenu ;
 *  - `stripe_checkout_session_id` est UNIQUE en base, donc un rejeu (Stripe
 *    réémet les webhooks en cas de non-acquittement) ne peut pas créer de
 *    doublon.
 */
export async function POST(request: Request) {
  const { STRIPE_WEBHOOK_SECRET } = serverEnv();

  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET absente');
    return NextResponse.json({ error: 'Webhook non configuré.' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Signature manquante.' }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('[webhook] signature invalide', error);
    return NextResponse.json({ error: 'Signature invalide.' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'checkout.session.expired':
        await markSessionStatus(event.data.object.id, 'cancelled');
        break;

      case 'charge.refunded': {
        const charge = event.data.object;
        if (typeof charge.payment_intent === 'string') {
          await markPaymentIntentRefunded(charge.payment_intent);
        }
        break;
      }

      default:
        // Les autres événements sont acquittés sans traitement : renvoyer une
        // erreur ferait réessayer Stripe indéfiniment pour rien.
        break;
    }
  } catch (error) {
    console.error(`[webhook] échec du traitement de ${event.type}`, error);
    // 500 → Stripe réessaiera, ce qui est le comportement souhaité en cas
    // d'indisponibilité temporaire de la base.
    return NextResponse.json({ error: 'Traitement impossible.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ---------------------------------------------------------------------------

type MetadataItem = { sku: string; qty: number; optionId: string };

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();

  // Idempotence : si la session est déjà enregistrée, il s'agit d'un rejeu.
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_checkout_session_id', session.id)
    .maybeSingle();

  if (existing) {
    console.info(`[webhook] session ${session.id} déjà traitée, rejeu ignoré`);
    return;
  }

  const email =
    session.customer_details?.email ?? session.customer_email ?? 'inconnu@tominafrica.com';

  // --- Client ---------------------------------------------------------------
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .upsert(
      {
        email,
        full_name: session.customer_details?.name ?? null,
        phone: session.customer_details?.phone ?? null,
        stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
      },
      { onConflict: 'email' },
    )
    .select('id')
    .single();

  if (customerError) throw new Error(`upsert client : ${customerError.message}`);

  // --- Commande -------------------------------------------------------------
  const shipping = session.collected_information?.shipping_details ?? null;
  const address = shipping?.address ?? session.customer_details?.address ?? null;

  const shippingCents = session.total_details?.amount_shipping ?? 0;
  const taxCents = session.total_details?.amount_tax ?? 0;
  const totalCents = session.amount_total ?? 0;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: customer.id,
      email,
      status: 'paid',
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === 'string' ? session.payment_intent : null,
      subtotal_cents: session.amount_subtotal ?? 0,
      shipping_cents: shippingCents,
      tax_cents: taxCents,
      total_cents: totalCents,
      currency: (session.currency ?? 'eur').toUpperCase(),
      shipping_name: shipping?.name ?? session.customer_details?.name ?? null,
      shipping_line1: address?.line1 ?? null,
      shipping_line2: address?.line2 ?? null,
      shipping_postal_code: address?.postal_code ?? null,
      shipping_city: address?.city ?? null,
      shipping_country: address?.country ?? null,
      paid_at: new Date().toISOString(),
    })
    .select('id, order_number')
    .single();

  if (orderError) {
    // Violation d'unicité : deux livraisons du même webhook en parallèle.
    // La commande existe déjà, il n'y a rien à faire.
    if (orderError.code === '23505') {
      console.info(`[webhook] session ${session.id} insérée en parallèle, rejeu ignoré`);
      return;
    }
    throw new Error(`insertion commande : ${orderError.message}`);
  }

  // --- Lignes de commande ---------------------------------------------------
  const metadataItems = parseMetadataItems(session.metadata?.items);

  if (metadataItems.length === 0) {
    console.error(`[webhook] commande ${order.order_number} sans métadonnées d'articles`);
    return;
  }

  const { data: options, error: optionsError } = await supabase
    .from('print_options')
    .select('*, photo:photos!print_options_photo_id_fkey (id, slug, title)')
    .in(
      'id',
      metadataItems.map((item) => item.optionId),
    );

  if (optionsError) throw new Error(`lecture des options : ${optionsError.message}`);

  const optionsById = new Map(
    (options ?? []).map((option) => [
      option.id,
      option as (typeof options)[number] & {
        photo: { id: string; slug: string; title: string } | null;
      },
    ]),
  );

  const rows = metadataItems.flatMap((item) => {
    const option = optionsById.get(item.optionId);
    if (!option) {
      console.error(`[webhook] option ${item.optionId} introuvable pour ${order.order_number}`);
      return [];
    }

    return [
      {
        order_id: order.id,
        print_option_id: option.id,
        photo_id: option.photo?.id ?? null,
        // Snapshot figé : les commandes passées restent exactes même si les
        // prix ou les titres changent plus tard.
        photo_title: option.photo?.title ?? 'Photographie',
        photo_slug: option.photo?.slug ?? '',
        option_label: option.label,
        option_sku: option.sku,
        unit_price_cents: option.price_cents,
        quantity: item.qty,
      },
    ];
  });

  if (rows.length > 0) {
    const { error: itemsError } = await supabase.from('order_items').insert(rows);
    if (itemsError) throw new Error(`insertion des lignes : ${itemsError.message}`);

    // Attribution atomique des numéros d'édition + incrément des compteurs.
    const { error: editionError } = await supabase.rpc('assign_edition_numbers', {
      p_order_id: order.id,
    });

    if (editionError) {
      // La commande est payée : on ne la rejette pas pour autant. On journalise
      // pour traitement manuel plutôt que de faire réessayer Stripe en boucle.
      console.error(
        `[webhook] numérotation d'édition impossible pour ${order.order_number} : ${editionError.message}`,
      );
    }
  }

  console.info(`[webhook] commande ${order.order_number} enregistrée (${rows.length} ligne(s))`);
}

function parseMetadataItems(raw: string | undefined): MetadataItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is MetadataItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as MetadataItem).optionId === 'string' &&
        typeof (item as MetadataItem).qty === 'number',
    );
  } catch {
    return [];
  }
}

async function markSessionStatus(sessionId: string, status: 'cancelled') {
  const supabase = createAdminClient();
  await supabase.from('orders').update({ status }).eq('stripe_checkout_session_id', sessionId);
}

async function markPaymentIntentRefunded(paymentIntentId: string) {
  const supabase = createAdminClient();
  await supabase
    .from('orders')
    .update({ status: 'refunded' })
    .eq('stripe_payment_intent_id', paymentIntentId);
}
