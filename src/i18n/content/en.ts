// ============================================================
// Contenu anglais — traduction éditoriale, pas littérale.
//
// La cible n'est pas « le lecteur français en anglais » mais
// l'automobiliste étranger immobilisé dans l'Hérault ou sur l'A9 :
// touriste, routier européen, conducteur de location. Le texte va donc
// droit au numéro, explique la procédure autoroutière française (bornes
// oranges, 112, tarif réglementé) et lève les doutes propres à une panne
// à l'étranger — autant de choses qu'un francophone n'a pas besoin qu'on
// lui explique.
//
// Vocabulaire : anglais britannique (« tyre », « motorway », « recovery »),
// registre du marché européen dont viennent la majorité des visiteurs
// anglophones du site (GB, IE, NL, DE, pays scandinaves).
// ============================================================

import { registerServiceSlugs } from '../config';
import type { LocalizedContent } from '../types';

export const en: LocalizedContent = {
  ui: {
    navServices: 'Services',
    navCoverage: 'Coverage',
    navHome: 'Home',
    callNow: 'Call now',
    emergency: '24/7 emergency',
    available: 'Available 24 hours a day, every day',
    languageLabel: 'Language',
    breadcrumbLabel: 'Breadcrumb',
    servicesHeading: 'Our services',
    stepsHeading: 'How it works',
    faqHeading: 'Frequently asked questions',
    otherServices: 'Other services',
    backToServices: 'All services',
    footerServices: 'Services',
    footerNetwork: 'Company',
    footerLegal: 'Legal',
    footerFrenchSite: 'Site en français',
    footerRights: 'Motorway-approved · NF Service certified',
    fullSiteNotice:
      'This is the English section of our site. Agency pages, town-by-town coverage and legal notices are published in French.',
    fullSiteLink: 'Go to the full French site',
    skipToContent: 'Skip to main content',
  },

  home: {
    title:
      'Montpellier Dépannage · 24/7 Towing & Vehicle Recovery · Montpellier, Hérault & A9',
    description:
      'Broken down near Montpellier or on the A9 motorway? English-speaking towing and vehicle recovery, 24 hours a day. Cars, motorhomes, heavy goods vehicles. Over 30 years of experience, 8 depots across the Hérault and the Gard.',
    heroPill: '24 hours a day · 7 days a week',
    heroTitle: 'Broken down in the south of France?',
    heroTitleAccent: 'We tow, day and night.',
    heroLead:
      'Montpellier Dépannage is a family-run recovery company operating around Montpellier and along the A9 motorway for more than 30 years. Over 40 tow trucks, 8 depots, motorway approval — and staff used to assisting drivers from abroad.',
    heroReassure: [
      'Motorway-approved · A9 and A709',
      'Working with every European breakdown insurer',
      'Cars, motorhomes, motorcycles and lorries',
    ],
    stats: [
      { value: '30+', label: 'Years in business', kicker: 'Family-run since day one' },
      { value: '40', label: 'Recovery vehicles', kicker: 'Incl. 4×4 and low-loaders' },
      { value: '8', label: 'Depots', kicker: 'Hérault & Gard' },
      { value: '24/7', label: 'On call', kicker: 'Nights, weekends, holidays' },
    ],

    trustOverline: 'Why call us',
    trustHeading: 'A breakdown abroad is stressful enough.',
    trustBody: [
      'Being stranded in a country whose language you do not speak, with a hire car you did not choose and a holiday timetable falling apart, is not a normal breakdown. It is the reason we answer the phone ourselves, around the clock, and why our operators are used to working out a location from a landmark, a motorway marker or a phone position rather than a French address.',
      'Montpellier Dépannage has been recovering vehicles around Montpellier since the 1990s. We are approved for motorway work on the A9 and A709, certified NF Service by AFNOR — the French national quality standard for recovery operators — and we work directly with the European assistance companies behind most travel and vehicle insurance policies. In most cases that means no money changes hands: we invoice your insurer.',
    ],
    trustPoints: [
      {
        titre: 'We deal with your insurer',
        desc: 'We are approved by every major European assistance network. If your policy covers recovery, we bill them directly and you pay nothing upfront.',
      },
      {
        titre: 'Motorway approved',
        desc: 'Official recovery operator for the A9 and A709 around Montpellier, working alongside the motorway concession and the emergency services.',
      },
      {
        titre: 'Any vehicle',
        desc: 'Cars and hire cars, motorhomes and caravans, motorcycles, vans, lorries and coaches — including low-loaders for sports and classic cars.',
      },
      {
        titre: 'Cross-border transport',
        desc: 'We repatriate vehicles to and from Belgium, Italy and Spain, so a car that cannot be repaired here does not have to be abandoned here either.',
      },
    ],

    servicesOverline: 'What we do',
    servicesHeading: 'Recovery, towing and workshop services.',
    servicesLead:
      'Six services covering everything from a flat battery in central Montpellier to a lorry overturned on the A9, plus long-distance vehicle transport across western Europe.',

    coverageOverline: 'Where we operate',
    coverageHeading: 'Montpellier, the coast, and the A9 corridor.',
    coverageLead:
      'Eight depots across the Hérault and the Gard put a recovery vehicle close to the motorway at all times — from Sète and the Thau lagoon to Nîmes, and from the beaches of La Grande-Motte to the A75 climbing towards the Larzac.',
    coverageCta: 'See the full coverage area',

    breakdownOverline: 'If it happens to you',
    breakdownHeading: 'What to do when you break down in France.',
    breakdownSteps: [
      {
        titre: 'On a motorway, do not call us first',
        desc: 'French law reserves motorway recovery to the operator approved for that section. Pull onto the hard shoulder, get everyone behind the safety barrier, put on a high-visibility vest, then use an orange emergency phone (one every 2 km) or dial 112. Prices on the motorway are set by the State. The operator dispatched is often us.',
      },
      {
        titre: 'On any other road, call us directly',
        desc: 'Off the motorway network you are free to choose your recovery company. Call our number, describe the vehicle and where you are — a village name, a junction number or a shared phone location is enough.',
      },
      {
        titre: 'Have your policy to hand',
        desc: 'Your travel insurance, credit card, hire agreement or manufacturer warranty very often includes recovery. Tell us the insurer and we will contact them, so the job is covered rather than paid out of pocket.',
      },
      {
        titre: 'Tell us where the vehicle should go',
        desc: 'A garage, your hotel, the airport, the hire company depot, or straight onto a transporter home. We agree the destination and the price with you before we load.',
      },
    ],

    faq: [
      {
        q: 'Do you speak English?',
        a: 'Yes. Our office and several of our drivers speak English, and we handle drivers from across Europe every week — this stretch of the A9 is one of the busiest holiday routes on the continent.',
      },
      {
        q: 'I broke down on the A9 motorway. What should I do?',
        a: 'Stop on the hard shoulder, put everyone behind the barrier, wear a high-visibility vest and call from an orange emergency phone or dial 112. On French motorways only the approved operator for that section may recover you, and the tariff is fixed by the State. Montpellier Dépannage is the approved operator on much of the Montpellier stretch.',
      },
      {
        q: 'Will my insurance cover the recovery?',
        a: 'Usually yes. Most European motor policies, travel insurance, premium credit cards and hire agreements include breakdown cover in France. Give us the insurer name and policy number and we will deal with them directly, so in most cases you pay nothing on the spot.',
      },
      {
        q: 'Can you recover a motorhome or a caravan?',
        a: 'Yes. We run heavy recovery vehicles with lifting arms and long low-loaders suitable for motorhomes, caravans and light lorries, which is a frequent request along the coast in summer.',
      },
      {
        q: 'My hire car has broken down. Who do I call?',
        a: 'Call the hire company first — most contracts require it and they may nominate a specific operator. If they leave the choice to you, or cannot reach anyone at night, call us and we will recover the car to their depot or the nearest approved garage.',
      },
      {
        q: 'Can you transport my car back to my home country?',
        a: 'Within France, Belgium, Italy and Spain, yes — we organise long-distance transport for vehicles that cannot be driven, whether after an accident or a terminal breakdown. Ask us about other European destinations; we look at each request.',
      },
    ],

    ctaTitle: 'Stranded? Call us now.',
    ctaLead: 'A recovery driver is on call, 24 hours a day, every day of the year.',
  },

  serviceIndex: {
    title: 'Our services · Towing, recovery and vehicle transport — Montpellier Dépannage',
    description:
      'Car and heavy vehicle towing, A9 motorway recovery, city-centre electric fleet, international vehicle transport and mechanical workshops around Montpellier. Available 24/7.',
    overline: 'Services',
    heading: 'Six services, one phone number.',
    lead:
      'From a car that will not start in the old town to a lorry off the road on the A9, and on to transporting a vehicle across Europe — everything Montpellier Dépannage does, in detail.',
  },

  services: [
    {
      slugFr: 'remorquage-vehicules-legers',
      slug: 'car-towing',
      nom: 'Car towing',
      titre: 'Car and prestige vehicle towing',
      tag: '01',
      resume:
        'Cars that will not start or have been in an accident, underground car park extraction, low-loaders for sports and prestige vehicles.',
      intro: [
        'A car that refuses to start, a blowout on the ring road, an accident on the way back from the beach: recovering light vehicles has been the core of what Montpellier Dépannage does for more than 30 years. Our trucks operate 24 hours a day across Montpellier, the whole of the Hérault and into the Gard, taking your vehicle safely to the garage of your choice.',
        'We run low-loaders built for lowered and prestige vehicles — sports saloons, coupés, classic cars — as well as equipment designed for underground car parks and the awkward access of the historic centre. Every vehicle is strapped and chocked with care: your car travels without ever touching the ground.',
      ],
      deroule: [
        {
          titre: 'Your call',
          desc: 'Tell us the vehicle, exactly where it is and where it needs to go. Our office assigns the nearest available truck. A landmark or a shared phone location is enough if you do not have a French address.',
        },
        {
          titre: 'Dispatch',
          desc: 'A driver is sent straight away. Around Montpellier and along the A9, recovery is usually under way within 45 minutes.',
        },
        {
          titre: 'Loading',
          desc: 'The vehicle is winched onto the bed, strapped and secured — including out of a basement car park or a tight parking space, thanks to our low-clearance equipment.',
        },
        {
          titre: 'Delivery',
          desc: 'We drop your car at the garage, your accommodation or any address you choose, with the price agreed in advance.',
        },
      ],
      faq: [
        {
          q: 'Can you get a car out of an underground car park?',
          a: 'Yes. Our low-loaders and winching equipment are made for basements and low-headroom entrances, which are common in central Montpellier.',
        },
        {
          q: 'Do you handle prestige and lowered vehicles?',
          a: 'Absolutely. We use low-approach beds suited to sports and luxury cars, so the front bumper and underbody are never scraped during loading.',
        },
        {
          q: 'Do you work at night and at weekends?',
          a: 'Yes, we are on call 24 hours a day, 7 days a week, including public holidays, across Montpellier, the Hérault and the Gard.',
        },
      ],
    },
    {
      slugFr: 'remorquage-poids-lourds',
      slug: 'heavy-vehicle-recovery',
      nom: 'Heavy vehicle recovery',
      titre: 'Heavy goods vehicle recovery',
      tag: '02',
      resume:
        '4×4 recovery fleet with lifting arms and heavy low-loaders. Any size of vehicle, day or night.',
      intro: [
        'An immobilised lorry means freight stuck and, very often, a lane closed. Montpellier Dépannage operates a fleet of 4×4 heavy recovery vehicles fitted with lifting arms and heavy-duty low-loaders, able to recover any size of vehicle — rigids, tractor units, semi-trailers, coaches and plant — around the clock.',
        'Our crews work on the A9, the A709, the A75 and the secondary network of the Hérault and the Gard, in coordination with the police and the motorway concession whenever road safety requires it. Righting an overturned vehicle, pulling a lorry out of a ditch, towing to a repair centre: we handle the whole operation.',
      ],
      deroule: [
        {
          titre: 'Assessment',
          desc: 'Tell us the type of vehicle, its load and how it is immobilised, so we can decide which lifting equipment to send.',
        },
        {
          titre: 'Making the scene safe',
          desc: 'On arrival the area is signed and secured, working with the road authorities when the job is on a motorway.',
        },
        {
          titre: 'Lifting and loading',
          desc: 'Lifting arm or heavy low-loader depending on the situation: the vehicle is righted then loaded, including after a rollover or a run off the road.',
        },
        {
          titre: 'Recovery',
          desc: 'The vehicle is taken to the repair centre or agreed destination, with the operation tracked from end to end.',
        },
      ],
      faq: [
        {
          q: 'Can you recover an overturned lorry or one in a ditch?',
          a: 'Yes. Our 4×4 heavy recovery vehicles and lifting arms are made for righting and extracting rigids and articulated combinations after a rollover or a run off the road.',
        },
        {
          q: 'Do you work on the motorway for haulage operators?',
          a: 'Yes, our crews are approved and used to heavy recovery on the A9, A709 and A75, coordinated with the emergency services.',
        },
        {
          q: 'What sizes can you handle?',
          a: 'Rigids, tractor units and semi-trailers, coaches and buses, and some plant. Tell us the weight when you call so we send the right equipment.',
        },
      ],
    },
    {
      slugFr: 'depannage-autoroute-a9',
      slug: 'a9-motorway-recovery',
      nom: 'A9 motorway',
      titre: 'A9 motorway breakdown recovery',
      tag: '03',
      resume:
        'Officially approved motorway operator, working with the concession. Fast response across the Hérault network.',
      intro: [
        'Breaking down on the A9 is one of the most dangerous situations a driver can face: heavy traffic, high speeds and an exposed hard shoulder. Montpellier Dépannage is an approved motorway recovery operator and works in partnership with the network concession, which lets us respond quickly and within the strict safety rules that apply.',
        'Our depots at Saint-Jean-de-Védas and Villetelle sit either side of Montpellier, as close as possible to the A9 and A709 junctions, to cut response times. Important: on a French motorway you cannot choose your recovery company. You must call from an orange emergency phone or dial 112, and the network operator dispatches the approved operator for that section — frequently one of our crews.',
      ],
      deroule: [
        {
          titre: 'Make yourself safe',
          desc: 'Pull onto the hard shoulder, get everyone out on the verge side and behind the safety barrier, put on a high-visibility vest, and use an orange emergency phone or dial 112. This is the official procedure and it is what keeps you safe.',
        },
        {
          titre: 'Dispatch',
          desc: 'The motorway operator assigns the approved recovery company for that section. In our area, that is frequently a Montpellier Dépannage crew.',
        },
        {
          titre: 'Recovery',
          desc: 'Our truck arrives with enhanced warning lighting, secures the scene and loads the vehicle from the hard shoulder.',
        },
        {
          titre: 'Leaving the network',
          desc: 'The vehicle is taken to a service area or a garage off the motorway, where repairs continue or you collect the car.',
        },
      ],
      faq: [
        {
          q: 'How do I call for recovery on the A9 motorway?',
          a: 'Use an orange emergency telephone — there is one every 2 km — or dial 112. Recovery prices on French motorways are set by the State. The network operator then dispatches the approved company for that section; you cannot call a company of your own choosing while on the motorway.',
        },
        {
          q: 'Are you approved for motorway work?',
          a: 'Yes, Montpellier Dépannage is an approved motorway recovery operator and a partner of the network concessions, including Vinci Autoroutes.',
        },
        {
          q: 'Which roads do you cover?',
          a: 'Mainly the A9 and A709 around Montpellier, plus the A75 to the west and the Gard rhodanien network from our Fournès depot.',
        },
        {
          q: 'How much does motorway recovery cost in France?',
          a: 'The tariff for light vehicles on the motorway network is regulated and revised annually by the French State, so it is the same whichever approved operator attends. Your insurer or assistance provider will usually reimburse or settle it directly.',
        },
      ],
    },
    {
      slugFr: 'transport-international',
      slug: 'international-vehicle-transport',
      nom: 'International transport',
      titre: 'International vehicle transport and repatriation',
      tag: '04',
      resume:
        'France, Belgium, Italy and Spain. Repatriation of accident-damaged and non-running vehicles.',
      intro: [
        'A vehicle damaged or immobilised abroad, or one that needs to travel to another country: Montpellier Dépannage organises international vehicle transport across France, Belgium, Italy and Spain. We handle the whole operation, from collection to delivery, for private owners as well as trade customers and assistance companies.',
        'This is the service to ask about when a car cannot realistically be repaired where it stands — an accident at the end of a holiday, a terminal failure far from home, a classic or a sold vehicle that must travel on a transporter rather than under its own power. Every job comes with a clear route and a fixed quote, agreed before we set off.',
      ],
      deroule: [
        {
          titre: 'First contact',
          desc: 'Tell us the collection point, the destination and the condition of the vehicle. We issue a transparent transport quote.',
        },
        {
          titre: 'Planning',
          desc: 'We set the route and collection date, coordinating with your assistance provider or insurer where they are funding the move.',
        },
        {
          titre: 'Collection',
          desc: 'The vehicle is loaded and secured on a transporter suited to long-distance work, running or not.',
        },
        {
          titre: 'Delivery',
          desc: 'We deliver to the agreed address in France or elsewhere in Europe and confirm arrival with you.',
        },
      ],
      faq: [
        {
          q: 'Which countries do you cover?',
          a: 'Mainly France, Belgium, Italy and Spain. Ask us about any other European destination — we look at each request individually.',
        },
        {
          q: 'Can you transport a non-running or accident-damaged vehicle?',
          a: 'Yes. Our transporters are equipped to load and secure damaged or non-running vehicles safely over long distances.',
        },
        {
          q: 'Do you work with assistance companies?',
          a: 'Yes, we are approved by every major assistance company and can arrange repatriation directly under the terms of your policy.',
        },
      ],
    },
    {
      slugFr: 'centre-ville-zones-pietonnes',
      slug: 'city-centre-recovery',
      nom: 'City centre & pedestrian zones',
      titre: 'City centre and pedestrian zone recovery',
      tag: '05',
      resume:
        'Zero-emission electric fleet — a compact vehicle and scooters to reach the historic centre: Comédie, Antigone, Peyrou.',
      intro: [
        "Montpellier's historic core — the Comédie, the Écusson, Antigone, the Peyrou — is a maze of narrow streets, pedestrian zones and retractable bollards that make conventional recovery difficult and often impossible. Montpellier Dépannage answered that with a zero-emission electric fleet: a compact vehicle and scooters that reach places a full-size truck simply cannot.",
        'The advantage is twofold: speed, because the access restrictions of the centre stop being an obstacle, and respect for the urban environment, with no noise or emissions in the most sensitive parts of the city. A breakdown, a flat battery, a vehicle that has to be moved: we get to you, within the rules that govern pedestrian areas.',
      ],
      deroule: [
        {
          titre: 'Locating you',
          desc: 'Tell us the street or square precisely. We work out the best way in given the pedestrian zone restrictions.',
        },
        {
          titre: 'Light intervention',
          desc: 'Our team arrives on a compact electric vehicle or a scooter for a first diagnosis, and fixes the fault on the spot where that is possible.',
        },
        {
          titre: 'Recovery',
          desc: 'If the vehicle has to be taken away, we coordinate moving it to a point a recovery truck can reach, respecting access rules.',
        },
        {
          titre: 'Finishing up',
          desc: 'The vehicle is back on the road or on its way to the garage, with the price agreed before any work starts.',
        },
      ],
      faq: [
        {
          q: 'Do you work inside Montpellier pedestrian zones?',
          a: 'Yes. Our compact electric fleet exists for exactly that: the Comédie, the Écusson, Antigone, the Peyrou and every restricted-access street around them.',
        },
        {
          q: 'Why an electric fleet?',
          a: 'It gets into pedestrian and low-emission areas quickly, without noise or pollution, where a conventional recovery truck is not allowed to go.',
        },
        {
          q: 'My car has broken down in the middle of the old town. What now?',
          a: 'Call us at any hour. We send whichever crew suits the access, and if needed we organise moving the vehicle to a point where a full-size truck can take over.',
        },
      ],
    },
    {
      slugFr: 'mecanique-gpl-climatisation',
      slug: 'garage-lpg-air-conditioning',
      nom: 'Garage · LPG · Air conditioning',
      titre: 'Mechanical repairs, LPG conversion and air conditioning',
      tag: '06',
      resume:
        'Vehicle servicing, LPG system installation, air conditioning service and regas.',
      intro: [
        'Beyond recovery, Montpellier Dépannage runs its own mechanical workshops, notably at the Garosud and Pérols sites. Our teams handle routine servicing and repairs, along with two specialities the company is known for locally: fitting LPG systems and servicing air conditioning.',
        'Having your servicing done by a recovery network means one point of contact: the same people who know your vehicle can service it and come out to it when it fails. Clear diagnosis, transparent quote, careful work — we hold the workshop to the same standard as the road.',
      ],
      deroule: [
        {
          titre: 'Diagnosis',
          desc: 'Tell us what you need — a service, an unexplained noise, an LPG conversion, air conditioning. We diagnose and quote before any work begins.',
        },
        {
          titre: 'Booking',
          desc: 'We schedule the visit at the Garosud or Pérols workshop depending on the work and your availability.',
        },
        {
          titre: 'The work',
          desc: 'Servicing, repairs, LPG installation or air conditioning regas and testing, carried out by our own mechanics.',
        },
        {
          titre: 'Handover',
          desc: 'The vehicle is returned checked over, with a breakdown of the work done and the maintenance advice that goes with it.',
        },
      ],
      faq: [
        {
          q: 'Do you fit LPG systems?',
          a: 'Yes, LPG installation is one of our workshops’ specialities, with diagnosis and a quote beforehand.',
        },
        {
          q: 'Do you regas air conditioning?',
          a: 'Yes, we service and regas air conditioning systems, including circuit testing and leak detection.',
        },
        {
          q: 'Where are your workshops?',
          a: 'Mainly at our Montpellier Garosud site (the network headquarters) and at Pérols, both equipped for servicing and repairs.',
        },
      ],
    },
  ],

  coverage: {
    title: 'Coverage area · Montpellier, Hérault, Gard and the A9 — Montpellier Dépannage',
    description:
      '8 depots and 15 towns covered 24/7 around Montpellier: Sète, Nîmes, La Grande-Motte, Lodève, Uzès, Le Grau-du-Roi and more. Towing and recovery across the Hérault, the Gard and the A9 motorway.',
    overline: 'Coverage',
    heading: 'Where we come out to.',
    lead: [
      'Montpellier Dépannage works across the Hérault and into the Gard, with a permanent presence on the A9 — the motorway that carries most traffic between Spain and the rest of France, and the road on which a large share of our callouts happen.',
      'Eight depots spread along that corridor keep a recovery vehicle close to the motorway at all times, from the Thau lagoon in the west to the Rhône in the east, and inland along the A75 towards the Larzac plateau.',
    ],
    agencesHeading: 'Our depots',
    agencesLead:
      'Each depot has its own crews and on-call rota. The number below reaches the network at any hour; we dispatch whichever depot is closest to you.',
    villesHeading: 'Towns we cover',
    villesLead:
      'Beyond the towns where we have a depot, these are covered from the nearest one, with a typical road time given for each. Detailed pages for each town are published in French.',
    fromAgency: 'from',
    faq: [
      {
        q: 'How far do you travel?',
        a: 'Routinely across the whole of the Hérault and the western Gard — roughly from Lodève and Sète to Nîmes and Villeneuve-lès-Avignon. For international transport, we go considerably further: France, Belgium, Italy and Spain.',
      },
      {
        q: 'How long will you take to reach me?',
        a: 'Around Montpellier and on the A9, recovery is usually under way within 45 minutes. Further out, expect the road time shown for your town, plus dispatch. Traffic in July and August on the coast road can add to it.',
      },
      {
        q: 'Do you cover the beaches and coastal resorts?',
        a: 'Yes — Palavas-les-Flots, Carnon, La Grande-Motte, Le Grau-du-Roi and Port-Camargue among others, with extra cover in summer when those roads are at their busiest.',
      },
    ],
    ctaTitle: 'Wherever you are, we come to you.',
    ctaLead: 'One number, eight depots, on call 24 hours a day.',
  },
};

// Déclare les slugs EN au routeur i18n (résolution des hreflang).
registerServiceSlugs(
  'en',
  Object.fromEntries(en.services.map((s) => [s.slugFr, s.slug])),
);
