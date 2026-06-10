# SnartDansk — Gennemgang af hjemmesiden, forbedringsforslag & SEO-plan

*Udarbejdet 5. juni 2026 · Forslag — ingen filer er ændret*

---

## 1. Resumé

Sitet er teknisk solidt: rene statiske HTML-sider, gennemført privatlivsdesign (ingen cookies/tracking), korrekte canonical-tags, Open Graph på næsten alle sider og et komplet sitemap. Det vigtigste indholdsproblem er **aktualitet**: forsiden er bygget op om lovforslag **L 98** fra 22. januar 2026, men det lovforslag er bortfaldet, fordi der blev udskrevet valg, og Danmark har siden 1. juni 2026 fået en ny regering (Mette Frederiksen III). Det skal afspejles på sitet, før du markedsfører "de nye regler".

Rapporten er delt i tre: (a) overblik over filerne, (b) konkrete forbedringsforslag — teknisk SEO, indhold/UX og troværdighed, og (c) en SEO-plan for at fange folk, der søger på de nye regler, inkl. forslag til en ny samleside og opdatering af eksisterende sider. Til sidst et faktagrundlag med kilder og en prioriteret handlingsplan.

---

## 2. Overblik over hjemmesidens filer

Sitet er et 100% client-side statisk site (HTML + Tailwind via CDN + vanilla JavaScript). 15 offentlige sider, delte header/footer-komponenter, fem beregner-scripts og en navneliste (`data.json`), der bevidst holdes ude af søgemaskiner.

### Offentlige sider

| Fil | Formål | SEO-status |
|-----|--------|------------|
| `index.html` | Forside + søgning på indfødsretslisten (L 98) | Title nævner L 98 (forældet) |
| `faq.html` | Ofte stillede spørgsmål | FAQ-schema ✓ |
| `beskaftigelse.html` | Beregner: 42-måneders arbejdskrav | Mangler structured data |
| `karens.html` | Beregner: karens ved strafbare forhold | Mangler structured data |
| `udlandsophold.html` | Beregner: rejser/ophold i udlandet | Mangler structured data |
| `tjekliste.html` | Er du klar til at søge? | Mangler structured data |
| `dispensation.html` | Guide: unge under 22 | Article-schema ✓ |
| `grundlovsceremoni.html` | Guide: sidste skridt | Schema ✓ |
| `sindelagskontrol.html` | Juridisk forklaring af sindelagsvurdering | Schema ✓ |
| `indfoedsretsproeven.html` | Datoer, tilmelding, pensum | Schema ✓ (2 blokke) |
| `ventetid.html` | Hvor lang tid tager det? (2026) | Schema ✓ (2 blokke) |
| `udvisningsregler-2026.html` | Udvisningsregler 2026 | Schema ✓ |
| `pdf-vaerktoj.html` | Værktøj: flet/komprimer PDF | Mangler structured data |
| `privatliv.html` | Privatlivspolitik | Mangler structured data |
| `404.html` | Fejlside | Mangler meta/noindex |

### Øvrige filer

- **`js/`** — beskaftigelse-, karens-, udlandsophold-, tjekliste-calculator + main.js og pdf-tool.js
- **`components/`** — delt header.html og footer.html (god vedligeholdelses-praksis)
- **`data.json`** — navnelisten. Korrekt blokeret i robots.txt og _headers (noindex). Vigtigt at den bliver dér.
- **`sitemap.xml`, `robots.txt`, `_headers`** — SEO/sikkerhed. Cloudflare Pages-headers ser fornuftige ud.
- **`Open graph/`, `og-image.png`** — delebilleder pr. side.
- **`private/`, `*.md`, `*.txt`** — interne noter (forbedringer.txt, README.md, GDPR_AUDIT.md m.fl.). Blokeret for crawlers via robots.txt.

---

## 3. Det vigtigste lige nu: L 98 er bortfaldet

