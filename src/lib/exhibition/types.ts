import { z } from 'zod';

/**
 * Formulaire d'inscription à l'exposition (page « Notre aventure »).
 *
 * `honeypot` : même piège à robots que le formulaire de contact — un champ
 * invisible pour un visiteur, que seuls les robots remplissent.
 */
export const exhibitionRegistrationRequestSchema = z.object({
  firstName: z.string().trim().min(1, 'Le prénom est requis').max(120),
  lastName: z.string().trim().min(1, 'Le nom est requis').max(120),
  email: z.email('Adresse e-mail invalide').max(200),
  phone: z.string().trim().min(1, 'Le numéro de téléphone est requis').max(40),
  message: z.string().trim().max(2000).optional(),
  honeypot: z.string().max(2000).optional(),
});

export type ExhibitionRegistrationRequest = z.infer<typeof exhibitionRegistrationRequestSchema>;
