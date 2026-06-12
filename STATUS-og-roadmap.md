# SnartDansk — Status & Roadmap

*Masteroverblik. Sidst opdateret: 12. juni 2026.*
*Detaljer ligger i: `SEO-handlingsplan.md`, `SEO-audit.md`, `Content-strategi.md`, `Gennemgang-og-SEO-plan.md`. Denne fil er det korte overblik + prioritering.*

> Bemærk: `.md`-filer er blokeret i robots.txt, så denne plan indekseres ikke — den er kun til dig.

---

## ✅ Udført

| Dato | Opgave |
|------|--------|
| 10. jun 2026 | **Øve-prøve oprydning:** fjernet historisk-prøve-sektion, dark mode, Google Fonts/pink-brand → system-font + blåt brand; rettet dublet-bug + slåfejl; værdi-regel (36/45 + 4/5) verificeret korrekt |
| 10. jun 2026 | **Øve-prøve SEO:** statisk intro + eksempel-spørgsmål + FAQ + `FAQPage`-schema; OG-billede + OG/Twitter-tags |
| 10. jun 2026 | **Forside:** L 98-statusbanner (bortfaldet efter valg), title/meta afdateret, regeringsdato rettet til 3. juni |
| 10. jun 2026 | **Navigation:** øve-prøve i header + footer; robots.txt + sitemap opdateret |
| 10. jun 2026 | **Structured data:** `WebApplication` + `BreadcrumbList` på beskaftigelse, karens, udlandsophold, tjekliste, pdf-vaerktoj (+ Breadcrumb på privatliv) |
| 10. jun 2026 | **Ny side** `/ordbog` — 23 begreber med DefinedTermSet-schema, interne links til de dybe sider, OG-billede; wiret i sitemap/robots/footer |
| 10. jun 2026 | **Ny side** `/vaerdiscreening-statsborgerskab` (Aktuelt): NewsArticle/FAQ/Breadcrumb-schema, inline-kilder + kildeliste, IFU-medlemsliste (pr. juni 2026), OG-billede; wiret i sitemap/robots/footer/header; krydslinket med sindelagskontrol |
| feb–jun 2026 | **Dokumenter:** gennemgang & SEO-plan, SEO-handlingsplan, SEO-audit, content-strategi |
| 12. jun 2026 | **Forside & Footer:** Ændret footer fra fixed til statisk, standardiseret Tjekliste-kort, opdateret "Aktuelt" FAQ. |
| 12. jun 2026 | **Tjekliste 2.0 (UX & Logik):** Implementeret blokerende rød banner med redirect (hvis arbejdskrav/kriminalitet dumper), dynamiske info-bokse med grønne "FORDELE"-tags (fritagelser). |
| 12. jun 2026 | **Tjekliste (Juridisk rettelse):** Rettet logik for herboende unge iht. UIM.dk (fastholder krav om permanent ophold, selvforsørgelse og indfødsretsprøve; men tilføjer grøn dispensation for arbejdskrav og sprogprøve). |
| 12. jun 2026 | **Ordbog:** Korrigeret "Justitsministeriet" til "Udlændinge- og Integrationsministeriet". |

---

## 🔜 Backlog — med vægtning

Vægtning: **Effekt** (hvor meget rykker det trafik/tillid) × **Indsats** (hvor meget arbejde). Prioritér høj effekt + lav indsats først.

| Opgave | Effekt | Indsats | Prioritet |
|--------|--------|---------|-----------|
| **Search Console:** "Anmod om indeksering" på nye/ændrede sider (sitemap er indsendt) | Høj | Lav | **1 — gør nu** |
| **Nyt indhold** fra content-kalenderen: opholdskrav ("hvor mange år?"), gebyr 2026, dobbelt statsborgerskab, sprogkrav | Høj | Løbende | **1 — gør nu** |
| **Performance:** erstat Tailwind-CDN med bygget, minificeret CSS | Høj | Middel-høj | **2** |
| **Opholds-beregner** ("hvornår kan jeg søge?") | Høj | Høj | **2** |
| **Tjekliste 2.0:** klikbare links + ophold-beregning + localStorage | Høj | Middel | **2** (udskudt) |
| **Tjekliste SEO:** statisk crawlbar tekst + FAQ + Twitter-tags | Middel-høj | Lav | **2** (udskudt) |
| "Om SnartDansk"-side (E-E-A-T: hvem står bag, hvordan opdateres reglerne) | Middel | Lav | **2** |
| `BreadcrumbList` på de øvrige undersider (guides/aktuelt) | Middel | Lav | **3** |
| Twitter Card-tags på karens, tjekliste, udlandsophold | Lav-middel | Lav | **3** |
| Stram for lange titler/beskrivelser (dispensation, udvisningsregler m.fl.) | Lav | Lav | **3** |
| **Aktuelt-hubside** `/aktuelt` (byg når der er 4-5 indlæg) | Middel | Lav | **3 — vent** |
| "Min Sag"-dashboard + samlet PDF-rapport (client-side) | Middel-høj | Høj | **4** |
| Flere quiz-spørgsmål: 45 pr. periode hvis fuld historisk simulering ønskes | Middel | Høj | **4** |

---

## 🔁 Løbende vedligehold (tjek ved ændringer)

- **Nyt lovforslag/liste:** opdater `data.json`, forsidens banner/tekst, og `<lastmod>` i `sitemap.xml`. Kør "Anmod om indeksering".
- **Regelændringer:** opdater de berørte sider + deres `dateModified`, og tilføj inline-kilde ved nye påstande.
- **IFU-medlemsliste** (på værdiscreening-siden): tjek mod [ft.dk's medlemsoversigt](https://www.ft.dk/da/udvalg/udvalgene/ifu/medlemsoversigt) ved valg/rokader; opdater "pr. [dato]"-stemplet.
- **Indfødsretsprøvens pensum:** nyt læremateriale forventes ultimo august 2026 (gælder vinter 2026 + sommer 2027) → opdater pensum-spørgsmål i øve-prøven.
- **Ekspertgruppens rapport:** forventes ultimo 2026 → opdater værdiscreening-siden, når den lander.

---

## 📌 Beslutninger truffet (så de ikke skal gentænkes)

- Quizzen og alle værktøjer er **gratis** (trafikmotor). Monetisering via advokat-leads + evt. premium PDF — ikke trackingbaserede annoncer (bevarer privatlivsbrandet).
- Øve-prøven bruger **dagens format (45 spm.)** til simulering; ældre prøver (40 spm.) bruges kun som lyn-/øvespørgsmål.
- Kilder skrives **både inline + i kildeliste** på nyheds-/guidesider.
- Aktuelt-indhold krydslinkes (forside-banner ↔ værdiscreening ↔ sindelagskontrol ↔ header/footer).
- **Ingen separat "Er jeg klar?"-wizard:** tjeklisten dækker den allerede (gruppe-tilpassede krav, blokering, fremdrift). Vi udbygger tjeklisten til "2.0" i stedet for at bygge en parallel wizard, så vi undgår overlap og dobbelt vedligehold.
