/**
 * Demande aux inscrits du week-end (samedi 28 / dimanche 29) de choisir un
 * créneau de visite de deux heures : face au nombre d'inscriptions, il faut
 * répartir le monde. Chaque e-mail contient un lien personnel vers
 * /notre-aventure/exposition/creneau/<id de l'inscription>.
 *
 *   npx tsx scripts/send-expo-creneaux.ts            → simulation, n'envoie rien
 *   npx tsx scripts/send-expo-creneaux.ts --envoyer  → envoi réel
 *
 * - Un e-mail par inscription (chaque personne a son propre lien) ; les
 *   inscriptions en double (même e-mail, même prénom) n'en reçoivent qu'un.
 * - Les personnes qui ont déjà un créneau ne reçoivent rien.
 * - Chaque inscription servie est notée dans exports/expo-creneaux-envoyes.txt
 *   (hors git) : relancer le script ne renvoie jamais deux fois.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { Resend } from 'resend';
import { EXHIBITION, formatSlot, slotsForDay } from '../src/lib/exhibition/event';
import type { Database } from '../src/types/database';

config({ path: '.env.local', quiet: true });

const FROM = 'Tom in Africa <contact@tominafrica.com>';
const REPLY_TO = process.env.CONTACT_EMAIL || 'tomsallepro@gmail.com';
const SITE = 'https://www.tominafrica.com';
const SENT_LOG = 'exports/expo-creneaux-envoyes.txt';
const BATCH_SIZE = 100; // limite de l'API batch de Resend
const WEEKEND = ['2026-11-28', '2026-11-29'];

const DAY_FR: Record<string, string> = { '2026-11-28': 'samedi 28', '2026-11-29': 'dimanche 29' };

/** Prénom saisi tout en minuscules ou en majuscules : on le remet en forme. */
function displayName(firstName: string): string {
  const name = firstName.trim();
  if (name !== name.toLowerCase() && name !== name.toUpperCase()) return name;
  return name.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, sep: string, letter: string) => sep + letter.toUpperCase());
}

function joinDays(days: string[], names: Record<string, string>, and: string): string {
  const labels = days.map((day) => names[day]);
  return labels.length > 1 ? `${labels.slice(0, -1).join(', ')} ${and} ${labels.at(-1)}` : (labels[0] ?? '');
}

function slotEmail(registration: { id: string; first_name: string; visit_days: string[] }) {
  const name = displayName(registration.first_name);
  const days = WEEKEND.filter((day) => registration.visit_days.includes(day));
  const slotsFr = slotsForDay(WEEKEND[0]!).map((slot) => formatSlot(slot, 'fr')).join(', ');
  const slotsEn = slotsForDay(WEEKEND[0]!).map((slot) => formatSlot(slot, 'en')).join(', ');
  const linkFr = `${SITE}/notre-aventure/exposition/creneau/${registration.id}`;
  const linkEn = `${SITE}/en/notre-aventure/exposition/creneau/${registration.id}`;

  return {
    subject: 'Exposition « 1 Mère, 1 Fils, 1 Rêve » : choisissez votre créneau de visite',
    text: [
      `Bonjour${name ? ` ${name}` : ''},`,
      '',
      `Merci encore pour votre inscription à notre exposition chez ${EXHIBITION.venue} (${EXHIBITION.street}, Paris 14e). Vous nous avez dit venir ${joinDays(days, DAY_FR, 'et')} novembre.`,
      '',
      'Nous avons reçu beaucoup plus d’inscriptions que prévu, et nous sommes obligés de gérer le flux de visiteurs pour que chacun puisse profiter des photos dans de bonnes conditions. Nous avons donc mis en place des créneaux de deux heures, de 10 h à 17 h :',
      slotsFr,
      '',
      'Pouvez-vous choisir le vôtre ? Cela prend quelques secondes :',
      linkFr,
      '',
      'Si vous venez à plusieurs, choisissez le même créneau pour tout le groupe. Et si vous ne pouvez plus venir, répondez simplement à cet e-mail.',
      '',
      'Merci beaucoup, et à très vite !',
      'Charlotte et Tom',
      '',
      '—',
      '',
      `Hello${name ? ` ${name}` : ''}, thank you for registering for our exhibition. Because far more people have registered than we expected, weekend visits are now split into two-hour time slots (${slotsEn}). Please choose yours here: ${linkEn}`,
      '',
      'Charlotte and Tom',
    ].join('\n'),
  };
}

