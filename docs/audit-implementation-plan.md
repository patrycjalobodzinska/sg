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

### A1. Rejestr claimów (audyt rozdz. 14) — jedno źródło prawdy ✅

✅ `app/_components/claims.ts` istnieje: `TERMS` (zaakceptowane sformułowania),
`MISSION_PROCESS_CONTROL` i `BLOCKED` (claimy czekające na klienta).
✅ Podmiana wykonana w kodzie **i w Sanity** — `scripts/patch-claim-register.mjs`
naniósł 24 pola na `home-en/nl/pl`. Skrypt jest idempotentny.

> ⚠️ Sanity jest tym, co renderuje live. Poprawka tylko w `home-content.ts`
> zmienia jedynie fallback — każdą zmianę claimu trzeba nanieść też na dataset.

Stan podmian:

| Obecnie | Docelowo | Gdzie dziś siedzi |
|---|---|---|
| `Result in <5 min · zero calibration` | ✅ **pole `trust2` usunięte** z typu, literałów, schematu Sanity i datasetu. Docelowe brzmienie czeka w `claims.ts` → `BLOCKED` (🔴 B1/B2) | `home-content.ts` → `explore.trust2` |
| `see the change as it happens` | ✅ `see what is changing during the run` | `home-content.ts` → `benefits.subtitle` |
| `scalable process intelligence` | ✅ `structured process data` (`TERMS.processData`) | `home-content.ts` → `lifecycle.headingAccent` |
| `Trusted by` | ✅ `Selected customers` + `and research collaborators`. 🔴 Typ relacji per nazwa i zgoda na logo nadal czekają na B5 | `home-content.ts` → `partners.heading`, `LandingClient.tsx` |
| `process control` (jako obietnica produktu) | ✅ `process monitoring` / `at-line measurement`. Zostało tylko w misji na `/about` (przez `MISSION_PROCESS_CONTROL`). Po drodze naprawione dwie zepsute pisownie NL | `home-content.ts`, `site-metadata.ts`, `about/page.tsx`, `investors/page.tsx`, `InvestorsPage.tsx` |
| `Additional assays available for development` | ✅ nie występuje w kodzie; brzmienie zapisane w `TERMS.coDevelopment` na przyszłość | Applications |
| `release decisions` | `support process decisions` | ✅ nie występuje w kodzie — pilnować przy nowych treściach |

> „process control" zostaje **tylko** w misji („Make process control accessible…"),
> bo tam to cel firmy, nie opis funkcji urządzenia.

### A2. Etykiety statusu — komponent, nie tekst 🟢 (dane 🔴)

Audyt rozdz. 2 wymaga jawnego statusu przy każdej aplikacji/assayu.

1. `app/_components/StatusBadge.tsx` z zamkniętym zbiorem:
   `Available now · Commercially validated · Pilot-ready · In validation · In application development · Available for co-development · Roadmap`.
2. Wpiąć w karty na Home (proof), Applications (typy procesów) i Technology (assays).
3. 🔴 Który badge gdzie — wynika z macierzy `analyte × matrix × status × intended use` (blocker A).

### A3. Architektura marki wszędzie tam, gdzie pada nazwa ✅

Zasada: **Beer-o-Meter nigdy nie występuje bez kwalifikatora**.
✅ Akapit brand na Home (`intro.brand`) — renderuje się w scalonej sekcji B2.
✅ Uzupełnione: panel kontaktowy (3 języki, home i `/contact`), tagline stopki,
opisy News (wymieniały obie marki jak równorzędne), opis About (nie nazywał ani
platformy, ani hierarchii). Applications i Investors miały kwalifikator już wcześniej.
Migracja: `scripts/patch-brand-hierarchy.mjs`.

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
| 1 | ✅ **zrobione** — rozbite na root layouty per drzewo: grupa `app/(en)/` i `app/[lang]/`, oba renderują wspólny `RootDocument` z lokalizacją. Wszystkie trasy nadal statyczne | `app/(en)/layout.tsx`, `app/[lang]/layout.tsx`, `_components/RootDocument.tsx` |
| 2 | ✅ skip link jest (i przetłumaczony na NL/PL), `id="main"` obecne | `RootDocument.tsx`, `globals.css:52` |
| 3 | ✅ zrobione | `SiteNavClient.tsx:91,111` |
| 4 | Hamburger ~40×32 px → min. 44×44 px | `SiteNavClient.tsx:74` |
| 5 | ✅ zrobione — `aria-controls`/`aria-expanded`, Escape zamyka menu i dropdown | `SiteNavClient.tsx:38,60,136` |
| 6 | Treści animowane startują z `opacity: 0` bez fallbacku | `globals.css`, `LandingClient.tsx` |
| 7 | Brak przełącznika EN/NL/PL na homepage (podstrony mają) | `landing-markup.ts` |
| 8 | ✅ zrobione — „News" było w kolumnie *Explore* i *Company*, zostało jedno | `landing-markup.ts` |
| 9 | Privacy / Terms / LinkedIn → `#top` | 🟡 kod już ukrywa atrapy (`isPlaceholder`), 🔴 brakuje treści i URL-a |

### A6. Intencyjne CTA w całym serwisie (rozdz. 12) ✅

