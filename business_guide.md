# Strategisk Guide: Leads & Monetisering for SnartDansk

Denne guide beskriver, hvordan du kan transformere dine beregnere fra gratis værktøjer til en indtægtskilde og en maskine til opsamling af leads (potentielle kunder).

---

## 🏗️ Del 1: Leads (Opsamling af kundeemner)

Formålet er at få brugerens kontaktinfo (navn, e-mail, tlf.), så du kan sælge dem juridisk rådgivning senere.

### 1. "Lås" resultatet (Gated Content)
I stedet for at vise det fulde resultat med det samme, kan du kræve en e-mail.
- **Workflow**:
    1. Brugeren indtaster sine rejser/arbejdstimer.
    2. Brugeren klikker "Beregn".
    3. En pop-up (modal) vises: *"Indtast din e-mail for at modtage din personlige analyse og en guide til L 98."*
    4. Når de har tastet e-mailen, vises resultatet.

### 2. Integration til WhatsApp / Kontaktformular
Da mange af dine brugere er på mobilen, er WhatsApp guld værd.
- **Implementering**: 
    - Tilføj en knap under resultatet: *"Har du brug for hjælp til din ansøgning? Skriv til os på WhatsApp."*
    - Brug et link som: `https://wa.me/DITNUMMER?text=Hej, jeg har brug for hjælp til min indfodsret-ansøgning.`

---

## 💰 Del 2: Monetisering (Tjen penge på beregnerne)

Her er to måder at gøre fx Udlandsopholdsberegneren til et betalingsprodukt (Premium Version).

### 1. Stripe / LemonSqueezy Integration
Dette er den "rigtige" vej til automatisk betaling.
- **LemonSqueezy** (Anbefales): De håndterer moms og skat globalt (Merchant of Record).
- **Setup**:
    1. Lav et produkt i LemonSqueezy (f.eks. "SnartDansk Premium Rejse-Log").
    2. Brug deres "Overlay Checkout".
    3. Når brugeren har betalt, gemmer du en "adgangskode" eller en cookie i deres browser, som låser op for avancerede funktioner.

### 2. Hvad kan du tage penge for? (Premium Features)
Gør de basale ting gratis, men kræv betaling for:
- **PDF-Eksport**: Generering af en færdig PDF-fil, som brugeren kan sende direkte til UIM som dokumentation.
- **Ubegrænsede rejser**: Gratis brugere kan indtaste 5 rejser, Premium kan indtaste alle 12 år.
- **Juridisk tjek**: "Få en jurist til at validere dine data" (Dette koster mere).

---

## 🛠️ Tekniske Trin (Næste skridt)

Hvis du vil gøre dette senere, er her den tekniske plan:

### 1. Lead Opsamling (Email)
- Brug **Mailchimp** eller **MailerLite**.
- Indsæt deres tilmeldingsformular i en modal på dine beregner-sider.

### 2. Betalingsvæg (Paywall)
1. **Frontend**: Lav en betalings-knap der åbner checkout.
2. **Backend**: Da du kører en statisk side, kan du bruge LemonSqueezy's `Redirect` funktion. Efter betaling sendes brugeren til: `snartdansk.dk/udlandsophold-premium.html?token=ABC123`.
3. **Sikkerhed**: Selvom det er en statisk side, kan du bruge JavaScript til at tjekke for tilstedeværelsen af en betalings-token i URL'en før man viser de avancerede værktøjer.

---

## 💡 UX Tips for højere konvertering
- **Værdi først**: Vis dem altid ét interessant datapunkt gratis (fx "Du har været bortrejst i 30 dage"), før du spørger om e-mail/penge.
- **Tidspres**: *"Husk, at reglerne for L 98 ændres snart. Få styr på dine data nu."* (Skaber hastværk).
