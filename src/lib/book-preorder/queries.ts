import 'server-only';
import { createClient } from '@/lib/supabase/server';
import type { BookPreorderTierRow } from '@/types/database';

/** Paliers publiés, dans l'ordre d'affichage. */
export async function getPublishedTiers(): Promise<BookPreorderTierRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('book_preorder_tiers')
    .select('*')
    .eq('published', true)
    .order('position', { ascending: true });

  if (error) throw new Error(`Lecture des paliers impossible : ${error.message}`);

  return data ?? [];
}

/** Un palier publié, par id — `null` s'il n'existe pas ou n'est pas publié. */
export async function getTierById(tierId: string): Promise<BookPreorderTierRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('book_preorder_tiers')
    .select('*')
    .eq('id', tierId)
    .eq('published', true)
    .maybeSingle();

  if (error) throw new Error(`Lecture du palier impossible : ${error.message}`);

  return data;
}

/**
 * Progression de la campagne. `bookUnitsTotal` (nombre de livres déjà
 * précommandés) est la métrique affichée sur la jauge ; `raisedCents` et
 * `pledgesCount` restent disponibles pour un affichage secondaire (montant
 * collecté, nombre de contributions). Passe par une fonction
 * `security definer` — aucune ligne de `book_preorder_pledges` n'est jamais
 * lue directement ici.
 */
export type PublicContribution = {
  publicName: string | null;
  publicMessage: string | null;
  tierSlug: string;
  isDonation: boolean;
  createdAt: string;
};

/**
 * Liste publique des contributions (nom affiché et message choisis par la
 * personne). En cas d'échec, la page s'affiche sans la liste plutôt que de
 * tomber : ce bloc est secondaire par rapport aux contreparties.
 */
export async function getPublicContributions(limit = 50): Promise<PublicContribution[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_book_preorder_contributions', { p_limit: limit });

  if (error) {
    console.error('[book-preorder] lecture des contributions impossible', error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    publicName: row.public_name,
    publicMessage: row.public_message,
    tierSlug: row.tier_slug,
    isDonation: row.is_donation,
    createdAt: row.created_at,
  }));
}

export async function getBookPreorderProgress(): Promise<{
  bookUnitsTotal: number;
  raisedCents: number;
  pledgesCount: number;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_book_preorder_progress');

  if (error) throw new Error(`Lecture de la progression impossible : ${error.message}`);

  const row = data?.[0];
  return {
    bookUnitsTotal: row?.book_units_total ?? 0,
    raisedCents: row?.raised_cents ?? 0,
    pledgesCount: row?.pledges_count ?? 0,
  };
}
