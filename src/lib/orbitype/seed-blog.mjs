/** Sample blog article post (Figma 277:11358) shared by seed + CMS. */

const de = (value) => ({ de: value, en: value })

const HERO =
  "/images/blog/wie-viel-planung-steckt-hinter-einer-erfolgreichen-sanierung/hero.jpg"

const TITLE = "WIE VIEL PLANUNG STECKT HINTER EINER ERFOLGREICHEN SANIERUNG?"
const SUBTITLE =
  "Warum der Architekt beim Umbau und einer Sanierung eine zentrale Rolle spielt"

export const SAMPLE_BLOG_POST_ID =
  "wie-viel-planung-steckt-hinter-einer-erfolgreichen-sanierung"

export function buildBlogArticleSection() {
  return {
    id: "blogArticle",
    title: de(TITLE),
    heading: de(TITLE),
    subheading: de(SUBTITLE),
    image: HERO,
    imageAlt: de(TITLE),
    tocLabel: de("Inhaltsverzeichnis"),
    toc: [
      { id: "einleitung", label: de("Einleitung") },
      {
        id: "sanierungsplanung",
        label: de(
          "Was gehört zur Sanierungsplanung – und warum ist sie so entscheidend?",
        ),
      },
      {
        id: "architekt-umbau-sanierung",
        label: de(
          "Architekt Umbau Sanierung – ein eingespieltes Zusammenspiel",
        ),
      },
      {
        id: "planungsfehler",
        label: de("Typische Planungsfehler – und wie wir sie vermeiden"),
      },
      {
        id: "wie-viel-planung",
        label: de("Wie viel Planung steckt also wirklich drin?"),
      },
      {
        id: "haeufige-fragen",
        label: de("Häufige Fragen zur Sanierungsplanung"),
      },
      {
        id: "zusammenfassung",
        label: de(
          "Zusammenfassung wie Planung der Schlüssel zu Ihrer erfolgreichen Sanierung ist",
        ),
      },
      {
        id: "jetzt-loslegen",
        label: de("Jetzt loslegen – mit einem Gespräch auf Augenhöhe"),
      },
    ],
    blocks: [
      {
        id: "einleitung",
        heading: de("Einleitung"),
        body: de(
          "Eine Sanierung ist mehr als ein baulicher Eingriff – sie ist eine komplexe Reise zwischen Bestand, Budget, Technik und Zukunft. Wer glaubt, ein paar neue Fenster und ein frischer Anstrich reichen aus, wird oft von versteckten Mängeln, Kostenüberschreitungen und Zeitverzögerungen überrascht.\n\nEin erfahrener Architekt für Umbau und Sanierung bringt Ordnung in dieses Spannungsfeld. Er erkennt Potenziale und Risiken, priorisiert Massnahmen und entwickelt einen klar strukturierten Ablauf. Bei Bhend Architektur wissen wir: Gute Planung ist der halbe Umbau – und der ganze Erfolg.\n\n“Sanieren ohne Planung ist wie Segeln ohne Karte.”",
        ),
      },
      {
        id: "sanierungsplanung",
        heading: de(
          "Was gehört zur Sanierungsplanung – und warum ist sie so entscheidend?",
        ),
        body: de(
          "1. Analyse des Bestands\nAm Anfang steht die Bestandsaufnahme. Welche Bausubstanz ist vorhanden? Wo bestehen Schäden? Wie ist der energetische Zustand? Wir prüfen:\nTragwerk & Statik\nFassade, Dach & Fenster\nHeizsysteme & Haustechnik\nRaumstruktur & Nutzung\nDiese Analyse ist die Grundlage jeder seriösen Sanierungsstrategie.",
        ),
        paragraphs: [
          de(
            "2. Ziele definieren & Nutzerbedürfnisse klären\nOhne klare Ziele keine sinnvolle Planung. Deshalb fragen wir:\nWas soll verbessert werden – Komfort, Effizienz, Raumgefühl?\nWelche Lebenssituation liegt vor – z. B. Familie, Arbeiten von zu Hause?\nGibt es Einschränkungen wie Denkmalschutz oder Baurecht?",
          ),
          de(
            "3. Machbarkeit & Variantenstudien\nNicht alles, was wünschenswert ist, ist auch umsetzbar. Deshalb vergleichen wir Szenarien:\nMinimal-Eingriffe vs. umfassende Sanierung\nEtappierungen zur Kosten- und Steueroptimierung\nWirtschaftlichkeit & mögliche Förderbeiträge",
          ),
        ],
      },
      {
        id: "architekt-umbau-sanierung",
        heading: de(
          "Architekt Umbau Sanierung – ein eingespieltes Zusammenspiel",
        ),
        body: de(
          "Warum Sie bei Bhend Architektur keine Standardlösung bekommen\nWir arbeiten systematisch – aber nie schematisch. Jedes Sanierungsprojekt ist individuell. Unsere Leistungen im Überblick:\nBeratung & Zieldefinition\nPlanung & Kostenrahmen\nBaueingabe & Behördenkoordination\nAusschreibung & Handwerkerselektion\nBauleitung & Qualitätssicherung\n“Wir verstehen Planung als Dialog – nicht als Diktat.“",
        ),
      },
      {
        id: "planungsfehler",
        heading: de("Typische Planungsfehler – und wie wir sie vermeiden"),
        body: de(
          "1. Fehlende Substanzanalyse\nOhne genaue Prüfung bleiben Schwachstellen unentdeckt. Unsere Erfahrung hilft, auch versteckte Risiken früh zu erkennen.\n2. Unrealistische Budgets\nWir kalkulieren mit Puffer und liefern monatliche Kostenübersichten – transparent und nachvollziehbar.\n3. Unklare Prioritäten\nNicht alles muss sofort gemacht werden. Wir helfen bei der Etappierung und setzen klare Sanierungsziele.\n4. Fehlende Kommunikation\nBei uns haben Sie feste Ansprechpartner und klare Strukturen – von Anfang bis zum Abschluss.",
        ),
      },
      {
        id: "wie-viel-planung",
        heading: de("Wie viel Planung steckt also wirklich drin?"),
        body: de(
          "Ein Sanierungsprojekt besteht nicht nur aus Bauen. Der Planungsanteil macht je nach Komplexität 10-20% des Gesamtprozesses aus. Dazu gehören:\nProjektvorbereitung\nVariantenentwicklung\nGenehmigungsverfahren\nTerminplanung\nDetaillierte Werkplanung\nJe besser diese Schritte durchdacht sind, desto reibungsloser und erfolgreicher verläuft der Umbau.",
        ),
      },
    ],
    faqHeading: de("Häufige Fragen zur Sanierungsplanung"),
    faqAnchorId: "haeufige-fragen",
    faq: [
      {
        question: de("Wie lange dauert die Planung einer Sanierung?"),
        answer: de("Je nach Grösse und Zustand 2–8 Monate."),
      },
      {
        question: de("Muss ich schon genaue Vorstellungen haben?"),
        answer: de(
          "Nein – wir erarbeiten gemeinsam mit Ihnen die richtigen Lösungen.",
        ),
      },
      {
        question: de("Gibt es Fördergelder für Sanierungen?"),
        answer: de(
          "Ja – z. B. für Dämmung, Heizsysteme oder Photovoltaik. Wir beraten Sie dazu.",
        ),
      },
      {
        question: de("Was kostet eine Planung?"),
        answer: de(
          "Die Kosten richten sich nach der SIA-Honorarordnung und Projektumfang. Ein erstes Gespräch ist kostenlos.",
        ),
      },
    ],
    midCtaLabel: de("JETZT ERSTGESPRÄCH"),
    summaryAnchorId: "zusammenfassung",
    summaryHeading: de(
      "Zusammenfassung wie Planung der Schlüssel zu Ihrer erfolgreichen Sanierung ist",
    ),
    summaryBody: de(
      "Eine gute Sanierung beginnt nicht auf der Baustelle, sondern mit einem klaren Plan. Ein erfahrener Architekt für Umbau und Sanierungen schafft die Grundlage für wirtschaftliches Bauen, langfristige Wertsteigerung und spürbare Wohnqualität.\n\nBei Bhend Architektur begleiten wir Sie strukturiert, transparent und mit viel Erfahrung – vom ersten Gedanken bis zum fertigen Raum.\n\n“Verändern beginnt mit Verstehen. Und mit einem guten Plan.”",
    ),
    closingAnchorId: "jetzt-loslegen",
    closingHeading: de("Jetzt loslegen – mit einem Gespräch auf Augenhöhe"),
    closingBody: de(
      "Haben Sie ein Sanierungsprojekt vor sich? Lassen Sie sich beraten, bevor Sie bauen. Wir zeigen Ihnen, wie eine klare Planung zu besseren Ergebnissen führt.",
    ),
    closingCtaLabel: de("GESPRÄCH VEREINBAREN"),
    reservationMode: "mailto",
    reservationTarget: "info@bhend-architektur.ch",
    _orbi: { component: "SectionBlogArticle" },
  }
}

export function buildSampleBlogPost(now = () => new Date().toISOString()) {
  const article = buildBlogArticleSection()
  const stamp = typeof now === "function" ? now() : now
  return {
    id: SAMPLE_BLOG_POST_ID,
    title: de(TITLE),
    lead: de(SUBTITLE),
    img: HERO,
    status: {
      options: ["draft", "review", "published"],
      value: "published",
    },
    keywords: ["blog", "sanierung", "planung", "umbau"],
    category: null,
    year: null,
    created_at: stamp,
    updated_at: stamp,
    sections: [article],
  }
}

export function buildSeedBlogPosts(now) {
  return [buildSampleBlogPost(now)]
}
