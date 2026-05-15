// ============================================================
// SOURCE DE VÉRITÉ — les 6 services du réseau Montpellier Dépannage.
//
// Repris 1:1 des cartes de ServicesGrid (home). Le résumé court
// existe déjà et est réutilisé tel quel ; le contenu rédactionnel
// long des pages /services/{slug}/ reste en TODO Phase 2.
// ============================================================

import { photos } from '../config/site';

export type Service = {
  /** Segment d'URL : /services/{slug}/ */
  slug: string;
  /** Intitulé court — navigation, cartes, fil d'Ariane. */
  nom: string;
  /** Titre complet — H1 et balise <title>. */
  titre: string;
  /** Numéro d'ordre affiché (tag mono). */
  tag: string;
  /** Résumé court factuel — réutilisé depuis ServicesGrid. */
  resume: string;
  /** Clé photo dans config/site.ts → photos. */
  photo: keyof typeof photos;
};

export const services: Service[] = [
  {
    slug: 'remorquage-vehicules-legers',
    nom: 'Remorquage VL',
    titre: 'Remorquage VL & véhicules de luxe',
    tag: '01',
    resume:
      'Voitures en panne ou accidentées, accès sous-sols, plateaux rabaissés adaptés aux véhicules de prestige.',
    photo: 'porscheCayman',
  },
  {
    slug: 'remorquage-poids-lourds',
    nom: 'Remorquage poids lourds',
    titre: 'Remorquage poids lourds',
    tag: '02',
    resume:
      'Flotte 4×4 avec bras, plateaux PL. Récupération de tout gabarit, jour et nuit.',
    photo: 'plRecuperation',
  },
  {
    slug: 'depannage-autoroute-a9',
    nom: 'Autoroute A9',
    titre: 'Dépannage sur autoroute A9',
    tag: '03',
    resume:
      'Agréés autoroutes, partenaires Vinci. Intervention rapide sur le réseau Hérault.',
    photo: 'interventionA9',
  },
  {
    slug: 'transport-international',
    nom: 'Transport international',
    titre: 'Transport international & rapatriement',
    tag: '04',
    resume:
      'France, Belgique, Italie, Espagne. Rapatriement de véhicules accidentés.',
    photo: 'plRenversement',
  },
  {
    slug: 'centre-ville-zones-pietonnes',
    nom: 'Centre-ville & zones piétonnes',
    titre: 'Intervention centre-ville & zones piétonnes',
    tag: '05',
    resume:
      'Flotte électrique zéro émission : véhicule compact et scooters pour intervenir dans le cœur historique : Comédie, Antigone, Peyrou.',
    photo: 'flotteElectrique',
  },
  {
    slug: 'mecanique-gpl-climatisation',
    nom: 'Mécanique · GPL · Clim',
    titre: 'Mécanique, GPL & climatisation',
    tag: '06',
    resume:
      'Entretien véhicules, installation systèmes GPL, révision climatisation.',
    photo: 'peyrou',
  },
];

/** Retrouve un service par son slug. */
export const getService = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);
