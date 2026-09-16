/** Leistungen service-page section payloads (shared by seed + CMS publish). */

const PHONE_LABEL = "+41 62 798 00 00"
const PHONE_TEL = "tel:+41627980000"
const GEAK_PDF =
  "https://bhend-architektur.ch/wp-content/uploads/2025/08/GEAK-Muster-Beratungsbericht.pdf"

const de = (value) => ({ de: value, en: value })

function phoneCta(id, title) {
  return {
    id,
    eyebrow: de("Weitere Informationen zum Thema"),
    title: de(title),
    text: de("Rufen Sie uns noch heute an"),
    ctaLabel: de(PHONE_LABEL),
    reservationMode: "url",
    reservationTarget: PHONE_TEL,
    _orbi: { component: "SectionCta" },
  }
}

function splitTitleBody(raw) {
  const lines = String(raw)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length <= 1) return { title: de(raw.trim()), text: undefined }
  return { title: de(lines[0]), text: de(lines.slice(1).join(" ")) }
}

export function beratungSections() {
  return [
    {
      id: "beratungIntro",
      title: de("BERATUNG"),
      lead: de("BRANDSCHUTZPLANUNG UND QUALITÄTSSICHERUNG BRANDSCHUTZ"),
      body: de(
        "Bei Bhend Architektur verstehen wir die Einzigartigkeit jedes Projekts und bieten daher Beratungsdienst-leistungen, die speziell auf Ihre Bedürfnisse zugeschnitten sind.\nUnser Ziel ist es, Lösungen zu entwickeln, die nicht nur Ihren Anforderungen gerecht werden, sondern auch Ihre Projektwünsche in die Realität umsetzen.",
      ),
      image: "/images/beratung/hero.jpg",
      imageAlt: de("Beratung bei Bhend Architektur"),
      _orbi: { component: "SectionServiceIntro" },
    },
    {
      id: "beratungPillars",
      items: [
        {
          title: de("Persönliche Bedarfsanalyse"),
          text: de(
            "Ihr Projekt im Fokus — Eine gründliche Analyse Ihrer Bedürfnisse ist der Ausgangspunkt unserer Zusammenarbeit. Wir nehmen uns die Zeit, um Ihre Anforderungen zu verstehen und entwickeln gemeinsam mit Ihnen Lösungen, die perfekt auf Ihr Projekt abgestimmt sind.",
          ),
        },
        {
          title: de("Professionelle Unterstützung"),
          text: de(
            "Erfahrung, die zählt — Unser Team aus erfahrenen Experten begleitet Sie durch alle Phasen Ihres Projekts. Wir bieten umfassende Unterstützung und fachkundige Beratung, um den Erfolg Ihres Bauvorhabens zu gewährleisten.",
          ),
        },
        {
          title: de("Transparente Kommunikation"),
          text: de(
            "Offene und klare Kommunikation liegt uns am Herzen. Wir halten Sie kontinuierlich über den Fortschritt Ihres Projekts informiert, damit Sie stets den Überblick behalten und gut informiert sind.",
          ),
        },
      ],
      _orbi: { component: "SectionTextColumns" },
    },
    {
      id: "beratungProcess",
      title: de("Fair, Kompetent, Visionär"),
      body: de(
        "Bei Bhend Architektur gründet sich unser Ansatz auf den drei Säulen: Fairness, Kompetenz und visionäres Denken. Wir verpflichten uns zu transparenten und gerechten Geschäftspraktiken, die Vertrauen fördern. Unsere Fachkompetenz sichert die hohe Qualität und Präzision unserer Projekte. Zugleich treiben uns innovative Ideen und zukunftsorientierte Konzepte an, um nachhaltige und ästhetisch ansprechende Räume zu schaffen, die über Generationen Bestand haben.",
      ),
      image: "/images/beratung/process.jpg",
      imageAlt: de("Planung und Beratung am Tisch"),
      items: [
        splitTitleBody(
          "Nutzungskonzepte\nHeute, morgen und in der Zukunft – wir entwickeln nachhaltige Nutzungskonzepte für Ihre Immobilie.",
        ),
        splitTitleBody(
          "Design und Gestaltung\nUnser individueller Ansatz in Design und Gestaltung bringt Ihre Vision zum Ausdruck.",
        ),
        splitTitleBody(
          "Materialisierung und Farbgebung\nIn enger Abstimmung mit Ihnen entstehen schlüssige Konzepte für ausdrucksstarke und harmonische Projekte.",
        ),
        splitTitleBody(
          "Baukonstruktion\nExpertise in Bauweise, Statik und Gebäudehülle sichert die technische und ästhetische Qualität Ihres Bauvorhabens.",
        ),
        splitTitleBody(
          "Gebäudetechnik und alternative Energienutzung\nBeratung zu Heizung, Lüftung, Warmwasseraufbereitung und dem Einsatz erneuerbarer Energien.",
        ),
        splitTitleBody(
          "Förderbeiträge\nInformationen zu möglichen Förderbeiträgen von Bund und Kantonen.",
        ),
        splitTitleBody(
          "Energieberatung\nOptimieren Sie die Energieeffizienz Ihres Projekts mit unserer Expertenberatung.",
        ),
      ],
      _orbi: { component: "SectionChecklistSplit" },
    },
    phoneCta("beratungCta", "BERATUNG"),
  ]
}

