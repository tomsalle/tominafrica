'use client'

import { useState } from 'react'
import Link from 'next/link'
import { loadStripe } from '@stripe/js'
import { ChevronRight, Check, MapPin, BookOpen, Heart, X } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function PrecommandeLivre() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const tiers = [
    {
      id: 'early-bird',
      name: 'Early Bird',
      price: 35,
      savings: '−5€',
      features: ['1 exemplaire du livre', '112 pages format A3', 'Tirage limité à 120'],
      badge: { text: '15 restants', color: '#810211' },
      highlighted: false,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_EARLY_BIRD || '',
    },
    {
      id: 'standard',
      name: 'Le Livre',
      price: 40,
      savings: null,
      features: ['1 exemplaire du livre', '112 pages format A3', 'Tirage limité à 120'],
      badge: null,
      highlighted: true,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD || '',
    },
    {
      id: 'postcard',
      name: 'Livre + Cartes',
      price: 50,
      savings: null,
      features: ['1 exemplaire du livre', '2 cartes postales premium', 'Photos du voyage'],
      badge: null,
      highlighted: false,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_POSTCARD || '',
    },
    {
      id: 'duo',
      name: 'Pack Duo',
      price: 75,
      savings: null,
      features: ['2 exemplaires du livre', 'Parfait pour offrir', 'Tirage limité'],
      badge: { text: 'Cadeau idéal', color: '#810211' },
      highlighted: false,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_DUO || '',
    },
    {
      id: 'support',
      name: 'Pack Soutien',
      price: 90,
      savings: null,
      features: ['1 livre + 2 cartes', '1 tirage 20×30cm', 'Support direct'],
      badge: { text: 'Meilleure valeur', color: '#810211' },
      highlighted: false,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SUPPORT || '',
    },
  ]

  const handleCheckout = async () => {
    if (!selectedTier) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/precommande', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId: selectedTier,
          quantity,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Checkout error:', error)
        return
      }

      const { sessionId } = await response.json()
      const stripe = await stripePromise
      if (stripe) {
        const result = await stripe.redirectToCheckout({ sessionId })
        if (result.error) {
          console.error('Stripe error:', result.error)
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-ink)' }}>
      {/* Navigation */}
      <nav
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: 'var(--color-ink)',
          borderColor: 'var(--color-ink-line)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-light tracking-widest uppercase"
            style={{ color: 'var(--color-paper)' }}
          >
            Tom in Africa
          </Link>
          <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest">
            <a
              href="#book"
              className="transition duration-300"
              style={{ color: 'var(--color-paper-dim)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-paper)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-paper-dim)')}
            >
              Le Livre
            </a>
            <a
              href="#tiers"
              className="transition duration-300"
              style={{ color: 'var(--color-paper-dim)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-paper)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-paper-dim)')}
            >
              Formules
            </a>
            <a
              href="#faq"
              className="transition duration-300"
              style={{ color: 'var(--color-paper-dim)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-paper)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-paper-dim)')}
            >
              FAQ
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative pt-20 pb-32 border-b"
        style={{
          borderColor: 'var(--color-ink-line)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-12">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest" style={{ color: 'var(--color-paper-faint)' }}>
                <MapPin size={14} />
                Paris → Cape Town
              </div>

              {/* Headline - Using Cormorant Garamond */}
              <div className="space-y-6">
                <h1
                  className="text-5xl sm:text-6xl lg:text-7xl font-light leading-tight tracking-tight"
                  style={{
                    color: 'var(--color-paper)',
                    fontFamily: 'var(--font-cormorant)',
                  }}
                >
                  1 Mère<br />1 Fils<br />1 Rêve
                </h1>
                <p
                  className="text-base sm:text-lg font-light max-w-md leading-relaxed"
                  style={{ color: 'var(--color-paper-dim)' }}
                >
                  Un livre de voyage. 25 000 km. 18 pays. Des histoires vraies.
                </p>
              </div>

              {/* Key Stat */}
              <div
                className="pt-8 border-t space-y-4"
                style={{
                  borderColor: 'var(--color-ink-line)',
                }}
              >
                <div className="space-y-1">
                  <div
                    className="text-4xl font-light"
                    style={{
                      color: 'var(--color-paper)',
                      fontFamily: 'var(--font-cormorant)',
                    }}
                  >
                    120
                  </div>
                  <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-paper-faint)' }}>
                    Exemplaires limités
                  </p>
                </div>
                <div className="space-y-1">
                  <div
                    className="text-4xl font-light"
                    style={{
                      color: 'var(--color-paper)',
                      fontFamily: 'var(--font-cormorant)',
                    }}
                  >
                    27 nov
                  </div>
                  <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-paper-faint)' }}>
                    Livraison prévue
                  </p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => document.getElementById('tiers')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center gap-3 pt-6"
                style={{ color: '#810211' }}
              >
                <span className="text-xs uppercase tracking-widest font-light link-underline">
                  Voir les formules
                </span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right Image Placeholder */}
            <div
              className="relative aspect-square rounded-sm overflow-hidden flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-ink-soft)',
                border: `1px solid var(--color-ink-line)`,
              }}
            >
              <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-paper-faint)' }}>
                Image du livre
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Book Info */}
      <section
        id="book"
        className="py-24 border-b"
        style={{
          borderColor: 'var(--color-ink-line)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-6">
            <h2
              className="text-4xl font-light leading-tight"
              style={{
                color: 'var(--color-paper)',
                fontFamily: 'var(--font-cormorant)',
              }}
            >
              De Paris<br />à Cape Town
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--color-paper-dim)' }}>
              Il y a douze ans, ma mère m'a emmené au Kenya. Depuis, une seule idée en tête : y retourner.
              Douze ans plus tard, je l'ai appelée pour lui proposer de repartir. Six mois. 25 000 km. 18 pays.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'var(--color-paper-dim)' }}>
              Ce livre raconte les rencontres, les visages, les histoires vraies cachées derrière chaque photographie.
              Un hommage à ceux qui nous ont accueillis.
            </p>
          </div>

          {/* Specs Grid */}
          <div
            className="grid md:grid-cols-3 gap-8 pt-8 border-t"
            style={{
              borderColor: 'var(--color-ink-line)',
            }}
          >
            {[
              { label: 'Format', value: 'A3 fermé', desc: 'Sans reliure, tirage à l\'unité' },
              { label: 'Contenu', value: '112 pages', desc: 'Deux regards : mère et fils' },
              { label: 'Tirage', value: '120 exemplaires', desc: 'Limité et numéroté' },
            ].map((spec) => (
              <div key={spec.label} className="space-y-2">
                <p className="text-xs uppercase tracking-widest" style={{ color: '#810211' }}>
                  {spec.label}
                </p>
                <p
                  className="text-lg font-light"
                  style={{
                    color: 'var(--color-paper)',
                    fontFamily: 'var(--font-cormorant)',
                  }}
                >
                  {spec.value}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-paper-faint)' }}>
                  {spec.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIERS SECTION */}
      <section
        id="tiers"
        className="py-24 border-b"
        style={{
          borderColor: 'var(--color-ink-line)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16 text-center space-y-4">
            <h2
              className="text-5xl sm:text-6xl font-light"
              style={{
                color: 'var(--color-paper)',
                fontFamily: 'var(--font-cormorant)',
              }}
            >
              Précommander
            </h2>
            <p className="text-base" style={{ color: 'var(--color-paper-dim)' }}>
              Soutenir le projet et recevoir votre exemplaire
            </p>
          </div>

          {/* Tier Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`relative group cursor-pointer rounded-sm border transition-all duration-300 overflow-hidden ${
                  tier.highlighted ? 'lg:scale-105 lg:z-10' : ''
                }`}
                style={{
                  backgroundColor: 'var(--color-ink-soft)',
                  borderColor:
                    selectedTier === tier.id ? '#810211' : tier.highlighted ? '#810211' : 'var(--color-ink-line)',
                  borderWidth: tier.highlighted || selectedTier === tier.id ? '2px' : '1px',
                  boxShadow:
                    selectedTier === tier.id ? '0 0 20px rgba(129, 2, 17, 0.3)' : 'none',
                }}
              >
                {/* Badge */}
                {tier.badge && (
                  <div
                    className="absolute -top-3 left-6 inline-flex items-center gap-1 px-3 py-1 text-white text-xs font-light rounded-sm"
                    style={{
                      backgroundColor: tier.badge.color,
                    }}
                  >
                    <Heart size={12} />
                    {tier.badge.text}
                  </div>
                )}

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-6 h-full flex flex-col">
                  {/* Name */}
                  <div className="space-y-2">
                    <h3
                      className="text-2xl font-light"
                      style={{
                        color: 'var(--color-paper)',
                        fontFamily: 'var(--font-cormorant)',
                      }}
                    >
                      {tier.name}
                    </h3>
                    {tier.savings && (
                      <p className="text-xs uppercase tracking-widest" style={{ color: '#810211' }}>
                        {tier.savings}
                      </p>
                    )}
                  </div>

                  {/* PRICE - HIGHLIGHTED */}
                  <div className="space-y-1">
                    <div
                      className="text-5xl font-light"
                      style={{
                        color: '#810211',
                        fontFamily: 'var(--font-cormorant)',
                      }}
                    >
                      {tier.price}€
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 flex-grow">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check size={16} style={{ color: '#810211', flexShrink: 0 }} />
                        <span className="text-sm" style={{ color: 'var(--color-paper-dim)' }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className="w-full py-3 px-4 font-light text-sm rounded-sm transition-all duration-300 uppercase tracking-widest"
                    style={{
                      backgroundColor: tier.highlighted && selectedTier !== tier.id ? '#810211' : 'var(--color-ink-line)',
                      color: tier.highlighted && selectedTier !== tier.id ? 'white' : 'var(--color-paper)',
                      borderWidth: selectedTier === tier.id ? '2px' : '1px',
                      borderColor: selectedTier === tier.id ? '#810211' : 'var(--color-ink-line)',
                    }}
                  >
                    Sélectionner
                  </button>

                  {/* Selection State */}
                  {selectedTier === tier.id && (
                    <div className="pt-4 border-t space-y-3 animate-in fade-in duration-300" style={{ borderColor: 'var(--color-ink-line)' }}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-paper-faint)' }}>
                          Quantité
                        </span>
                        <div className="flex items-center gap-2" style={{ backgroundColor: 'var(--color-ink)' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              quantity > 1 && setQuantity(quantity - 1)
                            }}
                            className="px-2 py-1 text-xs"
                            style={{ color: 'var(--color-paper-dim)' }}
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-light" style={{ color: 'var(--color-paper)' }}>
                            {quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setQuantity(quantity + 1)
                            }}
                            className="px-2 py-1 text-xs"
                            style={{ color: 'var(--color-paper-dim)' }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs" style={{ color: 'var(--color-paper-faint)' }}>
                          Total:
                        </p>
                        <p
                          className="text-2xl font-light"
                          style={{
                            color: '#810211',
                            fontFamily: 'var(--font-cormorant)',
                          }}
                        >
                          {quantity * tier.price}€
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="py-24 border-b"
        style={{
          borderColor: 'var(--color-ink-line)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2
            className="text-4xl font-light"
            style={{
              color: 'var(--color-paper)',
              fontFamily: 'var(--font-cormorant)',
            }}
          >
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Quand vais-je recevoir mon livre ?',
                a: '27 novembre 2026, lors du vernissage de l\'exposition à Paris. Nous vous contacterons avec les détails de livraison.',
              },
              {
                q: 'Le paiement est sécurisé ?',
                a: 'Oui, 100%. Paiement via Stripe. Aucune donnée bancaire ne transite par notre site.',
              },
              {
                q: 'Puis-je acheter plusieurs exemplaires ?',
                a: 'Oui, vous pouvez augmenter la quantité après sélection d\'une formule.',
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group border rounded-sm px-6 py-4 cursor-pointer transition duration-300"
                style={{
                  borderColor: 'var(--color-ink-line)',
                }}
              >
                <summary className="flex items-center justify-between font-light uppercase tracking-wider text-xs" style={{ color: 'var(--color-paper)' }}>
                  {faq.q}
                  <ChevronRight size={16} className="transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--color-paper-dim)' }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 border-t pt-20" style={{ borderColor: 'var(--color-ink-line)' }}>
          <h2
            className="text-4xl sm:text-5xl font-light"
            style={{
              color: 'var(--color-paper)',
              fontFamily: 'var(--font-cormorant)',
            }}
          >
            Prêt à soutenir ?
          </h2>
          <p className="text-base" style={{ color: 'var(--color-paper-dim)' }}>
            Rejoignez les premiers supporters. Tirage limité à 120 exemplaires.
          </p>
          <button
            onClick={() => document.getElementById('tiers')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-3 px-8 py-3 font-light text-xs uppercase tracking-widest rounded-sm transition-all duration-300 group"
            style={{
              backgroundColor: '#810211',
              color: 'white',
            }}
          >
            Voir les formules
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Sticky Checkout */}
      {selectedTier && (
        <div
          className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 z-50"
          style={{
            backgroundColor: 'var(--color-ink)',
            borderTop: `1px solid var(--color-ink-line)`,
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={() => setSelectedTier(null)}
              style={{ color: 'var(--color-paper-dim)' }}
            >
              <X size={24} />
            </button>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-paper-faint)' }}>
                Total: {quantity} formule{quantity > 1 ? 's' : ''}
              </p>
              <p
                className="text-3xl font-light"
                style={{
                  color: '#810211',
                  fontFamily: 'var(--font-cormorant)',
                }}
              >
                {quantity * (tiers.find((t) => t.id === selectedTier)?.price || 0)}€
              </p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="flex-1 sm:flex-none px-8 py-3 font-light rounded-sm transition-all duration-300 uppercase tracking-wider text-white disabled:opacity-50"
              style={{
                backgroundColor: '#810211',
              }}
            >
              {isLoading ? 'Chargement...' : 'Payer maintenant'}
            </button>
          </div>
        </div>
      )}

      {/* Spacer */}
      {selectedTier && <div className="h-24" />}
    </div>
  )
}