Forsiden, titlen og søgeresultaterne henviser til **"Indfødsretslisten L 98"** fremsat 22. januar 2026. Ifølge Folketingets og Udlændinge- og Integrationsministeriets oplysninger blev dette lovforslag bortfaldet i forbindelse med, at der blev udskrevet folketingsvalg, og en ny regering (Mette Frederiksen III, S-SF-M-R) er tiltrådt 1. juni 2026. Praktisk betyder det:

- **Søgeresultatet kan vildlede:** står man på L 98, er man ikke nødvendigvis "på vej" længere, fordi forslaget faldt. Det bør forklares tydeligt på forsiden.
- **Titel og meta er forældede:** "Er jeg på indfødsretslisten? (L 98)" bør gøres mere tidssvarende/robust over for nye lovforslagsnumre.
- **Mulighed:** Et tydeligt status-banner øverst ("Status juni 2026: L 98 er bortfaldet efter valget — næste lovforslag forventes under den nye regering") skaber tillid og fanger netop den søgetrafik, du efterspørger.

> **Anbefaling:** Behandl dette som opgave nr. 1 — det er både et troværdigheds- og et SEO-spørgsmål. Bekræft de præcise formuleringer mod ft.dk og uim.dk før du publicerer (se kilder i afsnit 6).

---

## 4. Konkrete forbedringsforslag

### 4.1 Teknisk SEO

| Forslag | Hvorfor / hvordan |
|---------|-------------------|
| Tilføj structured data på 6 sider | beskaftigelse, karens, udlandsophold, tjekliste, pdf-vaerktoj, privatliv mangler JSON-LD. Brug WebApplication- eller HowTo-schema på beregnerne og BreadcrumbList overalt — giver rich results og bedre forståelse hos Google. |
| Opdater sitemap-datoer | Alle `<lastmod>` står på jan/feb 2026. Sæt korrekte datoer ved hver opdatering — friske datoer er et ranking-signal og hjælper genindeksering. |
| Ret forsidens title/meta | Fjern hårdkodet "L 98" fra `<title>`, description og twitter:title, så de holder over tid (fx "Er jeg på indfødsretslisten? Tjek seneste lovforslag"). |
| 404-siden | Tilføj `<meta name="robots" content="noindex">` og en kort beskrivelse + links tilbage til hovedsider. |
| Performance: Tailwind via CDN | `cdn.tailwindcss.com` er en udviklings-CDN (kompilerer i browseren) og gør hver side langsommere + giver dårligere Core Web Vitals. Overvej at bygge én statisk, minificeret CSS-fil. Påvirker mobil-ranking. |
| Dato-metadata | Sørg for `lang="da"` overalt (forsiden har det). Tilføj `article:published_time` / `dateModified` på guide-sider for friskheds-signaler. |

### 4.2 Indhold & brugeroplevelse

Fra dine egne noter (forbedringer.txt) plus gennemgangen:

- **Sticky søgefelt overlapper portalen** på forsiden ved scroll — kosmetisk, men nemt at fjerne sticky eller øge spacing.
- **Header-dropdown vs. forside-portal** bruger to forskellige kategoriseringer. Ensret dem (Værktøjer / Guides & Viden / Aktuelt / Hurtig hjælp) for konsistens.
- **"Min Sag"-idéen** (samlet status + PDF-rapport) er stærk for engagement og deling. Hold den 100% client-side (localStorage) for at bevare privatlivsprofilen.
- **Tydelig "Sidst opdateret"-dato** synligt på hver guide — vigtigt på et område hvor reglerne ændrer sig, og øger både tillid og CTR.

### 4.3 Troværdighed (E-E-A-T)

Google vægter ekspertise/autoritet/troværdighed højt på "Your Money or Your Life"-emner som jura og statsborgerskab. Sitet gør allerede meget rigtigt (ansvarsfraskrivelse, ingen tracking). Styrk yderligere:

