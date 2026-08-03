'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const FIELD_CLASS =
  'mt-2 w-full border-b border-ink-line bg-transparent py-2.5 text-sm text-paper placeholder:text-paper-faint transition-colors duration-300 focus:border-paper focus:outline-none';

export function ExpositionForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus('submitting');
    setError(null);

    try {
      const response = await fetch('/api/exposition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          email: data.get('email'),
          phone: data.get('phone'),
          message: data.get('message'),
          honeypot: data.get('entreprise'),
        }),
      });

      const result = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setStatus('error');
        setError(result?.error ?? 'Une erreur est survenue. Réessayez dans un instant.');
        return;
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setError('Une erreur est survenue. Réessayez dans un instant.');
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-ink-line px-7 py-10 text-center">
        <p className="font-display text-2xl font-light">Inscription confirmée.</p>
        <p className="mt-3 text-sm text-paper-dim">
          Merci — vous recevrez les détails pratiques de l’exposition par e-mail.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Piège à robots : invisible et inutile pour un visiteur, donc jamais
          rempli — un champ non vide ici trahit un envoi automatisé. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="entreprise">Ne pas remplir</label>
        <input id="entreprise" name="entreprise" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="eyebrow">
            Prénom
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            placeholder="Votre prénom"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="lastName" className="eyebrow">
            Nom
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            placeholder="Votre nom"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="email" className="eyebrow">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.com"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="phone" className="eyebrow">
            Téléphone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="06 12 34 56 78"
            className={FIELD_CLASS}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="eyebrow">
            Message <span className="normal-case text-paper-faint">(facultatif)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Une question, le nombre de personnes qui vous accompagnent…"
            className={`${FIELD_CLASS} resize-none`}
          />
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}

      <Button type="submit" className="mt-8" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Envoi…' : 'S’inscrire'}
      </Button>
    </form>
  );
}
