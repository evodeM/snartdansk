# SnartDansk — SEO-handlingsplan

*Udarbejdet 10. juni 2026. Praktisk, prioriteret køreplan. Supplerer den større gennemgang i `Gennemgang-og-SEO-plan.md`.*

Målet er todelt: (1) rette de tekniske ting, der holder sitet tilbage, og (2) fange den søgetrafik, der opstår nu, hvor der er ny regering og nye regler — plus den stabile trafik fra øve-prøven.

---

## 1. Teknisk fundament (gør først)

Det her er forudsætningen for, at alt det andet virker.

- **Sitemap:** `sitemap.xml` er nu opdateret med øve-prøven (`/ovelse-indfodsretsproeven`). Husk fremover at opdatere `<lastmod>` til den dag, du faktisk ændrer en side — friske datoer kun når indholdet reelt er ændret (falske datoer ignoreres af Google).
- **robots.txt:** tilføj en linje, så den nye side eksplicit er tilladt (den er teknisk dækket af `Allow: /`, men hold listen konsistent):
  `Allow: /ovelse-indfodsretsproeven`
- **Google Search Console:** opret/verificér ejerskab, indsend `sitemap.xml`, og brug "Anmod om indeksering" på nye og ændrede sider. Det er dit vigtigste måleværktøj — og det bryder ikke din no-tracking-profil (det er server-side, ikke besøgs-tracking).
- **Structured data (JSON-LD):** tilføj på de sider, der mangler det — `beskaftigelse`, `karens`, `udlandsophold`, `tjekliste`, `pdf-vaerktoj`. Brug `WebApplication` eller `HowTo` på beregnerne. Tilføj `BreadcrumbList` overalt.
- **Øve-prøven specifikt:** tilføj `Quiz`- eller `FAQPage`-JSON-LD, og skriv statisk, crawlbar introtekst i HTML'en (overskrift + et par afsnit + 1-2 eksempel-spørgsmål skrevet direkte i sidens kildekode). Quizzen tegnes af JavaScript, så uden statisk tekst ser Google næsten en tom side.
- **Performance:** Tailwind via CDN (kompilerer i browseren) er den største bremse på Core Web Vitals. På sigt: byg én minificeret CSS-fil. Mobil-hastighed er en direkte ranking-faktor.
- **404-siden:** tilføj `<meta name="robots" content="noindex">` og links tilbage til hovedsiderne.

## 2. Indholds- og søgeordsstrategi

To stærke trafikmotorer lige nu:

### A. Øve-prøven = stabil, høj-volumen trafik

- Mål søgeord som "indfødsretsprøven øve gratis", "test indfødsretsprøven", "indfødsretsprøven 2026", "bestå indfødsretsprøven".
- Læg dem i `<title>`, `<h1>`, mellemrubrikker og introtekst — naturligt, ikke proppet.
- Tilføj en kort FAQ nederst på siden ("Hvor mange spørgsmål?", "Hvor mange skal jeg have rigtige?", "Hvad er værdispørgsmål?") med `FAQPage`-schema. Det giver chance for rich results og høj klikrate.

### B. Ny samleside om de nye regler = frisk nyheds-trafik

- Opret `/nye-regler-2026` som "pillar page": ny regering (Mette Frederiksen III), L 98 bortfaldet, gebyrændringer, sindelagsscreening, statsløse børn, erklæringsordning for unge.
- Hver ændring får 2-4 sætninger + link videre til din dybere side.
- Brug `Article`/`NewsArticle`-schema med `datePublished` og `dateModified`, og en synlig "Sidst opdateret"-dato.
- Mål: "nye regler statsborgerskab 2026", "ny regering indfødsret", "gebyr dansk statsborgerskab 2026".

### C. Opdatér eksisterende sider med de nye regler

- `sindelagskontrol` → afsnit om regeringens ekspertgruppe (rapport juli 2026).
- `ventetid` → at L 98 er bortfaldet, og hvornår næste lovforslag ventes.
- `faq` → spørgsmål om gebyr, ny regering, "er L 98 gyldig?".
- `dispensation` → den planlagte genindførsel af erklæringsordningen.

## 3. Intern linking & sitestruktur

- Lad alle relevante sider linke til den nye samleside og til øve-prøven — og omvendt. Intern linking fordeler autoritet og holder folk på sitet.
- Tilføj øve-prøven til header- og footer-navigationen (`components/header.html`, `components/footer.html`), så den er ét klik væk fra alle sider.
- Hold URL'erne rene og beskrivende (som nu: `/ovelse-indfodsretsproeven`, `/sindelagskontrol`).

## 4. Off-page / autoritet

- Backlinks vejer tungt: del øve-prøven og samlesiden i relevante Facebook-grupper, fora og subreddits for nye danskere/ansøgere. Det er gratis, ærlige links den vej, der giver dig trafik.
- Kontakt sprogskoler og rådgivere — en "nyttige værktøjer"-henvisning fra deres side er guld.
- Sørg for korrekte Open Graph-billeder på alle sider, så delinger ser pæne ud (øve-prøven og samlesiden mangler dedikerede OG-billeder).

## 5. Måling (uden at bryde privatlivsprofilen)

- **Google Search Console** giver dig søgeord, klik, visninger og indekseringsstatus — server-side, ingen cookies hos brugeren.
- Undgå Google Analytics og lignende tracking, da det kolliderer med dit privatlivsbrand. Vil du have besøgstal, så vælg et privatlivsvenligt, cookieløst alternativ (fx server-logbaseret eller Plausible).

---

## Prioriteret køreplan

### Denne uge (hurtige, høj effekt)
1. Indsend sitemap i Search Console + anmod om indeksering af forsiden og øve-prøven.
2. Tilføj øve-prøven til header/footer + til robots.txt.
3. Tilføj statisk introtekst + FAQ + `Quiz`/`FAQPage`-schema på øve-prøven.
4. Forklar på forsiden, at L 98 er bortfaldet, og ret forældet "L 98" i title/meta.

### 1-3 uger
5. Byg samlesiden `/nye-regler-2026` med Article + FAQ-schema, og tilføj den til sitemap.
6. Opdatér sindelagskontrol, ventetid, faq og dispensation med de nye regler + intern linking.
7. Tilføj manglende structured data på de fem beregner-/værktøjssider.

### Når der er tid
8. Erstat Tailwind-CDN med en bygget, minificeret CSS-fil (performance).
9. "Om SnartDansk"-side + konsekvente kildehenvisninger (E-E-A-T).
10. Dedikerede OG-billeder til øve-prøven og samlesiden.

---

*Husk: hver gang du udgiver eller ændrer en side væsentligt, opdatér `<lastmod>` i sitemap.xml og kør "Anmod om indeksering" i Search Console.*
