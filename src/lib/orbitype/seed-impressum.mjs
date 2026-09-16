/** Impressum page sections (Figma 2025:5472). */

const de = (value) => ({ de: value, en: value })

const PHOTO = "/images/impressum/photo.jpg"
const EMAIL = "info@bhend-architektur.ch"
const PHONE = "+41 62 798 00 00"
const PHONE_TEL = "tel:+41627980000"

export function impressumSections() {
  return [
    {
      id: "impressum",
      image: PHOTO,
      imageAlt: de("Gebäudeecke mit blauem Himmel — Bhend Architektur"),
      contactHeading: de("Kontaktadresse"),
      address: de(
        "Bhend Architektur AG\nZofingerstrasse 43\n4665 Oftringen\nSchweiz",
      ),
      email: EMAIL,
      phone: PHONE,
      phoneTel: PHONE_TEL,
      blocks: [
        {
          id: "vertretung",
          heading: de("Vertretungsberechtigte Personen"),
          body: de(
            "Ulrich Bhend, Geschäftsführer\nMicha Bhend, Gesellschafter\nThomas Schweizer, Gesellschafter\nPatrick Zingg, Gesellschafter",
          ),
        },
        {
          id: "handelsregister",
          heading: de("Handelsregistereintrag"),
          body: de(
            "Eingetragener Firmenname: Bhend Architektur AG\nNummer: CHE-443.394.873",
          ),
        },
        {
          id: "mwst",
          heading: de("Mehrwertsteuernummer"),
          body: de("CHE-443.394.873"),
        },
        {
          id: "haftung",
          heading: de("Haftungsausschluss"),
          body: de(
            "Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen. Alle Angebote sind unverbindlich. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.",
          ),
        },
        {
          id: "links",
          heading: de("Haftung für Links"),
          body: de(
            "Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten erfolgen auf eigene Gefahr des Nutzers oder der Nutzerin.",
          ),
        },
        {
          id: "urheberrechte",
          heading: de("Urheberrechte"),
          body: de(
            "Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf der Website gehören ausschliesslich der Firma Bhend Architektur AG oder den speziell genannten Rechtsinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung der Urheberrechtsträger im Voraus einzuholen.",
          ),
        },
      ],
      _orbi: { component: "SectionImpressum" },
    },
  ]
}
