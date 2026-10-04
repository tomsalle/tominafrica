import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Prose } from '@/components/ui/Prose';

/** « Qui porte la collecte » — section auteur d'Ulule. */
export function AuthorBio() {
  const t = useTranslations('bookPreorder.author');

  return (
    <section>
      <h2 className="font-display text-3xl font-light text-paper sm:text-4xl">{t('title')}</h2>

      <div className="mt-6 flex items-center gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-ink-soft">
          <Image src="/placeholders/dune-45.svg" alt="" fill sizes="64px" className="object-cover" />
        </div>
        <div>
          <p className="font-medium text-paper">{t('name')}</p>
          <p className="text-sm text-paper-faint">{t('subtitle')}</p>
        </div>
      </div>

      <div className="mt-6">
        <Prose>
          <p>
            <mark>{t('bio')}</mark>
          </p>
        </Prose>
      </div>
    </section>
  );
}
