# Plan wdrożenia audytu — krok po kroku, sekcja po sekcji

Źródło: `SG_Papertronics_website_audit_and_copy_recommendations.docx` (rozdz. 1–15).
Blokery po stronie klienta: `docs/audit-open-questions.md`.

Legenda statusu:
- ✅ **zrobione** — jest w kodzie na `main`
- 🟢 **do zrobienia teraz** — nie wymaga niczego od klienta
- 🟡 **częściowo** — szkielet jest, brakuje treści/danych
- 🔴 **zablokowane** — czeka na odpowiedź klienta (patrz `audit-open-questions.md`)

---

## CZĘŚĆ A. Zmiany całościowe (całą stronę naraz)

Te robimy **przed** pracą sekcja-po-sekcji, bo inaczej poprawiamy te same claimy
w pięciu miejscach.

### A1. Rejestr claimów (audyt rozdz. 14) — jedno źródło prawdy 🟢/🔴

Dziś te same ryzykowne sformułowania żyją w kilku plikach. Plan:

1. Utworzyć `app/_components/claims.ts` — jedna stała na claim, z komentarzem
   „warunek publikacji" z audytu. Każda strona importuje stąd, nie przepisuje.
2. Podmienić w całym serwisie:

| Obecnie | Docelowo | Gdzie dziś siedzi |
|---|---|---|
| `Result in <5 min · zero calibration` | `Results in under five minutes · No user calibration required for supported assays` — **🔴 dopiero po potwierdzeniu B1/B2** | `home-content.ts` → `explore.trust2` |
| `see the change as it happens` | `see what is changing during the run` | `home-content.ts` → `benefits.subtitle` |
| `scalable process intelligence` | `structured process data` | `home-content.ts` → `lifecycle.headingAccent` |
| `Trusted by` | `Selected customers and research collaborators` — **🔴 najpierw B5: kto jest kim** | `home-content.ts` → `partners.heading`, `LandingClient.tsx` |
| `process control` (jako obietnica produktu) | `at-line measurement / process monitoring / decision support` | `home-content.ts` (`howWeWork.headingAccent`, `seo.title`), `layout.tsx`, `about/page.tsx`, `InvestorsPage.tsx` |
| `Additional assays available for development` | `Additional analytes and matrices can be evaluated for co-development` | Applications |
| `release decisions` | `support process decisions` | ✅ nie występuje w kodzie — pilnować przy nowych treściach |

> „process control" zostaje **tylko** w misji („Make process control accessible…"),
> bo tam to cel firmy, nie opis funkcji urządzenia.

### A2. Etykiety statusu — komponent, nie tekst 🟢 (dane 🔴)

Audyt rozdz. 2 wymaga jawnego statusu przy każdej aplikacji/assayu.

1. `app/_components/StatusBadge.tsx` z zamkniętym zbiorem:
   `Available now · Commercially validated · Pilot-ready · In validation · In application development · Available for co-development · Roadmap`.
2. Wpiąć w karty na Home (proof), Applications (typy procesów) i Technology (assays).
3. 🔴 Który badge gdzie — wynika z macierzy `analyte × matrix × status × intended use` (blocker A).

### A3. Architektura marki wszędzie tam, gdzie pada nazwa 🟡

✅ Akapit brand jest już na Home (`intro.brand`).
🟢 Powtórzyć tę samą hierarchię (bez kopiowania całego akapitu) w: stopce,
About hero, Investors, meta description. Zasada: **Beer-o-Meter nigdy nie występuje
bez kwalifikatora** „first commercial application built on Q-Tector technology".

### A4. Typografia i design system (rozdz. 11) 🟢 — po akceptacji E2

1. `app/layout.tsx`: Montserrat → **Manrope** (display 600–700) + **Inter** (body 400–500).
   Dwa `next/font/google`, dwie zmienne CSS, mapowanie w `globals.css`.
2. Body: desktop 17–18 px / line-height 1.5–1.6; mobile 16 px / 1.55; szerokość linii 60–70 znaków.
3. Redukcja dekoracji: mniej dwukolorowych nagłówków, mniejsze promienie, mniej
   translucent cards. Pięć benefit cards → cztery (patrz B2 poniżej).
4. Kontrast: audyt szarości na jasnym tle (`#8990A0` w stopce to ~3.5:1 — poniżej AA).

### A5. Dostępność — jeden przebieg na cały serwis (rozdz. 13) 🟢

