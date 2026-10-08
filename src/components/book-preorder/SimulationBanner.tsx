/** Rappel visible quand la page tourne en simulation locale (`?simulation=`). */
export function SimulationBanner({ count }: { count: number }) {
  return (
    <p className="fixed bottom-4 left-1/2 z-60 -translate-x-1/2 bg-brand px-4 py-2 text-xs font-medium tracking-[0.14em] text-paper uppercase">
      Simulation locale · {count} préventes · aucune donnée réelle
    </p>
  );
}
