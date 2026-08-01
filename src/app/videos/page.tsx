import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { YouTubeFacade } from '@/components/videos/YouTubeFacade';
import { VIDEOS } from '@/lib/videos-data';

export const metadata: Metadata = {
  title: 'Vidéos',
  description: 'Les vidéos de la traversée de l’Afrique en Toyota Land Cruiser, mère et fils.',
};

export default function VideosPage() {
  return (
    <div className="pt-32 pb-28 sm:pt-40">
      <Container width="wide">
        <header className="max-w-3xl">
          <p className="eyebrow">youtube.com/@Tominafrica</p>
          <h1 className="mt-5 font-display text-5xl leading-[0.95] font-light sm:text-7xl">
            Vidéos
          </h1>
          <p className="mt-8 text-base leading-relaxed text-paper-dim sm:text-lg">
            Le récit de la traversée en images animées : préparatifs, pays traversés, imprévus.
          </p>
        </header>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((video, index) => (
            <Reveal key={video.id} delay={(index % 3) * 90}>
              <YouTubeFacade id={video.id} title={video.title} />
              <h2 className="mt-4 font-display text-xl leading-tight font-light">
                {video.title}
              </h2>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
