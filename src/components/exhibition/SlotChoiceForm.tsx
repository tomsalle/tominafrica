'use client';

import { useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';
import { SlotPicker } from '@/components/exhibition/SlotPicker';
import { Button } from '@/components/ui/Button';
import type { ExhibitionDay } from '@/lib/exhibition/event';

type Status = 'idle' | 'submitting' | 'saved' | 'error';

/** Formulaire de la page « Choisissez votre créneau » (lien reçu par e-mail). */
export function SlotChoiceForm({
  id,
  days,
  initial,
}: {
  id: string;
  days: ExhibitionDay[];
  initial: Partial<Record<ExhibitionDay, string>>;
}) {
  const t = useTranslations('expositionSlot');
  const tf = useTranslations('expositionForm');
  const [slots, setSlots] = useState<Partial<Record<ExhibitionDay, string>>>(initial);
  const [status, setStatus] = useState<Status>('idle');
  const [missing, setMissing] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (days.some((day) => !slots[day])) {
      setMissing(true);
      return;
    }
    setStatus('submitting');
    try {
      const response = await fetch('/api/exposition/creneau', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, visitSlots: days.map((day) => slots[day]) }),
      });
      setStatus(response.ok ? 'saved' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'saved') {
    return (
      <div role="status" className="border border-ink-line px-7 py-10 text-center">
        <p className="font-display text-2xl font-light">{t('saved')}</p>
        <p className="mt-3 text-sm text-paper-dim">{t('savedBody')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <SlotPicker
        days={days}
        value={slots}
        error={missing ? tf('slotRequired') : null}
        onChange={(day, slotId) => {
          setMissing(false);
          setSlots((current) => ({ ...current, [day]: slotId }));
        }}
      />
      {status === 'error' ? <p className="mt-4 text-sm text-accent">{t('error')}</p> : null}
      <Button type="submit" className="mt-10" disabled={status === 'submitting'}>
        {status === 'submitting' ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
