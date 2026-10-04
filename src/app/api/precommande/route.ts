import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { publicEnv } from '@/lib/env'

const TIER_PRICES: Record<string, { name: string; priceId: string }> = {
  'early-bird': {
    name: 'Early Bird (35€)',
    priceId: process.env.STRIPE_PRICE_PRECOMMANDE_EARLY_BIRD || '',
  },
  standard: {
    name: 'Le Livre (40€)',
    priceId: process.env.STRIPE_PRICE_PRECOMMANDE_STANDARD || '',
  },
  postcard: {
    name: 'Livre + Cartes (50€)',
    priceId: process.env.STRIPE_PRICE_PRECOMMANDE_POSTCARD || '',
  },
  duo: {
    name: 'Pack Duo (75€)',
    priceId: process.env.STRIPE_PRICE_PRECOMMANDE_DUO || '',
  },
  support: {
    name: 'Pack Soutien (90€)',
    priceId: process.env.STRIPE_PRICE_PRECOMMANDE_SUPPORT || '',
  },
}

export async function POST(request: Request) {
  try {
    const { priceId, quantity = 1, tierId } = await request.json()

    // Validate tier
    const tier = TIER_PRICES[tierId as string]
    if (!tier || !tier.priceId) {
      return NextResponse.json(
        { error: 'Tier invalide ou Stripe price ID manquant' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: tier.priceId,
          quantity: Math.max(1, parseInt(String(quantity)) || 1),
        },
      ],
      mode: 'payment',
      locale: 'fr',
      success_url: `${publicEnv.NEXT_PUBLIC_SITE_URL}/precommande-livre?success=true&tier=${tierId}`,
      cancel_url: `${publicEnv.NEXT_PUBLIC_SITE_URL}/precommande-livre?canceled=true`,
      customer_email_collection: 'required',
      metadata: {
        type: 'precommande-livre',
        tierId,
        tier_name: tier.name,
        quantity: String(quantity),
      },
    })

    if (!session.id) {
      throw new Error('Stripe session creation failed')
    }

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('[precommande] Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session Stripe' },
      { status: 500 }
    )
  }
}