export function brandschutzSections() {
  return [
    {
      id: "brandschutzIntro",
      title: de("BRANDSCHUTZ"),
      lead: de("BRANDSCHUTZPLANUNG UND QUALITÄTSSICHERUNG BRANDSCHUTZ"),
      body: de(
        "Wir unterstützen, beraten und suchen nach den besten Lösungen im Brandschutz. Je früher die Brandschutzplanung in einem Umbau, einer Umnutzung, einer Sanierung oder bei einem Neubau eingebunden wird, desto grösser ist der Handlungsspielraum im Entwurf wie auch in den Baukosten.",
      ),
      image: "/images/brandschutz/hero.jpg",
      imageAlt: de("Brandschutzplanung"),
      _orbi: { component: "SectionServiceIntro" },
    },
    {
      id: "brandschutzPillars",
      items: [
        {
          title: de("Brandschutzanalyse"),
          text: de(
            "In einer ersten Analyse wird das bestehende Gebäude begutachtet und mit den Änderungswünschen verglichen. Schnell können Probleme aufgelöst oder Herausforderungen aufgezeigt werden. Mit einem Massnahmenkatalog können nötige Anpassungen strategisch festgehalten werden, im Optimalfall findet dieser Schritt zeitnah mit dem ersten Entwurf Architektur zusammen.",
          ),
        },
        {
          title: de("Brandschutzplanung"),
          text: de(
            "In der Brandschutzplanung fliessen nun alle Informationen zusammen, die genauen Wünsche der Bauherrschaft, die Architekturplanung, die Materialwahl, der Personen- oder der Sachwertschutz, die Arbeitsabläufe des Betriebes. Durch die Zusammenarbeit aller Beteiligten kann der Brandschutz effizient in die Gesamtplanung eingearbeitet werden. Der Abschluss der Planung wird mit einer Amtlichen Brandschutzbewilligung erreicht.",
          ),
        },
        {
          title: de("Brandschutzumsetzung"),
          text: de(
            "Während der Bauphase ist die Begleitung in Brandschutzfragen für die Gesamtleitung Architektur eine wichtige Stütze. Schnell können plötzlich auftauchende Fragenstellungen lösungsorientiert angegangen werden. Durch Kontrollen der Pläne und der Ausführung vor Ort kann die Qualität, welche die Bauherrschaft bestellt hat, sichergestellt werden.",
          ),
        },
      ],
      _orbi: { component: "SectionTextColumns" },
    },
    {
      id: "brandschutzProcess",
      body: de(
        "Als erfahrenes Architekturbüro übernehmen wir Gesamtplanungen von ganzen Bauvorhaben.",
      ),
      lead: de(
        "Erfahrungen haben wir im Neubau vor allem aber im Umbau und im Sanierungsbereich bei:",
      ),
      image: "/images/brandschutz/process.jpg",
      imageAlt: de("Brandschutz am Bau"),
      items: [
        { title: de("Industriegebäuden") },
        { title: de("Gewerbebetrieben") },
        { title: de("Alters- und Pflegeheime") },
        { title: de("Wohnbauten") },
        { title: de("Schulen") },
        { title: de("Kindergarten") },
      ],
      _orbi: { component: "SectionChecklistSplit" },
    },
    phoneCta("brandschutzCta", "BRANDSCHUTZ"),
  ]
}