✅ Formularz obsługuje 7 typów zapytania, `contact-intent.ts` → `contactUrl()`
buduje URL-e, a `/contact` czyta `intent`, `source_page`, `source_cta`, `vertical`.
✅ Wszystkie CTA podpięte: Technology, Applications, Investors, About, News oraz
home (nav pill i hero secondary → `product`, sekcja „explore" → `pilot`). Dwa
`#contact` na home zostały świadomie — prowadzą do formularza in-page, który
preselektuje `general`, więc neutralne wejście jest odrębne od intencyjnych.
🔴 `assay`, `sales`, `partnership` nieużywane — należą do sekcji, które jeszcze
nie istnieją (C5 custom development, karty partnerów B5).

Mapowanie z audytu:

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
- 🟡 `newHero.JPG` **nie jest już nigdzie referencowany** — hero używa
  `hero-chrome.png`. Do wizualnego potwierdzenia, czy nowy kadr nie eksponuje
  brandingu Beer-o-Meter; docelowa sesja zdjęciowa nadal 🔴 (blocker D5).

### B2. „Q-Tector statement" + „Why it matters" → **jedna sekcja** 🟢
- Dziś to dwa bloki (`intro` + `benefits`) mówiące to samo, plus 5 kart o zbliżonej treści.
- Scalić w jeden blok z nagłówkiem `Measure during the run, not after the opportunity to act.`
- 5 kart → **4 karty** z copy decku: Optimise media and feeds / Transfer knowledge across
  scale / Investigate deviations sooner / Build comparable process histories.
- To załatwia jednocześnie zarzut z rozdz. 11 o „pięciu ciasnych kartach w rzędzie".

### B3. „Explore what we can do" ✅
- ✅ Nagłówek `Is Q‑Tector a fit for your process?`, CTA `Request a process-fit review`.
- ✅ `trust2` usunięte (patrz A1).
- ✅ Zdjęcie zespołu → diagram `Sample → Guided assay → Quantitative result →
  Trend → Process decision`. Zrobiony jako `<ol>` z ikonami inline, nie jako jeden
  płaski SVG — etykiety zostają tłumaczalne, a czytnik ekranu czyta pięć kroków.
  Nazwy kroków są z audytu; noty parafrazują jego własną definicję at-line
  (rozdz. 6) i **nie zawierają claimu o czasie ani kalibracji**.
- Po drodze wycofane: 139 linii JS-a karuzeli kolażu, ~70 linii jego CSS-a,
  `images.collage` (typ, schemat, lib) i martwe `explore.badge`.

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

### News ✅ (cała sekcja)
1. ✅ Jedna etykieta `Read the full story`; `readStory` usunięte z typu, schematu
   i mapowania w `settings.ts`.
2. ✅ Podpis autora: `jobgerjon` (slug autora z WordPressa, wszedł przez
   `scripts/seed.mjs`) → **SG Papertronics**. 🟡 Prawdziwego imienia nie ma nigdzie
   w projekcie — do podmiany, gdy będzie znane (powiązane z D3).
3. ✅ Duplikat obrazu: **wszystkie sześć** dokumentów CBC26 dzieliło jeden cover
   236×213 (reszta ma 1080×675). `cbc26-relationships` oddaje obraz.
4. 🟡 Kategorie — piątka z audytu obowiązuje **nowe wpisy**; archiwum (przed 2026)
   zachowuje swoje etykiety (`Grant`, `Award`, `Investment`, `Event`, `Recognition`).
   Pierwsze podejście przepisało całe archiwum i zwinęło 6 z 10 wpisów do „Company",
   co niszczyło informację — cofnięte (`patch-news-categories-archive.mjs`).
   Reguła zapisana w opisie pola w `documents.ts`.
5. ✅ CTA nie obiecuje już newslettera („we'll keep you posted"), bo newslettera nie ma.
6. ✅ Closing CTA `Discuss your application`.

---

## CZĘŚĆ G. Kolejność wdrożenia

Kolejność z audytu (rozdz. 15), przefiltrowana przez to, co realnie odblokowane:

**Sprint 1 — zamknięty**
1. ✅ A1 rejestr claimów (kod + Sanity)
2. ✅ A5 poz. 1 — `<html lang>` per lokalizacja
3. ✅ A6 intencyjne CTA na wszystkich stronach
4. ✅ B2 + B4 — scalenie zdublowanych sekcji Home
5. ✅ B3 diagram `Sample → … → Process decision`
6. ✅ A3 hierarchia marki poza home
7. ✅ A5 — poz. 2–8 zrobione (hamburgery 44×44 były już OK, fallback `noscript`,
   przełącznik języka na home, podwójne „News" usunięte)
8. ✅ F/News — cała lista

**Zostało z części A, odblokowane:** A2 — sam komponent `StatusBadge` (przypisanie
badge'y czeka na macierz), A4 typografia (czeka na akceptację E2).

> Uwaga operacyjna: CDN Sanity (`useCdn:true` + `revalidate=300`) propaguje
> **niejednolicie** — trafialiśmy na buildy, w których część stron miała nowe dane,
> a część stare. Po migracji warto przebudować po chwili i sprawdzić wynik.

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
