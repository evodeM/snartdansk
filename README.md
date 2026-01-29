# SnartDansk

> **⚠️ PRIVAT REPOSITORY - MÅ IKKE DELES**

Uofficielt værktøj til at navigere i den danske statsborgerskabsproces.

## Oversigt

SnartDansk er en samling af værktøjer der hjælper ansøgere med at forstå kravene til dansk statsborgerskab:

- **Søgefunktion** - Tjek om du er på den seneste indfødsretsliste
- **Beskæftigelsesberegner** - 42-måneders historik
- **Karensberegner** - Venteperioder ved strafbare forhold
- **Udlandsopholdsberegner** - Track rejser og ophold
- **Tjekliste** - Er du klar til at søge?
- **PDF Værktøj** - Sammenflet, komprimer og opdel PDFs (max 2 MB)
- **FAQ** - Ofte stillede spørgsmål
- **Dispensation Guide** - For unge under 22

## Teknologi

- HTML5 / CSS3 / JavaScript
- Tailwind CSS (CDN)
- pdf-lib.js (CDN)
- 100% client-side (ingen server, ingen tracking)

## Struktur

```
/
├── index.html          # Hovedside med søgefunktion
├── faq.html            # FAQ
├── beskaftigelse.html  # Beskæftigelsesberegner
├── karens.html         # Karensberegner
├── udlandsophold.html  # Udlandsopholdsberegner
├── tjekliste.html      # Tjekliste-værktøj
├── pdf-vaerktoj.html   # PDF merge/komprimer/split
├── dispensation.html   # Guide for unge under 22
├── 404.html            # Fejlside
├── robots.txt          # SEO - blokerer data.json
├── sitemap.xml         # SEO - sitemap
├── favicon.svg         # Favicon
├── data.json           # ⚠️ NAVNELISTE - MÅ IKKE INDEXERES
├── components/
│   ├── header.html     # Delt header
│   └── footer.html     # Delt footer
└── js/
    ├── calculators.js  # Delte funktioner
    ├── search.js       # Søgefunktion
    ├── tjekliste-calculator.js
    └── pdf-tool.js     # PDF værktøj
├── private/            # 🔒 Ignoreret mappe til lokale filer
```

---

## 🔧 Vedligeholdelsesguide

### 1. Opdatere navnelisten (data.json)

Når et nyt lovforslag fremsættes med en ny liste:

**Format:**
```json
[
  { "n": "Fornavn Efternavn", "k": "Kommune" },
  { "n": "Andet Navn", "k": "Anden Kommune" }
]
```

**Trin:**
1. Hent det nye lovforslag fra ft.dk (PDF-format)
2. Konverter PDF til tekst (brug en PDF parser)
3. Ekstrahere navne og kommuner til JSON-format
4. Erstat indholdet i `data.json`
5. **Opdater disse steder:**
   - `index.html`: Opdater lovforslagsnummer i titel og tekst
   - `sitemap.xml`: Opdater `<lastmod>` dato
   - `faq.html`: Teksten burde være generisk ("seneste lovforslag")

**Eksempel på at finde/erstatte lovforslag:**
```bash
# Find alle referencer til det gamle lovforslag
grep -r "L 98" --include="*.html" .
```

---

### 2. Redigere beregner-regler

**Tjekliste-regler:** `js/tjekliste-calculator.js`
- Find `generateRules()` funktionen
- Reglerne er organiseret efter brugertype (ung/voksen, straffet osv.)

**Karensberegner:** `js/karens-calculator.js`
- Venteperioder defineret i toppen som konstanter
- Opdater værdier når lovgivning ændres

**Beskæftigelsesberegner:** `js/beskaftigelse-calculator.js`
- Månedskrav (42 måneder, 35 timer osv.) er defineret som konstanter

---

### 3. Tilføje ny side/værktøj

1. **Opret HTML-fil** i rod-mappen
2. **Brug skabelon** fra eksisterende side (fx `faq.html`)
3. **Tilføj til navigation:**
   - `components/header.html` - Desktop dropdown og mobilmenu
   - `components/footer.html` - Footer links
4. **SEO:**
   - Tilføj til `sitemap.xml`
   - Opdater `<lastmod>` dato

---

### 4. Redigere header/footer

Filer: `components/header.html` og `components/footer.html`

**Navigation rækkefølge:** (efter relevans)
1. Beregnere: Beskæftigelse, Karens, Udlandsophold
2. Værktøjer: PDF, Tjekliste
3. Guides: Dispensation, FAQ

---

### 5. SEO opdateringer

**Ved større ændringer:**
1. Opdater `sitemap.xml` med nye sider og datoer
2. Opdater meta-tags i sidernes `<head>`
3. Tjek `robots.txt` blokerer sensitive filer

**Vigtige meta-tags per side:**
- `<title>` - unik titel
- `<meta name="description">` - beskrivelse
- `<link rel="canonical">` - kanonisk URL
- Open Graph tags (Facebook)
- Twitter Card tags

---

### 6. Fejlfinding

**Søgefunktion virker ikke:**
- Tjek at `data.json` er valid JSON (brug en JSON validator)
- Tjek browserkonsollen for fejl

**Beregner viser forkerte værdier:**
- Tjek de relevante JavaScript-filer i `/js/`
- Se efter konstanter/regler der skal opdateres

**404-side vises ikke:**
- Kræver serveropsætning (se Deployment-sektionen)

---

### 7. Private filer

Mappen `/private/` er konfigureret til at blive ignoreret af Git.

- **Formål:** Her placeres filer, som du vil gemme lokalt, men som **IKKE** skal lægges ud på hjemmesiden eller GitHub.
- **Eksempler:** Noter, udkast, `Strafbarforhold.txt` eller backup-filer.
- **Vigtigt:** Alt indhold i denne mappe forbliver kun på din computer.

---

## Legal Compliance

### Navneliste (data.json)
- **MÅ IKKE INDEXERES** af søgemaskiner
- Blokeret i `robots.txt`
- Ikke inkluderet i `sitemap.xml`
- Indeholder persondata fra offentligt lovforslag

### Privatliv
- Ingen cookies
- Ingen tracking/analytics
- Alt kører lokalt i brugerens browser
- Ingen data sendes til servere

## Deployment

### Lokal udvikling
```bash
python3 -m http.server 8080
# Åbn http://localhost:8080
```

### Produktion
Upload til webhost. Sørg for at webserveren:
1. Serverer `404.html` ved 404-fejl
2. Respekterer `robots.txt`
3. HTTPS er aktiveret

## Ansvarsfraskrivelse

- Alle resultater er **kun vejledende**
- Udgør **ikke juridisk rådgivning**
- Tjek altid ft.dk for officielle oplysninger
- Ikke tilknyttet offentlige myndigheder

---

**Sidst opdateret:** Januar 2026