- Tydelig kilde-henvisning på hver guide (link til den konkrete paragraf/cirkulære på retsinformation.dk, uim.dk, ft.dk).
- En kort "Om SnartDansk"-side: hvem står bag, hvordan opdateres reglerne, uafhængighed af myndigheder.
- Konsekvent ansvarsfraskrivelse i footer (findes i beregnerne — bring den ud på alle sider).

---

## 5. SEO-plan: formidling af de nye regler

Når en ny regering og nye regler er i nyhederne, stiger søgningerne markant. Strategien er at fange den trafik med **frisk, præcist indhold** og solid intern linkstruktur. Anbefalingen du valgte: ny samleside **og** opdatering af eksisterende sider.

### 5.1 Søgeordsmuligheder

Realistiske danske søgetermer at målrette (placér i titler, H1/H2 og brødtekst — ikke proppet):

| Søgeord / sætning | Hvor det hører hjemme |
|-------------------|------------------------|
| nye regler statsborgerskab 2026 | Ny samleside (hovedterm) |
| ny regering indfødsret / statsborgerskab | Ny samleside + forside-banner |
| gebyr dansk statsborgerskab 2026 / 6000 kr | Ny side + FAQ |
| sindelagskontrol / screening statsborgerskab | Opdatér sindelagskontrol.html |
| erklæring statsborgerskab unge født i Danmark | Opdatér dispensation.html + ny side |
| statsløse børn dansk statsborgerskab | Ny side (afsnit) |
| L 98 bortfaldet / næste lovforslag indfødsret | Forside + ny side |
| hvornår kommer næste indfødsretsliste | ventetid.html + FAQ |

### 5.2 Forslag til ny side: "Nye indfødsretsregler 2026"

URL-forslag: **`/nye-regler-2026`**. Strukturér den som en løbende opdateret "oversigtsartikel" (pillar page), der linker ind til dine eksisterende dybe sider:

1. Status nu (juni 2026): ny regering, L 98 bortfaldet, hvad det betyder for ansøgere.
2. Ændring for ændring: gebyr, sindelagsscreening, statsløse børn, erklæringsordning for unge — hver med 2–4 sætninger + link til dybere side.
3. Tidslinje: hvad er trådt i kraft, hvad er på vej (fx ekspertgruppe rapporterer juli 2026; erklæringsordning forventet inden udgangen af 2026).
4. "Hvad betyder det for dig?" — segmenter (unge, beskæftigede, tidligere afvist).
5. Kilder + "Sidst opdateret"-dato øverst og nederst.

**Schema:** Brug Article/NewsArticle-JSON-LD med `datePublished` og `dateModified`, samt en FAQPage-blok med de 4–5 mest stillede spørgsmål — det giver chance for rich results og høj CTR.

### 5.3 Opdatér eksisterende sider

- **sindelagskontrol.html:** tilføj afsnit om regeringens ekspertgruppe for screening af antidemokratiske holdninger (rapport forventet juli 2026). Denne side kan blive en stor trafikmagnet.
- **ventetid.html:** opdatér med at L 98 er bortfaldet, og hvornår næste lovforslag forventes.
- **faq.html:** tilføj spørgsmål om gebyret (6.000 kr.), den nye regering og "er L 98 stadig gyldig?"
- **dispensation.html:** knyt an til den planlagte genindførsel af erklæringsordningen for unge født/opvokset i Danmark.
- **Intern linking:** lad alle de opdaterede sider linke til den nye samleside og omvendt — det fordeler autoritet og holder folk på sitet.

### 5.4 Tekniske SEO-greb til nyheds-trafik

- Tilføj den nye side til sitemap.xml med `changefreq=weekly` og dagsaktuel `lastmod`.
- Indsend sitemap i Google Search Console og brug "Request indexing" på nye/ændrede sider for hurtig optagelse.
- Skriv en stærk meta description med tal/datoer (fx "Opdateret juni 2026") — løfter klikraten i søgeresultaterne.
- Genbrug et dedikeret OG-billede til den nye side for pæn deling på sociale medier.

