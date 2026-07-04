// ============================================================
// SOURCE DE VÉRITÉ — les 6 services du réseau Montpellier Dépannage.
//
// Repris 1:1 des cartes de ServicesGrid (home). Chaque service porte
// désormais un rédactionnel long et unique (intro, déroulé, FAQ) pour
// les pages /services/{slug}/ — contenu SEO, pas de duplicate content.
// ============================================================

import { photos } from '../config/site';

/** Une étape du déroulé d'intervention. */
export type ServiceEtape = {
  titre: string;
  desc: string;
};

/** Une question/réponse — alimente la section FAQ + le JSON-LD FAQPage. */
export type ServiceFaq = {
  q: string;
  a: string;
};

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
  /** Paragraphes de présentation (section « Le service »). Unique par service. */
  intro: string[];
  /** Étapes concrètes de l'intervention (section « Le déroulé »). */
  deroule: ServiceEtape[];
  /** Questions fréquentes — section FAQ + données structurées FAQPage. */
  faq: ServiceFaq[];
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
    intro: [
      "Une voiture qui refuse de démarrer, une roue crevée sur la rocade, un accident au retour du travail : le remorquage de véhicules légers est le cœur de métier de Montpellier Dépannage depuis 1956. Nos plateaux interviennent 24 h/24 et 7 j/7 sur Montpellier, tout l'Hérault et le Gard, pour vous conduire en sécurité jusqu'au garage de votre choix.",
      "Nous disposons de plateaux rabaissés spécialement conçus pour les véhicules surbaissés et de prestige — berlines sportives, coupés, voitures de collection — ainsi que du matériel adapté à la sortie des parkings souterrains et des accès difficiles du centre-ville. Chaque véhicule est sanglé et calé avec soin : votre voiture voyage sans le moindre contact avec le sol.",
    ],
    deroule: [
      { titre: 'Votre appel', desc: "Vous nous décrivez le véhicule, le lieu exact de la panne et la destination souhaitée. Notre standard vous oriente vers le plateau le plus proche." },
      { titre: 'La mobilisation', desc: "Un dépanneur est dépêché immédiatement. Sur la zone Montpellier et l'A9, l'intervention est généralement assurée en moins de 45 minutes." },
      { titre: 'Le chargement', desc: "Le véhicule est treuillé sur le plateau, sanglé et sécurisé — y compris depuis un sous-sol ou une place étroite grâce à nos matériels rabaissés." },
      { titre: 'L’acheminement', desc: "Nous déposons votre voiture au garage, à votre domicile ou à l'adresse de votre choix, avec un devis transparent communiqué en amont." },
    ],
    faq: [
      { q: 'Pouvez-vous sortir un véhicule d’un parking souterrain ?', a: "Oui. Nos plateaux rabaissés et notre matériel de treuillage sont conçus pour extraire les véhicules des sous-sols et des accès à faible hauteur, courants dans le centre de Montpellier." },
      { q: 'Prenez-vous en charge les véhicules de luxe et surbaissés ?', a: "Absolument. Nous utilisons des plateaux rabaissés adaptés aux voitures de prestige et de sport, pour un chargement sans risque de frottement du bouclier ou du bas de caisse." },
      { q: 'Intervenez-vous la nuit et le week-end ?', a: "Oui, notre astreinte fonctionne 24 h/24 et 7 j/7, y compris les jours fériés, sur Montpellier, l'Hérault et le Gard." },
    ],
  },
  {
    slug: 'remorquage-poids-lourds',
    nom: 'Remorquage poids lourds',
    titre: 'Remorquage poids lourds',
    tag: '02',
    resume:
      'Flotte 4×4 avec bras, plateaux PL. Récupération de tout gabarit, jour et nuit.',
    photo: 'plRecuperation',
    intro: [
      "Un poids lourd immobilisé, c'est une marchandise bloquée et une route souvent partiellement neutralisée. Montpellier Dépannage met à disposition une flotte de dépanneuses lourdes 4×4 équipées de bras de levage et de plateaux PL, capable de récupérer tout gabarit — porteurs, tracteurs, semi-remorques, bus et engins — de jour comme de nuit.",
      "Nos équipes interviennent sur l'A9, l'A709, l'A75 et le réseau secondaire de l'Hérault et du Gard, en coordination avec les forces de l'ordre et les concessionnaires autoroutiers lorsque la sécurité de la voie l'exige. Relevage après renversement, sortie de fossé, remorquage vers un centre de réparation : nous prenons en charge l'ensemble de l'opération.",
    ],
    deroule: [
      { titre: 'Évaluation', desc: "Vous nous indiquez le type de véhicule, sa charge et la nature de l'immobilisation. Nous déterminons le matériel de levage à mobiliser." },
      { titre: 'Sécurisation', desc: "À l'arrivée, la zone est balisée et sécurisée, en lien avec les services de la route quand l'intervention a lieu sur autoroute." },
      { titre: 'Relevage & chargement', desc: "Bras de levage ou plateau PL selon la situation : le poids lourd est redressé puis chargé, y compris après renversement ou sortie de route." },
      { titre: 'Remorquage', desc: "Le véhicule est acheminé vers le centre de réparation ou la destination convenue, avec un suivi de l'opération de bout en bout." },
    ],
    faq: [
      { q: 'Récupérez-vous un poids lourd renversé ou dans le fossé ?', a: "Oui. Nos dépanneuses lourdes 4×4 et nos bras de levage permettent le relevage et l'extraction d'un porteur ou d'un ensemble après renversement ou sortie de route." },
      { q: 'Intervenez-vous sur autoroute pour les professionnels du transport ?', a: "Oui, nos équipes sont agréées et habituées aux interventions PL sur l'A9, l'A709 et l'A75, en coordination avec les services de sécurité." },
      { q: 'Quels gabarits pouvez-vous prendre en charge ?', a: "Porteurs, tracteurs et semi-remorques, bus et cars, ainsi que certains engins. Précisez la charge lors de l'appel pour que nous mobilisions le bon matériel." },
    ],
  },
  {
    slug: 'depannage-autoroute-a9',
    nom: 'Autoroute A9',
    titre: 'Dépannage sur autoroute A9',
    tag: '03',
    resume:
      'Agréés autoroutes, partenaires Vinci. Intervention rapide sur le réseau Hérault.',
    photo: 'interventionA9',
    intro: [
      "Tomber en panne sur l'A9 est l'une des situations les plus dangereuses pour un automobiliste : trafic dense, vitesse élevée, bande d'arrêt d'urgence exposée. Montpellier Dépannage est agréé pour l'intervention sur autoroute et travaille en partenariat avec les concessionnaires du réseau, ce qui nous permet d'intervenir vite et dans le respect strict des règles de sécurité.",
      "Nos agences de Saint-Jean-de-Védas et de Villetelle sont positionnées de part et d'autre de Montpellier, au plus près des échangeurs de l'A9 et de l'A709, pour réduire le délai de mobilisation. Sur autoroute, la demande de dépannage passe par le poste d'appel d'urgence (bornes oranges) ou le 112 : les secours vous orientent alors vers le dépanneur agréé du secteur.",
    ],
    deroule: [
      { titre: 'Mise en sécurité', desc: "Placez-vous derrière la glissière, gilet enfilé, et appelez depuis une borne d'urgence orange ou le 112 : c'est la procédure officielle sur autoroute." },
      { titre: 'Attribution', desc: "Le gestionnaire de l'autoroute mandate le dépanneur agréé du secteur. Sur notre zone, c'est fréquemment une équipe Montpellier Dépannage." },
      { titre: 'Intervention', desc: "Notre dépanneuse arrive avec signalisation renforcée, sécurise l'intervention et prend en charge le véhicule sur la bande d'arrêt d'urgence." },
      { titre: 'Sortie du réseau', desc: "Le véhicule est remorqué jusqu'à une aire ou un garage hors autoroute, où le dépannage se poursuit ou où vous récupérez votre voiture." },
    ],
    faq: [
      { q: 'Comment appeler un dépanneur sur l’autoroute A9 ?', a: "Utilisez une borne d'appel d'urgence orange (tous les 2 km) ou composez le 112. Le tarif du dépannage sur autoroute est réglementé par l'État. Le gestionnaire mande alors le dépanneur agréé du secteur." },
      { q: 'Êtes-vous agréés pour intervenir sur autoroute ?', a: "Oui, Montpellier Dépannage est agréé pour l'intervention autoroutière et partenaire des concessionnaires du réseau, dont Vinci Autoroutes." },
      { q: 'Sur quels axes intervenez-vous ?', a: "Principalement l'A9 et l'A709 autour de Montpellier, ainsi que l'A75 à l'ouest et le réseau du Gard rhodanien depuis notre agence de Fournès." },
    ],
  },
  {
    slug: 'transport-international',
    nom: 'Transport international',
    titre: 'Transport international & rapatriement',
    tag: '04',
    resume:
      'France, Belgique, Italie, Espagne. Rapatriement de véhicules accidentés.',
    photo: 'transportInternational',
    intro: [
      "Un véhicule accidenté ou immobilisé à l'étranger, ou au contraire à rapatrier vers un autre pays : Montpellier Dépannage organise le transport international de véhicules à travers la France, la Belgique, l'Italie et l'Espagne. Nous gérons l'ensemble de la logistique, de l'enlèvement à la livraison, pour les particuliers comme pour les professionnels et les compagnies d'assistance.",
      "Ce service s'adresse aussi bien au rapatriement d'un véhicule accidenté après un séjour ou un déplacement professionnel qu'au transport d'un véhicule vendu, d'une voiture de collection ou d'un utilitaire vers une autre destination européenne. Chaque transport fait l'objet d'un itinéraire et d'un devis clairs, communiqués avant le départ.",
    ],
    deroule: [
      { titre: 'Prise de contact', desc: "Vous nous précisez le point d'enlèvement, la destination et l'état du véhicule. Nous établissons un devis de transport transparent." },
      { titre: 'Organisation', desc: "Nous planifions l'itinéraire et la date d'enlèvement, en coordination avec votre assistance ou votre assureur si le transport en dépend." },
      { titre: 'Enlèvement', desc: "Le véhicule est chargé et arrimé sur un plateau adapté à la longue distance, roulant ou non roulant." },
      { titre: 'Livraison', desc: "Nous acheminons le véhicule jusqu'à l'adresse convenue en France ou en Europe, et vous confirmons la bonne livraison." },
    ],
    faq: [
      { q: 'Vers quels pays assurez-vous le transport ?', a: "Principalement la France, la Belgique, l'Italie et l'Espagne. Contactez-nous pour toute autre destination européenne, nous étudions chaque demande." },
      { q: 'Pouvez-vous transporter un véhicule non roulant ou accidenté ?', a: "Oui. Nos plateaux sont équipés pour charger et arrimer un véhicule accidenté ou non roulant sur longue distance, en toute sécurité." },
      { q: 'Travaillez-vous avec les compagnies d’assistance ?', a: "Oui, nous sommes agréés auprès de toutes les compagnies d'assistance et pouvons organiser le rapatriement directement dans le cadre de votre contrat." },
    ],
  },
  {
    slug: 'centre-ville-zones-pietonnes',
    nom: 'Centre-ville & zones piétonnes',
    titre: 'Intervention centre-ville & zones piétonnes',
    tag: '05',
    resume:
      'Flotte électrique zéro émission : véhicule compact et scooters pour intervenir dans le cœur historique : Comédie, Antigone, Peyrou.',
    photo: 'flotteElectrique',
    intro: [
      "Le cœur historique de Montpellier — Comédie, Écusson, Antigone, Peyrou — est fait de rues étroites, de zones piétonnes et de bornes d'accès qui rendent l'intervention d'une dépanneuse classique difficile, voire impossible. Pour y répondre, Montpellier Dépannage a constitué une flotte électrique zéro émission : un véhicule compact et des scooters capables de se faufiler là où les gros porteurs ne passent pas.",
      "Cette approche présente un double avantage : la rapidité, en s'affranchissant des contraintes de circulation du centre, et le respect de l'environnement urbain, sans bruit ni émissions dans les secteurs les plus sensibles de la ville. Panne, batterie à plat, véhicule à déplacer : nous intervenons au plus près, dans le respect des règles d'accès aux zones piétonnes.",
    ],
    deroule: [
      { titre: 'Localisation', desc: "Vous nous indiquez précisément la rue ou la place concernée dans le centre. Nous identifions l'accès le plus adapté à la zone piétonne." },
      { titre: 'Intervention légère', desc: "Notre équipe se déplace en véhicule électrique compact ou en scooter pour un premier diagnostic : dépannage sur place quand c'est possible." },
      { titre: 'Prise en charge', desc: "Si le véhicule doit être évacué, nous coordonnons son déplacement jusqu'à un point accessible à un plateau, dans le respect des accès." },
      { titre: 'Finalisation', desc: "Le véhicule est remis en circulation ou acheminé au garage, avec un devis transparent communiqué avant toute opération." },
    ],
    faq: [
      { q: 'Intervenez-vous dans les zones piétonnes de Montpellier ?', a: "Oui. Notre flotte électrique compacte est spécialement dédiée au centre historique : Comédie, Écusson, Antigone, Peyrou et les rues à accès restreint." },
      { q: 'Pourquoi une flotte électrique ?', a: "Elle permet d'accéder rapidement aux secteurs piétons et à faibles émissions, sans bruit ni pollution, là où une dépanneuse classique ne peut pas circuler." },
      { q: 'Que faire si ma voiture est en panne en plein centre ?', a: "Appelez notre standard 24 h/24. Nous dépêchons l'équipe la plus adaptée à l'accès et organisons, si besoin, l'évacuation vers un point où un plateau peut prendre le relais." },
    ],
  },
  {
    slug: 'mecanique-gpl-climatisation',
    nom: 'Mécanique · GPL · Clim',
    titre: 'Mécanique, GPL & climatisation',
    tag: '06',
    resume:
      'Entretien véhicules, installation systèmes GPL, révision climatisation.',
    photo: 'peyrou',
    intro: [
      "Au-delà du remorquage, Montpellier Dépannage dispose d'ateliers mécaniques intégrés, notamment sur les sites de Garosud et de Pérols. Nos équipes assurent l'entretien courant de votre véhicule, les réparations, ainsi que deux spécialités qui font notre réputation : l'installation de systèmes GPL et la révision de la climatisation.",
      "Confier l'entretien à un réseau de dépannage, c'est bénéficier d'un interlocuteur unique : le même professionnel qui connaît votre véhicule peut aussi bien réaliser sa révision que le prendre en charge en cas de panne. Diagnostic clair, devis transparent et travail soigné : nous appliquons à l'atelier la même exigence que sur la route.",
    ],
    deroule: [
      { titre: 'Diagnostic', desc: "Vous nous exposez votre besoin — entretien, bruit suspect, pose GPL, climatisation. Nous établissons un diagnostic et un devis avant intervention." },
      { titre: 'Rendez-vous', desc: "Nous planifions le passage à l'atelier de Garosud ou de Pérols selon la nature des travaux et votre disponibilité." },
      { titre: 'Réalisation', desc: "Entretien, réparation, installation d'un système GPL ou recharge et contrôle de la climatisation : le travail est réalisé par nos mécaniciens." },
      { titre: 'Restitution', desc: "Le véhicule vous est rendu contrôlé, avec le détail des opérations effectuées et les conseils d'entretien associés." },
    ],
    faq: [
      { q: 'Installez-vous des systèmes GPL ?', a: "Oui, l'installation de systèmes GPL fait partie des spécialités de nos ateliers, avec un diagnostic et un devis préalables." },
      { q: 'Rechargez-vous la climatisation ?', a: "Oui, nous assurons la révision et la recharge de la climatisation, ainsi que le contrôle du circuit et la recherche de fuites." },
      { q: 'Où se trouvent vos ateliers mécaniques ?', a: "Principalement sur nos sites de Montpellier Garosud (siège du réseau) et de Pérols, tous deux équipés pour l'entretien et la réparation." },
    ],
  },
];

/** Retrouve un service par son slug. */
export const getService = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);