export function realisierungSections() {
  return [
    {
      id: "realisierungIntro",
      title: de("REALISIERUNG"),
      lead: de("BRANDSCHUTZPLANUNG UND QUALITÄTSSICHERUNG BRANDSCHUTZ"),
      body: de(
        "Bei Bhend Architektur verstehen wir die Bedeutung der Realisierung Ihres Bauprojekts als Schlüsselmoment, in dem Ihre Visionen greifbare Formen annehmen. Mit unseren Realisierungsdienstleistungen gewährleisten wir eine professionelle Umsetzung, die Ihren Erwartungen entsprechen.",
      ),
      image: "/images/realisierung/hero.jpg",
      imageAlt: de("Realisierung und Bauleitung"),
      _orbi: { component: "SectionServiceIntro" },
    },
    {
      id: "realisierungPillars",
      items: [
        {
          title: de("Effiziente Projektsteuerung"),
          text: de(
            "Unser Team übernimmt die effiziente Steuerung und Koordination aller Bauprozesse. Ziel ist es, Ihr Projekt termingerecht und im Rahmen des veranschlagten Budgets erfolgreich abzuschliessen. Durch die präzise Planung und Überwachung aller Schritte sichern wir den reibungslosen Ablauf Ihres Vorhabens.",
          ),
        },
        {
          title: de("Stetige Qualitätssicherung"),
          text: de(
            "Die Qualität Ihrer Bauprojekte ist unser grosses Anliegen. Durch die enge Zusammenarbeit mit ausgewählten Handwerkern und Zulieferern garantieren wir, dass jede Phase der Realisierung den höchsten Qualitätsstandards entspricht. Unsere Qualitätskontrollen auf der Baustelle gewährleisten die präzise Ausführung aller Arbeiten.",
          ),
        },
        {
          title: de("Nahtlose Integration von Nachhaltigkeit und Innovation"),
          text: de(
            "Unser Engagement geht über die traditionelle Projektrealisierung hinaus. Wir streben danach, umweltfreundliche Materialien und energieeffiziente Lösungen zu nutzen, die nicht nur den ökologischen Fussabdruck Ihres Projekts minimieren, sondern auch zukunftsorientierte Lebens- und Arbeitsräume schaffen.",
          ),
        },
      ],
      _orbi: { component: "SectionTextColumns" },
    },
    {
      id: "realisierungProcess",
      title: de("Kundenzufriedenheit als Priorität"),
      body: de(
        "Ihre Zufriedenheit ist unser oberstes Gebot. Wir legen grössten Wert auf klare Kommunikation und Transparenz während des gesamten Bauprozesses. Unsere kundenorientierte Herangehensweise garantiert, dass Ihre Erwartungen nicht nur erfüllt, sondern übertroffen werden.",
      ),
      lead: de(
        "Als ausführendes Architekturbüro bieten wir Ihnen ein vollumfängliches Servicepaket – von der Beratung über die Planung bis hin zur Bauleitung. Unser Angebot umfasst:",
      ),
      image: "/images/realisierung/process.jpg",
      imageAlt: de("Bauleitung vor Ort"),
      items: [
        splitTitleBody(
          "Koordination der Fachplaner\nEffektive Koordination verschiedener Fachplaner für eine reibungslose Projektabwicklung.",
        ),
        splitTitleBody(
          "Ausschreibung pro Gewerk, inklusive Kostenvergleich, Vergabe und Vertragswesen\nDetaillierte Ausschreibungen pro Gewerk, Kostenvergleiche, Vergabe und Vertragsmanagement.",
        ),
        splitTitleBody(
          "Erstellung und Überwachung des Bauterminplans\nPräzise Erstellung und kontinuierliche Überwachung des Bauterminplans.",
        ),
        splitTitleBody(
          "Planung des Zahlungsflusses von der Bauherrschaft an die Unternehmer\nEffiziente Planung des Zahlungsflusses für eine reibungslose Abwicklung der Bauprojekte.",
        ),
        splitTitleBody(
          "Bauleitung bis zur Schlüsselübergabe\nProfessionelle Bauleitung und Begleitung bis zur Schlüsselübergabe.",
        ),
        splitTitleBody(
          "Überwachung der Garantiezeiten\nKontinuierliche Überwachung der Garantiezeiten für langfristige Sicherheit.",
        ),
      ],
      _orbi: { component: "SectionChecklistSplit" },
    },
    phoneCta("realisierungCta", "REALISIERUNG"),
  ]
}

