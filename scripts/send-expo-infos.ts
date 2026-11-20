/**
 * Envoie les infos pratiques de l'exposition (lieu, horaires, programme) à
 * toutes les personnes déjà inscrites. Les nouveaux inscrits les reçoivent
 * automatiquement depuis le formulaire : ce script ne sert qu'une fois.
 *
 *   npx tsx scripts/send-expo-infos.ts            → simulation, n'envoie rien
 *   npx tsx scripts/send-expo-infos.ts --envoyer  → envoi réel
 *
 * - Un seul e-mail par adresse : une famille inscrite avec la même adresse
 *   reçoit un message unique (« Bonjour Marie et Paul »).
 * - Chaque adresse servie est notée dans exports/expo-infos-envoyes.txt
 *   (hors git) : relancer le script ne renvoie jamais deux fois.
 * - --avant=2026-11-20T18:00:00Z : ignore les inscriptions plus récentes
 *   (celles qui ont déjà reçu la confirmation automatique).
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { Resend } from 'resend';
import { exhibitionInfoEmail } from '../src/lib/exhibition/confirmation-email';
import type { Database } from '../src/types/database';

config({ path: '.env.local', quiet: true });

const FROM = 'Tom in Africa <contact@tominafrica.com>';
const REPLY_TO = process.env.CONTACT_EMAIL || 'tomsallepro@gmail.com';
const SENT_LOG = 'exports/expo-infos-envoyes.txt';
/**
 * Prénoms corrigés à la main (prénom et nom inversés, coquilles), au format
 * { "prénom saisi|nom saisi": "Prénom" }. Fichier local, hors git : il
 * contient des données personnelles.
 */
const NAME_FIXES = 'exports/expo-prenoms.json';
const BATCH_SIZE = 100; // limite de l'API batch de Resend

async function main() {
  const send = process.argv.includes('--envoyer');
  const before = process.argv.find((arg) => arg.startsWith('--avant='))?.slice('--avant='.length);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!url || !serviceKey) throw new Error('NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis dans .env.local');
  if (send && !resendKey) throw new Error('RESEND_API_KEY requis dans .env.local');

  const supabase = createClient<Database>(url, serviceKey, { auth: { persistSession: false } });
  let query = supabase
    .from('exhibition_registrations')
    .select('first_name, last_name, email, visit_days, created_at')
    .order('created_at', { ascending: true });
  if (before) query = query.lt('created_at', before);
  const { data, error } = await query;
  if (error) throw new Error(`Lecture des inscriptions : ${error.message}`);

  const fixes: Record<string, string> = JSON.parse(await readFile(NAME_FIXES, 'utf8').catch(() => '{}'));
  const fold = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

  // Regroupement par adresse e-mail.
  const byEmail = new Map<string, { email: string; names: string[]; days: Set<string> }>();
  for (const row of data ?? []) {
    const key = row.email.trim().toLowerCase();
    const entry = byEmail.get(key) ?? { email: row.email.trim(), names: [], days: new Set<string>() };
    const key2 = `${row.first_name.trim().toLowerCase()}|${row.last_name.trim().toLowerCase()}`;
    const name = (fixes[key2] ?? row.first_name).trim();
    if (name) entry.names.push(name);
    for (const day of row.visit_days ?? []) entry.days.add(day);
    byEmail.set(key, entry);
  }

  const alreadySent = new Set(
    (await readFile(SENT_LOG, 'utf8').catch(() => ''))
      .split('\n')
      .map((line) => line.trim().toLowerCase())
      .filter(Boolean),
  );
  const recipients = [...byEmail.entries()].filter(([key]) => !alreadySent.has(key)).map(([, entry]) => entry);

  console.log(`${data?.length ?? 0} inscriptions, ${byEmail.size} adresses distinctes, ${alreadySent.size} déjà servies.`);
  console.log(`${recipients.length} e-mail(s) à envoyer${send ? '' : ' (simulation : rien n’est envoyé)'}.\n`);

  const messages = recipients.map((r) => {
    // Doublons (accents compris) et prénoms déjà contenus dans un autre :
    // « Nicolas » disparaît devant « Nicolas et Émilie ».
    const names = r.names.filter((name, index, all) => {
      const words = (other: string) => fold(other).split(/[\s,]+/);
      if (all.findIndex((other) => fold(other) === fold(name)) !== index) return false;
      return !all.some((other) => fold(other) !== fold(name) && fold(name).split(/\s+/).every((w) => words(other).includes(w)));
    });
    r.names = names;
    const firstName = r.names.length > 1 ? `${r.names.slice(0, -1).join(', ')} et ${r.names.at(-1)}` : (r.names[0] ?? null);
    const mail = exhibitionInfoEmail({ locale: 'fr', firstName, visitDays: [...r.days].sort(), kind: 'rappel' });
    return { from: FROM, to: r.email, replyTo: REPLY_TO, subject: mail.subject, text: mail.text };
  });

  if (!send) {
    for (const m of messages) console.log(`  ${m.to}  —  ${m.text.split('\n')[0]}`);
    if (messages[0]) console.log(`\n--- Exemple ---\nObjet : ${messages[0].subject}\n\n${messages[0].text}`);
    return;
  }

  await mkdir('exports', { recursive: true });
  const resend = new Resend(resendKey);
  let sent = 0;
  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const chunk = messages.slice(i, i + BATCH_SIZE);
    const { error: sendError } = await resend.batch.send(chunk);
    if (sendError) {
      console.error(`\n✗ Envoi interrompu après ${sent} e-mail(s) : ${sendError.message}`);
      console.error('  Relancer le script plus tard reprendra là où il s’est arrêté.');
      process.exit(1);
    }
    await appendFile(SENT_LOG, chunk.map((m) => m.to.toLowerCase()).join('\n') + '\n');
    sent += chunk.length;
    console.log(`  ${sent}/${messages.length} envoyés`);
  }
  console.log(`\n✓ ${sent} e-mail(s) envoyés.`);
}

main().catch((error: unknown) => {
  console.error('\n✗', error instanceof Error ? error.message : error);
  process.exit(1);
});
