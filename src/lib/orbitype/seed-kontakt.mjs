/** Kontakt page sections. */

const de = (value) => ({ de: value, en: value })

const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2705.550485155702!2d7.936299299999999!3d47.3035834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47902f88cced02f3%3A0xb0958e6ba944e98c!2sZofingerstrasse%2043%2C%204665%20Oftringen%2C%20Suiza!5e0!3m2!1ses!2smx!4v1789535913121!5m2!1ses!2smx"

export function kontaktSections() {
  return [
    {
      id: "kontakt",
      heading: de("KONTAKT"),
      submitLabel: de("JETZT KONTAKT AUFNEHMEN"),
      namePlaceholder: de("Name"),
      emailPlaceholder: de("Email"),
      phonePlaceholder: de("Telefon"),
      companyPlaceholder: de("Firma"),
      messagePlaceholder: de("Nachricht"),
      mapEmbedUrl: MAP_EMBED,
      mapTitle: de("Zofingerstrasse 43, 4665 Oftringen"),
      successMessage: de("Vielen Dank — Ihre Nachricht wurde übermittelt."),
      errorMessage: de(
        "Senden fehlgeschlagen. Bitte später erneut versuchen oder per E-Mail melden.",
      ),
      _orbi: { component: "SectionContactForm" },
    },
  ]
}