export function energieberatungSections() {
  return [
    {
      id: "energieberatungIntro",
      title: de("ENERGIEBERATUNG"),
      lead: de("Nachhaltige Lösungen für Ihr Bauprojekt"),
      body: de(
        "Energieeffizienz ist in der heutigen Bauwelt ein zentrales Anliegen. Unsere professionelle Energieberatung zielt darauf ab, Ihre Bauprojekte durch massgeschneiderte, nachhaltige Lösungen energetisch zu optimieren. Wir unterstützen Sie dabei, das volle energetische Potential Ihres Gebäudes auszuschöpfen, um langfristige Einsparungen und verbesserten Komfort zu erzielen.",
      ),
      image: "/images/energieberatung/hero.jpg",
      imageAlt: de("Energieberatung"),
      ctaLabel: de("GEAK MUSTERBERICHT"),
      reservationMode: "url",
      reservationTarget: GEAK_PDF,
      _orbi: { component: "SectionServiceIntro" },
    },
    {
      id: "energieberatungPillars",
      items: [
        {
          title: de("GEAK* Beratungsbericht"),
          text: de(
            "Mit einem GEAK Plus Beratungsbericht zeigen Ihnen unsere Energieberater, wo der Energieverbrauch gesenkt, der Komfort erhöht und der Wert des Gebäudes gesteigert werden kann. Der Beratungsbericht analysiert den Energieverbrauch, die Gebäudehülle sowie die Heizungs- und Warmwasseranlagen und gibt drei bis fünf auf Sie zugeschnittene Empfehlungen für Verbesserung an. *Gebäudeenergieausweis der Kantone.",
          ),
        },
        {
          title: de("Gebäudeanalyse"),
          text: de(
            "Die Gebäudeanalyse nach BFE (Bundesamt für Energie) eignet sich vor allem für Gewerbebauten, öffentliche Gebäude und andere Liegenschaften, bei denen der GEAK nicht angewendet werden kann. Die Gebäudeanalyse zeigt auf, wie das Gebäude energetisch optimiert, die Betriebskosten gesenkt und der Komfort verbessert werden können. Dabei wird die energetische Performance von Heizung, Warmwasser, Lüftung, Kühlung und anderen technischen Einrichtungen untersucht.",
          ),
        },
        {
          title: de("Umsetzungsstrategie"),
          text: de(
            "Die Umsetzung einer wirksamen Strategie zur Verbesserung der Energieeffizienz beginnt mit der Integration der Erkenntnisse aus dem GEAK-Beratungsbericht oder der Gebäudeanalyse. Darauf aufbauend werden Massnahmen wie die Modernisierung von Heizungs- und Lüftungsanlagen oder die Verbesserung der Wärmedämmung festgelegt. Entscheidend sind ein klarer Zeitplan, die Budgetierung und die Auswahl qualifizierter Fachleute. Zudem sollten Förderprogramme und Finanzierungsmöglichkeiten genutzt werden, um die Umsetzung zu unterstützen.",
          ),
        },
      ],
      _orbi: { component: "SectionTextColumns" },
    },
    {
      id: "energieberatungProcess",
      title: de("Unsere Kompetenzen"),
      body: de(
        "Unser Team aus erfahrenen Energieberatern spezialisiert sich nicht nur auf Wohngebäude, sondern bietet auch für Nichtwohngebäude, wie Unternehmen und Gewerbebetriebe, tiefgreifende Energieanalysen an. Wir sind darauf ausgerichtet, Energieeffizienz in jedem Aspekt Ihres Projekts zu steigern, von der Materialwahl bis zu den Arbeitsabläufen des Betriebes.",
      ),
      lead: de(
        "Unsere Energieberatung deckt ein breites Spektrum an Bedürfnissen ab, einschliesslich:",
      ),
      image: "/images/energieberatung/process.jpg",
      imageAlt: de("Energieberatung Kompetenzen"),
      items: [
        splitTitleBody(
          "Erstellung von GEAK-Beratungsberichten\nProfessionelle Erstellung von GEAK-Beratungsberichten für eine fundierte Energieanalyse.",
        ),
        splitTitleBody(
          "Zielgerichtete Gebäudeanalysen\nDetaillierte und zielgerichtete Analysen Ihrer Gebäude für eine optimale Planung.",
        ),
        splitTitleBody(
          "Planung und Umsetzung von Modernisierungsstrategien\nProfessionelle Planung und Umsetzung von Modernisierungsstrategien für eine nachhaltige Gebäudeentwicklung.",
        ),
      ],
      _orbi: { component: "SectionChecklistSplit" },
    },
    phoneCta("energieberatungCta", "ENERGIEBERATUNG"),
  ]
}

