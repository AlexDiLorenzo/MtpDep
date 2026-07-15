// ============================================================
// SOURCE DE VÉRITÉ — pages « zones d'intervention ».
//
// Villes moyennes et grandes de l'Hérault et du Gard où le réseau
// n'a PAS d'agence, mais qui restent atteignables dans un délai
// crédible (~30 min) depuis l'agence la plus proche. Objectif SEO :
// capter les recherches « dépannage {ville} » / « remorquage {ville} ».
//
// URL : /depannage/{slug}/ — distincte des pages agences (/agences/).
//
// Règles :
//  - Chaque `Zone.agenceSlug` DOIT référencer une agence de data/agences.ts.
//  - Le rédactionnel (`intro`, `acces`, `prestations`, `faq`) est UNIQUE
//    par ville — pas de duplicate content entre zones ni avec les agences.
//  - Aucune adresse locale n'est revendiquée : la page décrit un service
//    couvrant la ville depuis l'agence de rattachement (honnête, cf. schema).
//
// PRÊT POUR L'I18N (à implémenter plus tard) :
//  - Tout le texte affiché vit ici : le contenu par ville dans `zones`,
//    les libellés d'interface dans `zoneLabels`. Le template ne contient
//    aucune chaîne en dur. Une future version FR/EN/ES pourra indexer ces
//    deux exports par langue (ex. zones.fr / zones.en) sans toucher au JSX.
// ============================================================

import { agences, type Agence } from './agences';

/** Une prestation disponible sur la zone — carte informative, non cliquable. */
export type ZonePrestation = {
  nom: string;
  description: string;
};

/** Une question/réponse — alimente la FAQ + le JSON-LD FAQPage. */
export type ZoneFaq = {
  q: string;
  a: string;
};

/** Rédactionnel local d'une ville rattachée — unique par ville. */
export type Zone = {
  /** Segment d'URL : /depannage/{slug}/ */
  slug: string;
  /** Nom de la ville — H1, titres, fil d'Ariane. */
  ville: string;
  /** Code postal principal de la ville. */
  codePostal: string;
  /** Département de la ville. */
  departement: 'Hérault' | 'Gard';
  /** Slug de l'agence de rattachement (doit exister dans data/agences.ts). */
  agenceSlug: string;
  /** Distance routière approximative agence → ville (km). */
  distanceKm: number;
  /** Temps de route approximatif agence → ville (minutes). */
  distanceMin: number;
  /** Coordonnées géographiques de la ville — JSON-LD GeoCoordinates. */
  geo: { lat: number; lng: number };
  /** Accroche courte — meta description + sous-titre du hero. */
  accroche: string;
  /** Paragraphes de présentation unique (ville, axes, spécificités). */
  intro: string[];
  /** Repères locaux (axes routiers, caractéristiques) — puces courtes. */
  reperes: string[];
  /** Paragraphe accès / rattachement depuis l'agence. */
  acces: string;
  /** Prestations disponibles, orientées ville. */
  prestations: ZonePrestation[];
  /** Communes ou quartiers proches également desservis. */
  alentours: string[];
  /** FAQ locale — section FAQ + données structurées FAQPage. */
  faq: ZoneFaq[];
};

// ------------------------------------------------------------------
// Libellés d'interface — centralisés pour l'i18n. Les fonctions
// portent l'interpolation (nom de ville, agence, distance) afin
// qu'AUCUNE chaîne ne soit codée en dur dans le template.
// ------------------------------------------------------------------
export const zoneLabels = {
  heroPill: (departement: string) =>
    `Zone d'intervention · ${departement} · 24h/24 · 7j/7`,
  heroTitleLead: 'Dépannage et remorquage',
  heroTitleCity: (ville: string) => `à ${ville}.`,
  heroPhoneLabel: 'Urgence 24/7',
  heroNetwork: (agenceNom: string) =>
    `Assuré depuis notre agence de ${agenceNom}, membre du réseau Montpellier Dépannage.`,
  introOverline: (ville: string) => `Dépannage à ${ville}`,
  introHeading: 'Une intervention rapide, jour et nuit.',
  reperesLabel: 'Repères locaux',
  accesOverline: 'Agence de rattachement',
  accesHeading: (ville: string) => `Qui intervient à ${ville} ?`,
  accesDistance: (min: number, agenceNom: string) =>
    `À environ ${min} min de route de notre agence de ${agenceNom}.`,
  accesAgenceLink: "Voir l'agence de rattachement",
  accesMapsLink: 'Itinéraire depuis l’agence',
  accesHoursLabel: 'Disponibilité',
  accesHoursValue: '24h/24, 7j/7 — astreinte permanente',
  prestationsOverline: 'Nos prestations',
  prestationsHeading: (ville: string) => `Ce que nous faisons à ${ville}.`,
  alentoursOverline: "Zone d'intervention",
  alentoursHeading: (ville: string) => `Autour de ${ville}.`,
  alentoursLead: (ville: string) =>
    `Au-delà de ${ville}, nos équipes desservent également les communes et secteurs voisins :`,
  faqOverline: 'Questions fréquentes',
  faqHeading: (ville: string) => `Le dépannage à ${ville} en questions.`,
  ctaTitle: (ville: string) => `Besoin d'un dépannage à ${ville} ?`,
  ctaLead: 'Intervention immédiate, 24h/24 et 7j/7.',
  breadcrumbRoot: 'Zones d’intervention',
} as const;

