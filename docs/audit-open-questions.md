# SG Papertronics — pytania blokujące wdrożenie audytu

Kontekst: `SG_Papertronics_website_audit_and_copy_recommendations.docx` (rozdz. 1–15).
Copy deck z audytu jest gotowy do wdrożenia, ale **część treści ma w dokumencie
jawny „warunek publikacji"** — nie wolno jej opublikować bez potwierdzenia. Poniżej
tylko te pozycje, których nie da się rozstrzygnąć po naszej stronie.

Status na dziś: pozycje **A** blokują P0 i P1. Pozycje **B–D** blokują pojedyncze sekcje.

---

## A. Macierz produktowa — blokuje najwięcej (audyt P0, rozdz. 6, 7, 14)

To jest krytyczna ścieżka. Bez niej nie ruszy tabela specyfikacji na Technology,
taksonomia na Applications ani żadna etykieta statusu.

Prosimy o tabelę, jeden wiersz na kombinację **analyte × sample matrix**:

| Kolumna | Przykład |
|---|---|
| Analyte | glucose |
| Sample matrix | culture media (S. cerevisiae, aerobic fed-batch) |
| Status | Available now / Commercially validated / Pilot-ready / In validation / In application development / Roadmap |
| Intended use | np. „process monitoring and decision support" — **nie** „release testing", chyba że jest na to walidacja |
| Measurement range | |
| Precision / CV | |
| Sample volume | |
| Time to result | |
| Sample preparation | |
| Throughput | |
| User calibration required? | tak / nie |

**Pytania dodatkowe:**
1. Czy „glucose and sucrose in culture media" to na dziś jedyny w pełni dostępny workflow?
2. Które matryce są potwierdzone, a które są dopiero do oceny z partnerem?

---

## B. Claimy do potwierdzenia (audyt rozdz. 14 — „Warunek")

Audyt każe wstrzymać publikację tych zdań do czasu potwierdzenia. Prosimy o TAK/NIE
przy każdym, osobno dla każdego wspieranego assaya:

| # | Claim | Pytanie |
|---|---|---|
| B1 | „Results in under five minutes" | Czy dotyczy **wszystkich** wspieranych workflows, czy tylko wybranych? Których? |
| B2 | „No user calibration required" | Jak wyżej — dla których assayów jest to prawdziwe? |
| B3 | „Release decisions" | Czy jest walidacja i intended use pozwalające mówić o decyzjach zwolnieniowych? Jeśli nie, zamieniamy na „support process decisions". |
| B4 | „Process intelligence" | Czy platforma robi dziś coś więcej niż storage / trends / comparison / export? Jeśli nie, zamieniamy na „structured process data". |
| B5 | „Trusted by" + logotypy | Dla każdej nazwy: to **customer**, **pilot partner**, **research collaborator** czy **consortium member**? Czy mamy zgodę na użycie nazwy i logotypu? |

---

## C. Formularz i dane osobowe — częściowo blokuje wdrożony już kod

Formularz został przebudowany (7 typów zapytania, walidacja, stany, RODO-notka).
Do uruchomienia brakuje:

1. **Skrzynka docelowa** — na jaki adres mają trafiać zapytania? Czy różne typy
   zapytania mają iść na różne adresy (np. `investor` → IR, `sales` → sprzedaż)?
2. **Dostawca wysyłki** — wdrożyliśmy integrację z Resend (klucz w `RESEND_API_KEY`).
   Czy akceptujecie Resend, czy ma to iść przez Wasz SMTP / HubSpot / inny CRM?
3. **Domena nadawcy** — potrzebujemy rekordów SPF/DKIM dla `sgpapertronics.com`,
   żeby wiadomości nie lądowały w spamie.
4. **Treść Privacy Notice** — formularz linkuje do niej w notce RODO. Potrzebny
   tekst (EN/NL/PL) albo decyzja, że linkujemy do jednej wersji EN.
5. **Terms** — jak wyżej: treść albo decyzja o rezygnacji z linku.
6. **Czas odpowiedzi** — copy obiecuje „within one business day". Potwierdzacie?

> ⚠️ **Do zgłoszenia klientowi jako incydent.** Dotychczasowy formularz na stronie
> **nie wysyłał nigdzie danych** — po kliknięciu „Send message" pokazywał komunikat
> o wysłaniu, a treść była porzucana w przeglądarce. Wszystkie zapytania złożone
> przez stronę do dnia wdrożenia tej poprawki zostały utracone. Warto sprawdzić,
> czy nie było innego kanału, którym te osoby próbowały się kontaktować.

---

## D. Treści, których nie da się napisać za klienta

### D1. Investors (rozdz. 9)
Audyt każe zastąpić ogólne „strong validation" liczbami. Potrzebujemy:
- liczba płacących klientów i aktywnych pilotaży
- liczba wdrożonych urządzeń, zużycie / reorder rate assay podów
- liczba zwalidowanych assayów i matryc
- rynki / kraje
- gotowość produkcyjna i status IP
- skład leadershipu i doradców, przeznaczenie środków z rundy
- czy potwierdzacie publicznie, że przygotowujecie **Series A**?

### D2. Case studies (rozdz. 5, 7)
Dla każdego z trzech przykładów (Beer-o-Meter, precision fermentation, PotatoSense):
problem, analyte, matryca, workflow, **mierzalny wynik**, status projektu, partner,
następny kamień milowy, cytat z przypisaniem (imię, rola, firma) + zgoda na publikację.

### D3. Zespół (rozdz. 8, 10)
- imiona, role, krótkie kompetencje i profile LinkedIn poszczególnych osób
- pochodzenie nazwy „Papertronics" i historia przejścia od paper-based microfluidics do Q-Tectora

### D4. Linki
- URL profilu LinkedIn firmy (dziś link w stopce prowadził donikąd — **tymczasowo go ukryliśmy**)

### D5. Sesja zdjęciowa (rozdz. 10) — koszt po stronie klienta
- Q-Tector **bez** oznaczenia Beer-o-Meter (hero, Technology)
- pełny zespół, kadr 16:9, widoczne twarze
- osobny portret leadershipu na Investors
- portrety indywidualne na About
- seria procesowa: pobranie próbki → skan QR → assay pod → reader → wynik → trend

---

## E. Decyzje kierunkowe (nie blokują, ale im szybciej tym taniej)

| # | Temat | Rekomendacja |
|---|---|---|
| E1 | Nawigacja buyer-first: `Technology · Applications · Case Studies · About · Resources` | Wymaga decyzji, czy powstaje sekcja Case Studies i Resources. |
| E2 | Zmiana fontów Montserrat → Manrope/Inter Tight + Inter | Zgadzamy się z audytem; do akceptacji brand ownera. |
| E3 | Główne CTA „Discuss your process" zamiast „Talk to us" | Do akceptacji. |
| E4 | Beer-o-Meter schodzi z hero do dedykowanego case study | To największa zmiana narracyjna — wymaga świadomej zgody. |
