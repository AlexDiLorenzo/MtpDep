// ============================================================
// Contenu espagnol — traduction éditoriale, pas littérale.
//
// L'Espagne est le 2e pays du site en clics (CTR 13,5 %, très au-dessus
// de la moyenne) : l'A9 est l'axe de transit entre la péninsule ibérique
// et le reste de l'Europe, et une partie du trafic PL comme des vacanciers
// qui tombent en panne dans l'Hérault sont hispanophones.
//
// Vocabulaire : castillan d'Espagne, terminologie du secteur telle qu'elle
// est réellement cherchée — « grúa » (dépanneuse et remorquage), « asistencia
// en carretera », « autocaravana », « taller ». On évite les variantes
// latino-américaines (« remolcadora », « llanta ») qui ne correspondent pas
// à la cible.
// ============================================================

import { registerServiceSlugs } from '../config';
import type { LocalizedContent } from '../types';

export const es: LocalizedContent = {
  ui: {
    navServices: 'Servicios',
    navCoverage: 'Zonas',
    navHome: 'Inicio',
    callNow: 'Llamar ahora',
    emergency: 'Urgencias 24/7',
    available: 'Disponibles 24 horas, todos los días',
    languageLabel: 'Idioma',
    breadcrumbLabel: 'Migas de pan',
    servicesHeading: 'Nuestros servicios',
    stepsHeading: 'Cómo funciona',
    faqHeading: 'Preguntas frecuentes',
    otherServices: 'Otros servicios',
    backToServices: 'Todos los servicios',
    footerServices: 'Servicios',
    footerNetwork: 'Empresa',
    footerLegal: 'Legal',
    footerFrenchSite: 'Site en français',
    footerRights: 'Autorizados en autopista · Certificados NF Service',
    fullSiteNotice:
      'Esta es la sección en español de nuestra web. Las páginas de cada delegación, la cobertura ciudad por ciudad y los avisos legales están publicados en francés.',
    fullSiteLink: 'Ir a la web completa en francés',
    skipToContent: 'Saltar al contenido principal',
  },

  home: {
    title: 'Grúa 24 h en Montpellier y la A9 | Atención en español',
    description:
      '¿Avería cerca de Montpellier o en la A9? Grúa 24 horas en español para coches, autocaravanas y camiones. Ocho bases en Hérault y Gard.',
    heroPill: '24 horas al día · 7 días a la semana',
    heroTitle: '¿Avería en el sur de Francia?',
    heroTitleAccent: 'Grúa a cualquier hora.',
    heroLead:
      'Montpellier Dépannage es una empresa familiar que lleva más de 30 años trabajando en Montpellier y a lo largo de la autopista A9. Más de 40 grúas, 8 bases, autorización en autopista y personal acostumbrado a atender a conductores extranjeros.',
    heroReassure: [
      'Autorizados en autopista · A9 y A709',
      'Trabajamos con todas las aseguradoras europeas',
      'Coches, autocaravanas, motos y camiones',
    ],
    stats: [
      { value: '30+', label: 'Años de experiencia', kicker: 'Empresa familiar' },
      { value: '40', label: 'Grúas', kicker: 'Con 4×4 y plataformas rebajadas' },
      { value: '8', label: 'Bases', kicker: 'Hérault y Gard' },
      { value: '24/7', label: 'De guardia', kicker: 'Noches, fines de semana, festivos' },
    ],

    trustOverline: 'Por qué llamarnos',
    trustHeading: 'Una avería fuera de casa ya es bastante complicada.',
    trustBody: [
      'Quedarse tirado en un país cuyo idioma no dominas, con un coche de alquiler que no elegiste y unas vacaciones que se desmoronan, no es una avería normal. Por eso atendemos el teléfono nosotros mismos a cualquier hora, y por eso nuestro personal está acostumbrado a localizar un vehículo a partir de un punto kilométrico, una referencia visual o la ubicación del móvil, y no de una dirección francesa.',
      'Montpellier Dépannage trabaja en la zona de Montpellier desde los años noventa. Estamos autorizados para intervenir en la A9 y la A709, contamos con la certificación NF Service de AFNOR —la norma de calidad francesa del sector de la grúa— y trabajamos directamente con las compañías de asistencia europeas que hay detrás de la mayoría de pólizas. En la práctica eso significa que normalmente no pagas nada en el momento: facturamos a tu aseguradora.',
    ],
    trustPoints: [
      {
        titre: 'Tratamos con tu aseguradora',
        desc: 'Estamos homologados por las principales redes de asistencia europeas. Si tu póliza cubre el remolque, les facturamos directamente y tú no adelantas dinero.',
      },
      {
        titre: 'Autorizados en autopista',
        desc: 'Somos operador autorizado de la A9 y la A709 en el entorno de Montpellier, en coordinación con la concesionaria y los servicios de emergencia.',
      },
      {
        titre: 'Cualquier vehículo',
        desc: 'Coches propios y de alquiler, autocaravanas y caravanas, motos, furgonetas, camiones y autocares, con plataformas rebajadas para deportivos y clásicos.',
      },
      {
        titre: 'Transporte internacional',
        desc: 'Repatriamos vehículos entre Francia, Bélgica, Italia y España: un coche que no se puede reparar aquí tampoco tiene por qué quedarse aquí.',
      },
    ],

    servicesOverline: 'Qué hacemos',
    servicesHeading: 'Grúa, rescate y taller.',
    servicesLead:
      'Seis servicios que van desde una batería descargada en el centro de Montpellier hasta un camión volcado en la A9, además del transporte de vehículos por Europa occidental.',

    coverageOverline: 'Dónde trabajamos',
    coverageHeading: 'Montpellier, la costa y el corredor de la A9.',
    coverageLead:
      'Ocho bases repartidas por Hérault y Gard mantienen siempre una grúa cerca de la autopista: desde Sète y la laguna de Thau hasta Nimes, y desde las playas de La Grande-Motte hasta la A75 que sube al Larzac.',
    coverageCta: 'Ver toda la zona de cobertura',

    breakdownOverline: 'Si te ocurre a ti',
    breakdownHeading: 'Qué hacer si te averías en Francia.',
    breakdownSteps: [
      {
        titre: 'En autopista, no nos llames primero',
        desc: 'La ley francesa reserva el rescate en autopista al operador autorizado de ese tramo. Detente en el arcén, saca a todo el mundo tras la barrera de seguridad, ponte el chaleco reflectante y usa un poste SOS naranja (hay uno cada 2 km) o marca el 112. Las tarifas en autopista las fija el Estado. El operador que envían es, con frecuencia, el nuestro.',
      },
      {
        titre: 'En cualquier otra carretera, llámanos directamente',
        desc: 'Fuera de la red de autopistas eres libre de elegir empresa de grúa. Llama a nuestro número y dinos el vehículo y dónde estás: el nombre de un pueblo, un número de salida o la ubicación compartida del móvil son suficientes.',
      },
      {
        titre: 'Ten a mano tu póliza',
        desc: 'El seguro del coche, el seguro de viaje, la tarjeta de crédito, el contrato de alquiler o la garantía del fabricante suelen incluir la asistencia en carretera. Dinos la compañía y nosotros nos encargamos de contactar, para que el servicio vaya cubierto y no de tu bolsillo.',
      },
      {
        titre: 'Dinos adónde llevamos el vehículo',
        desc: 'Un taller, tu hotel, el aeropuerto, la delegación de la empresa de alquiler o directamente a un camión portacoches rumbo a casa. Acordamos destino y precio antes de cargar.',
      },
    ],

    faq: [
      {
        q: '¿Atendéis en español?',
        a: 'Sí. En la oficina y entre nuestros conductores hay personal que habla español, y atendemos a conductores españoles cada semana: este tramo de la A9 es la principal vía de entrada y salida de la península.',
      },
      {
        q: 'Me he averiado en la autopista A9. ¿Qué hago?',
        a: 'Detente en el arcén, sal del vehículo por el lado derecho y colócate tras la barrera, ponte el chaleco reflectante y llama desde un poste SOS naranja o marca el 112. En las autopistas francesas solo puede rescatarte el operador autorizado del tramo, y la tarifa la fija el Estado. Montpellier Dépannage es el operador autorizado en buena parte del tramo de Montpellier.',
      },
      {
        q: '¿Me lo cubrirá el seguro?',
        a: 'Normalmente sí. La mayoría de pólizas de automóvil españolas, los seguros de viaje, las tarjetas de crédito premium y los contratos de alquiler incluyen asistencia en Francia. Dinos la compañía y el número de póliza y hablamos nosotros con ellos, de modo que en la mayoría de casos no pagas nada en el momento.',
      },
      {
        q: '¿Podéis remolcar una autocaravana o una caravana?',
        a: 'Sí. Disponemos de grúas pesadas con brazo y plataformas largas aptas para autocaravanas, caravanas y camiones ligeros, algo que nos piden con frecuencia en la costa durante el verano.',
      },
      {
        q: 'Se me ha averiado el coche de alquiler. ¿A quién llamo?',
        a: 'Llama primero a la empresa de alquiler: la mayoría de contratos lo exigen y pueden designar un operador concreto. Si te dejan elegir, o si de noche no consigues hablar con nadie, llámanos y llevamos el coche a su delegación o al taller autorizado más cercano.',
      },
      {
        q: '¿Podéis llevar mi coche de vuelta a España?',
        a: 'Sí. Organizamos transporte de larga distancia entre Francia, Bélgica, Italia y España para vehículos que no pueden circular, ya sea por accidente o por una avería grave. Consúltanos también otros destinos europeos.',
      },
    ],

    ctaTitle: '¿Estás tirado en la carretera? Llámanos.',
    ctaLead: 'Hay un conductor de guardia las 24 horas, todos los días del año.',
  },

  serviceIndex: {
    title: 'Servicios de grúa y asistencia | Montpellier',
    description:
      'Grúa para coches y camiones, asistencia en la A9, transporte internacional y talleres cerca de Montpellier. Urgencias disponibles 24 horas.',
    overline: 'Servicios',
    heading: 'Seis servicios, un solo teléfono.',
    lead:
      'Desde un coche que no arranca en el casco antiguo hasta un camión fuera de la calzada en la A9, pasando por el transporte de un vehículo a través de Europa: todo lo que hace Montpellier Dépannage, en detalle.',
  },

  services: [
    {
      slugFr: 'remorquage-vehicules-legers',
      slug: 'grua-coches',
      nom: 'Grúa para coches',
      titre: 'Grúa para turismos y vehículos de alta gama',
      tag: '01',
      resume:
        'Coches averiados o accidentados, salida de aparcamientos subterráneos, plataformas rebajadas para deportivos y vehículos de alta gama.',
      intro: [
        'Un coche que no arranca, un reventón en la ronda, un accidente al volver de la playa: el remolque de turismos es el núcleo del trabajo de Montpellier Dépannage desde hace más de 30 años. Nuestras grúas trabajan 24 horas al día en Montpellier, en toda la región de Hérault y en Gard, y llevan tu vehículo con seguridad al taller que elijas.',
        'Contamos con plataformas rebajadas pensadas para vehículos bajos y de alta gama —berlinas deportivas, cupés, coches clásicos— y con material preparado para sacar coches de aparcamientos subterráneos y de los accesos difíciles del centro. Cada vehículo se amarra y se cala con cuidado: tu coche viaja sin rozar en ningún momento.',
      ],
      deroule: [
        {
          titre: 'Tu llamada',
          desc: 'Nos dices el vehículo, dónde está exactamente y adónde hay que llevarlo. Asignamos la grúa más cercana. Si no tienes una dirección francesa, basta con una referencia o la ubicación compartida del móvil.',
        },
        {
          titre: 'Salida',
          desc: 'Enviamos un conductor de inmediato. En Montpellier y en la A9, el servicio suele estar en marcha en menos de 45 minutos.',
        },
        {
          titre: 'Carga',
          desc: 'El vehículo se sube con cabrestante a la plataforma y se amarra, incluso desde un sótano o una plaza estrecha, gracias a nuestro material rebajado.',
        },
        {
          titre: 'Entrega',
          desc: 'Dejamos el coche en el taller, en tu alojamiento o en la dirección que nos indiques, con el precio acordado de antemano.',
        },
      ],
      faq: [
        {
          q: '¿Podéis sacar un coche de un aparcamiento subterráneo?',
          a: 'Sí. Nuestras plataformas rebajadas y el material de cabrestante están pensados para sótanos y accesos de poca altura, muy habituales en el centro de Montpellier.',
        },
        {
          q: '¿Remolcáis vehículos de alta gama y carrocería baja?',
          a: 'Por supuesto. Usamos plataformas de ángulo reducido adaptadas a deportivos y vehículos de lujo, de forma que el paragolpes y los bajos no rozan al cargar.',
        },
        {
          q: '¿Trabajáis de noche y en fin de semana?',
          a: 'Sí, estamos de guardia 24 horas al día, 7 días a la semana, festivos incluidos, en Montpellier, Hérault y Gard.',
        },
      ],
    },
    {
      slugFr: 'remorquage-poids-lourds',
      slug: 'grua-camiones',
      nom: 'Grúa para camiones',
      titre: 'Rescate y remolque de vehículos pesados',
      tag: '02',
      resume:
        'Flota de grúas pesadas 4×4 con brazo y plataformas para camión. Cualquier tonelaje, de día y de noche.',
      intro: [
        'Un camión inmovilizado significa mercancía parada y, muy a menudo, un carril cortado. Montpellier Dépannage dispone de una flota de grúas pesadas 4×4 con brazo de elevación y plataformas para vehículo industrial, capaz de rescatar cualquier tonelaje —rígidos, tractoras, semirremolques, autocares y maquinaria— a cualquier hora.',
        'Nuestros equipos trabajan en la A9, la A709, la A75 y la red secundaria de Hérault y Gard, coordinados con la gendarmería y la concesionaria de la autopista cuando la seguridad vial lo exige. Enderezar un vehículo volcado, sacarlo de la cuneta, remolcarlo hasta un taller: nos ocupamos de toda la operación.',
      ],
      deroule: [
        {
          titre: 'Evaluación',
          desc: 'Nos indicas el tipo de vehículo, su carga y cómo ha quedado inmovilizado, para decidir qué material de elevación enviamos.',
        },
        {
          titre: 'Señalización',
          desc: 'Al llegar, la zona se baliza y se asegura, en coordinación con los servicios de carretera cuando el rescate es en autopista.',
        },
        {
          titre: 'Elevación y carga',
          desc: 'Brazo de elevación o plataforma pesada según el caso: el vehículo se endereza y se carga, incluso tras un vuelco o una salida de vía.',
        },
        {
          titre: 'Traslado',
          desc: 'Llevamos el vehículo al taller o al destino acordado, con seguimiento de la operación de principio a fin.',
        },
      ],
      faq: [
        {
          q: '¿Rescatáis un camión volcado o en la cuneta?',
          a: 'Sí. Nuestras grúas pesadas 4×4 y los brazos de elevación permiten enderezar y extraer rígidos y conjuntos articulados tras un vuelco o una salida de vía.',
        },
        {
          q: '¿Trabajáis en autopista para empresas de transporte?',
          a: 'Sí, nuestros equipos están autorizados y habituados al rescate de vehículos pesados en la A9, la A709 y la A75, coordinados con los servicios de emergencia.',
        },
        {
          q: '¿Qué tonelajes podéis mover?',
          a: 'Rígidos, tractoras y semirremolques, autobuses y autocares, y determinada maquinaria. Indícanos el peso al llamar para que enviemos el material adecuado.',
        },
      ],
    },
    {
      slugFr: 'depannage-autoroute-a9',
      slug: 'asistencia-autopista-a9',
      nom: 'Autopista A9',
      titre: 'Asistencia y grúa en la autopista A9',
      tag: '03',
      resume:
        'Operador autorizado en autopista, en colaboración con la concesionaria. Respuesta rápida en toda la red de Hérault.',
      intro: [
        'Averiarse en la A9 es una de las situaciones más peligrosas para un conductor: tráfico denso, velocidades altas y un arcén muy expuesto. Montpellier Dépannage está autorizado para intervenir en autopista y colabora con la concesionaria de la red, lo que nos permite llegar rápido y respetando las estrictas normas de seguridad que se aplican.',
        'Nuestras bases de Saint-Jean-de-Védas y Villetelle están situadas a ambos lados de Montpellier, lo más cerca posible de los enlaces de la A9 y la A709, para reducir el tiempo de salida. Importante: en una autopista francesa no puedes elegir la empresa de grúa. Hay que llamar desde un poste SOS naranja o al 112, y es la concesionaria quien avisa al operador autorizado del tramo, que con frecuencia es uno de nuestros equipos.',
      ],
      deroule: [
        {
          titre: 'Ponte a salvo',
          desc: 'Detente en el arcén, sal por el lado derecho y colócate tras la barrera de seguridad con el chaleco puesto, y llama desde un poste SOS naranja o al 112. Es el procedimiento oficial y es lo que te mantiene seguro.',
        },
        {
          titre: 'Asignación',
          desc: 'La concesionaria avisa a la empresa autorizada de ese tramo. En nuestra zona, es a menudo un equipo de Montpellier Dépannage.',
        },
        {
          titre: 'Intervención',
          desc: 'Nuestra grúa llega con señalización reforzada, asegura la zona y carga el vehículo desde el arcén.',
        },
        {
          titre: 'Salida de la autopista',
          desc: 'El vehículo se traslada a un área de servicio o a un taller fuera de la autopista, donde continúa la reparación o donde recoges tu coche.',
        },
      ],
      faq: [
        {
          q: '¿Cómo pido una grúa en la autopista A9?',
          a: 'Usa un poste SOS naranja —hay uno cada 2 km— o marca el 112. El precio del rescate en autopista en Francia lo fija el Estado. La concesionaria avisa entonces a la empresa autorizada del tramo: estando en la autopista no puedes llamar a una empresa de tu elección.',
        },
        {
          q: '¿Estáis autorizados para trabajar en autopista?',
          a: 'Sí, Montpellier Dépannage es operador autorizado de rescate en autopista y colaborador de las concesionarias de la red, entre ellas Vinci Autoroutes.',
        },
        {
          q: '¿Qué vías cubrís?',
          a: 'Principalmente la A9 y la A709 en el entorno de Montpellier, además de la A75 al oeste y la red del Gard rhodanien desde nuestra base de Fournès.',
        },
        {
          q: '¿Cuánto cuesta una grúa en autopista en Francia?',
          a: 'La tarifa para turismos en la red de autopistas está regulada y se revisa cada año por el Estado francés, así que es la misma sea cual sea el operador autorizado que acuda. Tu aseguradora o tu compañía de asistencia suele reembolsarla o abonarla directamente.',
        },
      ],
    },
    {
      slugFr: 'transport-international',
      slug: 'transporte-internacional-vehiculos',
      nom: 'Transporte internacional',
      titre: 'Transporte internacional y repatriación de vehículos',
      tag: '04',
      resume:
        'Francia, Bélgica, Italia y España. Repatriación de vehículos accidentados y que no circulan.',
      intro: [
        'Un vehículo accidentado o inmovilizado en el extranjero, o que hay que trasladar a otro país: Montpellier Dépannage organiza el transporte internacional de vehículos entre Francia, Bélgica, Italia y España. Nos encargamos de toda la logística, de la recogida a la entrega, tanto para particulares como para profesionales y compañías de asistencia.',
        'Es el servicio que hay que pedir cuando un coche no se puede reparar razonablemente donde está: un accidente al final de las vacaciones, una avería grave lejos de casa, un clásico o un vehículo vendido que debe viajar en camión y no por su propio pie. Cada traslado lleva una ruta y un presupuesto claros, acordados antes de salir.',
      ],
      deroule: [
        {
          titre: 'Primer contacto',
          desc: 'Nos indicas el punto de recogida, el destino y el estado del vehículo. Preparamos un presupuesto de transporte transparente.',
        },
        {
          titre: 'Organización',
          desc: 'Planificamos la ruta y la fecha de recogida, en coordinación con tu compañía de asistencia o tu aseguradora si son ellas quienes lo cubren.',
        },
        {
          titre: 'Recogida',
          desc: 'El vehículo se carga y se amarra en una plataforma preparada para larga distancia, circule o no.',
        },
        {
          titre: 'Entrega',
          desc: 'Lo llevamos hasta la dirección acordada en Francia o en Europa y te confirmamos la entrega.',
        },
      ],
      faq: [
        {
          q: '¿A qué países transportáis?',
          a: 'Principalmente Francia, Bélgica, Italia y España. Consúltanos cualquier otro destino europeo: estudiamos cada solicitud.',
        },
        {
          q: '¿Podéis transportar un vehículo que no circula o accidentado?',
          a: 'Sí. Nuestras plataformas están equipadas para cargar y amarrar con seguridad vehículos accidentados o que no circulan en trayectos de larga distancia.',
        },
        {
          q: '¿Trabajáis con compañías de asistencia?',
          a: 'Sí, estamos homologados con todas las grandes compañías de asistencia y podemos gestionar la repatriación directamente al amparo de tu póliza.',
        },
      ],
    },
    {
      slugFr: 'centre-ville-zones-pietonnes',
      slug: 'centro-historico-zonas-peatonales',
      nom: 'Centro histórico y zonas peatonales',
      titre: 'Intervención en el centro histórico y zonas peatonales',
      tag: '05',
      resume:
        'Flota eléctrica de cero emisiones: un vehículo compacto y scooters para llegar al casco antiguo: Comédie, Antigone, Peyrou.',
      intro: [
        'El casco histórico de Montpellier —la Comédie, el Écusson, Antigone, el Peyrou— es un laberinto de calles estrechas, zonas peatonales y pilonas retráctiles que hacen difícil, y a menudo imposible, la entrada de una grúa convencional. Montpellier Dépannage respondió a ese problema con una flota eléctrica de cero emisiones: un vehículo compacto y scooters capaces de llegar donde un camión no cabe.',
        'La ventaja es doble: rapidez, porque las restricciones de circulación del centro dejan de ser un obstáculo, y respeto por el entorno urbano, sin ruido ni emisiones en las zonas más sensibles de la ciudad. Una avería, una batería descargada, un vehículo que hay que mover: llegamos hasta ti, dentro de las normas que regulan las áreas peatonales.',
      ],
      deroule: [
        {
          titre: 'Localización',
          desc: 'Nos indicas con precisión la calle o la plaza. Nosotros decidimos el acceso más adecuado según las restricciones de la zona peatonal.',
        },
        {
          titre: 'Intervención ligera',
          desc: 'Nuestro equipo se desplaza en vehículo eléctrico compacto o en scooter para un primer diagnóstico, y resuelve la avería in situ cuando es posible.',
        },
        {
          titre: 'Retirada',
          desc: 'Si hay que evacuar el vehículo, coordinamos su traslado hasta un punto accesible para una plataforma, respetando las normas de acceso.',
        },
        {
          titre: 'Cierre',
          desc: 'El vehículo vuelve a circular o va camino del taller, con el precio acordado antes de cualquier actuación.',
        },
      ],
      faq: [
        {
          q: '¿Entráis en las zonas peatonales de Montpellier?',
          a: 'Sí. Nuestra flota eléctrica compacta existe precisamente para eso: la Comédie, el Écusson, Antigone, el Peyrou y todas las calles de acceso restringido de alrededor.',
        },
        {
          q: '¿Por qué una flota eléctrica?',
          a: 'Permite llegar rápido a las zonas peatonales y de bajas emisiones, sin ruido ni contaminación, allí donde una grúa convencional no puede circular.',
        },
        {
          q: 'Mi coche se ha averiado en pleno casco antiguo. ¿Qué hago?',
          a: 'Llámanos a cualquier hora. Enviamos el equipo que mejor se adapte al acceso y, si hace falta, organizamos el traslado del vehículo hasta un punto donde pueda hacerse cargo una plataforma.',
        },
      ],
    },
    {
      slugFr: 'mecanique-gpl-climatisation',
      slug: 'taller-glp-aire-acondicionado',
      nom: 'Taller · GLP · Aire acondicionado',
      titre: 'Mecánica, instalación de GLP y aire acondicionado',
      tag: '06',
      resume:
        'Mantenimiento de vehículos, instalación de sistemas de GLP, revisión y carga del aire acondicionado.',
      intro: [
        'Más allá de la grúa, Montpellier Dépannage cuenta con talleres mecánicos propios, sobre todo en las instalaciones de Garosud y Pérols. Nuestros equipos se ocupan del mantenimiento y de las reparaciones, además de dos especialidades por las que se nos conoce en la zona: la instalación de sistemas de GLP y la revisión del aire acondicionado.',
        'Confiar el mantenimiento a una red de asistencia significa tener un único interlocutor: los mismos profesionales que conocen tu vehículo pueden revisarlo y también acudir a él cuando se avería. Diagnóstico claro, presupuesto transparente y trabajo cuidado: aplicamos en el taller la misma exigencia que en la carretera.',
      ],
      deroule: [
        {
          titre: 'Diagnóstico',
          desc: 'Nos cuentas qué necesitas —una revisión, un ruido extraño, una instalación de GLP, el aire acondicionado— y diagnosticamos y presupuestamos antes de empezar.',
        },
        {
          titre: 'Cita',
          desc: 'Programamos el paso por el taller de Garosud o de Pérols según el tipo de trabajo y tu disponibilidad.',
        },
        {
          titre: 'Ejecución',
          desc: 'Mantenimiento, reparación, instalación de un sistema de GLP o carga y comprobación del aire acondicionado, realizados por nuestros mecánicos.',
        },
        {
          titre: 'Entrega',
          desc: 'Te devolvemos el vehículo revisado, con el detalle de las operaciones realizadas y los consejos de mantenimiento correspondientes.',
        },
      ],
      faq: [
        {
          q: '¿Instaláis sistemas de GLP?',
          a: 'Sí, la instalación de sistemas de GLP es una de las especialidades de nuestros talleres, con diagnóstico y presupuesto previos.',
        },
        {
          q: '¿Cargáis el aire acondicionado?',
          a: 'Sí, hacemos la revisión y la carga del aire acondicionado, además de la comprobación del circuito y la localización de fugas.',
        },
        {
          q: '¿Dónde están vuestros talleres?',
          a: 'Principalmente en nuestras instalaciones de Montpellier Garosud (sede de la red) y de Pérols, ambas equipadas para mantenimiento y reparación.',
        },
      ],
    },
  ],

  coverage: {
    title: 'Cobertura de grúa | Montpellier, Hérault, Gard y A9',
    description:
      'Ocho bases cubren Montpellier, Hérault, Gard y la autopista A9 las 24 horas, incluidas Sète, Nîmes, La Grande-Motte, Lodève y Uzès.',
    overline: 'Cobertura',
    heading: 'Hasta dónde llegamos.',
    lead: [
      'Montpellier Dépannage trabaja en toda la región de Hérault y en parte de Gard, con presencia permanente en la A9: la autopista por la que pasa la mayor parte del tráfico entre España y el resto de Francia, y la vía en la que se produce buena parte de nuestros avisos.',
      'Ocho bases repartidas a lo largo de ese corredor mantienen siempre una grúa cerca de la autopista, desde la laguna de Thau al oeste hasta el Ródano al este, y hacia el interior siguiendo la A75 en dirección a la meseta del Larzac.',
    ],
    agencesHeading: 'Nuestras bases',
    agencesLead:
      'Cada base tiene sus propios equipos y su turno de guardia. El número de abajo conecta con toda la red a cualquier hora; nosotros enviamos la base más cercana a ti.',
    villesHeading: 'Localidades que cubrimos',
    villesLead:
      'Además de las localidades donde tenemos base, estas se cubren desde la más próxima, con el tiempo de trayecto habitual indicado en cada caso. Las páginas detalladas de cada localidad están publicadas en francés.',
    fromAgency: 'desde',
    faq: [
      {
        q: '¿Hasta dónde os desplazáis?',
        a: 'Habitualmente por toda la región de Hérault y el oeste de Gard, aproximadamente entre Lodève y Sète por un lado y Nimes y Villeneuve-lès-Avignon por otro. En transporte internacional llegamos mucho más lejos: Francia, Bélgica, Italia y España.',
      },
      {
        q: '¿Cuánto tardáis en llegar?',
        a: 'En Montpellier y en la A9, el servicio suele estar en marcha en menos de 45 minutos. Más lejos, cuenta con el tiempo de trayecto indicado para tu localidad más la salida. El tráfico de julio y agosto en la costa puede alargarlo.',
      },
      {
        q: '¿Cubrís las playas y los municipios costeros?',
        a: 'Sí: Palavas-les-Flots, Carnon, La Grande-Motte, Le Grau-du-Roi y Port-Camargue, entre otros, con refuerzo en verano, cuando esas carreteras están más saturadas.',
      },
    ],
    ctaTitle: 'Estés donde estés, vamos a buscarte.',
    ctaLead: 'Un solo número, ocho bases, de guardia las 24 horas.',
  },
};

// Déclare les slugs ES au routeur i18n (résolution des hreflang).
registerServiceSlugs(
  'es',
  Object.fromEntries(es.services.map((s) => [s.slugFr, s.slug])),
);