| # | Problem | Plik |
|---|---|---|
| 1 | `<html lang="en">` zahardkodowane — NL i PL deklarują się jako angielskie | `app/layout.tsx:72` |
| 2 | Brak `<main>` i skip linka | `layout.tsx` + `landing-markup.ts` (dziś `<header id="top">` bez `<main>`) |
| 3 | Brak `aria-current="page"` i `aria-current` na aktywnym języku | `SiteNavClient.tsx:46,55` |
| 4 | Hamburger ~40×32 px → min. 44×44 px | `SiteNavClient.tsx:74` |
| 5 | Brak `aria-controls`; Escape nie zamyka menu; tło się przewija pod menu | `SiteNavClient.tsx` |
| 6 | Treści animowane startują z `opacity: 0` bez fallbacku | `globals.css`, `LandingClient.tsx` |
| 7 | Brak przełącznika EN/NL/PL na homepage (podstrony mają) | `landing-markup.ts` |
| 8 | Podwójne „News" w stopce homepage | `site-footer.tsx` / dane w Sanity |
| 9 | Privacy / Terms / LinkedIn → `#top` | 🟡 kod już ukrywa atrapy (`isPlaceholder`), 🔴 brakuje treści i URL-a |

### A6. Intencyjne CTA w całym serwisie (rozdz. 12) 🟡

✅ Formularz obsługuje 7 typów zapytania.
🟢 Zostało: przejrzeć **każdy** przycisk na stronie i podpiąć właściwy `intent`:

| CTA | URL |
|---|---|
| Discuss a pilot | `/contact?intent=pilot` |
| Ask about Q-Tector | `/contact?intent=product` |
| Talk to sales | `/contact?intent=sales` |
| Discuss a custom assay | `/contact?intent=assay` |
| Propose a partnership | `/contact?intent=partnership` |
| Request the investor deck | `/contact?intent=investor` |
| Ask a question | `/contact?intent=general` |

Plus `source_page`, `source_cta`, `locale`, `vertical` jako parametry.
Zlikwidować sytuację, w której „Contact" i „Talk to us" prowadzą w to samo miejsce.

---

## CZĘŚĆ B. Home — sekcja po sekcji (rozdz. 5)

### B1. Hero ✅ / 🔴 zdjęcie
- ✅ eyebrow, headline, subtitle, `focus`, oba CTA — copy deck wdrożony (`home-content.ts:63`).
- 🔴 **Zdjęcie nadal pokazuje urządzenie z napisem Beer-o-Meter** (`/assets/newHero.JPG`).
  To najcięższy pojedynczy punkt P0 z audytu i wymaga sesji zdjęciowej (blocker D5).
  Do czasu sesji: kadr, który nie eksponuje brandingu, albo diagram reader + pod + app + data.

### B2. „Q-Tector statement" + „Why it matters" → **jedna sekcja** 🟢
- Dziś to dwa bloki (`intro` + `benefits`) mówiące to samo, plus 5 kart o zbliżonej treści.
- Scalić w jeden blok z nagłówkiem `Measure during the run, not after the opportunity to act.`
- 5 kart → **4 karty** z copy decku: Optimise media and feeds / Transfer knowledge across
  scale / Investigate deviations sooner / Build comparable process histories.
- To załatwia jednocześnie zarzut z rozdz. 11 o „pięciu ciasnych kartach w rzędzie".

### B3. „Explore what we can do" 🟢 / 🔴 grafika
- Nagłówek → `Is Q-Tector a fit for your process?`, CTA → `Request a process-fit review`.
- 🟢 Usunąć `trust2` z niepotwierdzonym claimem (patrz A1).
- 🔴 Zdjęcie zespołu w tym miejscu → diagram
  `Sample → Guided assay → Quantitative result → Trend → Process decision`.
  Diagram możemy narysować sami jako SVG — **nie wymaga klienta**, warto zrobić od razu.

### B4. „Data & analytics" + „How we work" + „Customer success" → **jedna sekcja** 🟢
- Trzy bloki opisują dziś tę samą ścieżkę.
- Nowa sekcja: `One measurement workflow from first experiment to production`
  z trzema kolumnami R&D — Learn / Pilot — Validate / Production — Standardise.
- Usunąć nienaturalne „Analyze goals".
- Pod spodem czterokrokowy collaboration flow + CTA `Discuss a pilot`.

### B5. Proof i partnerzy 🟡 / 🔴
- 🟢 Białe koła z nazwami → karty z opisem typu relacji.
- 🔴 Typ relacji przy każdej z 5 nazw i zgoda na logotyp (blocker B5).
- 🔴 Case cards: link, status, **wynik liczbowy**, cytat z przypisaniem (blocker D2).

---

## CZĘŚĆ C. Technology (rozdz. 6)

1. ✅ „Sample to decision, in five steps" — audyt chwali, zostawiamy bez zmian.
2. 🟢 Hero: nowe copy z decku + `Current analytical focus: glucose and sucrose in culture media`
   + CTA `View current assays` / `Discuss your sample matrix`.
3. 🟢 Nowa sekcja **definicja at-line** — wprost: „it is not a continuous online sensor".
   To rozbraja zarzut o mylące „process control".
4. 🔴 **Tabela specyfikacji** — największy brak na tej stronie. Kolumny: analyte, matrix,
   status, intended use, range, precision/CV, sample volume, time to result, prep,
   throughput, user calibration, data export. Zablokowana macierzą (blocker A).
   🟢 Możemy zbudować komponent tabeli i wypełnić placeholderami do review.
