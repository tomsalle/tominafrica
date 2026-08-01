/**
 * Vidéos YouTube de la traversée (youtube.com/@Tominafrica).
 *
 * Liste figée à la main plutôt qu'appelée à l'API YouTube au chargement :
 * douze vidéos, publiées rarement, aucune raison d'ajouter une dépendance
 * réseau (clé API, quota) pour ça. Mettre à jour cette liste à la main pour
 * une nouvelle vidéo.
 */
export type VideoEntry = {
  id: string;
  title: string;
  publishedAt: string;
};

export const VIDEOS: VideoEntry[] = [
  { id: 'TYV1vy3Cr1I', title: "#1 J'achète un TOYOTA LAND CRUISER pour TRAVERSER L'AFRIQUE !", publishedAt: '2024-09-17' },
  { id: 'NOBHbkh_eoI', title: "#2 je PRÉPARE un 4X4 de 1993 pour partir TRAVERSER L'AFRIQUE !", publishedAt: '2024-10-27' },
  { id: 'xysddyY3Y4k', title: "#3 ON PART TRAVERSER L'AFRIQUE en 4X4 !! (on traverse notre premier désert, les bardenas)", publishedAt: '2024-12-16' },
  { id: 'AD9HDM2es0M', title: '#4 3 SEMAINES POUR TRAVERSER LE MAROC', publishedAt: '2025-01-12' },
  { id: 'VB9Xua4Uk90', title: '#5 Traverser la Mauritanie, un défi fou avec ma mère !', publishedAt: '2025-05-25' },
  { id: 'HOZR71uNn4I', title: "L'AFRIQUE EN 4x4 - LE SENEGAL #6", publishedAt: '2025-09-07' },
  { id: 'OLwPcb3-zMU', title: 'Ma mère AMBIANCE tout un VILLAGE en GUINÉE 🤣', publishedAt: '2025-09-14' },
  { id: 'Y6J5x6J0PX4', title: "Le pays où tout a failli s'arrêter… (Côte d'Ivoire 🇨🇮)", publishedAt: '2025-10-05' },
  { id: 'WGMbzucqgBs', title: '7 jours pour traverser le NIGERIA ! Par les montagnes (ça se passe pas comme prévu !)', publishedAt: '2025-11-26' },
  { id: 'NNn2xv_7Eio', title: 'CONGO : LE PARADIS VERT ! (INCROYABLE)', publishedAt: '2026-02-22' },
  { id: 'v0uorqWp7yE', title: "ON VISITE le pays le plus SOUS-COTÉ d'Afrique", publishedAt: '2026-04-19' },
  { id: 'pkDtDa22c1Q', title: "30 JOURS POUR TRAVERSER LA NAMIBIE (c'est INCROYABLE !!)", publishedAt: '2026-07-19' },
];
