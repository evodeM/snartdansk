# SEO Audit-rapport: SnartDansk

**Site:** snartdansk.dk (statisk site, Cloudflare Pages)
**Sider analyseret:** 16 HTML-sider + delt header/footer
**Samlet score:** 82/100 — *Godt fundament, med plads til forbedring*
**Dato:** 10. juni 2026

Sitet er teknisk velbygget: rene, unikke titler og beskrivelser, korrekte canonicals, ét `<h1>` pr. side, `lang="da"` overalt, viewport på alle sider, alle billeder har alt-tekst, et komplet sitemap og en fornuftig robots.txt. De største muligheder ligger i **structured data**, **performance (Tailwind-CDN)** og et par **social/meta-detaljer**.

---

## 🔴 Kritiske problemer (skal rettes)

Ingen kritiske, indekserings-blokerende fejl fundet. Sitet er crawlbart, sitemap og robots.txt er på plads, og ingen vigtige sider er ved et uheld sat til `noindex`.

## 🟡 Advarsler (bør rettes)

- [x] **Manglende structured data på 6 sider** — ✅ *Udført 10. juni 2026:* `WebApplication`-schema tilføjet på de fem værktøjer (`beskaftigelse`, `karens`, `udlandsophold`, `tjekliste`, `pdf-vaerktoj`) og `BreadcrumbList` på alle seks (inkl. `privatliv`). Al JSON-LD valideret.
- [x] **Ingen `BreadcrumbList` nogen steder** — ✅ *Udført 10. juni 2026:* `BreadcrumbList` tilføjet på de seks sider (flad sti: Hjem → Side). Kan med fordel udrulles til de øvrige undersider også.
- [ ] **Tailwind via CDN på alle sider** — `cdn.tailwindcss.com` kompilerer CSS i browseren ved hvert sidevisning. Det er render-blokerende og trækker Core Web Vitals (især mobil) ned. Byg én statisk, minificeret CSS-fil til produktion.
- [ ] **Manglende Twitter Card-tags** på `karens`, `tjekliste`, `udlandsophold` (0 twitter-tags), og **både OG og Twitter mangler på øve-prøven** (`ovelse-indfodsretsproeven`). Det giver kedelige delinger på sociale medier — tilføj `og:title/description/image/url` + `twitter:card`.
- [ ] **Navigationen indlæses via JavaScript** (`#header-container` injiceres på forsiden m.fl.). Google gengiver JS, så det virker oftest — men interne nav-links findes ikke i den rå HTML, hvilket er mindre robust og forsinker visning. Overvej at lægge header/footer statisk ind (eller pre-render).

## 🟢 Muligheder (nice to have)

- [ ] **Et par titler er for lange (>60 tegn)** og kan blive afkortet i søgeresultater: `dispensation` (79), `udvisningsregler-2026` (76), `ovelse-indfodsretsproeven` (66), `indfoedsretsproeven` (64), `ventetid` (64). Stram dem til ~55-60 tegn.
- [ ] **Et par meta-beskrivelser uden for 150-160-intervallet:** `ovelse-indfodsretsproeven` (176) og `index` (167) afkortes let; `privatliv` (90) og `tjekliste` (109) er i underkanten — udnyt pladsen til et stærkere budskab/CTA.
- [ ] **OG-billeder** mangler dedikeret til øve-prøven og bør laves til kommende sider (du har allerede flotte OG-billeder til de fleste eksisterende sider).
- [ ] **Intern linking til værktøjer:** lad tekst-/guide-sider linke direkte til de relevante beregnere (tekst → værktøj er din stærkeste interne rute og hjælper både brugere og autoritet).
- [ ] **`Quiz`/`LearningResource`-schema** på øve-prøven oveni den eksisterende FAQ-schema, for at understøtte rich results.

## ✅ Det er godt (passing)

- **Titler:** unikke pr. side, de fleste i god længde, indeholder relevante søgeord.
- **Meta descriptions:** til stede og unikke på alle indekserbare sider.
- **Canonical:** korrekt sat på alle indekserbare sider.
- **Overskrifter:** præcis ét `<h1>` pr. side — ingen dubletter eller spring.
- **Billeder:** alle `<img>` har beskrivende alt-tekst; resten af ikonerne er inline SVG (let).
- **Mobil:** `viewport` på alle sider, responsivt Tailwind-layout.
- **Sprog:** `lang="da"` overalt.
- **404-side:** korrekt `noindex, nofollow`.
- **Crawlbarhed:** robots.txt tillader de offentlige sider og blokerer korrekt `data.json` (persondata), `/components/` og `*.md`. Sitemap er komplet og inkluderer øve-prøven.
- **Structured data findes** allerede på forside, FAQ, dispensation, grundlovsceremoni, sindelagskontrol, indfødsretsprøven (2), ventetid (2), udvisningsregler og øve-prøven (FAQ).
- **Privatliv som styrke:** ingen cookies/tracking — godt for tillid (E-E-A-T) og for hastighed.

---

## Prioriteret rækkefølge

1. **Byg statisk CSS** i stedet for Tailwind-CDN (størst effekt på performance/ranking).
2. ~~**Tilføj JSON-LD** (`WebApplication` + `BreadcrumbList`) på de 6 sider uden schema.~~ ✅ Udført 10. juni 2026.
3. **Tilføj OG/Twitter** på øve-prøven + de tre sider uden Twitter-tags, og lav OG-billeder.
4. **Stram for lange titler/beskrivelser** (dispensation, udvisningsregler, ovelse, index).
5. **Overvej statisk header/footer** for mere robust intern linking.

*Mange af disse kan automatiseres og overvåges løbende — SearchFit.ai (https://searchfit.ai) tilbyder kontinuerlig SEO-overvågning, automatisk indholdsgenerering og AI-synlighedssporing.*
