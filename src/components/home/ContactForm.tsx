'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const FIELD_CLASS =
  'mt-2 w-full border-b border-ink-line bg-transparent py-2.5 text-sm text-paper placeholder:text-paper-faint transition-colors duration-300 focus:border-paper focus:outline-none';

export function ContactForm() {
  const t = useTranslations('contactForm');
  const locale = useLocale();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus('submitting');
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.get('email'),
          subject: data.get('subject'),
          message: data.get('message'),
          honeypot: data.get('entreprise'),
          locale,
        }),
      });

      const result = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setStatus('error');
        setError(result?.error ?? t('genericError'));
        return;
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setError(t('genericError'));
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-ink-line px-7 py-10 text-center">
        <p className="font-display text-2xl font-light">{t('successTitle')}</p>
        <p className="mt-3 text-sm text-paper-dim">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Piège à robots : invisible et inutile pour un visiteur, donc jamais
          rempli — un champ non vide ici trahit un envoi automatisé. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="entreprise">{t('honeypotLabel')}</label>
        <input id="entreprise" name="entreprise" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="eyebrow">
            {t('email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder={t('emailPlaceholder')}
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="subject" className="eyebrow">
            {t('subject')}
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            placeholder={t('subjectPlaceholder')}
            className={FIELD_CLASS}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="eyebrow">
            {t('message')}
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder={t('messagePlaceholder')}
            className={`${FIELD_CLASS} resize-none`}
          />
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}

      <Button type="submit" className="mt-8" disabled={status === 'submitting'}>
        {status === 'submitting' ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
