/** Starter CMS rows — single source for mock mode and `pnpm run cms:seed`. */

const now = () => new Date().toISOString()

const API_KEYS_URL = "https://app.orbitype.com/settings/api-keys"

const CONTACT_MAIL = "info@bhend-architektur.ch"
const CAREERS_PATH = "/bei-uns-arbeiten"

const de = (value) => ({ de: value, en: value })

function teamMember({ name, roles, image, phone }) {
  return {
    name: de(name),
    roles: roles.map(de),
    image,
    imageAlt: de(name),
    phone,
    mailLabel: de("Mail"),
  }
}

function teamSections() {
  return [
    {
      id: "teamHero",
      title: de("BHEND ARCHITEKTUR TEAM"),
      image: "/images/team/team-hero.jpg",
      imageAlt: de("Das Team von Bhend Architektur"),
      _orbi: { component: "SectionPageHero" },
    },
    {
      id: "teamGrid",
      members: [
        teamMember({
          name: "Ueli Bhend",
          image: "/images/team/ueli-bhend.jpg",
          phone: "+41 62 798 0707",
          roles: [
            "Geschäftsinhaber",
            "Architekt HF",
            "Energieberater Kanton Aargau",
            "GEAK Experte",
            "Energieberater für Schutzobjekte und kirchliche Gebäude",
            "Fortbildung Minergie -P Bauweise",
            "Solarprofi Kurs Swisssola",
          ],
        }),
        teamMember({
          name: "Micha Bhend",
          image: "/images/team/micha-bhend.jpg",
          phone: "+41 62 798 0909",
          roles: [
            "Mitglied Geschäftsleitung / Partner",
            "Architekt HF",
            "Hochbaupolier",
          ],
        }),
        teamMember({
          name: "Thomas Schweizer",
          image: "/images/team/thomas-schweizer.jpg",
          phone: "+41 62 798 0404",
          roles: [
            "Mitglied Geschäftsleitung / Partner",
            "Techniker HF Holztechnik",
            "Brandschutzfachmann mit eidg. FA/VKF",
            "CAS Brandschutz für Architekten",
            "Brandschutztechnische Beurteilung von Bestandesbauten",
            "Berufsbildner",
          ],
        }),
        teamMember({
          name: "Patrick Zingg",
          image: "/images/team/patrick-zingg.jpg",
          phone: "+41 62 798 1070",
          roles: [
            "Mitglied Geschäftsleitung / Partner",
            "Architekt HF",
            "GEAK Experte",
            "Energieberater",
            "CAS Nachhaltiges Bauen",
            "CAS Strategische Bauerneuerung",
            "CAS Energieberatung",
            "Berufsbildner",
          ],
        }),
        teamMember({
          name: "Christoph Ruesch",
          image: "/images/team/christoph-ruesch.jpg",
          phone: "+41 62 798 1072",
          roles: [
            "Architekt FH",
            "Energiexperte Bau",
            "GEAK Experte",
            "DAS Energieexperte Bau",
            "CAS Energie am Bau",
            "CAS Energie in der Gebäudeerneuerung",
            "CAS Management Skills",
            "CAS Nachhaltiges Bauen",
            "CAS Photovoltaik",
          ],
        }),
        teamMember({
          name: "Markus Moser",
          image: "/images/team/markus-moser.jpg",
          phone: "+41 62 798 1076",
          roles: [
            "Bauleiter",
            "Technischer Kaufmann mit eidgenösischem Fachausweis",
            "Dipl. Bodenberater Boden Schweiz/ISP/TVS",
            "Berufsbildner",
          ],
        }),
        teamMember({
          name: "Joel Gerber",
          image: "/images/team/joel-gerber.jpg",
          phone: "+41 62 798 1076",
          roles: ["Architekt HF", "Berufsbildner"],
        }),
        teamMember({
          name: "Brigitte Flükiger",
          image: "/images/team/brigitte-fluekiger.jpg",
          phone: "+41 62 798 1077",
          roles: [
            "Zeichnerin EFZ Architektur",
            "Hochbauzeichnerin",
            "Berufsbildnerin",
          ],
        }),
        teamMember({
          name: "Stefanie Burren",
          image: "/images/team/stefanie-burren.jpg",
          phone: "+41 62 798 1071",
          roles: ["Zeichnerin EFZ Architektur"],
        }),
        teamMember({
          name: "Simon Höchenberger",
          image: "/images/team/simon-hoechenberger.jpg",
          phone: "+41 62 798 0000",
          roles: ["Zeichner EFZ Architektur", "Maurer EFZ"],
        }),
        teamMember({
          name: "Jannik Wyss",
          image: "/images/team/jannik-wyss.jpg",
          phone: "+41 62 798 0000",
          roles: ["Zeichner EFZ Architektur i.A"],
        }),
        teamMember({
          name: "Mathilde de Almeida Rocha",
          image: "/images/team/mathilde-de-almeida-rocha.jpg",
          phone: "+41 62 798 0000",
          roles: ["Zeichnerin EFZ Architektur i.A."],
        }),
        teamMember({
          name: "Esther Wälchli",
          image: "/images/team/esther-waelchli.jpg",
          phone: "+41 62 798 0000",
          roles: ["Administration"],
        }),
        teamMember({
          name: "Selina Vonäsch",
          image: "/images/team/selina-vonaesch.jpg",
          phone: "+41 62 798 0000",
          roles: ["Praktikantin"],
        }),
      ],
      _orbi: { component: "SectionTeamGrid" },
    },
  ]
}

