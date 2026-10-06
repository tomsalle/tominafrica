import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

/**
 * Aperçu LOCAL du catalogue complet (photos pas encore publiées incluses),
 * pour juger la mise en page avec de vraies images avant de publier.
 *
 * Double verrou : uniquement en `next dev` ET avec CATALOG_PREVIEW=1 dans
 * .env.local (fichier qui n'existe pas sur Vercel). En production, ce
 * drapeau est toujours faux et les lectures passent par la RLS.
 */
export function isCatalogPreview(): boolean {
  return process.env.NODE_ENV === 'development' && process.env.CATALOG_PREVIEW === '1';
}

/** Client de lecture du catalogue : RLS normale, sauf en aperçu local. */
export async function catalogClient() {
  return isCatalogPreview() ? createAdminClient() : createClient();
}

/**
 * En aperçu, on ne garde des brouillons que ceux qui sont déjà « vendables »
 * (au moins un tirage disponible) : les fichiers bruts du type « Dsf9586 »,
 * sans titre ni tirage, n'apportent rien à la relecture.
 */
export function visibleInCatalog(photo: { published: boolean; print_options?: unknown }): boolean {
  return photo.published || (isCatalogPreview() && isForSale(photo));
}

/**
 * Galerie, séquence d'accueil et navigation « sur la route » ne montrent que
 * des œuvres en vente (au moins un tirage disponible). Une photo publiée sans
 * tirage — comme l'image d'ouverture de l'accueil — reste visible là où elle
 * est utilisée, mais n'entre pas dans la galerie.
 */
export function isForSale(photo: { print_options?: unknown }): boolean {
  return (
    Array.isArray(photo.print_options) &&
    (photo.print_options as { available?: boolean }[]).some((o) => o.available)
  );
}
