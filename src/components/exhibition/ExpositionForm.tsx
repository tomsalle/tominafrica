'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { EXHIBITION_DAYS, EXHIBITION_REGISTERED_KEY, type ExhibitionDay } from '@/lib/exhibition/event';

type Status = 'idle' | 'submitting' | 'success' | 'already' | 'error';

const DAY_KEYS: Record<ExhibitionDay, 'friday' | 'saturday' | 'sunday'> = {
  '2026-11-27': 'friday',
  '2026-11-28': 'saturday',
  '2026-11-29': 'sunday',
};

const FIELD_CLASS =
  'mt-2 w-full border-b border-ink-line bg-transparent py-2.5 text-sm text-paper placeholder:text-paper-faint transition-colors duration-300 focus:border-paper focus:outline-none';

/** La pop-in d'invitation ne revient plus une fois la personne inscrite. */
function rememberRegistration() {
  try {
    window.localStorage.setItem(EXHIBITION_REGISTERED_KEY, '1');
  } catch {
    // Stockage indisponible : la pop-in pourra simplement réapparaître.
  }
}

export function ExpositionForm() {
  const t = useTranslations('expositionForm');
  const locale = useLocale();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [daysError, setDaysError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const visitDays = data.getAll('visitDays').map(String);

    if (visitDays.length === 0) {
      setDaysError(t('daysRequired'));
      form.querySelector<HTMLInputElement>('input[name="visitDays"]')?.focus();
      return;
    }

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
          visitDays,
          honeypot: data.get('entreprise'),
          locale,
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        error?: string;
        alreadyRegistered?: boolean;
      } | null;

      if (result?.alreadyRegistered) {
        setStatus('already');
        rememberRegistration();
        return;
      }

      if (!response.ok) {
        setStatus('error');
        setError(result?.error ?? t('genericError'));
        return;
      }

      setStatus('success');
      form.reset();
      rememberRegistration();
    } catch {
      setStatus('error');
      setError(t('genericError'));
    }
  }

  if (status === 'success' || status === 'already') {
    const already = status === 'already';
    return (
      <div role="status" className="border border-ink-line px-7 py-10 text-center">
        <p className="font-display text-2xl font-light">{already ? t('alreadyTitle') : t('successTitle')}</p>
        <p className="mt-3 text-sm text-paper-dim">{already ? t('alreadyBody') : t('successBody')}</p>
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
          <label htmlFor="firstName" className="eyebrow">
            {t('firstName')}
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            placeholder={t('firstNamePlaceholder')}
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="lastName" className="eyebrow">
            {t('lastName')}
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            placeholder={t('lastNamePlaceholder')}
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="email" className="eyebrow">
            {t('email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t('emailPlaceholder')}
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="phone" className="eyebrow">
            {t('phone')}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder={t('phonePlaceholder')}
            className={FIELD_CLASS}
          />
        </div>

        <fieldset className="sm:col-span-2" aria-describedby={daysError ? 'visit-days-error' : 'visit-days-help'}>
          <legend className="eyebrow">{t('daysLabel')}</legend>
          <p id="visit-days-help" className="mt-2 text-xs text-paper-faint">
            {t('daysHelp')}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {EXHIBITION_DAYS.map((day) => (
              <label key={day} className="cursor-pointer">
                <input
                  type="checkbox"
                  name="visitDays"
                  value={day}
                  className="peer sr-only"
                  onChange={() => setDaysError(null)}
                />
                <span className="flex min-h-11 items-center gap-2.5 border border-ink-line px-4 text-sm text-paper-dim transition-colors duration-200 select-none peer-checked:border-brand peer-checked:bg-brand/20 peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-paper hover:border-paper-dim peer-checked:[&_.day-box]:border-brand peer-checked:[&_.day-box]:bg-brand peer-checked:[&_svg]:opacity-100">
                  <span
                    aria-hidden
                    className="day-box flex size-4 shrink-0 items-center justify-center border border-paper-faint transition-colors duration-200"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-3 text-paper opacity-0 transition-opacity duration-200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  {t(`days.${DAY_KEYS[day]}`)}
                </span>
              </label>
            ))}
          </div>
          {daysError ? (
            <p id="visit-days-error" role="alert" className="mt-3 text-sm text-accent">
              {daysError}
            </p>
          ) : null}
        </fieldset>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="eyebrow">
            {t('message')} <span className="normal-case text-paper-faint">{t('messageOptional')}</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
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
