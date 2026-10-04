import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Prose } from '@/components/ui/Prose';

/** « Qui porte ce projet » — sur le modèle de la section auteur d'Ulule. */
export function AuthorBio() {
  const t = useTranslations('bookPreorder.author');

  return (
    <div>
      <p className="eyebrow">{t('title')}</p>

      <div className="mt-5 flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-ink-soft">
          <Image src="/placeholders/dune-45.svg" alt="" fill sizes="56px" className="object-cover" />
        </div>
        <div>
          <p className="font-display text-lg font-light text-paper">{t('name')}</p>
          <p className="text-xs text-paper-faint">{t('subtitle')}</p>
        </div>
      </div>

      <div className="mt-6">
        <Prose>
          <p>
            <mark>{t('bio')}</mark>
          </p>
        </Prose>
      </div>
    </div>
  );
}