export function bauherrenberatungSections() {
  return [
    {
      id: "bauherrenberatungIntro",
      title: de("BAUHERRENBERATUNG"),
      lead: de("Unabhängige Begleitung für kluge Entscheide"),
      body: de(
        "Mit Erfahrung, Weitblick und technischem Know-how stehen wir Bauherrschaften zur Seite – von der ersten Idee bis zur Abnahme. Wir denken mit, hinterfragen kritisch, prüfen Optionen und schützen Ihre Interessen auf Augenhöhe.",
      ),
      image: "/images/bauherrenberatung/hero.jpg",
      imageAlt: de("Bauherrenberatung"),
      _orbi: { component: "SectionServiceIntro" },
    },
    {
      id: "bauherrenberatungPillars",
      items: [
        {
          title: de("Mehr Klarheit im Bauprozess"),
          text: de(
            "Bauen ist komplex – wir schaffen Orientierung. Ob bei der Auswahl von Planern, der Prüfung von Verträgen oder in der Koordination der Beteiligten: Wir vertreten Ihre Anliegen professionell, unabhängig und transparent.",
          ),
        },
        {
          title: de("Ihr Projekt – Ihre Kontrolle"),
          text: de(
            "Als Bauherrenberater sorgen wir dafür, dass Sie jederzeit den Überblick behalten. Wir bereiten Entscheidungen vor, klären technische Fragen und geben Ihnen die Sicherheit, das Richtige zu tun – in jeder Phase des Projekts.",
          ),
        },
        {
          title: de("Technik, Kosten, Qualität im Griff"),
          text: de(
            "Mit unserem bautechnischen Verständnis und unserem Projektwissen bringen wir alle Faktoren unter einen Hut. Wir begleiten Ausschreibungen, prüfen Angebote, überwachen Termine und hinterfragen Bauqualität – in Ihrem Sinn.",
          ),
        },
      ],
      _orbi: { component: "SectionTextColumns" },
    },
    {
      id: "bauherrenberatungProcess",
      title: de("Vertrauen durch Erfahrung"),
      body: de(
        "Wir beraten keine Modelle – sondern Menschen. Unsere Expertise als Planer, Bauleiter und Architekten fliesst direkt in unsere Bauherrenberatung ein. Wir verstehen beide Seiten – und sorgen so für echte, faire Lösungen.",
      ),
      lead: de("Unsere Bauherrenberatung bietet Ihnen:"),
      image: "/images/bauherrenberatung/process.jpg",
      imageAlt: de("Innenraum mit Wendeltreppe"),
      imageCaption: de("Fotograf: Karina Castro | Architektur: Malte Kloes"),
      items: [
        { title: de("Unabhängige Zweitmeinung zu Projektideen und Angeboten") },
        {
          title: de(
            "Unterstützung bei der Auswahl von Architekturbüros oder GU/TU",
          ),
        },
        {
          title: de(
            "Vertragsprüfung mit technischem und wirtschaftlichem Fokus",
          ),
        },
        {
          title: de(
            "Begleitung bei Sitzungen, Submissionen und Entscheidprozessen",
          ),
        },
        {
          title: de(
            "Laufende Qualitätskontrolle\nund Termin-/Kostenverfolgung",
          ),
        },
        {
          title: de(
            "Unterstützung bei Abnahmen, Mängelrügen und Garantiefragen",
          ),
        },
      ],
      _orbi: { component: "SectionChecklistSplit" },
    },
    {
      id: "bauherrenberatungInvite",
      title: de("Jetzt beraten lassen"),
      body: de(
        "Sie möchten als Bauherr eine starke, unabhängige Begleitung mit Erfahrung?\n\nDann nehmen Sie Kontakt mit uns auf – wir freuen uns auf Ihr Projekt.",
      ),
      image: "/images/bauherrenberatung/cta.jpg",
      imageAlt: de("Innenraum mit Betonboden und Holzrahmen"),
      imageCaption: de("Fotograf: Karina Castro | Architektur: Malte Kloes"),
      tone: "light",
      _orbi: { component: "SectionInkSplit" },
    },
    phoneCta("bauherrenberatungCta", "BAUHERRENBERATUNG"),
  ]
}

