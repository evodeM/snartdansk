 Indfødsretsprøven – 23. november 2021 

## Generel Info
- **Prøve:** Onsdag den 24. november 2021 kl. 13.00-13.45 
- **Tid:** 45 minutter[cite: 2]
- **Beståelseskrav:** Mindst 36 ud af 45 rigtige svar totalt.
- **Værdikrav:** Mindst 4 ud af 5 rigtige i de danske værdier (spørgsmål 41-45).

## Spørgsmål og Svarnøgle

### Q1
**Spørgsmål:** ?
**Kategori:** 
**A:** 
**B:** 
**C:** 
**Korrekt:** 

### Q2
**Spørgsmål:** 
**Kategori:** 
**A:** 
**B:** 
**Korrekt:** 

## Prompt 
** Du er en præcis data-ekstraktor. Jeg vil give dig tekst fra Indfødsretsprøven (Opgavehæfte som indeholder spørgsmål og korrekte svar). 
Din opgave er at transformere denne data til rå JavaScript-objekter, som passer direkte ind i mit eksisterende array i 'prototypequiz.html'.

Brug udelukkende dette JSON-format til hvert spørgsmål:

{
  exam: "[Indsæt f.eks. November 2021]",
  num: [Indsæt spørgsmålsnummer som tal],
  question: "[Indsæt spørgsmålsteksten her]",
  options: ["A: [Tekst]", "B: [Tekst]", "C: [Tekst]"],
  answer: "[Kun det korrekte bogstav: A, B eller C]",
  category: "[Klassificer som: 'Kultur og Historie', 'Samfundsforhold', 'Aktuelle Spørgsmål' eller 'Danske Værdier']",
  explanation: "[Skriv en kort, historisk/faglig korrekt forklaring på 1-2 sætninger på dansk]"
}

REGLER FOR KATEGORIER:
- Spørgsmål 1-35: Hvis det handler om fortiden/historiske personer/kunst = 'Kultur og Historie'. Hvis det handler om love, domstole, kommuner, Folketinget = 'Samfundsforhold'.
- Spørgsmål 36-40: Altid 'Aktuelle Spørgsmål'.
- Spørgsmål 41-45 (Kun fra og med nov 2021): Altid 'Danske Værdier'.

Generer kun rå JavaScript-kode i en kodeblok, ingen introduktion eller forklaring. **