function homeSections() {
  return [
    {
      title: de("BHEND ARCHITEKTUR"),
      lead: de("Bauen für Menschen, gestalten für Generationen"),
      image: "/images/home/hero.jpg",
      imageAlt: de("Modernes Wohnhaus von Bhend Architektur"),
      _orbi: { component: "SectionHero" },
    },
    {
      id: "audience",
      items: [
        {
          title: de("Privatpersonen"),
          text: de(
            "Verwirklichung Ihres Traumhauses – massgeschneidert, Ihre Wünsche widerspiegelnd.",
          ),
          icon: "/images/home/icons/private.png",
        },
        {
          title: de("Firmen und Institutionen"),
          text: de(
            "Realisierung funktionaler und zukunftsorientierter Geschäftsräume, die Effizienz und Innovation vereinen.",
          ),
          icon: "/images/home/icons/business.png",
        },
        {
          title: de("Öffentliche Bauten"),
          text: de(
            "Erschaffung öffentlicher Bauten, die Gemeinschaften ermöglichen und Generationen inspirieren.",
          ),
          icon: "/images/home/icons/public.png",
        },
      ],
      _orbi: { component: "SectionIconGrid" },
    },
    {
      id: "challenges",
      heading: de(
        "Private und Öffentliche Bauprojekte =\nGleiche Herausforderungen",
      ),
      body: de(
        "Häufig begegnen unsere Kunden und Partner Herausforderungen bei der Planung und Umsetzung ihrer Bauvorhaben, unabhängig davon, ob es sich um private, geschäftliche oder öffentliche Projekte handelt.",
      ),
      image: "/images/home/challenges.jpg",
      imageAlt: de("Moderne Holztreppe im Innenraum"),
      imagePosition: "left",
      _orbi: { component: "SectionSplit" },
    },
    {
      id: "challengeDetails",
      items: [
        {
          title: de("Privatpersonen"),
          text: de(
            "Privatkunden stehen oft vor der Schwierigkeit, ein Zuhause zu entwerfen, das sowohl ihren persönlichen Stil als auch ihre praktischen Bedürfnisse perfekt widerspiegelt.",
          ),
          icon: "/images/home/icons/private.png",
        },
        {
          title: de("Firmen und Institutionen"),
          text: de(
            "Firmen und Institutionen suchen nach Wegen, ihre Räumlichkeiten effizient und zukunftssicher zu gestalten, während sie gleichzeitig ein inspirierendes Arbeitsumfeld schaffen möchten.",
          ),
          icon: "/images/home/icons/business.png",
        },
        {
          title: de("Öffentliche Bauten"),
          text: de(
            "Öffentliche Einrichtungen suchen nach Lösungen, um Gebäude zu konzipieren, die sowohl funktional sind als auch langfristig zum Wohl der Gemeinschaft beitragen.",
          ),
          icon: "/images/home/icons/public.png",
        },
      ],
      _orbi: { component: "SectionIconGrid" },
    },
    {
      id: "aesthetics",
      heading: de("Ästhetik und Innovation Hand in Hand"),
      body: de(
        "Alle unsere Kunden sind mit der Herausforderung konfrontiert, Nachhaltigkeit und Energieeffizienz zu einem fairen Preis in Einklang mit Ästhetik und Innovation zu bringen.",
      ),
      image: "/images/home/aesthetics.jpg",
      imageAlt: de("Dachlandschaft moderner Gebäude"),
      imagePosition: "right",
      _orbi: { component: "SectionSplit" },
    },
    {
      id: "partner",
      heading: de("Ihr Baupartner für die Zukunft"),
      body: de(
        "Bei Bhend Architektur verstehen wir die vielfältigen Herausforderungen, mit denen unsere Kunden bei ihren Bauvorhaben konfrontiert sind.\nOb es nun um den Traum eines perfekt abgestimmten Zuhauses geht, um die Anforderungen von Firmen und Institutionen an funktionale und zukunftssichere Räumlichkeiten oder um die spezifischen Bedürfnisse der öffentlichen Hand bei der Gestaltung von Gemeinschaftseinrichtungen – wir stehen bereit, um Sie in all diesen Belangen zu unterstützen.",
      ),
      image: "/images/home/partner.jpg",
      imageAlt: de("Innenraum Café und Meeting-Bereich"),
      imagePosition: "left",
      caption: de("Fotograf: Patrick Lüthy"),
      _orbi: { component: "SectionSplit" },
    },
    {
      id: "mehrAls",
      heading: de("Mehr als nur Bauen"),
      body: de(
        "Unser Fokus liegt nicht allein auf dem Bau von Gebäuden; es ist unser Bestreben, Räume zu erschaffen, die Lebensqualität, Effizienz und Wohlbefinden in den Vordergrund stellen.",
      ),
      bodySecondary: de(
        "Wir sind stets darauf bedacht, massgeschneiderte Lösungen zu entwickeln, die den einzigartigen Anforderungen und Wünschen unserer Kunden gerecht werden und dabei einen Mehrwert für die Zukunft schaffen.",
      ),
      image: "/images/home/mehr-als.jpg",
      imageAlt: de("Modernes Foyer mit Rundbeleuchtung"),
      caption: de("Fotograf: Patrick Lüthy"),
      _orbi: { component: "SectionMediaStory" },
    },
    {
      id: "team",
      heading: de("Unser Team aus Experten"),
      body: de(
        "Unser Team besteht aus erfahrenen Architekten und Fachspezialisten, die sich durch fortlaufende Weiterbildung stets auf dem neuesten Stand der Bautechnologien und Trends halten.",
      ),
      bodySecondary: de(
        "Wir bieten nicht nur innovative Gestaltungslösungen an, sondern setzen auch auf nachhaltige und energieeffiziente Baupraktiken, die sowohl die Umwelt schonen als auch langfristige Kosteneinsparungen ermöglichen.",
      ),
      image: "/images/home/team.jpg",
      imageAlt: de("Team von Fachleuten auf der Baustelle"),
      ctaLabel: de("Freie Stellen"),
      reservationMode: "path",
      reservationTarget: CAREERS_PATH,
      _orbi: { component: "SectionMediaStory" },
    },
    {
      id: "benefits",
      heading: de("Als Kunde profitieren Sie von:"),
      image: "/images/home/benefits.jpg",
      imageAlt: de("Arbeit am Computer"),
      imagePosition: "left",
      items: [
        {
          text: de(
            "Energieeffizienten Gebäude dank akkreditierten Energieberatern mit Expertise in Minergie- und Minergie-P-Bauten;",
          ),
        },
        {
          text: de(
            "Finanziellen Vorteilen und Fördergelder durch energieeffiziente Massnahmen dank unseren GEAK-Beratern;",
          ),
        },
        {
          text: de(
            "Einer hohen Sicherheit im Brandschutz dank regelmässiger und jahrelanger Erfahrung und Ausbildung;",
          ),
        },
        {
          text: de(
            "Aktuellsten Stand der Technik dank unseren Kenntnissen in den SIA Normen;",
          ),
        },
        {
          text: de(
            "Jedes Projekt ist individuell auf Ihre Wünsche zusammengestellt.",
          ),
        },
      ],
      _orbi: { component: "SectionSplit" },
    },
    {
      id: "projects",
      items: [
        {
          title: de("Gewerbliche Bauprojekte"),
          text: de("Moderne Bürogebäude und gewerbliche Einrichtungen."),
          image: "/images/home/carousel.jpg",
          imageAlt: de("Gewerbliches Gebäude"),
        },
      ],
      _orbi: { component: "SectionProjectCarousel" },
    },
    {
      id: "standsFor",
      heading: de("Bhend Architektur steht für"),
      body: de(
        "Bhend Architektur steht für massgeschneiderte, nachhaltige und zukunftsorientierte Baukonzepte, die nicht nur Ihre individuellen Wünsche erfüllen, sondern auch einen bleibenden Wert für Sie und die Gemeinschaft schaffen.",
      ),
      image: "/images/home/stands-for.jpg",
      imageAlt: de("Gebäudeecke"),
      imagePosition: "left",
      ctaLabel: de("Starten Sie Ihr Projekt mit uns"),
      reservationMode: "mailto",
      reservationTarget: CONTACT_MAIL,
      _orbi: { component: "SectionSplit" },
    },
    {
      id: "process",
      title: de(
        "Realisieren Sie Ihr Bauprojekt mit Bhend Architektur\nIn drei einfachen Schritten",
      ),
      items: [
        {
          title: de("Kontaktaufnahme und Beratung"),
          text: de(
            "Beginnen Sie Ihr Projekt, indem Sie Kontakt mit uns aufnehmen. Wir sind hier, um Ihre spezifischen Anforderungen zu verstehen, sei es für ein privates Eigenheim, ein gewerbliches Bauvorhaben oder ein öffentliches Bauwerk.",
          ),
          icon: "/images/home/icons/step1.png",
        },
        {
          title: de("Planung und Konzeptentwicklung"),
          text: de(
            "Unser Team arbeitet eng mit Ihnen zusammen, um ein massgeschneidertes Konzept zu entwickeln. Wir berücksichtigen Ihre Anforderungen, um sicherzustellen, dass Ihre Bedürfnisse vollständig erfüllt werden.",
          ),
          icon: "/images/home/icons/step2.png",
        },
        {
          title: de("Umsetzung und Fertigstellung"),
          text: de(
            "Wir kümmern uns um die reibungslose Realisierung Ihres Projekts. Von der Beschaffung der Baubewilligung bis zur Fertigstellung des Bauwerks gewährleisten wir eine professionelle Ausführung.",
          ),
          icon: "/images/home/icons/step3.png",
        },
      ],
      _orbi: { component: "SectionIconGrid" },
    },
    {
      id: "ctaBand",
      title: de(
        "Machen Sie den ersten Schritt zu Ihrem erfolgreichen Bauprojekt!",
      ),
      ctaLabel: de("Jetzt Kontakt aufnehmen"),
      reservationMode: "mailto",
      reservationTarget: CONTACT_MAIL,
      _orbi: { component: "SectionCta" },
    },
    {
      id: "risks",
      heading: de(
        "Mit Bhend Architektur Risiken minimieren und Sicherheit gewinnen",
      ),
      body: de(
        "Bei jedem Bauprojekt, egal ob privat, geschäftlich oder öffentlich, gibt es potenzielle Herausforderungen und Risiken.\nBhend Architektur hat sich darauf spezialisiert, diese Risiken zu minimieren und Misserfolge zu vermeiden. Unsere klaren Strukturen und bewährten Prozesse helfen uns, häufige Fallen wie Budgetüberschreitungen, Qualitätsmängel, Planungsfehler und Bauverzögerungen zu verhindern.",
      ),
      bodySecondary: de(
        "Wir setzen auf transparente Kommunikation, gründliche Planung und sorgfältige Ausführung, um sicherzustellen, dass Ihr Projekt erfolgreich und gemäss Ihren Vorstellungen realisiert wird. Mit Bhend Architektur an Ihrer Seite können Sie darauf vertrauen, dass Ihr Bauvorhaben in sicheren Händen ist und Ihre Investition langfristigen Wert schafft.",
      ),
      image: "/images/home/risks.jpg",
      imageAlt: de("Team in einer Besprechung"),
      _orbi: { component: "SectionMediaStory" },
    },
    {
      id: "engagement",
      heading: de("Unser Engagement für Ihren Erfolg bei jedem Bauprojekt"),
      body: de(
        "Bei Bhend Architektur ist es unser Hauptanliegen, Ihre Visionen in die Realität umzusetzen. Wir konzentrieren uns darauf, die spezifischen Wünsche und Bedürfnisse jedes Projekts zu verstehen und mit grösster Sorgfalt und Präzision zu erfüllen.\nUnser Ziel ist es, Räume zu schaffen, die nicht nur heute begeistern, sondern auch zukünftigen Anforderungen standhalten.\nOb es sich um ein gemütliches Zuhause, ein funktionales Geschäftsgebäude oder eine öffentliche Einrichtung handelt – wir sind bestrebt, langfristigen Wert und dauerhafte Zufriedenheit zu schaffen. Verwirklichen Sie Ihr Projekt mit uns.",
      ),
      image: "/images/home/engagement.jpg",
      imageAlt: de("Pläne und Arbeit am Entwurf"),
      imagePosition: "left",
      _orbi: { component: "SectionSplit" },
    },
    {
      id: "map",
      image: "/images/home/map.jpg",
      imageAlt: de("Standort Bhend Architektur in Oftringen"),
      _orbi: { component: "SectionMap" },
    },
  ]
}