export function buildLeistungenSeedPages(now) {
  const stamp = typeof now === "function" ? now : () => new Date().toISOString()
  return [
    {
      id: "seed-beratung",
      slug: "beratung",
      title: { de: "Beratung", en: "Consulting" },
      lead: {
        de: "Beratungsdienstleistungen für Ihr Bauvorhaben",
        en: "Consulting services for your building project",
      },
      img: "/images/beratung/hero.jpg",
      keywords: ["beratung", "leistungen", "architektur"],
      head: {},
      created_at: stamp(),
      updated_at: stamp(),
      sections: beratungSections(),
    },
    {
      id: "seed-brandschutz",
      slug: "brandschutz",
      title: { de: "Brandschutz", en: "Fire protection" },
      lead: {
        de: "Brandschutzplanung und Qualitätssicherung",
        en: "Fire protection planning and quality assurance",
      },
      img: "/images/brandschutz/hero.jpg",
      keywords: ["brandschutz", "leistungen"],
      head: {},
      created_at: stamp(),
      updated_at: stamp(),
      sections: brandschutzSections(),
    },
    {
      id: "seed-realisierung",
      slug: "realisierung",
      title: { de: "Realisierung", en: "Realization" },
      lead: {
        de: "Professionelle Realisierung Ihres Bauprojekts",
        en: "Professional realization of your building project",
      },
      img: "/images/realisierung/hero.jpg",
      keywords: ["realisierung", "bauleitung", "leistungen"],
      head: {},
      created_at: stamp(),
      updated_at: stamp(),
      sections: realisierungSections(),
    },
    {
      id: "seed-energieberatung",
      slug: "energieberatung",
      title: { de: "Energieberatung", en: "Energy consulting" },
      lead: {
        de: "Nachhaltige Lösungen für Ihr Bauprojekt",
        en: "Sustainable solutions for your building project",
      },
      img: "/images/energieberatung/hero.jpg",
      keywords: ["energieberatung", "geak", "leistungen"],
      head: {},
      created_at: stamp(),
      updated_at: stamp(),
      sections: energieberatungSections(),
    },
    {
      id: "seed-bauherrenberatung",
      slug: "bauherrenberatung",
      title: { de: "Bauherrenberatung", en: "Client consulting" },
      lead: {
        de: "Unabhängige Begleitung für kluge Entscheide",
        en: "Independent guidance for sound decisions",
      },
      img: "/images/bauherrenberatung/hero.jpg",
      keywords: ["bauherrenberatung", "leistungen"],
      head: {},
      created_at: stamp(),
      updated_at: stamp(),
      sections: bauherrenberatungSections(),
    },
  ]
}
