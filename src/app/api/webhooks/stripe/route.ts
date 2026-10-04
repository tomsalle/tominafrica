import { headers } from 'next/headers'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return new Response('No signature header', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (error) {
    console.error('[webhook] Signature verification failed:', error)
    return new Response(`Webhook error: ${error}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('[webhook] Checkout completed:', {
          sessionId: session.id,
          customerId: session.customer,
          metadata: session.metadata,
        })

        if (session.metadata?.type === 'precommande-livre') {
          console.log('[webhook] Précommande du livre:', {
            tier: session.metadata?.tierId,
            quantity: session.metadata?.quantity,
            amount: session.amount_total,
          })
        }

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('[webhook] Checkout expired:', session.id)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        console.log('[webhook] Charge refunded:', charge.id)
        break
      }

      default:
        console.log('[webhook] Unhandled event type:', event.type)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[webhook] Error processing event:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