---

## 6. Faktagrundlag: de nye regler 2026

> **Bemærk:** Punkterne nedenfor er samlet via web-søgning juni 2026 og skal verificeres mod de officielle kilder (ft.dk, uim.dk, regeringen.dk, retsinformation.dk) før publicering. Reglerne kan stadig være under behandling.

- **Ny regering:** Regeringen Mette Frederiksen III (S-SF-M-R, "firkløverregeringen") tiltrådt 1. juni 2026 efter folketingsvalg og rekordlange forhandlinger.
- **L 98 bortfaldet:** Lovforslaget om indfødsret fra 22. januar 2026 faldt, da der blev udskrevet valg. Næste lovforslag forventes under den nye regering (lovforslag om indfødsret fremsættes typisk forår/efterår).
- **Gebyr:** Ansøgningsgebyret blev hævet fra 4.000 kr. til 6.000 kr. (pr. 18. juni 2025). Unge under 25 født/opvokset i DK betaler fortsat 4.000 kr. Genansøgning: første gang gratis, derefter 3.000 kr.
- **Sindelagsscreening:** Regeringen nedsatte i september 2025 en ekspertgruppe, der skal undersøge screening for antidemokratiske holdninger blandt ansøgere. Rapport forventet juli 2026.
- **Statsløse børn:** Initiativ om at børn født statsløse i Danmark automatisk får statsborgerskab ved fødslen, hvis de ikke har ret til statsborgerskab andetsteds.
- **Erklæringsordning for unge:** Folketinget har pålagt regeringen at fremsætte lovforslag inden udgangen af 2026, der genindfører muligheden for, at unge udlændinge født og opvokset i Danmark kan få statsborgerskab ved erklæring.

### Kilder

- [Udlændinge- og Integrationsministeriet — Aktuelt fra Indfødsretskontoret](https://uim.dk/statsborgerskab/aktuelt-i-indfoedsretskontoret/)
- [Folketinget — Tema: Indfødsret (lovforslag)](https://www.ft.dk/da/aktuelt/tema/indf%C3%B8dsret)
- [Regeringen.dk — Aftale om indfødsret](https://regeringen.dk/aktuelt/publikationer-og-aftaletekster/aftale-om-indfoedsret)
- [Statsministeriet — Regeringen Mette Frederiksen III](https://stm.dk/presse/pressemeddelelser/2026/regeringen-mette-frederiksen-iii/)
- [TV 2 — Overblik: Nu får Danmark en ny regering (1. juni 2026)](https://nyheder.tv2.dk/politik/2026-06-01-nu-faar-danmark-en-ny-regering)
- [UIM — Betingelser for naturalisation](https://uim.dk/statsborgerskab/udenlandske-statsborgere/betingelser/)

---

## 7. Prioriteret handlingsplan

### Gør først (denne uge — hurtige, høj effekt)

1. Forklar at L 98 er bortfaldet på forsiden (status-banner) + ret forældet title/meta.
2. Tilføj FAQ-punkter om ny regering, gebyr og "er L 98 gyldig?"
3. Opdatér sitemap-datoer og genindsend i Search Console.

### Dernæst (1–3 uger)

4. Byg den nye samleside "Nye indfødsretsregler 2026" med Article + FAQ-schema.
5. Opdatér sindelagskontrol, ventetid og dispensation med de nye regler + intern linking.
6. Tilføj manglende structured data på de 6 sider.

### Større forbedringer (når der er tid)

7. Erstat Tailwind-CDN med en bygget, minificeret CSS-fil (performance/Core Web Vitals).
8. "Om SnartDansk"-side og konsekvent kildehenvisning for E-E-A-T.
9. "Min Sag"-dashboard + samlet PDF-rapport (client-side).

---

*Alle forslag er bevidst holdt på forslagsniveau — ingen filer er ændret. Sig til, hvis du vil have nogle af punkterne implementeret direkte.*