export const zones: Zone[] = [
  // ============================================================
  // Rattachées à St-Jean-de-Védas (A9) — littoral sud-ouest
  // ============================================================
  {
    slug: 'sete',
    ville: 'Sète',
    codePostal: '34200',
    departement: 'Hérault',
    agenceSlug: 'saint-jean-de-vedas-a9',
    distanceKm: 25,
    distanceMin: 28,
    geo: { lat: 43.4053, lng: 3.697 },
    accroche:
      "Dépannage et remorquage à Sète, du port à la corniche : intervention 24h/24 sur l'île singulière et le bassin de Thau.",
    intro: [
      "Ville portuaire posée entre mer et étang, Sète cumule les contraintes de circulation : quais étroits qui bordent les canaux, montée du mont Saint-Clair, corniche exposée au vent et pont mobile qui rythme le trafic. Une panne y bloque vite une voie unique, et l'accès des dépanneuses demande de connaître le terrain. Montpellier Dépannage intervient sur toute l'île singulière, du théâtre de la Mer aux quais du vieux port.",
      "Notre agence de Saint-Jean-de-Védas, directement reliée à Sète par l'A9, mobilise plateaux VL et moyens poids lourds pour la ville comme pour la zone portuaire et le môle. Voiture en panne le long d'un canal, deux-roues immobilisé sur la corniche, poids lourd bloqué à l'entrée du port de commerce : nous prenons en charge l'intervention de jour comme de nuit, toute l'année.",
    ],
    reperes: [
      'Autoroute A9 (sortie Sète / Balaruc)',
      'Port de commerce & criée',
      'Mont Saint-Clair & corniche',
      'Quais et canaux du centre',
    ],
    acces:
      "Sète est reliée à notre agence de Saint-Jean-de-Védas par l'A9, ce qui permet une mobilisation directe vers l'île singulière et le bassin de Thau. Nos équipes connaissent les accès délicats du port, les quais et la montée du mont Saint-Clair, souvent inaccessibles à un plateau non préparé.",
    prestations: [
      {
        nom: 'Remorquage VL en ville',
        description:
          "Voitures en panne le long des canaux, sur la corniche ou dans les rues étroites du centre, treuillées et acheminées au garage de votre choix.",
      },
      {
        nom: 'Remorquage poids lourds & port',
        description:
          "Moyens de levage adaptés aux gros porteurs pour la zone portuaire, la criée et les accès au port de commerce.",
      },
      {
        nom: 'Intervention littoral',
        description:
          "Prise en charge sur le lido, la route de la corniche et les axes très fréquentés en saison, où l'immobilisation gêne fortement la circulation.",
      },
    ],
    alentours: [
      'Balaruc-les-Bains',
      'Frontignan',
      'Marseillan',
      'Bouzigues',
      'Poussan',
      'Mèze',
    ],
    faq: [
      {
        q: 'Intervenez-vous sur les quais et dans le centre de Sète ?',
        a: "Oui. Nos équipes prennent en charge les véhicules le long des canaux, sur les quais et dans les rues étroites du centre, avec le matériel adapté aux accès difficiles de l'île singulière.",
      },
      {
        q: 'Combien de temps pour arriver à Sète ?',
        a: "Sète est à environ 28 minutes de notre agence de Saint-Jean-de-Védas par l'A9. Le délai réel dépend du trafic et de la saison, mais l'astreinte fonctionne 24h/24.",
      },
      {
        q: 'Pouvez-vous remorquer un poids lourd sur la zone portuaire ?',
        a: "Oui, nous disposons de moyens de levage et de plateaux poids lourds pour intervenir sur le port de commerce et ses accès.",
      },
    ],
  },
  {
    slug: 'frontignan',
    ville: 'Frontignan',
    codePostal: '34110',
    departement: 'Hérault',
    agenceSlug: 'saint-jean-de-vedas-a9',
    distanceKm: 18,
    distanceMin: 22,
    geo: { lat: 43.4487, lng: 3.7561 },
    accroche:
      "Dépannage et remorquage à Frontignan et Frontignan-Plage : intervention 24h/24 entre étang de Thau, A9 et bord de mer.",
    intro: [
      "Entre l'étang de Thau et la Méditerranée, Frontignan s'étire de la ville muscat, tournée vers les chais et la voie ferrée, jusqu'à Frontignan-Plage et son cordon littoral. Le secteur mêle zones industrielles, raffinerie, campings estivaux et un lido où la circulation se densifie fortement l'été. Autant de configurations où une panne demande une prise en charge rapide et bien orientée.",
      "Rattachée à notre agence de Saint-Jean-de-Védas, toute proche par l'A9, Frontignan bénéficie d'interventions VL et poids lourds à toute heure. Panne sur la route de la plage, véhicule accidenté sur l'échangeur, utilitaire immobilisé en zone d'activités : nous acheminons votre véhicule vers le garage ou l'adresse de votre choix, 7 j/7.",
    ],
    reperes: [
      'Autoroute A9 (sortie Sète / Frontignan)',
      'Frontignan-Plage & lido',
      'Étang de Thau',
      "Zones d'activités & raffinerie",
    ],
    acces:
      "Frontignan est à quelques minutes de notre agence de Saint-Jean-de-Védas par l'A9. Cette proximité permet d'intervenir aussi bien dans la ville muscat qu'à Frontignan-Plage, sur les axes du littoral comme dans les zones industrielles.",
    prestations: [
      {
        nom: 'Dépannage VL',
        description:
          "Voitures en panne ou accidentées prises en charge dans la ville, sur la route de la plage et les axes vers l'A9.",
      },
      {
        nom: 'Remorquage poids lourds',
        description:
          "Plateaux et bras de levage pour les utilitaires et gros porteurs des zones d'activités et de la façade portuaire.",
      },
      {
        nom: 'Intervention estivale littoral',
        description:
          "Renfort sur le lido et les accès plage en haute saison, quand le trafic sature les voies d'accès à Frontignan-Plage.",
      },
    ],
    alentours: [
      'Sète',
      'Balaruc-les-Bains',
      'Balaruc-le-Vieux',
      'Vic-la-Gardiole',
      'Mireval',
      'Gigean',
    ],
    faq: [
      {
        q: 'Desservez-vous Frontignan-Plage en été ?',
        a: "Oui, y compris en haute saison. Nous intervenons sur le lido et les routes d'accès à la plage, où le trafic estival rend une immobilisation particulièrement gênante.",
      },
      {
        q: "Prenez-vous en charge les véhicules en zone d'activités ?",
        a: "Oui. Nos plateaux et moyens de levage couvrent les utilitaires et poids lourds des zones industrielles de Frontignan et de la façade portuaire.",
      },
    ],
  },
  {
    slug: 'villeneuve-les-maguelone',
    ville: 'Villeneuve-lès-Maguelone',
    codePostal: '34750',
    departement: 'Hérault',
    agenceSlug: 'saint-jean-de-vedas-a9',
    distanceKm: 9,
    distanceMin: 15,
    geo: { lat: 43.533, lng: 3.861 },
    accroche:
      "Dépannage et remorquage à Villeneuve-lès-Maguelone : intervention 24h/24 du village à la plage et à la cathédrale de Maguelone.",
    intro: [
      "Aux portes sud de Montpellier, Villeneuve-lès-Maguelone associe un centre en pleine croissance, des espaces naturels protégés et un littoral atypique où l'on rejoint la plage et la cathédrale de Maguelone par une route étroite bordée d'étangs. Le secteur est très fréquenté aux beaux jours et ses accès, parfois limités, demandent une intervention adaptée.",
      "Notre agence de Saint-Jean-de-Védas est voisine immédiate : quelques minutes suffisent pour rejoindre Villeneuve-lès-Maguelone. Nous y assurons le dépannage de véhicules légers et d'utilitaires, la sortie de véhicules dans les secteurs résidentiels comme la prise en charge sur les axes vers la mer, à toute heure et toute l'année.",
    ],
    reperes: [
      'Route de la plage & cathédrale de Maguelone',
      'Étangs et espaces naturels',
      'Proximité immédiate A9 / Saint-Jean-de-Védas',
      'Secteurs résidentiels en croissance',
    ],
    acces:
      "Villeneuve-lès-Maguelone jouxte notre agence de Saint-Jean-de-Védas : le délai de mobilisation y est parmi les plus courts de notre secteur. Nos équipes connaissent les accès au littoral et à la plage de Maguelone, ainsi que les quartiers résidentiels du village.",
    prestations: [
      {
        nom: 'Dépannage VL',
        description:
          "Voitures en panne ou accidentées prises en charge dans le village et sur les axes vers Montpellier et la plage.",
      },
      {
        nom: "Dépannage d'utilitaires",
        description:
          "Fourgons et véhicules utilitaires légers récupérés dans les zones résidentielles et le long des routes du littoral.",
      },
      {
        nom: 'Accès littoral & étangs',
        description:
          "Intervention sur la route de Maguelone et les accès plage, aux abords des étangs et des espaces naturels protégés.",
      },
    ],
    alentours: [
      'Saint-Jean-de-Védas',
      'Lattes',
      'Fabrègues',
      'Palavas-les-Flots',
      'Mireval',
    ],
    faq: [
      {
        q: 'Quel est le délai d’intervention à Villeneuve-lès-Maguelone ?',
        a: "La ville jouxte notre agence de Saint-Jean-de-Védas, ce qui en fait l'un de nos délais les plus courts. L'astreinte est assurée 24h/24 et 7j/7.",
      },
      {
        q: 'Intervenez-vous sur la route de la plage de Maguelone ?',
        a: "Oui, nous prenons en charge les véhicules sur les accès au littoral et à la cathédrale de Maguelone, y compris pendant la forte affluence estivale.",
      },
    ],
  },

  // ============================================================
  // Rattachées à Pérols — littoral est & Petite Camargue
  // ============================================================
  {
    slug: 'la-grande-motte',
    ville: 'La Grande-Motte',
    codePostal: '34280',
    departement: 'Hérault',
    agenceSlug: 'perols',
    distanceKm: 14,
    distanceMin: 18,
    geo: { lat: 43.562, lng: 4.087 },
    accroche:
      "Dépannage et remorquage à La Grande-Motte : intervention 24h/24 dans la station balnéaire, du port aux pyramides.",
    intro: [
      "Station balnéaire au plan très reconnaissable, La Grande-Motte voit sa population décupler l'été. Entre le port de plaisance, les avenues qui ceinturent les pyramides et les parkings saturés en haute saison, une panne peut vite immobiliser une voie de la station. Le reste de l'année, la ville garde une circulation dense autour du port et des zones résidentielles.",
      "Notre agence de Pérols, la plus proche sur le corridor littoral, dessert La Grande-Motte en quelques minutes. Nous y assurons le remorquage de véhicules légers, la prise en charge des utilitaires de livraison et l'intervention sur les axes d'accès, avec un renfort particulier pendant la saison estivale où l'affluence complique chaque déplacement.",
    ],
    reperes: [
      'Station balnéaire & pyramides',
      'Port de plaisance',
      "Forte affluence estivale",
      'Axe littoral vers Pérols / Carnon',
    ],
    acces:
      "La Grande-Motte est reliée à notre agence de Pérols par l'axe littoral, via Carnon. Nos équipes connaissent le plan de circulation de la station, ses avenues concentriques et les accès au port, souvent congestionnés en été.",
    prestations: [
      {
        nom: 'Remorquage VL',
        description:
          "Voitures en panne ou accidentées prises en charge dans la station et acheminées vers le garage de votre choix.",
      },
      {
        nom: 'Intervention estivale',
        description:
          "Renfort en haute saison sur les avenues, parkings et accès plage, quand l'affluence sature la circulation de la station.",
      },
      {
        nom: 'Utilitaires & livraisons',
        description:
          "Prise en charge des fourgons et utilitaires immobilisés autour du port et des commerces.",
      },
    ],
    alentours: [
      'Carnon',
      'Le Grau-du-Roi',
      'Aigues-Mortes',
      'Mauguio',
      'Pérols',
    ],
    faq: [
      {
        q: 'Intervenez-vous à La Grande-Motte en pleine saison estivale ?',
        a: "Oui. Nous savons que l'affluence estivale sature la circulation de la station : notre agence de Pérols, toute proche, assure les interventions 24h/24 y compris au cœur de l'été.",
      },
      {
        q: 'Pouvez-vous récupérer une voiture près du port ?',
        a: "Oui, nous intervenons sur l'ensemble de la station, y compris les abords du port de plaisance et les parkings des pyramides.",
      },
    ],
  },
  {
    slug: 'palavas-les-flots',
    ville: 'Palavas-les-Flots',
    codePostal: '34250',
    departement: 'Hérault',
    agenceSlug: 'perols',
    distanceKm: 8,
    distanceMin: 12,
    geo: { lat: 43.5285, lng: 3.93 },
    accroche:
      "Dépannage et remorquage à Palavas-les-Flots : intervention 24h/24 de part et d'autre du Lez, du port aux plages.",
    intro: [
      "Station familiale traversée par le Lez, Palavas-les-Flots concentre sur une bande étroite ses quais, ses ponts, son casino et ses plages. La circulation s'y fait sur des axes uniques que la fréquentation estivale sature rapidement ; une panne sur un pont ou un quai peut bloquer tout un secteur. Le stationnement contraint ajoute à la difficulté d'accès pour un plateau.",
      "À quelques minutes seulement de notre agence de Pérols, Palavas est l'une des zones les plus rapidement desservies du réseau. Nous y intervenons sur les véhicules légers en panne ou accidentés, les deux-roues et les utilitaires, avec une bonne connaissance des quais du Lez et des accès plage souvent encombrés.",
    ],
    reperes: [
      'Les deux rives du Lez',
      'Quais, ponts & port',
      'Plages et front de mer',
      'Proximité immédiate de Pérols',
    ],
    acces:
      "Palavas-les-Flots est directement reliée à notre agence de Pérols, à quelques minutes par la route du littoral. Nos équipes connaissent les quais du Lez, les ponts et les accès plage, où le stationnement estival complique les interventions.",
    prestations: [
      {
        nom: 'Remorquage VL',
        description:
          "Voitures en panne ou accidentées sur les quais, les ponts et les axes du front de mer, treuillées puis acheminées au garage.",
      },
      {
        nom: 'Accès plage & centre',
        description:
          "Intervention dans les secteurs à circulation contrainte et stationnement dense, typiques de la station.",
      },
      {
        nom: 'Deux-roues & utilitaires',
        description:
          "Prise en charge des scooters, motos et utilitaires immobilisés dans le centre et sur le front de mer.",
      },
    ],
    alentours: ['Pérols', 'Carnon', 'Lattes', 'Villeneuve-lès-Maguelone'],
    faq: [
      {
        q: 'Quel est le délai pour venir à Palavas-les-Flots ?',
        a: "Palavas est l'une de nos zones les plus proches : quelques minutes depuis notre agence de Pérols. L'astreinte est assurée 24h/24 et 7j/7.",
      },
      {
        q: 'Intervenez-vous sur les quais du Lez malgré le stationnement dense ?',
        a: "Oui. Nos équipes connaissent les contraintes d'accès de la station et interviennent sur les quais, les ponts et les abords des plages.",
      },
    ],
  },
  {
    slug: 'le-grau-du-roi',
    ville: 'Le Grau-du-Roi',
    codePostal: '30240',
    departement: 'Gard',
    agenceSlug: 'perols',
    distanceKm: 22,
    distanceMin: 28,
    geo: { lat: 43.537, lng: 4.136 },
    accroche:
      "Dépannage et remorquage au Grau-du-Roi et à Port-Camargue : intervention 24h/24 du chenal au plus grand port de plaisance d'Europe.",
    intro: [
      "Seule commune gardoise du littoral au sud, Le Grau-du-Roi vit au rythme de son chenal, de sa criée et de Port-Camargue, premier port de plaisance d'Europe. L'été, la station accueille une population immense et ses axes uniques — quais, pont tournant, route de l'Espiguette — deviennent extrêmement sensibles au moindre véhicule immobilisé.",
      "Depuis notre agence de Pérols, nous rejoignons Le Grau-du-Roi par le corridor littoral via La Grande-Motte. Nous y assurons le remorquage de véhicules légers, la prise en charge des utilitaires et l'intervention sur les grands parkings de l'Espiguette et de Port-Camargue, avec un dispositif renforcé pendant la saison estivale.",
    ],
    reperes: [
      'Port-Camargue (plus grand port de plaisance d’Europe)',
      "Plage de l'Espiguette",
      'Chenal & pont tournant',
      'Très forte affluence estivale',
    ],
    acces:
      "Le Grau-du-Roi est desservi depuis notre agence de Pérols par l'axe littoral, via Carnon et La Grande-Motte. Nos équipes connaissent le plan de la station, les accès à Port-Camargue et les grands parkings de l'Espiguette.",
    prestations: [
      {
        nom: 'Remorquage VL',
        description:
          "Voitures en panne ou accidentées prises en charge dans la station, à Port-Camargue et sur la route de l'Espiguette.",
      },
      {
        nom: 'Intervention Port-Camargue',
        description:
          "Prise en charge des véhicules et utilitaires sur les vastes parkings et abords du port de plaisance.",
      },
      {
        nom: 'Renfort estival',
        description:
          "Dispositif adapté à la très forte affluence de l'été, quand les axes uniques de la station saturent rapidement.",
      },
    ],
    alentours: [
      'Aigues-Mortes',
      'La Grande-Motte',
      'Port-Camargue',
      "L'Espiguette",
    ],
    faq: [
      {
        q: 'Desservez-vous Port-Camargue et la plage de l’Espiguette ?',
        a: "Oui, nous intervenons sur l'ensemble de la commune, y compris Port-Camargue et les grands parkings de l'Espiguette, très fréquentés en saison.",
      },
      {
        q: 'Le Grau-du-Roi est-il dans votre zone alors que c’est le Gard ?',
        a: "Oui. Bien qu'il soit gardois, Le Grau-du-Roi est desservi par notre agence de Pérols via le corridor littoral, à environ 28 minutes de route.",
      },
    ],
  },
  {
    slug: 'aigues-mortes',
    ville: 'Aigues-Mortes',
    codePostal: '30220',
    departement: 'Gard',
    agenceSlug: 'perols',
    distanceKm: 20,
    distanceMin: 26,
    geo: { lat: 43.5665, lng: 4.192 },
    accroche:
      "Dépannage et remorquage à Aigues-Mortes : intervention 24h/24 au pied des remparts, entre salins et Petite Camargue.",
    intro: [
      "Cité médiévale ceinte de remparts, Aigues-Mortes impose des contraintes de circulation particulières : intérieur des murailles quasi piéton, portes étroites, parkings périphériques et axes qui longent les salins et les canaux. La ville draine un tourisme important toute l'année, et une panne aux abords des remparts ou sur la route de la Camargue peut rapidement gêner l'accès au cœur historique.",
      "Rattachée à notre agence de Pérols via le littoral, Aigues-Mortes est prise en charge pour le remorquage de véhicules légers, les utilitaires et les interventions sur les axes de la Petite Camargue. Nos équipes connaissent les accès contraints autour des murailles et les parkings où les véhicules doivent être récupérés hors les murs.",
    ],
    reperes: [
      'Remparts & cité médiévale',
      'Salins & Petite Camargue',
      'Parkings hors les murs',
      'Route de la Camargue',
    ],
    acces:
      "Aigues-Mortes est desservie depuis notre agence de Pérols par l'axe littoral. Nos équipes connaissent les contraintes de la cité médiévale : circulation restreinte à l'intérieur des remparts et prise en charge des véhicules sur les parkings périphériques.",
    prestations: [
      {
        nom: 'Remorquage VL',
        description:
          "Voitures en panne ou accidentées récupérées aux abords des remparts et sur les parkings périphériques, puis acheminées au garage.",
      },
      {
        nom: 'Intervention Petite Camargue',
        description:
          "Prise en charge sur les routes des salins, des canaux et des axes touristiques vers la Camargue.",
      },
      {
        nom: 'Utilitaires & livraisons',
        description:
          "Fourgons et utilitaires immobilisés aux portes de la cité, où l'accès poids lourd est limité.",
      },
    ],
    alentours: [
      'Le Grau-du-Roi',
      'La Grande-Motte',
      'Saint-Laurent-d’Aigouze',
      'Marsillargues',
    ],
    faq: [
      {
        q: 'Pouvez-vous intervenir à l’intérieur des remparts ?',
        a: "La circulation à l'intérieur des remparts est très restreinte. Nous prenons généralement en charge les véhicules sur les parkings périphériques et aux portes de la cité, avec le matériel adapté aux accès étroits.",
      },
      {
        q: 'Aigues-Mortes fait-elle partie de votre zone ?',
        a: "Oui, la ville est desservie par notre agence de Pérols, à environ 26 minutes par l'axe littoral, 24h/24 et 7j/7.",
      },
    ],
  },
  {
    slug: 'mauguio',
    ville: 'Mauguio',
    codePostal: '34130',
    departement: 'Hérault',
    agenceSlug: 'perols',
    distanceKm: 6,
    distanceMin: 10,
    geo: { lat: 43.617, lng: 4.008 },
    accroche:
      "Dépannage et remorquage à Mauguio-Carnon : intervention 24h/24 entre le bourg, l'aéroport et le littoral.",
    intro: [
      "Vaste commune qui va du bourg historique de Mauguio jusqu'à la station de Carnon, le territoire englobe aussi l'aéroport Montpellier-Méditerranée et de grandes zones d'activités. Cette diversité — centre ancien, axes rapides vers l'aéroport, littoral touristique — multiplie les situations d'intervention, du simple démarrage impossible à l'accident sur voie rapide.",
      "Notre agence de Pérols est voisine immédiate de Mauguio : le délai de mobilisation y est très court. Nous assurons le remorquage de véhicules légers et de poids lourds, l'intervention aux abords de l'aéroport et la prise en charge des utilitaires en zone d'activités, à toute heure et toute l'année.",
    ],
    reperes: [
      'Aéroport Montpellier-Méditerranée',
      'Carnon & littoral',
      "Grandes zones d'activités",
      'Proximité immédiate de Pérols',
    ],
    acces:
      "Mauguio jouxte notre agence de Pérols, ce qui en fait l'une des zones les plus rapidement desservies. Nos équipes couvrent aussi bien le bourg que Carnon, les abords de l'aéroport et les zones d'activités environnantes.",
    prestations: [
      {
        nom: 'Remorquage VL & PL',
        description:
          "Véhicules légers et poids lourds pris en charge dans le bourg, sur les axes vers l'aéroport et en zone d'activités.",
      },
      {
        nom: 'Abords aéroport',
        description:
          "Intervention rapide sur les voies d'accès à l'aéroport Montpellier-Méditerranée et ses parkings.",
      },
      {
        nom: 'Littoral de Carnon',
        description:
          "Prise en charge des véhicules sur la station de Carnon et les accès plage, renforcée en saison estivale.",
      },
    ],
    alentours: [
      'Carnon',
      'Pérols',
      'La Grande-Motte',
      'Candillargues',
      'Mudaison',
      'Saint-Aunès',
    ],
    faq: [
      {
        q: 'Intervenez-vous près de l’aéroport Montpellier-Méditerranée ?',
        a: "Oui, l'aéroport est sur le territoire de Mauguio, à quelques minutes de notre agence de Pérols. Nous intervenons sur ses voies d'accès et ses parkings 24h/24.",
      },
      {
        q: 'Desservez-vous aussi Carnon ?',
        a: "Oui, Carnon fait partie de la commune de Mauguio. Nous y assurons le dépannage toute l'année, avec un renfort estival lié à l'affluence balnéaire.",
      },
    ],
  },

  // ============================================================
  // Rattachée à Montpellier Garosud — agglomération nord
  // ============================================================
  {
    slug: 'castelnau-le-lez',
    ville: 'Castelnau-le-Lez',
    codePostal: '34170',
    departement: 'Hérault',
    agenceSlug: 'montpellier-garosud',
    distanceKm: 9,
    distanceMin: 15,
    geo: { lat: 43.637, lng: 3.902 },
    accroche:
      "Dépannage et remorquage à Castelnau-le-Lez : intervention 24h/24 dans l'agglomération nord de Montpellier, le long du Lez et de la ligne 2.",
    intro: [
      "Deuxième ville de la métropole montpelliéraine, Castelnau-le-Lez prolonge Montpellier au nord-est, le long du Lez et de la ligne 2 du tramway. Le tissu urbain dense, les grands axes comme l'avenue de l'Europe ou la route de Nîmes, et les nouveaux quartiers en développement génèrent un trafic soutenu où l'immobilisation d'un véhicule se répercute vite sur la circulation.",
      "Notre siège de Montpellier Garosud, au sud de l'agglomération, couvre Castelnau-le-Lez avec l'ensemble de ses moyens : plateaux VL et poids lourds, atelier, flotte adaptée aux contraintes urbaines. Panne en zone résidentielle, sortie de parking souterrain, accident sur un grand axe : nos équipes interviennent de jour comme de nuit.",
    ],
    reperes: [
      'Agglomération nord de Montpellier',
      'Le Lez & ligne 2 du tramway',
      "Route de Nîmes / avenue de l'Europe",
      'Parkings souterrains résidentiels',
    ],
    acces:
      "Castelnau-le-Lez est couverte par notre siège de Montpellier Garosud, qui dispose de l'ensemble des moyens du réseau. La proximité au sein de l'agglomération permet une mobilisation rapide vers les quartiers et les grands axes de la ville.",
    prestations: [
      {
        nom: 'Remorquage VL',
        description:
          "Voitures en panne ou accidentées prises en charge dans les quartiers et sur les grands axes de la ville.",
      },
      {
        nom: 'Sortie de parking souterrain',
        description:
          "Plateaux rabaissés et matériel de treuillage pour extraire les véhicules des sous-sols des résidences.",
      },
      {
        nom: 'Remorquage poids lourds',
        description:
          "Moyens de levage pour les utilitaires et gros porteurs sur les axes structurants de l'agglomération.",
      },
    ],
    alentours: [
      'Montpellier',
      'Le Crès',
      'Clapiers',
      'Jacou',
      'Vendargues',
      'Montferrier-sur-Lez',
    ],
    faq: [
      {
        q: 'Pouvez-vous sortir un véhicule d’un parking souterrain à Castelnau-le-Lez ?',
        a: "Oui. Nos plateaux rabaissés et notre matériel de treuillage sont conçus pour extraire les véhicules des sous-sols des résidences, fréquents dans l'agglomération.",
      },
      {
        q: 'Quelle agence intervient à Castelnau-le-Lez ?',
        a: "Notre siège de Montpellier Garosud, qui regroupe l'atelier et l'ensemble des moyens du réseau, couvre Castelnau-le-Lez 24h/24 et 7j/7.",
      },
    ],
  },

  // ============================================================
  // Rattachées à Clermont-l'Hérault — A75 & vallée de l'Hérault
  // ============================================================
  {
    slug: 'lodeve',
    ville: 'Lodève',
    codePostal: '34700',
    departement: 'Hérault',
    agenceSlug: 'clermont-l-herault',
    distanceKm: 19,
    distanceMin: 18,
    geo: { lat: 43.732, lng: 3.316 },
    accroche:
      "Dépannage et remorquage à Lodève : intervention 24h/24 sur l'A75 et aux portes du Larzac.",
    intro: [
      "Sous-préfecture nichée au confluent de la Lergue et de la Soulondres, Lodève marque l'entrée du Larzac et le début des grandes rampes de l'A75 vers le viaduc de Millau. Cette position en fait un point de passage stratégique où pannes et surchauffes de véhicules sont fréquentes, notamment sur les longues montées et pour les poids lourds chargés.",
      "Notre agence de Clermont-l'Hérault, reliée à Lodève par l'A75, intervient sur la ville comme sur l'autoroute et ses échangeurs. Remorquage de véhicules légers, prise en charge des poids lourds sur les rampes, dépannage dans le centre ancien aux rues resserrées : nos équipes connaissent le secteur et ses contraintes, 24h/24.",
    ],
    reperes: [
      'Autoroute A75 (montées vers le Larzac)',
      'Porte du Larzac & Millau',
      'Centre ancien resserré',
      'Confluence Lergue / Soulondres',
    ],
    acces:
      "Lodève est reliée à notre agence de Clermont-l'Hérault par l'A75, axe qui permet une intervention directe sur la ville comme sur l'autoroute. Nos équipes sont habituées aux rampes du Larzac, où les poids lourds sont particulièrement exposés aux pannes.",
    prestations: [
      {
        nom: 'Remorquage VL',
        description:
          "Voitures en panne ou accidentées prises en charge dans Lodève et sur les axes vers l'A75.",
      },
      {
        nom: 'Dépannage autoroute A75',
        description:
          "Intervention sur les rampes et échangeurs de l'A75, où les longues montées vers le Larzac sollicitent fortement les véhicules.",
      },
      {
        nom: 'Remorquage poids lourds',
        description:
          "Bras de levage et plateaux PL pour les gros porteurs immobilisés sur l'autoroute ou ses abords.",
      },
    ],
    alentours: [
      'Le Bosc',
      'Soumont',
      'Le Puech',
      'Saint-Étienne-de-Gourgas',
      'Lauroux',
      'Clermont-l’Hérault',
    ],
    faq: [
      {
        q: 'Intervenez-vous sur l’A75 autour de Lodève ?',
        a: "Oui. Notre agence de Clermont-l'Hérault couvre l'A75, y compris les rampes vers le Larzac où les pannes et surchauffes sont fréquentes, pour les VL comme pour les poids lourds.",
      },
      {
        q: 'Combien de temps pour rejoindre Lodève ?',
        a: "Lodève est à environ 18 minutes de notre agence de Clermont-l'Hérault par l'A75. L'astreinte fonctionne 24h/24 et 7j/7.",
      },
    ],
  },
  {
    slug: 'gignac',
    ville: 'Gignac',
    codePostal: '34150',
    departement: 'Hérault',
    agenceSlug: 'clermont-l-herault',
    distanceKm: 13,
    distanceMin: 15,
    geo: { lat: 43.649, lng: 3.551 },
    accroche:
      "Dépannage et remorquage à Gignac : intervention 24h/24 sur l'A750, au cœur de la vallée de l'Hérault.",
    intro: [
      "Carrefour de la vallée de l'Hérault, Gignac commande les accès vers Saint-Guilhem-le-Désert, le pont du Diable et l'arrière-pays viticole, tout en étant relié à Montpellier par l'A750. Ce rôle de pôle draine un trafic important, entre axes rapides, route touristique le long du fleuve et centre-bourg animé par son marché.",
      "Notre agence de Clermont-l'Hérault, proche par l'A750, dessert Gignac pour le remorquage de véhicules légers et d'utilitaires comme pour les interventions sur l'autoroute. Panne sur la voie rapide, véhicule accidenté sur la route des gorges, utilitaire immobilisé au bourg : nous prenons en charge l'ensemble, de jour comme de nuit.",
    ],
    reperes: [
      'Autoroute A750 (Montpellier – vallée)',
      'Vallée de l’Hérault & pont du Diable',
      'Accès Saint-Guilhem-le-Désert',
      'Centre-bourg & marché',
    ],
    acces:
      "Gignac est reliée à notre agence de Clermont-l'Hérault par l'A750, ce qui permet une intervention rapide sur la ville comme sur l'axe autoroutier. Nos équipes connaissent les routes touristiques de la vallée et les accès parfois étroits vers les gorges.",
    prestations: [
      {
        nom: 'Remorquage VL',
        description:
          "Voitures en panne ou accidentées prises en charge dans le bourg et sur les axes de la vallée de l'Hérault.",
      },
      {
        nom: 'Dépannage autoroute A750',
        description:
          "Intervention sur l'A750 entre Montpellier et la vallée, pour les automobilistes et les professionnels.",
      },
      {
        nom: 'Utilitaires & vallée',
        description:
          "Prise en charge des utilitaires sur les routes touristiques du fleuve, vers Saint-Guilhem et le pont du Diable.",
      },
    ],
    alentours: [
      'Aniane',
      'Saint-André-de-Sangonis',
      'Popian',
      'Le Pouget',
      'Saint-Guilhem-le-Désert',
      'Clermont-l’Hérault',
    ],
    faq: [
      {
        q: 'Desservez-vous les gorges et Saint-Guilhem-le-Désert depuis Gignac ?',
        a: "Oui, nous intervenons sur les routes touristiques de la vallée de l'Hérault, vers le pont du Diable et Saint-Guilhem-le-Désert, en tenant compte de leurs accès parfois étroits.",
      },
      {
        q: 'Intervenez-vous sur l’A750 ?',
        a: "Oui. Notre agence de Clermont-l'Hérault couvre l'A750 qui relie Montpellier à la vallée, pour les véhicules légers comme pour les utilitaires.",
      },
    ],
  },

  // ============================================================
  // Rattachées à Fournès — Gard rhodanien & bassin nîmois
  // ============================================================
  {
    slug: 'nimes',
    ville: 'Nîmes',
    codePostal: '30000',
    departement: 'Gard',
    agenceSlug: 'fournes',
    distanceKm: 26,
    distanceMin: 30,
    geo: { lat: 43.8367, lng: 4.3601 },
    accroche:
      "Dépannage et remorquage à Nîmes : intervention 24h/24 dans la préfecture du Gard, de l'Écusson aux échangeurs A9 / A54.",
    intro: [
      "Préfecture du Gard, Nîmes conjugue un centre historique dense autour des arènes et de la Maison Carrée, des boulevards très circulés et une ceinture d'échangeurs où se croisent l'A9, l'A54 et les grands axes vers Alès et Avignon. Les rues étroites de l'Écusson, les zones piétonnes et le trafic des périphériques créent des situations d'intervention variées, du véhicule bloqué en centre-ville à l'accident sur voie rapide.",
      "Notre agence de Fournès, dans le Gard rhodanien, dessert Nîmes par l'A9 et l'A54. Nous y assurons le remorquage de véhicules légers et de poids lourds ainsi que l'intervention sur autoroute et voies rapides. Aux portes du centre historique comme sur les échangeurs, nos équipes prennent en charge votre véhicule de jour comme de nuit.",
    ],
    reperes: [
      'Échangeurs A9 / A54',
      "Écusson & centre historique (arènes)",
      'Boulevards et périphériques circulés',
      'Axes vers Alès et Avignon',
    ],
    acces:
      "Nîmes est desservie depuis notre agence de Fournès par l'A9 et l'A54. Cette liaison autoroutière permet d'intervenir aussi bien sur les échangeurs et voies rapides qu'aux portes du centre historique, où la circulation est restreinte.",
    prestations: [
      {
        nom: 'Remorquage VL',
        description:
          "Voitures en panne ou accidentées prises en charge dans la ville et sur les boulevards, puis acheminées au garage de votre choix.",
      },
      {
        nom: 'Dépannage autoroute A9 / A54',
        description:
          "Intervention sur les échangeurs et voies rapides qui ceinturent Nîmes, pour les automobilistes et les professionnels.",
      },
      {
        nom: 'Remorquage poids lourds',
        description:
          "Bras de levage et plateaux PL pour les gros porteurs sur autoroute et sur les axes structurants de l'agglomération.",
      },
    ],
    alentours: [
      'Marguerittes',
      'Caissargues',
      'Bouillargues',
      'Saint-Gervasy',
      'Redessan',
      'Manduel',
    ],
    faq: [
      {
        q: 'Nîmes est-elle vraiment dans votre zone d’intervention ?',
        a: "Oui. Notre agence de Fournès, dans le Gard rhodanien, dessert Nîmes par l'A9 et l'A54, à environ 30 minutes de route. Le délai réel dépend du trafic ; l'astreinte est assurée 24h/24.",
      },
      {
        q: 'Intervenez-vous dans le centre historique de Nîmes ?',
        a: "Oui, aux portes de l'Écusson et sur les boulevards. La circulation est restreinte dans les zones piétonnes autour des arènes : nous prenons alors en charge les véhicules sur les axes accessibles les plus proches.",
      },
      {
        q: 'Pouvez-vous remorquer un poids lourd autour de Nîmes ?',
        a: "Oui, nous disposons de moyens de levage et de plateaux poids lourds pour intervenir sur les échangeurs et voies rapides de l'agglomération nîmoise.",
      },
    ],
  },
  {
    slug: 'uzes',
    ville: 'Uzès',
    codePostal: '30700',
    departement: 'Gard',
    agenceSlug: 'fournes',
    distanceKm: 18,
    distanceMin: 22,
    geo: { lat: 44.0121, lng: 4.4196 },
    accroche:
      "Dépannage et remorquage à Uzès : intervention 24h/24 dans le premier duché de France, entre place aux Herbes et vallée de l'Eure.",
    intro: [
      "Premier duché de France, Uzès attire un flux touristique considérable autour de sa place aux Herbes, de ses hôtels particuliers et de la vallée de l'Eure. Le centre médiéval, largement piéton et bordé de ruelles étroites, s'organise autour de boulevards circulaires où le stationnement sature dès les beaux jours. Une panne y complique vite l'accès au cœur de ville.",
      "Notre agence de Fournès, toute proche, dessert Uzès et son bassin par les routes du Gard rhodanien. Nous y assurons le remorquage de véhicules légers et d'utilitaires, avec la connaissance des accès contraints du centre historique et des marchés qui animent la ville. Intervention de jour comme de nuit, toute l'année.",
    ],
    reperes: [
      'Centre médiéval & place aux Herbes',
      'Boulevards circulaires',
      'Vallée de l’Eure & Pont du Gard à proximité',
      'Forte affluence touristique',
    ],
    acces:
      "Uzès est desservie depuis notre agence de Fournès par les routes du Gard rhodanien. Nos équipes connaissent les boulevards circulaires du centre et les accès contraints des ruelles médiévales, où la circulation est restreinte.",
    prestations: [
      {
        nom: 'Remorquage VL',
        description:
          "Voitures en panne ou accidentées prises en charge sur les boulevards et aux abords du centre médiéval, puis acheminées au garage.",
      },
      {
        nom: 'Accès centre historique',
        description:
          "Prise en charge des véhicules sur les axes accessibles les plus proches des ruelles piétonnes et des jours de marché.",
      },
      {
        nom: "Dépannage d'utilitaires",
        description:
          "Fourgons et utilitaires immobilisés en ville ou dans les zones d'activités du bassin uzégeois.",
      },
    ],
    alentours: [
      'Saint-Quentin-la-Poterie',
      'Blauzac',
      'Arpaillargues-et-Aureillac',
      'Montaren-et-Saint-Médiers',
      'Vers-Pont-du-Gard',
    ],
    faq: [
      {
        q: 'Intervenez-vous dans le centre médiéval piéton d’Uzès ?',
        a: "La circulation y est restreinte. Nous prenons en charge les véhicules sur les boulevards circulaires et les axes accessibles les plus proches du centre historique.",
      },
      {
        q: 'Uzès est-elle loin de votre agence ?',
        a: "Non, Uzès est à environ 22 minutes de notre agence de Fournès par les routes du Gard rhodanien, avec une astreinte 24h/24 et 7j/7.",
      },
    ],
  },
  {
    slug: 'beaucaire',
    ville: 'Beaucaire',
    codePostal: '30300',
    departement: 'Gard',
    agenceSlug: 'fournes',
    distanceKm: 16,
    distanceMin: 20,
    geo: { lat: 43.8073, lng: 4.6435 },
    accroche:
      "Dépannage et remorquage à Beaucaire : intervention 24h/24 au bord du Rhône, entre canal, château et zones industrielles.",
    intro: [
      "Sur la rive droite du Rhône, face à Tarascon, Beaucaire garde l'empreinte de son passé de grande foire : un centre ancien resserré, un port de plaisance sur le canal du Rhône à Sète et d'importantes zones industrielles le long du fleuve. Le trafic mêle circulation urbaine, poids lourds des sites logistiques et flux de transit vers les Bouches-du-Rhône.",
      "Notre agence de Fournès dessert Beaucaire par les axes du Gard rhodanien. Nous y assurons le remorquage de véhicules légers et de poids lourds, avec une bonne connaissance des zones industrielles du bord de Rhône et des accès au centre historique. Nos équipes interviennent 24h/24, pour les particuliers comme pour les professionnels.",
    ],
    reperes: [
      'Bord du Rhône & pont vers Tarascon',
      'Canal du Rhône à Sète',
      'Zones industrielles & logistique',
      'Château et centre ancien',
    ],
    acces:
      "Beaucaire est desservie depuis notre agence de Fournès par les axes du Gard rhodanien. Nos équipes couvrent aussi bien le centre ancien que les grandes zones industrielles du bord de Rhône, où les poids lourds sont nombreux.",
    prestations: [
      {
        nom: 'Remorquage VL',
        description:
          "Voitures en panne ou accidentées prises en charge dans la ville et sur les axes vers le Rhône, puis acheminées au garage.",
      },
      {
        nom: 'Remorquage poids lourds',
        description:
          "Bras de levage et plateaux PL pour les gros porteurs des zones industrielles et logistiques du bord de Rhône.",
      },
      {
        nom: 'Utilitaires & bord de Rhône',
        description:
          "Prise en charge des utilitaires immobilisés aux abords du canal, du port de plaisance et des sites d'activités.",
      },
    ],
    alentours: [
      'Bellegarde',
      'Jonquières-Saint-Vincent',
      'Vallabrègues',
      'Fourques',
      'Comps',
    ],
    faq: [
      {
        q: 'Prenez-vous en charge les poids lourds des zones industrielles de Beaucaire ?',
        a: "Oui. Nos bras de levage et plateaux poids lourds sont adaptés aux gros porteurs des zones industrielles et logistiques du bord de Rhône.",
      },
      {
        q: 'Quelle agence intervient à Beaucaire ?',
        a: "Notre agence de Fournès, à environ 20 minutes par les axes du Gard rhodanien, dessert Beaucaire 24h/24 et 7j/7.",
      },
    ],
  },
  {
    slug: 'villeneuve-les-avignon',
    ville: 'Villeneuve-lès-Avignon',
    codePostal: '30400',
    departement: 'Gard',
    agenceSlug: 'fournes',
    distanceKm: 16,
    distanceMin: 20,
    geo: { lat: 43.966, lng: 4.796 },
    accroche:
      "Dépannage et remorquage à Villeneuve-lès-Avignon : intervention 24h/24 sur la rive gardoise du Rhône, face à Avignon.",
    intro: [
      "Sur la rive droite du Rhône, face au palais des Papes, Villeneuve-lès-Avignon veille depuis le fort Saint-André et la tour Philippe le Bel sur l'agglomération avignonnaise. Ville d'art très fréquentée, elle conjugue un centre historique en pente, des ruelles étroites et des ponts qui la relient à Avignon, points de passage où le trafic se concentre.",
      "Rattachée à notre agence de Fournès, dans le Gard rhodanien, Villeneuve-lès-Avignon est prise en charge pour le remorquage de véhicules légers et d'utilitaires. Nos équipes connaissent les accès en pente du centre historique et les axes qui franchissent le Rhône, souvent chargés. Intervention de jour comme de nuit, toute l'année.",
    ],
    reperes: [
      'Rive gardoise du Rhône, face à Avignon',
      'Fort Saint-André & tour Philippe le Bel',
      'Centre historique en pente',
      'Ponts vers Avignon',
    ],
    acces:
      "Villeneuve-lès-Avignon est desservie depuis notre agence de Fournès par les axes du Gard rhodanien. Nos équipes connaissent les rues en pente du centre historique et les ponts vers Avignon, où la circulation se concentre.",
    prestations: [
      {
        nom: 'Remorquage VL',
        description:
          "Voitures en panne ou accidentées prises en charge dans la ville et sur les axes vers le Rhône et Avignon.",
      },
      {
        nom: 'Accès centre historique',
        description:
          "Prise en charge des véhicules dans les rues en pente et étroites du centre, avec le matériel adapté.",
      },
      {
        nom: "Dépannage d'utilitaires",
        description:
          "Fourgons et utilitaires immobilisés en ville ou sur les axes de franchissement du Rhône.",
      },
    ],
    alentours: [
      'Les Angles',
      'Pujaut',
      'Rochefort-du-Gard',
      'Saze',
      'Sauveterre',
    ],
    faq: [
      {
        q: 'Intervenez-vous dans le centre historique en pente de Villeneuve-lès-Avignon ?',
        a: "Oui, avec le matériel adapté aux rues étroites et en pente du centre. Selon l'accès, le véhicule est pris en charge sur l'axe praticable le plus proche.",
      },
      {
        q: 'Villeneuve-lès-Avignon est-elle dans votre zone ?',
        a: "Oui, la ville est gardoise et desservie par notre agence de Fournès, à environ 20 minutes de route, 24h/24 et 7j/7.",
      },
    ],
  },
];

/** Retrouve une zone par son slug. */
export const getZone = (slug: string): Zone | undefined =>
  zones.find((z) => z.slug === slug);

/** Villes rattachées à une agence donnée (pour le maillage agence → villes). */
export const zonesByAgence = (agenceSlug: string): Zone[] =>
  zones.filter((z) => z.agenceSlug === agenceSlug);

/** L'agence de rattachement d'une zone (jointure vers data/agences.ts). */
export const getZoneAgence = (zone: Zone): Agence => {
  const agence = agences.find((a) => a.slug === zone.agenceSlug);
  if (!agence) {
    throw new Error(
      `Zone « ${zone.slug} » : agence de rattachement « ${zone.agenceSlug} » introuvable dans data/agences.ts`,
    );
  }
  return agence;
};
