'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Check, MapPin, BookOpen, Heart, X } from 'lucide-react'

export default function PrecommandeLivre() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showCheckout, setShowCheckout] = useState(false)

  const tiers = [
    {
      id: 'early-bird',
      name: 'Early Bird',
      price: 35,
      savings: '−5€',
      features: [
        '1 exemplaire du livre',
        '112 pages format A3',
        'Tirage limité à 120',
      ],
      badge: { text: '15 restants', color: 'bg-orange-500' },
      highlighted: false,
    },
    {
      id: 'standard',
      name: 'Le Livre',
      price: 40,
      savings: null,
      features: [
        '1 exemplaire du livre',
        '112 pages format A3',
        'Tirage limité à 120',
      ],
      badge: null,
      highlighted: true,
    },
    {
      id: 'postcard',
      name: 'Livre + Cartes',
      price: 50,
      savings: null,
      features: [
        '1 exemplaire du livre',
        '2 cartes postales premium',
        'Photos du voyage',
      ],
      badge: null,
      highlighted: false,
    },
    {
      id: 'duo',
      name: 'Pack Duo',
      price: 75,
      savings: null,
      features: [
        '2 exemplaires du livre',
        'Parfait pour offrir',
        'Tirage limité',
      ],
      badge: { text: 'Cadeau idéal', color: 'bg-amber-600' },
      highlighted: false,
    },
    {
      id: 'support',
      name: 'Pack Soutien',
      price: 90,
      savings: null,
      features: [
        '1 livre + 2 cartes',
        '1 tirage 20×30cm',
        'Support direct',
      ],
      badge: { text: 'Meilleure valeur', color: 'bg-yellow-600' },
      highlighted: false,
    },
  ]

  const handleCheckout = () => {
    if (selectedTier) {
      // Call Stripe payment
      console.log(`Précommande: ${selectedTier} x${quantity}`)
      setShowCheckout(true)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-black border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold tracking-widest uppercase">
            Tom in Africa
          </Link>
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest">
            <a
              href="#book"
              className="text-zinc-400 hover:text-white transition duration-300"
            >
              Le Livre
            </a>
            <a
              href="#tiers"
              className="text-zinc-400 hover:text-white transition duration-300"
            >
              Formules
            </a>
            <a
              href="#faq"
              className="text-zinc-400 hover:text-white transition duration-300"
            >
              FAQ
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Exaggerated Minimalism */}
      <section className="relative pt-20 pb-32 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Headline + CTA */}
            <div className="space-y-12">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500">
                <MapPin size={14} />
                Paris → Cape Town
              </div>

              {/* Headline - LARGE & BOLD */}
              <div className="space-y-6">
                <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black leading-none tracking-tighter">
                  1 Mère
                  <br />1 Fils
                  <br />1 Rêve
                </h1>
                <p className="text-xl sm:text-2xl font-light text-zinc-300 max-w-md">
                  Un livre de voyage. 25 000 km. 18 pays. Des histoires vraies.
                </p>
              </div>

              {/* Key Stat - Progressive Disclosure */}
              <div className="pt-8 border-t border-zinc-800 space-y-4">
                <div className="space-y-1">
                  <div className="text-5xl font-black text-white">120</div>
                  <p className="text-sm uppercase tracking-widest text-zinc-500">
                    Exemplaires limités
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-5xl font-black text-white">27 nov</div>
                  <p className="text-sm uppercase tracking-widest text-zinc-500">
                    Livraison prévue
                  </p>
                </div>
              </div>

              {/* CTA - Scroll to Tiers */}
              <button
                onClick={() =>
                  document.getElementById('tiers')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="group inline-flex items-center gap-3 px-6 py-3 text-white font-bold uppercase tracking-widest text-sm hover:gap-4 transition-all duration-300"
              >
                Voir les formules
                <ChevronRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>

            {/* Right: Image Placeholder */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 flex items-center justify-center">
              <div className="absolute inset-0 opacity-20">
                <BookOpen size={200} className="w-full h-full" />
              </div>
              <p className="relative text-sm text-zinc-500">Image du livre</p>
            </div>
          </div>
        </div>
      </section>

      {/* Book Info - Minimal & Dense */}
      <section id="book" className="py-24 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-8">
            <h2 className="text-5xl font-black leading-tight">
              De Paris
              <br />à Cape Town
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed">
              Il y a douze ans, ma mère m'a emmené au Kenya. Depuis, une seule idée en
              tête : y retourner. Douze ans plus tard, je l'ai appelée pour lui proposer
              de repartir. Six mois. 25 000 km. 18 pays.
            </p>
            <p className="text-lg text-zinc-300 leading-relaxed">
              Ce livre raconte les rencontres, les visages, les histoires vraies cachées
              derrière chaque photographie. Un hommage à ceux qui nous ont accueillis.
            </p>
          </div>

          {/* Specs Grid */}
          <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-zinc-800">
            {[
              {
                label: 'Format',
                value: 'A3 fermé',
                desc: 'Sans reliure, tirage à l\'unité',
              },
              {
                label: 'Contenu',
                value: '112 pages',
                desc: 'Deux regards : mère et fils',
              },
              {
                label: 'Tirage',
                value: '120 exemplaires',
                desc: 'Limité et numéroté',
              },
            ].map((spec, i) => (
              <div key={i} className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-orange-600 font-bold">
                  {spec.label}
                </p>
                <p className="text-2xl font-black">{spec.value}</p>
                <p className="text-sm text-zinc-500">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIERS SECTION - PRIMARY CONVERSION FOCUS */}
      <section id="tiers" className="py-24 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center space-y-4">
            <h2 className="text-6xl sm:text-7xl font-black">Précommander</h2>
            <p className="text-lg text-zinc-400">
              Soutenir le projet et recevoir votre exemplaire
            </p>
          </div>

          {/* Tier Cards - Optimized for Conversion */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`relative group cursor-pointer rounded-xl border transition-all duration-300 overflow-hidden ${
                  tier.highlighted
                    ? 'border-orange-500 bg-gradient-to-br from-zinc-900 to-black ring-2 ring-orange-500/50 lg:scale-105 lg:z-10'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div
                    className={`absolute -top-3 left-6 inline-flex items-center gap-1 px-3 py-1 ${tier.badge.color} text-white text-xs font-bold rounded-full`}
                  >
                    <Heart size={12} />
                    {tier.badge.text}
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6 sm:p-8 space-y-6 h-full flex flex-col">
                  {/* Name */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black">{tier.name}</h3>
                    {tier.savings && (
                      <p className="text-xs uppercase tracking-wider text-orange-500 font-bold">
                        {tier.savings}
                      </p>
                    )}
                  </div>

                  {/* PRICE - MASSIVE & BOLD */}
                  <div className="space-y-1">
                    <div className="text-6xl sm:text-7xl font-black text-orange-500">
                      {tier.price}€
                    </div>
                  </div>

                  {/* Features - Simple & Clear */}
                  <ul className="space-y-2 flex-grow">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check
                          size={18}
                          className="text-orange-500 flex-shrink-0 mt-1"
                        />
                        <span className="text-sm text-zinc-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button - Large & Prominent */}
                  <button
                    className={`w-full py-4 px-4 font-bold text-lg rounded-lg transition-all duration-300 uppercase tracking-wider ${
                      tier.highlighted
                        ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-orange-500/30'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    }`}
                  >
                    Sélectionner
                  </button>

                  {/* Selection State - Quantity */}
                  {selectedTier === tier.id && (
                    <div className="pt-4 border-t border-zinc-700 space-y-3 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest text-zinc-500">
                          Quantité
                        </span>
                        <div className="flex items-center gap-2 bg-zinc-900 rounded-lg border border-zinc-700">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              quantity > 1 && setQuantity(quantity - 1)
                            }}
                            className="px-2 py-1 text-zinc-400 hover:text-white"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-bold text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setQuantity(quantity + 1)
                            }}
                            className="px-2 py-1 text-zinc-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-500">Total:</p>
                        <p className="text-2xl font-black text-orange-500">
                          {quantity * tier.price}€
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Checkout CTA - Large & Bottom */}
          {selectedTier && (
            <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 p-4 sm:p-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedTier(null)}
                  className="text-zinc-400 hover:text-white transition"
                >
                  <X size={24} />
                </button>
                <div className="space-y-1">
                  <p className="text-sm uppercase tracking-widest text-zinc-500">
                    Total: {quantity} formule{quantity > 1 ? 's' : ''}
                  </p>
                  <p className="text-3xl font-black text-orange-500">
                    {quantity *
                      (tiers.find((t) => t.id === selectedTier)?.price || 0)}
                    €
                  </p>
                </div>
                <button
                  onClick={handleCheckout}
                  className="flex-1 sm:flex-none px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-all duration-300 uppercase tracking-wider"
                >
                  Payer maintenant
                </button>
              </div>
            </div>
          )}

          {/* Spacer for sticky checkout */}
          {selectedTier && <div className="h-24" />}
        </div>
      </section>

      {/* FAQ Section - Minimal */}
      <section id="faq" className="py-24 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-5xl font-black">Questions fréquentes</h2>

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
              {
                q: 'Comment sera expédié le livre ?',
                a: 'Détails à venir : envoi à domicile, point relais, ou remise en main propre à Paris.',
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group border border-zinc-800 rounded-lg px-6 py-4 cursor-pointer hover:border-zinc-700 transition duration-300"
              >
                <summary className="flex items-center justify-between font-bold uppercase tracking-wider text-sm">
                  {faq.q}
                  <ChevronRight
                    size={18}
                    className="transition-transform group-open:rotate-90"
                  />
                </summary>
                <p className="mt-4 text-zinc-400 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 border-t border-zinc-800 pt-20">
          <h2 className="text-5xl sm:text-6xl font-black">Prêt à soutenir ?</h2>
          <p className="text-lg text-zinc-400">
            Rejoignez les premiers supporters. Tirage limité à 120 exemplaires.
          </p>
          <button
            onClick={() =>
              document.getElementById('tiers')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-all duration-300 uppercase tracking-wider text-sm"
          >
            Voir les formules
            <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </div>
  )
}