function membershipLogo({ title, image, href }) {
  return {
    title: de(title),
    image,
    imageAlt: de(title),
    href,
  }
}

function membershipSections() {
  return [
    {
      id: "memberships",
      title: de("MITGLIEDSCHAFTEN"),
      items: [
        membershipLogo({
          title: "Energieberatung Aargau",
          image: "/images/mitgliedschaften/energieberatung-aargau.png",
          href: "https://www.ag.ch/de/verwaltung/bvu/energie/energieberatungaargau",
        }),
        membershipLogo({
          title: "GEAK",
          image: "/images/mitgliedschaften/geak.png",
          href: "https://www.geak.ch/",
        }),
        membershipLogo({
          title: "LVBP",
          image: "/images/mitgliedschaften/lvbp.svg",
          href: "https://www.lvbp.ch/",
        }),
        membershipLogo({
          title: "CRB",
          image: "/images/mitgliedschaften/crb.svg",
          href: "https://www.crb.ch/",
        }),
        membershipLogo({
          title: "VBSF",
          image: "/images/mitgliedschaften/vbsf.png",
          href: "https://www.vbsf.ch/",
        }),
        membershipLogo({
          title: "WR Zofingen",
          image: "/images/mitgliedschaften/wr-zofingen.png",
          href: "https://wr-zofingen.ch/",
        }),
        membershipLogo({
          title: "Gewerbe Roggwil",
          image: "/images/mitgliedschaften/gewerbe-roggwil.png",
          href: "https://www.gewerbe-roggwil.ch/",
        }),
        membershipLogo({
          title: "Gewerbe Oftringen",
          image: "/images/mitgliedschaften/gewerbe-oftringen.png",
          href: "https://www.gewerbe-oftringen.ch/",
        }),
      ],
      _orbi: { component: "SectionLogoGrid" },
    },
  ]
}

