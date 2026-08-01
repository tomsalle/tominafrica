import { z } from 'zod';

/**
 * Formulaire de contact de l'accueil.
 *
 * `honeypot` : champ invisible pour un visiteur, que seuls les robots
 * remplissent. S'il arrive non vide, on répond succès sans rien envoyer —
 * inutile de leur signaler que le piège a fonctionné.
 */
export const contactRequestSchema = z.object({
  email: z.email('Adresse e-mail invalide').max(200),
  subject: z.string().trim().min(1, 'L’objet est requis').max(200),
  message: z.string().trim().min(1, 'Le message est requis').max(5000),
  // Pas de contrainte ici : un robot qui le remplit doit passer la validation
  // pour être détecté silencieusement dans la route (voir son commentaire),
  // pas recevoir une 400 qui trahirait le piège.
  honeypot: z.string().max(2000).optional(),
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;