5. 🟢 Sekcja **Custom development** + CTA `Request an application assessment`.

---

## CZĘŚĆ D. Applications (rozdz. 7)

1. 🟢 **Rozdzielić taksonomię na dwa niezależne wymiary** — dziś jedna lista miesza
   branżę, typ procesu i model biznesowy:
   - *Etap / decyzja*: process development · feed strategy · scale-up · production monitoring · troubleshooting
   - *Typ procesu / klient*: precision fermentation · biomass fermentation · food & beverage · applied biotech · CDMO
2. 🟢 Nowy hero + CTA `Find your workflow` / `Discuss your application`.
3. 🟢 Sekcja **Use cases** (4 pozycje z decku) — mapuje wymiar „etap/decyzja".
4. 🟢 Sekcja **Typy procesów** (5 pozycji z decku) — mapuje wymiar „typ procesu".
   Przy F&B jawny odsyłacz: „For brewery-specific testing, see Beer-o-Meter".
5. 🔴 **Publication rule**: żaden proces nie dostaje etykiety „available" bez
   potwierdzenia `analyte × matrix × status × intended use`. Do tego czasu każdy
   kafel dostaje status neutralny.
6. 🔴 Case studies klikalne, z mierzalnym wynikiem (blocker D2).

---

## CZĘŚĆ E. About (rozdz. 8)

1. 🟢 Zachować i wyeksponować `Better process data shouldn't be reserved for big labs`
   — audyt uznaje to za najlepsze zdanie na stronie.
2. 🟢 Nowy hero + sekcja „Why we exist" + „Capabilities" z decku.
3. 🟢 Wyciągnąć About z samej stopki do głównej nawigacji (patrz E1 w open-questions).
4. 🔴 Karty osób: imię, rola, kompetencje, LinkedIn (blocker D3).
5. 🔴 Historia nazwy „Papertronics" i droga od paper-based microfluidics do Q-Tectora (D3).
6. 🔴 Zdjęcia: dziś twarze ucięte na obu krawędziach; potrzebny nowy kadr (D5).

---

## CZĘŚĆ F. Investors i News (rozdz. 9)

### Investors
1. 🟢 Nowy hero + skrócenie narracji + CTA `Request the investor deck` /
   `Contact investor relations` (oba z `intent`).
2. 🔴 Blok liczb zamiast „strong validation": klienci, pilotaże, urządzenia, reorder rate,
   zwalidowane assaye, rynki, gotowość produkcyjna, IP, leadership, use of funds (blocker D1).
3. 🔴 Czy „Series A" można komunikować publicznie (D1).
4. 🔴 Osobny portret leadershipu (D5).

### News
1. 🟢 Ujednolicić `Read the full story` / `Read more` do jednego wariantu.
2. 🟢 Naprawić podpis autora `jobgerjon` → pełne imię (dane w Sanity).
3. 🟢 Dwa artykuły CBC dzielą ten sam obraz — podmienić jeden.
4. 🟢 Kategorie: `Customer results · Q-Tector product · Application development · Partnerships · Company`.
5. 🟢 CTA „we'll keep you posted" albo prowadzi do newslettera, albo znika.
6. 🟢 Closing CTA `Discuss your application` na końcu listy.

---

## CZĘŚĆ G. Kolejność wdrożenia

Kolejność z audytu (rozdz. 15), przefiltrowana przez to, co realnie odblokowane:

**Sprint 1 — teraz, bez klienta**
1. A1 rejestr claimów + A3 hierarchia marki (dotyka wszystkich stron — najpierw)
2. B2 + B4 — scalenie zdublowanych sekcji Home (największa redukcja szumu)
3. B3 diagram `Sample → … → Process decision` (zastępuje zdjęcie zespołu)
4. A6 intencyjne CTA na wszystkich stronach
5. A5 pełny pass dostępności
6. F/News — cała lista, w całości odblokowana

**Sprint 2 — teraz, ale wymaga akceptacji kierunku (E1–E4)**
7. A4 typografia (E2), nawigacja buyer-first (E1), CTA „Discuss your process" (E3)
8. C2/C3/C5 + D1–D4 — nowe copy Technology i Applications
9. E1–E3 About

**Sprint 3 — dopiero po odpowiedziach klienta**
10. Macierz produktowa → tabela specyfikacji (C4), etykiety statusu (A2), publication rule (D5)
11. Claimy warunkowe (B1/B2 z open-questions)
12. Case studies z liczbami, Investors z danymi
13. Sesja zdjęciowa → hero, About, Investors, seria procesowa

**Definition of done (audyt):** strona odpowiada na pięć pytań — co mierzymy dzisiaj,
dla jakiej próbki, w jakim statusie, jaką decyzję wspiera wynik, jak zacząć właściwą rozmowę.
