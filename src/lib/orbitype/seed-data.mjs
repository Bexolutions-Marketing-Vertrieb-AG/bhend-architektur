/** Starter CMS rows — single source for mock mode and `pnpm run cms:seed`. */

import { buildLeistungenSeedPages } from "./seed-leistungen.mjs"
import {
  buildProjectFeedPages,
  buildSeedProjectPosts,
} from "./seed-projects.mjs"
import { buildSeedBlogPosts } from "./seed-blog.mjs"
import { impressumSections } from "./seed-impressum.mjs"
import { kontaktSections, MAP_EMBED } from "./seed-kontakt.mjs"

const now = () => new Date().toISOString()

const API_KEYS_URL = "https://app.orbitype.com/settings/api-keys"

const CONTACT_MAIL = "info@bhend-architektur.ch"
const CAREERS_PATH = "/bei-uns-arbeiten"

const de = (value) => ({ de: value, en: value })

function teamMember({ name, role, studies = [], image, phone, email }) {
  return {
    name: de(name),
    role: de(role),
    studies: studies.map(de),
    image,
    imageAlt: de(name),
    phone,
    email,
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
          email: "ueli.bhend@bhend-architektur.ch",
          role: "Geschäftsinhaber",
          studies: [
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
          email: "micha.bhend@bhend-architektur.ch",
          role: "Mitglied Geschäftsleitung / Partner",
          studies: ["Architekt HF", "Hochbaupolier"],
        }),
        teamMember({
          name: "Thomas Schweizer",
          image: "/images/team/thomas-schweizer.jpg",
          phone: "+41 62 798 0404",
          email: "thomas.schweizer@bhend-architektur.ch",
          role: "Mitglied Geschäftsleitung / Partner",
          studies: [
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
          email: "patrick.zingg@bhend-architektur.ch",
          role: "Mitglied Geschäftsleitung / Partner",
          studies: [
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
          email: "christoph.ruesch@bhend-architektur.ch",
          role: "Architekt FH",
          studies: [
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
          email: "markus.moser@bhend-architektur.ch",
          role: "Bauleiter",
          studies: [
            "Technischer Kaufmann mit eidgenösischem Fachausweis",
            "Dipl. Bodenberater Boden Schweiz/ISP/TVS",
            "Berufsbildner",
          ],
        }),
        teamMember({
          name: "Joel Gerber",
          image: "/images/team/joel-gerber.jpg",
          phone: "+41 62 798 1076",
          email: "joel.gerber@bhend-architektur.ch",
          role: "Architekt HF",
          studies: ["Berufsbildner"],
        }),
        teamMember({
          name: "Brigitte Flükiger",
          image: "/images/team/brigitte-fluekiger.jpg",
          phone: "+41 62 798 1077",
          email: "brigitte.flükiger@bhend-architektur.ch",
          role: "Zeichnerin EFZ Architektur",
          studies: ["Hochbauzeichnerin", "Berufsbildnerin"],
        }),
        teamMember({
          name: "Stefanie Burren",
          image: "/images/team/stefanie-burren.jpg",
          phone: "+41 62 798 1071",
          email: "stefanie.burren@bhend-architektur.ch",
          role: "Zeichnerin EFZ Architektur",
        }),
        teamMember({
          name: "Simon Höchenberger",
          image: "/images/team/simon-hoechenberger.jpg",
          phone: "+41 62 798 1073",
          email: "simon.hoechi@bhend-architektur.ch",
          role: "Zeichner EFZ Architektur",
          studies: ["Maurer EFZ"],
        }),
        teamMember({
          name: "Jannik Wyss",
          image: "/images/team/jannik-wyss.jpg",
          phone: "+41 62 798 0000",
          email: "jannik.wyss@bhend-architektur.ch",
          role: "Zeichner EFZ Architektur i.A",
        }),
        teamMember({
          name: "Mathilde de Almeida Rocha",
          image: "/images/team/mathilde-de-almeida-rocha.jpg",
          phone: "+41 62 798 0000",
          email: "mathilde.rocha@bhend-architektur.ch",
          role: "Zeichnerin EFZ Architektur i.A.",
        }),
        teamMember({
          name: "Esther Wälchli",
          image: "/images/team/esther-waelchli.jpg",
          phone: "+41 62 798 0000",
          email: "sekretariat@bhend-architektur.ch",
          role: "Administration",
        }),
        teamMember({
          name: "Selina Vonäsch",
          image: "/images/team/selina-vonaesch.jpg",
          phone: "+41 62 798 0000",
          email: "selina.vonaesch@bhend-architektur.ch",
          role: "Praktikantin",
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
          icon: "/images/home/icons/private-light.png",
        },
        {
          title: de("Firmen und Institutionen"),
          text: de(
            "Realisierung funktionaler und zukunftsorientierter Geschäftsräume, die Effizienz und Innovation vereinen.",
          ),
          icon: "/images/home/icons/business-light.png",
        },
        {
          title: de("Öffentliche Bauten"),
          text: de(
            "Erschaffung öffentlicher Bauten, die Gemeinschaften ermöglichen und Generationen inspirieren.",
          ),
          icon: "/images/home/icons/public-light.png",
        },
      ],
      _orbi: { component: "SectionIconGrid" },
    },
    {
      id: "challenges",
      heading: de(
        "Private und Öffentliche\nBauprojekte\nGleiche\nHerausforderungen",
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
          icon: "/images/home/icons/private-dark.png",
        },
        {
          title: de("Firmen und Institutionen"),
          text: de(
            "Firmen und Institutionen suchen nach Wegen, ihre Räumlichkeiten effizient und zukunftssicher zu gestalten, während sie gleichzeitig ein inspirierendes Arbeitsumfeld schaffen möchten.",
          ),
          icon: "/images/home/icons/business-dark.png",
        },
        {
          title: de("Öffentliche Bauten"),
          text: de(
            "Öffentliche Einrichtungen suchen nach Lösungen, um Gebäude zu konzipieren, die sowohl funktional sind als auch langfristig zum Wohl der Gemeinschaft beitragen.",
          ),
          icon: "/images/home/icons/public-dark.png",
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
          title: de("Private Bauprojekte"),
          text: de(
            "Individuell gestaltete Einfamilienhäuser und Wohnkomplexe.",
          ),
          image: "/images/home/carousel-1.jpg",
          imageAlt: de("Privates Wohnprojekt"),
        },
        {
          title: de("Gewerbliche Bauprojekte"),
          text: de("Moderne Bürogebäude und gewerbliche Einrichtungen."),
          image: "/images/home/carousel.jpg",
          imageAlt: de("Gewerbliches Gebäude"),
        },
        {
          title: de("Institutionelle Bauprojekte"),
          text: de("Schulen, Kindergärten und öffentliche Einrichtungen."),
          image: "/images/home/carousel-2.jpg",
          imageAlt: de("Institutionelles Bauprojekt"),
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
      reservationMode: "path",
      reservationTarget: "/kontakt",
      _orbi: { component: "SectionSplit" },
    },
    {
      id: "process",
      title: de(
        "Realisieren Sie Ihr Bauprojekt mit Bhend Architektur\nIn drei einfachen Schritten",
      ),
      items: [
        {
          title: de("Kontaktaufnahme und\nBeratung"),
          text: de(
            "Beginnen Sie Ihr Projekt, indem Sie Kontakt mit uns aufnehmen. Wir sind hier, um Ihre spezifischen Anforderungen zu verstehen, sei es für ein privates Eigenheim, ein gewerbliches Bauvorhaben oder ein öffentliches Bauwerk.",
          ),
          icon: "/images/home/icons/step1.png",
        },
        {
          title: de("Planung und\nKonzeptentwicklung"),
          text: de(
            "Unser Team arbeitet eng mit Ihnen zusammen, um ein massgeschneidertes Konzept zu entwickeln. Wir berücksichtigen Ihre Anforderungen, um sicherzustellen, dass Ihre Bedürfnisse vollständig erfüllt werden.",
          ),
          icon: "/images/home/icons/step2.png",
        },
        {
          title: de("Umsetzung und\nFertigstellung"),
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
      mapEmbedUrl: MAP_EMBED,
      mapTitle: de("Zofingerstrasse 43, 4665 Oftringen"),
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

function pressPost({ id, title, source, body, images }) {
  return {
    id,
    title: de(title),
    source: source ? de(source) : undefined,
    body: body ? de(body) : undefined,
    images: (images ?? []).map((img) => ({
      src: img.src,
      alt: de(img.alt ?? title),
    })),
  }
}

function pressSections() {
  return [
    {
      id: "pressList",
      title: de("PRESSE / EXTERN"),
      items: [
        pressPost({
          id: "baureportage-bornapark",
          title: "Baureportage Bornapark",
          source: "Wiggertaler, September 2025",
          images: [
            { src: "/images/presse-extern/baureportage-bornapark-1.jpg" },
            { src: "/images/presse-extern/baureportage-bornapark-2.jpg" },
          ],
        }),
        pressPost({
          id: "bornapark-uebernahme",
          title: "Offizielle Übernahme der Bornapark-Neubauten",
          source: "Borna Wiggertaler, August 2025",
          images: [
            {
              src: "/images/presse-extern/offizielle-uebernahme-der-bornapark-neubauten.jpg",
            },
          ],
        }),
        pressPost({
          id: "firmen-umwandlung-und-neue-partner",
          title: "Firmen-Umwandlung und neue Partner",
          source: "Wiggertaler 19.09.2024",
          images: [
            {
              src: "/images/presse-extern/firmen-umwandlung-und-neue-partner.jpg",
            },
          ],
        }),
        pressPost({
          id: "spatenstich-lindenpark-ofringen",
          title: "Spatenstich Lindenpark Ofringen",
          source: "Zofinger Tagblatt 19.09.2024",
          images: [
            {
              src: "/images/presse-extern/spatenstich-lindenpark-ofringen.jpg",
            },
          ],
        }),
        pressPost({
          id: "einweihung-kindergarten-kuengoldingen",
          title: "Einweihung Kindergarten Küngoldingen",
          source: "Wiggertaler 02.11.2023",
          images: [
            {
              src: "/images/presse-extern/einweihung-kindergarten-kuengoldingen-1.jpg",
            },
            {
              src: "/images/presse-extern/einweihung-kindergarten-kuengoldingen-2.jpg",
            },
          ],
        }),
        pressPost({
          id: "lernende-baustelle-safenwil",
          title: "Lernende Baustelle – Safenwil",
          source: "Zofinger Tagblatt 30.06.2023",
          images: [
            { src: "/images/presse-extern/lernende-baustelle-safenwil.jpg" },
          ],
        }),
        pressPost({
          id: "pilotprojekt-luftkissen",
          title: "Pilotprojekt Arbeitssicherheit mit Luftkissen",
          source: "Modernisierung Kath. Kirche Schöftland AZ 15.06.2023",
          images: [
            {
              src: "/images/presse-extern/pilotprojekt-arbeitssicherheit-mit-luftkissen.jpg",
            },
          ],
        }),
        pressPost({
          id: "baureportage-sennhof",
          title: "Baureportage Sennhof",
          source: "Wiggertaler Mai 2023",
          images: [
            { src: "/images/presse-extern/baureportage-sennhof-1.jpg" },
            { src: "/images/presse-extern/baureportage-sennhof-2.jpg" },
            { src: "/images/presse-extern/baureportage-sennhof-3.jpg" },
          ],
        }),
        pressPost({
          id: "spatenstich-doppelkindergarten-oftringen",
          title: "Spatenstich Doppelkindergarten Oftringen",
          source: "Zofinger Tagblatt, September 2022",
          images: [
            {
              src: "/images/presse-extern/spatenstich-doppelkindergarten-oftringen.jpg",
            },
          ],
        }),
        pressPost({
          id: "kirchensanierung-schoeftland",
          title: "Katholische Kirche –Kirchensanierung teurer als gedacht",
          source: "Zofinger Tagblatt, März 2022",
          images: [
            {
              src: "/images/presse-extern/katholische-kirche-kirchensanierung-teurer-als-g.jpg",
            },
          ],
        }),
        pressPost({
          id: "sennhof-erweiterung",
          title: "Sennhof in Vordemwald erweitert den geschützten Wohnbereich",
          source: "Zofinger Tagblatt, März 2022",
          images: [
            {
              src: "/images/presse-extern/sennhof-in-vordemwald-erweitert-den-geschuetzten.jpg",
            },
          ],
        }),
        pressPost({
          id: "sennhof-beim-umbau-geht-s-zuegig-voran",
          title: "Sennhof – Beim Umbau geht’s zügig voran",
          source: "Sennhof Spiegel Oktober 2021",
          images: [
            {
              src: "/images/presse-extern/sennhof-beim-umbau-geht-s-zuegig-voran.jpg",
            },
          ],
        }),
        pressPost({
          id: "sennhof-bauarbeiten-sind-auf-kurs",
          title: "Sennhof – Bauarbeiten sind auf Kurs",
          source: "Wiggertaler und Aarauer Nachrichten April 2021",
          images: [
            {
              src: "/images/presse-extern/sennhof-bauarbeiten-sind-auf-kurs-1.jpg",
            },
            {
              src: "/images/presse-extern/sennhof-bauarbeiten-sind-auf-kurs-2.jpg",
            },
          ],
        }),
        pressPost({
          id: "sennhof-umbau-ist-im-zeitplan",
          title: "Sennhof – Umbau ist im Zeitplan",
          source: "Sennhof Spiegel März 2021",
          images: [
            {
              src: "/images/presse-extern/sennhof-umbau-ist-im-zeitplan-1.jpg",
            },
            {
              src: "/images/presse-extern/sennhof-umbau-ist-im-zeitplan-2.jpg",
            },
            {
              src: "/images/presse-extern/sennhof-umbau-ist-im-zeitplan-3.jpg",
            },
          ],
        }),
        pressPost({
          id: "efh-ghana-lehrlingsprojekt",
          title: "Einfamilienhaus für Ghana Lehrlingsprojekt",
          source: "Wiggertaler Anzeiger Januar 2021",
          images: [
            {
              src: "/images/presse-extern/einfamilienhaus-fuer-ghana-lehrlingsprojekt.jpg",
            },
          ],
        }),
        pressPost({
          id: "zukunft-sennhof-baustart",
          title: "Zukunft Sennhof – Baustart",
          source: "Sennhof Spiegel September 2020",
          images: [
            { src: "/images/presse-extern/zukunft-sennhof-baustart.jpg" },
          ],
        }),
        pressPost({
          id: "pflegeheim-sennhof-2023",
          title: "Pflegeheim Sennhof – Im Jahr 2023 beginnt die Zukunft",
          source: "Zofinger Tagblatt August 2020",
          body: "Bericht vom Zofinger Tagblatt über den vergangen Informationsanlass zum projektierten Anbau und den Start der ersten Bauetappe.",
          images: [
            {
              src: "/images/presse-extern/pflegeheim-sennhof-im-jahr-2023-beginnt-die-zuku.jpg",
            },
          ],
        }),
        pressPost({
          id: "zukunft-sennhof-die-naechste-bauetappe",
          title: "Zukunft Sennhof – Die nächste Bauetappe",
          source: "Sennhof Spiegel Februar 2020",
          body: "Bericht der Sennhof Hauszeitung über den bevorstehenden Umbau.",
          images: [
            {
              src: "/images/presse-extern/zukunft-sennhof-die-naechste-bauetappe-1.jpg",
            },
            {
              src: "/images/presse-extern/zukunft-sennhof-die-naechste-bauetappe-2.jpg",
            },
            {
              src: "/images/presse-extern/zukunft-sennhof-die-naechste-bauetappe-3.jpg",
            },
          ],
        }),
        pressPost({
          id: "neubau-b-b-allegra-kuengoldingen",
          title: "Neubau B&B Allegra Küngoldingen",
          source: "Zofinger Tagblatt 07.10.2019",
          images: [
            {
              src: "/images/presse-extern/neubau-b-b-allegra-kuengoldingen.jpg",
            },
          ],
        }),
        pressPost({
          id: "einbau-hoehenrettungszentrum",
          title: "Einbau Höhenrettungszentrum",
          source: "Zofinger Tagblatt 17.10.2018",
          body: "Der Firmenmix im Trilapark an der Unteren Brühlstrasse 11 in Zofingen ist um eine Sparte reicher. In der alten Farbenfabrik ist neu auch ein Ausbildungszentrum für Höhenrettungen beheimatet.\nDas deutsche Unternehmen Bornack hat sich die Thutstadt als neuen Schweizer Firmensitz ausgesucht.\n«Es war Liebe auf den ersten Blick», sagt Geschäftsführer Markus Hobi. «Als ich diese leerstehende Halle sah, wusste ich, das ist es, wonach ich schon lange suchte.»",
          images: [
            { src: "/images/presse-extern/einbau-hoehenrettungszentrum.jpg" },
          ],
        }),
        pressPost({
          id: "spatenstich-b-b-allegra",
          title: "Spatenstich B&B Allegra",
          source: "Zofinger Tagblatt 09.10.2018",
          body: "Jetzt kann die Familie von Anneliese und Martin Gaberthüel aus Küngoldingen wieder lachen. In wenigen Tagen fällt der Startschuss zum Wiederaufbau ihres im Sommer 2016 abgebrannten Hofes.\nRückblick: Mittwoch, 8. Juni 2016, ein Unwetter zieht über die Region Zofingen. Immer wieder gehen Blitze nieder. Um 15.15 Uhr schlägt einer direkt in den Scheunenteil der Familie Gaberthüel an der Oberen Hauptstrasse 44 in Küngoldingen ein. Innerhalb von wenigen Sekunden steht der Holzbau in Vollbrand.\n«Ich war nicht zu Hause, ich arbeitete auswärts, als der Blitz einschlug», erinnert sich Landwirt Martin Gaberthüel.\n«Die Tiere waren auf der Weide.» Tatenlos musste er zuschauen, wie die Scheune bis auf die Grundmauern niederbrannte. Gegen 100 Feuerwehrleute aus Oftringen, Zofingen und Aarburg kämpften gegen die Flammen und retteten den Wohnteil. Trotzdem beträgt der Sachschaden mehrere hunderttausend Franken.\n«Zum Glück sind keine Menschen und Tiere zu Schaden gekommen, der Rest ist ersetzbar», bilanziert Gaberthüel am Tag nach dem Brand. Über dem Wohnhausteil wurde ein Notdach erstellt. Bereits einen Tag nach dem Brand kehrte die sechsköpfige Familie in ihre Wohnung zurück.\nNach dem Brand liess sich das Paar viel Zeit, denn die Situation bot plötzlich viele neue Optionen. «Wir planten mit dem Familienrat die Zukunft des Hofs», sagt Martin Gaberthüel. «Schnell wurde klar, dass wir am bisherigen Standort keine Tiere mehr wollen.» In der Zwischenzeit sind mehr als zwei Jahre vergangen, alle Brandspuren beseitigt und die Familie Gaberthüel setzt die Zukunftspläne in die Tat um. «Wir werden ein Bed & Breakfast (B&B) mit vier Zimmern eröffnen», verraten Anneliese und Martin Gaberthüel. Das innovative Paar wog zuvor verschiedene Möglichkeiten ab. «Nun hat der Brand die Idee beschleunigt», sagt Martin Gaberthüel.\n\nWiederaufbau des Hofladens\nArchitektonisch wird der Anbau gleich wie bisher aussehen und auch auf den bisherigen Grundmauern aufgebaut. Über den vier B&B-Zimmern wird es zudem eine Zweizimmerwohnung mit Balkon Richtung Westen geben. Alles wird behindertengerecht gebaut, so wird es auch einen Lift geben. Im Erdgeschoss wird der Hofladen einquartiert. «Die Landwirtschaft soll immer ein Standbein unserer Familie bleiben», sagt Martin Gaberthüel. Die Familie baut mit dem einheimischen Architekturbüro von Ueli Bhend. «Wir haben nach dem Brand sehr grosse Solidarität in der Gemeinde erleben dürfen», sagt die Familie Gaberthüel, «deshalb ist es auch klar, dass wir mit regionalen Handwerkern unseren Neubau realisieren werden.»\nDer symbolische Spatenstich ist bereits vor den Herbstferien gefeiert worden. Die Bauarbeiten beginnen in wenigen Tagen. Der Anbau soll in rund einem Jahr fertig sein. «Wenn dann die ersten Gäste ins B&B einziehen, geht ein grosser Traum für uns in Erfüllung», betont Anneliese Gaberthüel. Bis dahin gibt es aber noch eine Menge Arbeit zu erledigen.",
          images: [
            { src: "/images/presse-extern/spatenstich-b-b-allegra-1.jpg" },
            { src: "/images/presse-extern/spatenstich-b-b-allegra-2.jpg" },
          ],
        }),
        pressPost({
          id: "shed-dachsanierung-trilapark",
          title: "Shed-Dachsanierung Trilapark",
          source: "Architektur und Technik April 2018",
          images: [
            { src: "/images/presse-extern/shed-dachsanierung-trilapark.jpg" },
          ],
        }),
      ],
      _orbi: { component: "SectionPressList" },
    },
  ]
}

function planungSections() {
  return [
    {
      id: "planungIntro",
      title: de("PLANUNG"),
      lead: de("BRANDSCHUTZPLANUNG UND QUALITÄTSSICHERUNG BRANDSCHUTZ"),
      body: de(
        "Bei Bhend Architektur steht eine massgeschneiderte und präzise Planung im Zentrum unserer Arbeit, um optimale Ergebnisse für Ihr Bauvorhaben zu gewährleisten. Unser Ziel ist es, Ihre Vision mit höchster Sorgfalt und Genauigkeit in die Realität umzusetzen.",
      ),
      image: "/images/planung/hero.jpg",
      imageAlt: de("Team von Bhend Architektur bei der Planung"),
      _orbi: { component: "SectionServiceIntro" },
    },
    {
      id: "planungPillars",
      items: [
        {
          title: de("Präzise Kostenplanung"),
          text: de(
            "Bei jedem Bauprojekt ist eine sorgfältige Kostenplanung von entscheidender Bedeutung, um sicherzustellen, dass das Budget eingehalten wird. Durch kontinuierliche Überwachung und transparente Kommunikation können potenzielle Kostenüberschreitungen vermieden werden. Die richtige Balance zwischen Qualität und Wirtschaftlichkeit ist dabei essentiell, um ein erfolgreiches und finanzierbares Bauprojekt zu realisieren.",
          ),
        },
        {
          title: de(
            "Innovative Lösungen und Frühzeitige Herausforderungserkennung",
          ),
          text: de(
            "Unser Team aus erfahrenen Architekten und Bauleitern setzt auf innovative Lösungen und kreative Konzepte. Wir planen Ihr Projekt effizient und erkennen potenzielle Herausforderungen frühzeitig, um optimale Lösungswege zu entwickeln.",
          ),
        },
        {
          title: de("Detaillierte Entwürfe nach Höchsten Standards"),
          text: de(
            "Mit grosser Aufmerksamkeit für Details erstellen wir Entwürfe und Pläne, die alle Aspekte Ihres Bauvorhabens umfassend berücksichtigen. Unsere Arbeit orientiert sich an den SIA-Normen, um höchste Qualität und Sicherheit zu gewährleisten.",
          ),
        },
      ],
      _orbi: { component: "SectionTextColumns" },
    },
    {
      id: "planungProcess",
      body: de(
        "Durch diese strukturierte Vorgehensweise stellen wir sicher, dass Ihr Projekt nicht nur Ihren Vorstellungen entspricht, sondern auch effizient und kostenbewusst realisiert wird. Entdecken Sie, wie Bhend Architektur Ihre Bauprojekte mit Präzision und Innovation zum Erfolg führt.",
      ),
      lead: de(
        "Wir legen grossen Wert auf eine transparente und umfassende Beratung in allen Planungsphasen:",
      ),
      image: "/images/planung/process.jpg",
      imageAlt: de("Detailplanung mit Plänen und Massstab"),
      items: [
        {
          title: de("Analyse und Entwurf"),
          text: de(
            "Professionelle Analyse und Entwurf Ihrer Immobilie für optimale Ergebnisse.",
          ),
        },
        {
          title: de("Vorprojekt mit Kostenschätzung"),
          text: de(
            "Detaillierte Vorplanung inklusive einer ersten Kostenschätzung für Ihr Projekt.",
          ),
        },
        {
          title: de("Bauprojekt mit detailliertem Kostenvoranschlag"),
          text: de(
            "Umfassende Ausarbeitung Ihres Bauprojekts mit einem detaillierten Kostenvoranschlag.",
          ),
        },
        {
          title: de("Ausführungsplanung"),
          text: de(
            "Präzise Ausführungsplanung zur reibungslosen Umsetzung Ihres Bauprojekts.",
          ),
        },
      ],
      _orbi: { component: "SectionChecklistSplit" },
    },
    {
      id: "planungCta",
      eyebrow: de("Weitere Informationen zum Thema"),
      title: de("PLANUNG"),
      text: de("Rufen Sie uns noch heute an"),
      ctaLabel: de("+41 62 798 00 00"),
      reservationMode: "url",
      reservationTarget: "tel:+41627980000",
      _orbi: { component: "SectionCta" },
    },
  ]
}

function careersSections() {
  return [
    {
      id: "careersIntro",
      heading: de("WIR SUCHEN DICH!"),
      image: "/images/bei-uns-arbeiten/hero.jpg",
      imageAlt: de("Das Team von Bhend Architektur auf der Baustelle"),
      body: de(
        "Du suchst nach einem Arbeitsumfeld das Innovation, Teamgeist und Fachkompetenz vereint?",
      ),
      bodySecondary: de(
        "Bei Bhend Architektur legen wir grossen Wert auf die Entwicklung und das Wohl unserer Mitarbeiter. Wir glauben daran, dass eine starke Unternehmenskultur und vielfältige Weiterbildungsmöglichkeiten den Schlüssel zu einem erfüllenden Berufsleben bilden. Werden Sie Teil eines Teams, das nicht nur Innovation lebt, sondern auch auf individuelle Stärken und Karrieren setzt.",
      ),
      _orbi: { component: "SectionCareersIntro" },
    },
    {
      id: "jobOpenings",
      heading: de("Offene Stellen"),
      items: [
        {
          id: "schnuppertage",
          title: de("ZEICHNER EFZ ARCHITEKTUR (M/W) SCHNUPPERTAGE"),
          body: de(
            "Nutze die Gelegenheit, einen Einblick in die Arbeiten und den Alltag von einem Zeichner zu erhalten und erfahre, wie vielseitig und kreativ der Beruf sein kann.",
          ),
          image: "/images/bei-uns-arbeiten/job-schnuppertage.jpg",
          imageAlt: de("Schnuppertage im Büro"),
          ctaLabel: de("MEHR ÜBER SCHNUPPERTAGE"),
          reservationMode: "path",
          reservationTarget: "/architektur-erleben",
        },
        {
          id: "lehrstelle",
          title: de("ZEICHNER EFZ ARCHITEKTUR (M/W) LEHRSTELLE"),
          body: de(
            "Du willst mitgestalten statt nur abzeichnen? Bei Bhend Architektur kombinieren wir Praxis, Herz und Verstand – fair, kompetent, visionär. Wenn dich Sinn, Teamgeist und sauberes Handwerk antreiben, bist du hier richtig.",
          ),
          image: "/images/bei-uns-arbeiten/job-lehrstelle.jpg",
          imageAlt: de("Lehrstelle Architektur"),
          ctaLabel: de("Bewerbung für Lehrstelle"),
          dialogId: "application-lehrstelle",
        },
      ],
      _orbi: { component: "SectionJobOpenings" },
    },
    {
      id: "applicationInvite",
      heading: de("Deine Initiativbewerbung"),
      body: de(
        "Keine passende Stelle? Trotzdem melden.\nSchnuppertag, Lehrstelle, freie Stelle oder Spontanbewerbung – wir schauen uns jede Bewerbung aufmerksam an und geben dir rasch Feedback.",
      ),
      ctaLabel: de("Jetzt bewerben"),
      dialogId: "application-lehrstelle",
      defaultApplicationType: "Spontanbewerbung",
      _orbi: { component: "SectionApplicationInvite" },
    },
    {
      id: "careersAbout",
      heading: de("WER SIND WIR EIGENTLICH?"),
      body: de(
        "Bhend Architektur steht für visionäre Architektur und innovative Bauprojekte!\nMit über 200 erfolgreich abgeschlossenen Projekten und einem erfahrenen Team von zusammen über 120 Jahren Bauerfahrung, kombinieren wir Fachkompetenz, soziale Verantwortung und zukunftsorientiertes Denken.",
      ),
      image: "/images/bei-uns-arbeiten/about.jpg",
      imageAlt: de("Teammeeting bei Bhend Architektur"),
      listHeading: de(
        "Unser Fokus liegt darauf, individuelle Lebensräume zu schaffen, die hohe Qualitätsstandards erfüllen.",
      ),
      lead: de("Unsere Kunden sind:"),
      items: [
        {
          body: de(
            "Familien, welche ein modernisiertes oder neues Eigenheim suchen",
          ),
        },
        { body: de("Pflegeheime mit Visionen") },
        {
          body: de(
            "Gemeinden welche neue Schulräume, Turnhallen oder Mehrzweckräume benötigen",
          ),
        },
        {
          body: de("Kirchen mit vielfältigen Wünschen zu ihren Gebäuden"),
        },
        {
          body: de("Investoren mit Bedarf an Wohn- und Gewerberäume"),
        },
      ],
      note: de(
        "Zusätzlich sind wir stark in der Energieberatung und im Brandschutz.",
      ),
      _orbi: { component: "SectionChecklistSplit" },
    },
    {
      id: "cultureBand",
      heading: de("MITARBEITERKULTUR UND ARBEITSUMFELD"),
      subheading: de("UNSERE MITARBEITERKULTUR – MEHR ALS NUR ARBEIT"),
      body: de(
        "Wir legen grossen Wert auf eine respektvolle und unterstützende Arbeitsatmosphäre.\nTeamanlässe, flexible Arbeitszeiten und eine moderne Büroinfrastruktur gehören zu den Grundlagen, die unseren Mitarbeitern helfen, sich zu entfalten.",
      ),
      _orbi: { component: "SectionCultureBand" },
    },
    {
      id: "instagramFeed",
      username: "bhend.architektur",
      biography: de("Bauen für Menschen, gestalten für Generationen."),
      limit: 12,
      _orbi: { component: "SectionInstagramFeed" },
    },
  ]
}

function schnupperSections() {
  const schnupperCta = de(
    "Jetzt den Beruf Schnuppern als Zeichner/in EFZ Architektur kennenlernen",
  )
  return [
    {
      id: "schnupperHero",
      heading: de("Architektur erleben"),
      lead: de(
        "Werde Zeichner für einen Tag! Entdecke den Beruf des Zeichners!",
      ),
      body: de(
        "Nutze die Gelegenheit, einen Einblick in die Arbeiten und den Alltag von einem Zeichner zu erhalten und erfahre, wie vielseitig und kreativ der Beruf sein kann.",
      ),
      image: "/images/bei-uns-arbeiten/schnupper-hero.jpg",
      imageAlt: de("Das Team von Bhend Architektur auf der Baustelle"),
      ctaLabel: schnupperCta,
      dialogId: "application-schnuppertage",
      defaultApplicationType: "Schnuppertag",
      _orbi: { component: "SectionSchnupperHero" },
    },
    {
      id: "lehrstelleWarum",
      heading: de("Warum eine Lehrstelle bei Bhend Architektur"),
      subheading: de(
        "Die Bhend Architektur steht für visionäre Architektur und innovative Bauprojekte!",
      ),
      body: de(
        "Seit über 10 Jahre bilden wir erfolgreich Zeichner/-innen EFZ aus. Unser Ziel ist es, Schüler/-innen auf ihrem Weg ins Berufsleben zu begleiten und sie auch neben der Ausbildung zu fördern, um einen sanften Einstieg in die Berufswelt zu ermöglichen. Die Lehrlingsausbildner Patrick und Joel haben zusammen über 20 Lehrlinge erfolgreich durch die Berufslehre begleitet.\nNebst der Förderung im Bereich der Berufskenntnisse, Sozial- und Selbstkompetenz fördern wir unsere Lehrlinge in allgemeinen Bereichen und ermöglichen während der Lehre einen Einblick in den Entwurf, die Bauleitung und viele weitere Bereiche.",
      ),
      image: "/images/bei-uns-arbeiten/lehrstelle-why.jpg",
      imageAlt: de("Lehrlinge und Ausbildner auf der Baustelle"),
      ctaLabel: schnupperCta,
      dialogId: "application-schnuppertage",
      defaultApplicationType: "Schnuppertag",
      _orbi: { component: "SectionLehrstelleSplit" },
    },
  ]
}

function blogSections() {
  return [
    {
      id: "blogFeed",
      heading: de("BLOGS"),
      emptyMessage: de("Noch keine Blogbeiträge veröffentlicht."),
      _orbi: { component: "SectionBlogFeed" },
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
      id: "seed-presse-extern",
      slug: "ueber-uns/presse-extern",
      title: {
        de: "Presse / Extern",
        en: "Press / External",
      },
      lead: {
        de: "Presseberichte und externe Beiträge",
        en: "Press coverage and external features",
      },
      img: "/images/presse-extern/baureportage-bornapark-1.jpg",
      keywords: ["presse", "extern", "über uns", "medien"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: pressSections(),
    },
    {
      id: "seed-planung",
      slug: "planung",
      title: {
        de: "Planung",
        en: "Planning",
      },
      lead: {
        de: "Massgeschneiderte und präzise Planung",
        en: "Tailored and precise planning",
      },
      img: "/images/planung/hero.jpg",
      keywords: ["planung", "leistungen", "architektur", "sia"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: planungSections(),
    },
    ...buildLeistungenSeedPages(now),
    ...buildProjectFeedPages(now),
    {
      id: "seed-bei-uns-arbeiten",
      slug: "bei-uns-arbeiten",
      title: {
        de: "Bei uns arbeiten",
        en: "Work with us",
      },
      lead: {
        de: "Wir suchen dich — offene Stellen und Initiativbewerbung",
        en: "We're hiring — open positions and speculative applications",
      },
      img: "/images/bei-uns-arbeiten/hero.jpg",
      keywords: ["karriere", "stellen", "lehrstelle", "schnuppertage", "team"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: careersSections(),
    },
    {
      id: "seed-architektur-erleben",
      slug: "architektur-erleben",
      title: {
        de: "Architektur erleben",
        en: "Experience architecture",
      },
      lead: {
        de: "Schnuppertage und Lehrstelle Zeichner/in EFZ Architektur",
        en: "Taster days and drafting apprenticeship",
      },
      img: "/images/bei-uns-arbeiten/schnupper-hero.jpg",
      keywords: [
        "schnuppertage",
        "lehrstelle",
        "zeichner",
        "architektur erleben",
      ],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: schnupperSections(),
    },
    {
      id: "seed-blog",
      slug: "blog",
      title: {
        de: "Blog",
        en: "Blog",
      },
      lead: {
        de: "Beiträge von Bhend Architektur",
        en: "Articles from Bhend Architektur",
      },
      img: "",
      keywords: ["blog", "wissen", "architektur"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: blogSections(),
    },
    {
      id: "seed-impressum",
      slug: "impressum",
      title: {
        de: "Impressum",
        en: "Legal notice",
      },
      lead: {
        de: "Kontaktadresse und rechtliche Angaben",
        en: "Contact address and legal information",
      },
      img: "/images/impressum/photo.jpg",
      keywords: ["impressum", "kontakt", "rechtliches"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: impressumSections(),
    },
    {
      id: "seed-kontakt",
      slug: "kontakt",
      title: {
        de: "Kontakt",
        en: "Contact",
      },
      lead: {
        de: "Schreiben Sie uns — wir melden uns gerne",
        en: "Write to us — we will get back to you",
      },
      img: "",
      keywords: ["kontakt", "anfrage", "formular"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: kontaktSections(),
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
  return [...buildSeedProjectPosts(now), ...buildSeedBlogPosts(now)]
}
