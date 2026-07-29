/**
 * Bloc récit de la page produit.
 *
 * Le champ `photos.story` est du texte simple, dont les paragraphes sont
 * séparés par une ligne vide. Pas de moteur markdown : le besoin est de la
 * prose, pas des tableaux ni du code, et une dépendance de plus pour découper
 * sur `\n\n` ne se justifie pas. Le jour où un vrai balisage devient
 * nécessaire, c'est ce composant, et lui seul, qui change.
 */
export function PhotoStory({ story, title }: { story: string | null; title: string }) {
  if (!story?.trim()) return null;

  const paragraphs = story
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section aria-labelledby="recit-titre">
      <h2 id="recit-titre" className="eyebrow">
        Le récit
      </h2>

      <div className="mt-7 max-w-[42rem]">
        {/* La première lettre en lettrine, comme dans un magazine. */}
        <p className="sr-only">Récit de la photographie « {title} ».</p>

        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={`text-[1.0625rem] leading-[1.75] text-paper-dim ${
              index === 0
                ? 'first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-light first-letter:text-paper'
                : 'mt-6'
            }`}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