async function main() {
  const send = process.argv.includes('--envoyer');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!url || !serviceKey) throw new Error('NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis dans .env.local');
  if (send && !resendKey) throw new Error('RESEND_API_KEY requis dans .env.local');

  const supabase = createClient<Database>(url, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('exhibition_registrations')
    .select('id, first_name, email, visit_days, visit_slots, created_at')
    .overlaps('visit_days', WEEKEND)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Lecture des inscriptions : ${error.message}`);

  const alreadySent = new Set(
    (await readFile(SENT_LOG, 'utf8').catch(() => ''))
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
  );

  // Doublons (même e-mail + même prénom) : on garde l'inscription la plus récente.
  const seen = new Set<string>();
  const recipients = (data ?? []).filter((r) => {
    const key = `${r.email.trim().toLowerCase()}|${r.first_name.trim().toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    const missingSlot = WEEKEND.some(
      (day) => r.visit_days?.includes(day) && !r.visit_slots?.some((slot) => slot.startsWith(day)),
    );
    return missingSlot && !alreadySent.has(r.id);
  });

  console.log(`${data?.length ?? 0} inscriptions pour le week-end, ${alreadySent.size} déjà servies.`);
  console.log(`${recipients.length} e-mail(s) à envoyer${send ? '' : ' (simulation : rien n’est envoyé)'}.\n`);

  const messages = recipients.map((r) => {
    const mail = slotEmail({ id: r.id, first_name: r.first_name, visit_days: r.visit_days ?? [] });
    return { id: r.id, from: FROM, to: r.email.trim(), replyTo: REPLY_TO, subject: mail.subject, text: mail.text };
  });

  if (!send) {
    // Deux exemples : une personne qui vient un seul jour, une qui vient les deux.
    const single = recipients.findIndex((r) => WEEKEND.filter((day) => r.visit_days?.includes(day)).length === 1);
    const both = recipients.findIndex((r) => WEEKEND.every((day) => r.visit_days?.includes(day)));
    for (const index of [single, both].filter((i) => i >= 0)) {
      const m = messages[index]!;
      console.log(`--- Exemple ---\nÀ : ${m.to}\nObjet : ${m.subject}\n\n${m.text.replace(/creneau\/[0-9a-f-]+/g, 'creneau/<lien personnel>')}\n`);
    }
    return;
  }

  await mkdir('exports', { recursive: true });
  const resend = new Resend(resendKey);
  let sent = 0;
  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const chunk = messages.slice(i, i + BATCH_SIZE);
    const { error: sendError } = await resend.batch.send(
      chunk.map((m) => ({ from: m.from, to: m.to, replyTo: m.replyTo, subject: m.subject, text: m.text })),
    );
    if (sendError) {
      console.error(`\n✗ Envoi interrompu après ${sent} e-mail(s) : ${sendError.message}`);
      console.error('  Relancer le script plus tard reprendra là où il s’est arrêté.');
      process.exit(1);
    }
    await appendFile(SENT_LOG, chunk.map((m) => m.id).join('\n') + '\n');
    sent += chunk.length;
    console.log(`  ${sent}/${messages.length} envoyés`);
  }
  console.log(`\n✓ ${sent} e-mail(s) envoyés.`);
}

main().catch((error: unknown) => {
  console.error('\n✗', error instanceof Error ? error.message : error);
  process.exit(1);
});