export function buildSeedPages({
  hasSqlKeyConfigured = false,
  apiKeysUrl = API_KEYS_URL,
} = {}) {
  return [
    {
      id: "seed-home",
      slug: "home",
      title: {
        de: "Home",
        en: "Home",
      },
      lead: {
        de: "Bauen für Menschen, gestalten für Generationen",
        en: "Bauen für Menschen, gestalten für Generationen",
      },
      img: "/images/home/hero.jpg",
      keywords: ["architektur", "bauen", "oftringen", "bhend"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: homeSections(),
    },
    {
      id: "seed-team",
      slug: "ueber-uns/team",
      title: {
        de: "Team",
        en: "Team",
      },
      lead: {
        de: "Bhend Architektur Team",
        en: "Bhend Architektur Team",
      },
      img: "/images/team/team-hero.jpg",
      keywords: ["team", "über uns", "architektur"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: teamSections(),
    },
    {
      id: "seed-mitgliedschaften",
      slug: "ueber-uns/mitgliedschaften",
      title: {
        de: "Mitgliedschaften",
        en: "Memberships",
      },
      lead: {
        de: "Mitgliedschaften von Bhend Architektur",
        en: "Bhend Architektur memberships",
      },
      img: "/images/mitgliedschaften/energieberatung-aargau.png",
      keywords: ["mitgliedschaften", "über uns", "partner"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: membershipSections(),
    },
    {
      id: "seed-setup",
      slug: "setup",
      title: {
        de: "Setup",
        en: "Setup",
      },
      lead: {
        de: "Operator onboarding",
        en: "Operator onboarding",
      },
      img: "",
      keywords: ["welcome", "setup"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: [
        {
          title: {
            en: "Welcome to your Astro + Orbitype site",
            de: "Willkommen bei Ihrer Astro + Orbitype Site",
          },
          lead: {
            en: "This screen appears when the CMS is empty, unconfigured, or running in mock mode.",
            de: "Dieser Bildschirm erscheint, wenn das CMS leer, nicht konfiguriert oder im Mock-Modus ist.",
          },
          capabilities: [],
          steps: [
            {
              title: { en: "Install schema", de: "Schema installieren" },
              text: {
                en: "Run pnpm run cms:install on an authorized machine.",
                de: "Führen Sie pnpm run cms:install auf einem autorisierten Rechner aus.",
              },
              kind: "cli",
              code: "pnpm run cms:install",
            },
          ],
          hasSqlKeyConfigured,
          apiKeysUrl,
          _orbi: { component: "SectionWelcome" },
        },
      ],
    },
  ]
}

export function buildSeedPosts() {
  return [
    {
      id: "seed-post-1",
      title: {
        de: "Erste Schritte mit Abschnitten",
        en: "Getting started with sections",
      },
      lead: {
        de: "<p>Wie CMS-JSON zu gerendertem HTML wird.</p>",
        en: "<p>How CMS JSON becomes rendered HTML.</p>",
      },
      img: "",
      status: {
        options: ["draft", "review", "published"],
        value: "published",
      },
      keywords: ["sections", "orbitype"],
      created_at: now(),
      updated_at: now(),
      sections: [
        {
          title: {
            de: "Eine Datei pro Abschnitt",
            en: "One file per section",
          },
          content: {
            de: "<p>Erstellen Sie <code>SectionName.astro</code>. Der Dateiname muss genau <code>_orbi.component</code> entsprechen.</p>",
            en: "<p>Create <code>SectionName.astro</code> in <code>src/components/sections/</code>. The filename must match <code>_orbi.component</code> exactly.</p>",
          },
          _orbi: { component: "SectionProse" },
        },
      ],
    },
  ]
}
