// Rewrite every Polish string in Sanity: idiomatic copy instead of a literal
// translation of the EN deck, one consistent terminology, restored Polish
// diacritics (large parts of the PL documents had been stored without them)
// and Polish typography (en dash instead of a hyphen between clauses).
//
// Terminology, applied consistently across every document (industry register:
// the anglicisms Polish biotech teams actually use in the lab are kept, the
// grammar around them is fixed):
//   workflow        - kept, neuter and uninflected ("jedno workflow pomiarowe")
//   assay           - kept, masculine and inflected ("assay", "assayu", "assaye")
//   assay pod       - "wklad assay"   (was: "pody assay" / "kapsuly assay" / "assay pody")
//   at-line         - kept, uninflected ("analityka at-line", "pomiar at-line")
//   run / batch     - "seria"         (was: "przebieg" and "seria" mixed)
//   culture media   - "podloza hodowlane" (was: "media hodowlane" in half the fields)
//   feed strategy   - "strategia zasilania"
//
// Facts, claims, names, dates, prices and links are untouched; the Polish
// privacy notice is a faithful translation of the EN body, which the PL page
// was falling back to because privacy-pl had no body at all.
//
// Usage: node scripts/patch-pl-copy.mjs            (dry run)
//        node scripts/patch-pl-copy.mjs --commit   (write)
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
for (const line of existsSync(`${root}/.env.local`) ? readFileSync(`${root}/.env.local`, "utf8").split("\n") : []) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) throw new Error("Missing projectId/token in .env.local");

const client = createClient({ projectId, dataset, apiVersion: "2025-02-19", token, useCdn: false });

const QT = "Q‑Tector";   // non-breaking hyphen, as everywhere else in the dataset
const BOM = "Beer‑o‑Meter";

/* ------------------------------------------------------------------ pages */

const PAGES = {
  "home-pl": {
    hero: {
      eyebrow: `Analityka at-line dla procesów biologicznych`,
      titleLead: "Zobacz, co dzieje się w Twoim procesie",
      titleAccent: "- póki wciąż możesz zareagować.",
      subtitle: `${QT} łączy gotowe wkłady assay, kompaktowy czytnik i prowadzone krok po kroku cyfrowe workflow, żeby dostarczać porównywalne wyniki glukozy i sacharozy tuż przy fermentorze lub bioreaktorze. Na tych danych porównasz serie, dopracujesz strategię zasilania i przeniesiesz wiedzę procesową z R&D do produkcji.`,
      focus: "Obecny zakres analityczny: glukoza i sacharoza w podłożach hodowlanych",
      cta1: `Zobacz, jak działa ${QT}`,
      cta2: "Omówmy Twój proces",
    },
    intro: {
      brand: `SG Papertronics rozwija ${QT} - kompaktową platformę analityki at-line dla procesów biologicznych. ${BOM} to pierwsze komercyjne zastosowanie zbudowane na tej technologii. Wspólnie z partnerami przemysłowymi opracowujemy i walidujemy też nowe workflow assayów dla konkretnych analitów i matryc próbek.`,
    },
    benefits: {
      subtitle: "Proces biologiczny potrafi zmienić się szybciej, niż dotrą wyniki z laboratorium.",
      heading: "Mierz w trakcie serii,",
      headingAccent: "a nie wtedy, gdy moment na reakcję już minął.",
      leadPre: `${QT} przenosi prowadzone krok po kroku pomiary tuż do fermentora, bioreaktora lub linii produkcyjnej, `,
      leadAccent: "dzięki czemu zespół ma istotne procesowo wyniki jeszcze w trakcie serii",
      leadPost: ".",
      cards: [
        { _key: "optymalizuj-pod-o-a-i-za", title: "Optymalizuj podłoża i strategie zasilania", text: "Porównuj zużycie substratu między szczepami, podłożami i strategiami zasilania." },
        { _key: "przeno-wiedz-mi-dzy-skal", title: "Przenoś wiedzę między skalami", text: "Korzystaj z jednego powtarzalnego workflow pomiarowego - od rozwoju przez pilotaż aż do produkcji." },
        { _key: "badaj-odchylenia-szybcie", title: "Badaj odchylenia szybciej", text: "Zbieraj dane procesowe, póki jest jeszcze czas, żeby je zrozumieć i zareagować." },
        { _key: "buduj-por-wnywalne-histo", title: "Buduj porównywalne historie procesu", text: "Zapisuj wyniki, śledź trendy i eksportuj dane z eksperymentów, serii i partii produkcyjnych." },
      ],
    },
    lifecycle: {
      heading: "Jedno workflow pomiarowe",
      headingAccent: "od pierwszego eksperymentu do produkcji",
      closing: "Każdy wynik staje się częścią ustrukturyzowanych danych procesowych, które można przeglądać, porównywać i eksportować.",
      cols: [
        { _key: "s01", num: "01", title: "R&D - nauka", text: "Porównuj szczepy, podłoża i warunki dzięki częstym pomiarom." },
        { _key: "s02", num: "02", title: "Pilotaż - walidacja", text: "Przetestuj workflow na reprezentatywnych seriach i ustal, jak wyniki mają wspierać decyzje procesowe." },
        { _key: "s03", num: "03", title: "Produkcja - standaryzacja", text: "Korzystaj ze zwalidowanej procedury, żeby śledzić trendy, porównywać partie i szukać przyczyn odchyleń." },
      ],
    },
    howWeWork: {
      eyebrow: "Jak pracujemy",
      heading: "Zaczynamy od Twojego pytania procesowego",
      cta: "Omówmy pilotaż",
      steps: [
        { _key: "s01", num: "01", title: "Zdefiniowanie pytania", text: "Określamy organizm, matrycę, analit i decyzję, którą ma wspierać wynik." },
        { _key: "s02", num: "02", title: "Ocena dopasowania", text: "Sprawdzamy, czy assay i workflow pasują do Twojego procesu." },
        { _key: "s03", num: "03", title: "Walidacja metody", text: "Walidujemy metodę na rzeczywistych próbkach i seriach." },
        { _key: "s04", num: "04", title: "Wdrożenie do rutyny", text: "Przenosimy workflow do codziennego użycia." },
      ],
    },
    explore: {
      heading: `Czy ${QT} pasuje`,
      headingAccent: "do Twojego procesu?",
      body: `Powiedz nam, co produkujesz, co potrzebujesz zmierzyć i jaką decyzję ma wspierać wynik. Ustalimy, czy pasuje istniejące workflow ${QT}a - czy raczej ma sens ścieżka rozwoju nowego zastosowania.`,
      cta1: "Sprawdź dopasowanie do procesu",
      cta2: "Zobacz technologię",
      trust1: "Odpowiadamy w ciągu jednego dnia roboczego",
      flow: [
        { _key: "f01", num: "01", label: "Próbka", note: "Operator pobiera niewielką próbkę z trwającego procesu." },
        { _key: "f02", num: "02", label: "Prowadzony assay", note: "Gotowy wkład assay, prowadzony krok po kroku instrukcją z kodu QR." },
        { _key: "f03", num: "03", label: "Wynik liczbowy", note: "Porównywalna wartość glukozy lub sacharozy dla tej próbki." },
        { _key: "f04", num: "04", label: "Trend", note: "Wynik dołącza do historii serii, obok wcześniejszych próbek." },
        { _key: "f05", num: "05", label: "Decyzja procesowa", note: "Zasilanie, moment zakończenia albo eskalacja - jeszcze w trakcie serii." },
      ],
    },
    partners: { heading: "Wybrani klienci", headingAccent: "i partnerzy naukowi" },
    contact: {
      badge: "Kontakt",
      heading: "Kontrola bliżej Twojej",
      headingAccent: "biologii",
      rightHeadingLine1: "Porozmawiajmy o",
      rightHeadingLine2: "Twoim procesie.",
      rightBody: `Napisz nam, z jakim organizmem pracujesz, na jakim etapie jest proces i jaki masz cel - podpowiemy, gdzie sprawdzi się ${QT}.`,
      ph: { name: "Imię i nazwisko", email: "E-mail", message: "Wiadomość" },
      submit: "Wyślij wiadomość",
      formSent: "Dziękujemy - odezwiemy się wkrótce. ✓",
      emailLabel: "E-mail",
      visitLabel: "Odwiedź nas",
      visitValue: "Blauwborgje 31, 9747 AW Groningen, NL",
      beerLabel: `${BOM} - zastosowanie ${QT}a w browarnictwie`,
    },
    footer: {
      tagline: "Praktyczna analityka procesowa dla układów żywych.",
      exploreTitle: "Na skróty",
      companyTitle: "Firma",
      connectTitle: "Kontakt",
      connectEmail: "E-mail",
      connectLinkedIn: "LinkedIn",
      privacy: "Prywatność",
      terms: "Regulamin",
      copyright: "© 2026 SG Papertronics. Blauwborgje 31, 9747 AW Groningen, NL.",
    },
    images: {
      heroBg: { alt: "Laboratorium SG Papertronics" },
      heroCollage: {
        device: { alt: `Czytnik ${QT} stojący na tanku fermentacyjnym` },
        field: { alt: "Rzędy zielonego pola uprawnego" },
        lab: { alt: "Mikroskop i statywy z próbkami na blacie laboratoryjnym" },
        tanks: { alt: "Stalowe tanki fermentacyjne przed browarem nocą" },
      },
      lifecycle: [
        { _key: "l0", alt: "Analiza celów - przegląd danych procesowych" },
        { _key: "l1", alt: "Pilotaż i testy - pomiar próbki" },
        { _key: "l2", alt: "Wdrożenie - linia produkcyjna" },
      ],
    },
    seo: {
      title: "SG Papertronics - analityka at-line dla procesów biologicznych",
      description: `${QT} to platforma pomiarowa at-line stworzona dla procesów biologicznych. Zamień niewielkie próbki w dane, na których da się oprzeć decyzje - od rozwoju aż do produkcji.`,
    },
  },

  "technology-pl": {
    hero: {
      lead: `${QT} zamienia niewielkie próbki procesowe w porównywalne wyniki tuż przy stanowisku pracy - zespół może reagować w trakcie serii i uczyć się z serii na serię.`,
      body1: `${QT} łączy kompaktowy czytnik, gotowe wkłady assay, instrukcje prowadzone kodem QR i połączony z chmurą zapis wyników. Wykonuj istotne procesowo pomiary tuż przy fermentorze lub bioreaktorze - bez czekania na laboratorium centralne.`,
      image: { alt: `Czytnik ${QT} stojący na tanku fermentacyjnym` },
      primaryCta: { href: "#contact", label: "Zobacz dostępne assaye", style: "primary" },
      secondaryCta: { href: "/applications", label: "Zobacz zastosowania", style: "ghost" },
      title: "Technologia",
      titleAccent: QT,
    },
    steps: [
      { _key: "st0", n: "01", title: "Pobierz próbkę", text: "Pobierz niewielką próbkę z hodowli, fermentacji lub strumienia produktu." },
      { _key: "st1", n: "02", title: "Wykonaj prowadzony assay", text: "Użyj gotowego wkładu assay i postępuj zgodnie z workflow w aplikacji." },
      { _key: "st2", n: "03", title: "Odczytaj wynik", text: `${QT} podaje czytelny wynik przez połączony czytnik.` },
      { _key: "st3", n: "04", title: "Śledź proces", text: "Wyniki są zapisywane i służą do analizy trendów, porównywania serii i eksportu." },
      { _key: "st4", n: "05", title: "Działaj na danych", text: "Wykorzystaj wynik przy decyzjach o zasilaniu, momencie zakończenia procesu, formulacji, stabilizacji lub diagnostyce odchyleń." },
    ],
    focus: {
      eyebrow: "Obecny zakres analityczny",
      heading: "Dostępne workflow: glukoza i sacharoza",
      body: `${QT} koncentruje się dziś na pomiarze glukozy i sacharozy w podłożach hodowlanych. Typowe zastosowania to rozwój fermentacji, optymalizacja podłoży, praca nad strategią zasilania i monitorowanie produkcji.`,
      image: { alt: "Monitorowanie procesu przy fermentorze" },
      tags: ["Glukoza i sacharoza", "Podłoża hodowlane", "Fermentacja", "Hodowla komórkowa", "Optymalizacja podłoży", "Strategia zasilania", "Monitorowanie produkcji"],
    },
    builtForScale: {
      heading: "Stworzony do skalowania",
      body1: "Procesy często nie skalują się dlatego, że dane zebrane na wczesnym etapie rozwoju nie są dość ustrukturyzowane, częste ani porównywalne.",
      body2: `${QT} pomaga budować zbiory danych procesowych już od pierwszych eksperymentów. Dzięki powtarzalnym workflow pomiarowym i połączonemu zapisowi danych zespół porównuje eksperymenty, śledzi trendy i przenosi wiedzę procesową do pilotażu i produkcji.`,
    },
    seo: {
      title: `Technologia ${QT} - SG Papertronics`,
      description: "Kompaktowa platforma pomiarowa at-line do istotnych procesowo pomiarów: czytnik, gotowe wkłady assay, workflow prowadzone kodem QR i dane w chmurze.",
    },
  },

  "applications-pl": {
    hero: {
      eyebrow: "Zastosowania",
      title: "Stworzony do produkcji",
      titleAccent: "biologicznej",
      lead: `${QT} dopasowuje się do tego, jak różne zespoły pracują z procesami biologicznymi - od wczesnego rozwoju i optymalizacji, przez serie pilotażowe, aż do monitorowania produkcji.`,
      image: { alt: "Fermentacja w tankach browarniczych" },
      primaryCta: { href: "#contact", label: "Porozmawiajmy o Twoim procesie", style: "primary" },
      secondaryCta: { href: "/technology", label: "Zobacz technologię", style: "ghost" },
    },
    categoriesEyebrow: `Gdzie sprawdza się ${QT}`,
    categoriesHeading: "Cztery sposoby, w jakie zespoły z niego korzystają",
    categories: [
      {
        _key: "cat0",
        tag: "Biotechnologia i fermentacja precyzyjna",
        title: "Zrozum, jak zachowują się Twoje hodowle",
        text: "Monitoruj zużycie składników i wydajność w różnych szczepach, podłożach i na kolejnych etapach skalowania.",
        image: { alt: "Zrozum, jak zachowują się Twoje hodowle" },
        points: [
          "Śledź dostępność składników w trakcie rozwoju hodowli",
          "Porównuj podłoża i strategie zasilania",
          "Buduj zbiory danych pod decyzje o skalowaniu",
        ],
      },
      {
        _key: "cat1",
        tag: "CDMO i rozwój kontraktowy",
        title: "Standaryzuj monitorowanie w projektach",
        text: "Spójne workflow at-line dla wczesnego rozwoju, transferu procesu i diagnostyki odchyleń.",
        image: { alt: "Standaryzuj monitorowanie w projektach" },
        points: [
          "Monitoruj kluczowe parametry w projektach klientów",
          "Ogranicz zależność od opóźnionych wyników",
          "Buduj czytelne zbiory danych do raportów dla klienta",
        ],
      },
      {
        _key: "cat2",
        tag: "Żywność i napoje fermentowane",
        title: "Kontroluj żywe produkty lepszymi danymi",
        text: "Ułatw istotne procesowo pomiary w rozwoju i w produkcji.",
        image: { alt: "Kontroluj żywe produkty lepszymi danymi" },
        points: [
          "Monitoruj cukry resztkowe w trakcie fermentacji",
          "Wiedz, kiedy fermentacja się kończy",
          "Ogranicz zmienność między seriami",
        ],
      },
      {
        _key: "cat3",
        tag: "Agri-food i biotechnologia stosowana",
        title: "Wgląd w złożone systemy biologiczne",
        text: "Otwarty na rozwój nowych assayów i workflow pod konkretne zastosowanie.",
        image: { alt: "Wgląd w złożone systemy biologiczne" },
        points: [
          "Twórz praktyczne workflow pomiarowe",
          "Monitoruj istotne procesowo anality",
          "Już działa: PotatoSense - Fascinating / ISPT",
        ],
      },
    ],
    caseStudiesEyebrow: "Studia przypadków",
    caseStudiesHeading: `${QT} w praktyce`,
    cta: {
      heading: "Masz konkretny proces na myśli?",
      body: `Napisz nam, z jakim organizmem pracujesz, na jakim etapie jest proces i jaki masz cel - pokażemy, gdzie sprawdzi się ${QT} i jak szybko możesz zacząć.`,
      button: { href: "#contact", label: "Porozmawiajmy", style: "primary" },
    },
    seo: {
      title: "Zastosowania - SG Papertronics",
      description: `Zastosowania ${QT}a w biotechnologii i fermentacji precyzyjnej, w CDMO, w żywności i napojach fermentowanych oraz w agri-food i biotechnologii stosowanej.`,
    },
  },

  "investors-pl": {
    hero: {
      title: "Budujemy dostępną warstwę analityki procesowej",
      titleAccent: "dla produkcji biologicznej",
      body1: "SG Papertronics tworzy kompaktowe platformy analityczne, które pomagają firmom monitorować procesy biologiczne i fermentacyjne na danych, na których da się oprzeć decyzje - bliżej produkcji, prościej i w sposób skalowalny.",
      body2: `Przygotowujemy rundę Series A, żeby przyspieszyć ekspansję komercyjną i wprowadzić ${QT} do kolejnych środowisk biotech, fermentacji, CDMO i food-tech.`,
      image: { alt: "SG Papertronics" },
      primaryCta: { href: "mailto:m.grajewski@sgpapertronics.com", label: "Poproś o deck inwestorski", style: "primary" },
      secondaryCta: { href: "mailto:m.grajewski@sgpapertronics.com", label: "Kontakt dla inwestorów", style: "ghost" },
    },
    problem: {
      eyebrow: "Co rozwiązujemy",
      heading: "Procesy biologiczne są dynamiczne - dane docierają za późno",
      body: `Bez częstych danych procesowych zespoły wykrywają odchylenia dopiero po zakończeniu serii. ${QT} przenosi pomiar z opóźnionej analizy laboratoryjnej do miejsca pracy - tak, żeby wynik wspierał decyzję procesową.`,
    },
    whyNow: {
      eyebrow: "Dlaczego teraz",
      heading: "Produkcja biologiczna się skaluje - pomiar procesu nie nadąża",
      body1: "Fermentacja precyzyjna, rolnictwo komórkowe, żywność funkcjonalna i produkcja kontraktowa zależą od rozumienia i kontroli procesów z udziałem żywych organizmów.",
      body2: "Wiele zespołów wciąż podejmuje kluczowe decyzje przy ograniczonych danych z bieżącego procesu. SG Papertronics odpowiada na tę potrzebę.",
      painPoints: [
        "Próbki jadą do laboratoriów centralnych - wyniki przychodzą za późno",
        "Zespoły rozwojowe z trudem porównują serie",
        "Produkcja nie ma prostych narzędzi do częstego monitorowania",
        "CDMO potrzebują skalowalnych, ustandaryzowanych metod",
      ],
    },
    platform: {
      eyebrow: "Platforma",
      heading: `${QT}: analityka at-line dla procesów biologicznych`,
      body: "Kompaktowe lab-in-a-box do istotnych procesowo pomiarów - proste w codziennym użyciu, a jednocześnie tworzące ustrukturyzowane dane.",
      features: ["Kompaktowy czytnik", "Gotowe wkłady assay", "Workflow prowadzone kodem QR", "Instrukcje w aplikacji", "Zapis wyników w chmurze", "Analiza trendów i eksport danych"],
    },
    marketEyebrow: "Szansa rynkowa",
    marketHeading: "Pomiar procesu staje się wąskim gardłem produkcji biologicznej",
    marketSubtitle: "Firmy pracujące z procesami mikrobiologicznymi, enzymatycznymi lub komórkowymi potrzebują częstszych i łatwiej dostępnych danych.",
    market: ["Firmy fermentacji precyzyjnej", "CDMO i rozwój kontraktowy", "Food-tech i napoje funkcjonalne", "Biotechnologia przemysłowa", "Projekty innowacyjne w agri-food", "Ośrodki badawcze i pilotażowe"],
    mission: {
      eyebrow: "Nasza misja",
      heading: "Sprawić, żeby częsty i użyteczny pomiar procesu był praktyczny",
      headingAccent: "dla każdego zespołu, który rozwija i produkuje z udziałem biologii",
      body: "Im wcześniej zespół zaczyna mierzyć, tym szybciej się uczy. Im bardziej konsekwentnie mierzy, tym łatwiej skalować.",
    },
    seriesAEyebrow: "Fokus rundy Series A",
    seriesAHeading: `Skalowanie ${QT}a - komercyjnie i technicznie`,
    seriesA: [
      { _key: "s0", title: "Ekspansja komercyjna", text: "Rozwój sprzedaży do klientów biotech, fermentacji, CDMO i food-tech." },
      { _key: "s1", title: "Portfolio produktu i assayów", text: `Poszerzenie zakresu zastosowań ${QT}a o kolejne assaye.` },
      { _key: "s2", title: "Platforma danych", text: "Wzmocnienie oprogramowania: historia wyników, trendy, porównania serii, raporty." },
      { _key: "s3", title: "Skalowanie produkcji", text: "Gotowość produkcyjna urządzeń, wkładów assay i wsparcia." },
      { _key: "s4", title: "Partnerstwa aplikacyjne", text: "Głębsza współpraca przy walidacji nowych zastosowań." },
    ],
    thesisEyebrow: "Teza inwestycyjna",
    thesisHeading: "Warstwa kontroli procesu dla dostępnej biomanufaktury",
    thesis: [
      "Technologia platformowa z wieloma rynkami zastosowań",
      `Pierwszy przypadek użycia zwalidowany przez ${BOM}`,
      "Rosnące znaczenie pomiaru w fermentacji, biotech i CDMO",
      "Wyraźne przejście w stronę ustrukturyzowanych danych procesowych",
      "Skalowalny model materiałów zużywalnych oparty na wkładach assay",
      "Silne regionalne powiązania innowacyjne w północnej Holandii",
      "Misja zgodna z przyszłością produkcji biologicznej",
    ],
    benefits: [
      { _key: "b0", tag: "Biotechnologia i fermentacja precyzyjna", text: "Monitoruj zużycie składników, porównuj podłoża i strategie zasilania oraz twórz ustrukturyzowane dane.", benefit: "Szybsze cykle uczenia się i lepsze rozumienie procesu." },
      { _key: "b1", tag: "CDMO", text: "Standaryzuj monitorowanie w projektach klientów i dostarczaj czytelniejsze dane procesowe.", benefit: "Bardziej skalowalne workflow i lepsze raporty dla klientów." },
      { _key: "b2", tag: "Żywność i napoje fermentowane", text: "Monitoruj cukry, kwasowość i stabilność w trakcie fermentacji i walidacji trwałości.", benefit: "Lepsza kontrola spójności, jakości i ryzyka regulacyjnego." },
      { _key: "b3", tag: "Biotechnologia stosowana i agri-food", text: "Wspieraj praktyczne workflow pomiarowe w złożonych systemach biologicznych.", benefit: "Lepsze powiązanie R&D, pilotażu i wdrożenia." },
    ],
    seo: {
      title: "Relacje inwestorskie - SG Papertronics",
      description: `SG Papertronics przygotowuje rundę Series A - dostępna technologia kontroli procesu at-line (${QT}) dla biotech, fermentacji, CDMO i food-tech.`,
    },
  },

  "about-pl": {
    hero: {
      eyebrow: "O nas",
      title: "Przybliżamy praktyczną analitykę procesową",
      titleAccent: "do produkcji biologicznej.",
      lead: `SG Papertronics tworzy kompaktową technologię analityczną dla zespołów pracujących z fermentacją, biotechnologią i innymi procesami biologicznymi. Nasza platforma ${QT} łączy prowadzone assaye at-line z połączonym zapisem danych - żeby zespoły uczyły się wcześniej, reagowały szybciej i skalowały w oparciu o mocniejsze dowody.`,
      image: { alt: "Zespół SG Papertronics" },
      imageCaption: "Zespół · Groningen",
      primaryCta: { href: "#contact", label: `Poznaj ${QT}`, style: "primary" },
      secondaryCta: { href: "/technology", label: "Napisz do nas", style: "ghost" },
    },
    whyWeExist: {
      eyebrow: "Dlaczego istniejemy",
      heading: "Lepsze dane procesowe nie są zarezerwowane dla dużych laboratoriów",
      body1: "Uważamy, że lepsze dane procesowe nie powinny być dostępne tylko w dużych laboratoriach albo na etapie końcowej kontroli jakości. Zespoły tworzące żywe produkty potrzebują praktycznych, częstych i użytecznych pomiarów w całym rozwoju, optymalizacji i produkcji.",
      body2: `Nasza główna platforma, ${QT}, łączy pomiar at-line, prowadzone workflow i połączony zapis danych w jednym kompaktowym systemie. Pomaga zespołom rozumieć proces wcześniej, reagować szybciej i skalować pewniej.`,
      image: { alt: "Pomiar at-line w laboratorium SG Papertronics" },
    },
    valuesEyebrow: `Co daje ${QT}`,
    valuesHeading: "Rozumiej wcześniej, reaguj szybciej, skaluj pewniej",
    values: [
      { _key: "v0", title: "Rozumiej wcześniej", text: "Praktyczne, częste pomiary w całym rozwoju, optymalizacji i produkcji - nie tylko w późnej kontroli jakości." },
      { _key: "v1", title: "Reaguj szybciej", text: "Pomiar at-line, prowadzone workflow i połączony zapis danych w jednym kompaktowym systemie, blisko procesu." },
      { _key: "v2", title: "Skaluj pewniej", text: "Ustrukturyzowane dane procesowe, które przenoszą wiedzę od pierwszego eksperymentu aż do produkcji." },
    ],
    mission: {
      eyebrow: "Nasza misja",
      heading: "Sprawić, żeby częsty i użyteczny pomiar procesu był praktyczny",
      headingAccent: "dla każdego zespołu, który rozwija i produkuje z udziałem biologii.",
      lead: "Nasze doświadczenie łączy biotechnologię, mikroprzepływy, rozwój assayów, inżynierię urządzeń i praktykę kontroli procesu w realnych warunkach. Od browarnictwa i żywności fermentowanej po biotechnologię, fermentację precyzyjną i środowiska CDMO - nasza misja pozostaje ta sama:",
      visionEyebrow: "Nasza wizja",
      vision: "Przyszłość, w której produkcją biologiczną kierują aktualne, porównywalne dane - od pierwszego eksperymentu po każdą serię produkcyjną.",
    },
    partnersLabel: "Współpracujemy z przemysłem i nauką",
    seo: {
      title: "O nas - SG Papertronics",
      description: "SG Papertronics tworzy dostępną technologię analityczną dla firm pracujących z procesami biologicznymi i fermentacyjnymi.",
    },
  },
};

/* ----------------------------------------------------------- case studies */

const CASES = {
  "caseStudy-agri-pl": {
    tag: "Agri-food",
    title: "PotatoSense - Fascinating / ISPT",
    description: `Workflow pomiarowe ${QT}a w służbie pytań procesowych agri-food, w ramach regionalnej współpracy innowacyjnej.`,
  },
  "caseStudy-beer-pl": {
    tag: "Browarnictwo",
    title: `${BOM}: kontrola jakości w browarze`,
    description: `Nasze pierwsze komercyjne zastosowanie ${QT}a - szybkie pomiary at-line cukrów, alkoholu i kluczowych parametrów dla browarów rzemieślniczych, tuż przy tanku.`,
  },
  "caseStudy-ferment-pl": {
    tag: "Fermentacja precyzyjna",
    title: "Monitorowanie podłoży i zasilania między seriami",
    description: "Śledzenie glukozy i sacharozy w podłożach hodowlanych, żeby zespoły mogły porównywać strategie zasilania i reagować w trakcie serii - a nie kilka dni po niej.",
  },
};

/* ------------------------------------------------------------------- news */
/* Titles, leads and SEO only: the article bodies were imported with correct
   Polish and are left untouched, so no fact in a published story moves. */

const NEWS = {
  "newsArticle-cbc26-future-pl": {
    title: "CBC26 w Filadelfii: jak wygląda przyszłość browarnictwa",
    excerpt: "Craft Brewers Conference & BrewExpo America 2026 pokazała jedno: branża browarnicza szybko się zmienia, a browary aktywnie szukają mądrzejszych i bardziej praktycznych sposobów, żeby się do tej zmiany dostosować.",
  },
  "newsArticle-cbc26-relationships-pl": {
    title: `${BOM} na CBC26: relacje, walidacja rynku i przyszłość kontroli jakości w browarnictwie`,
    excerpt: `CBC26 i BrewExpo America w Filadelfii były wyjątkowo ważnym kamieniem milowym dla ${BOM}.`,
  },
  "newsArticle-ces-2025-pl": {
    title: "Spotkajmy się na CES 2025 - zwiększ efektywność produkcji!",
    excerpt: "Nasze rozwiązanie lab-in-a-box dla sektora spożywczego zaprezentowaliśmy na CES 2025 w Las Vegas.",
  },
  "newsArticle-finally-here-pl": {
    title: "Wreszcie jesteśmy!",
    excerpt: `Premierowe wydarzenie ${BOM} zgromadziło klientów, inwestorów i partnerów, żeby wspólnie uczcić efekt pracy zespołu.`,
  },
  "newsArticle-flinc-pitch-pl": {
    title: "Zwycięski pitch na Pitch Camp by Flinc",
    excerpt: "Szybkie testowanie piwa rzemieślniczego to specjalność SG Papertronics - dzięki niej zdobyliśmy korzystną pożyczkę 20 000 EUR na Flinc Pitch Camp.",
  },
  "newsArticle-kvk-top-100-pl": {
    title: "KVK Innovatie Top 100 - edycja 2025",
    excerpt: "Wielka wiadomość! SG Papertronics zakwalifikowało się do KVK Innovatie Top 100.",
  },
  "newsArticle-living-fermentation-pl": {
    title: "Od żywej fermentacji do użytecznych danych: rozwój produktu w Groningen",
    excerpt: "Napoje fermentowane nie bez powodu zyskują uwagę. Niedawny artykuł w Dagblad van het Noorden przybliżył pracę Florisa i jego zespołu w Groningen, którzy tworzą żywe produkty i napoje z wyraźną ambicją kulinarną.",
  },
  "newsArticle-mit-grant-pl": {
    title: "Levels Diagnostics, Omnigen i SG Papertronics z grantem MIT na współpracę B+R",
    excerpt: "Łącząc wiedzę z rozwoju biomarkerów klinicznych, bioinformatyki i mikroprzepływów papierowych, konsorcjum opracuje nowatorski test uszkodzenia wątroby.",
  },
  "newsArticle-mit-subsidy-pl": {
    title: "SG Papertronics i EV Biotech z subwencją B+R MIT",
    excerpt: "W rocznym projekcie opracujemy czujnik glukozy dla fermentacji mikrobiologicznej, zmniejszając objętość próbek i nakład pracy.",
  },
  "newsArticle-nom-rug-pl": {
    title: "NOM i RUG Holding wspólnie inwestują na wczesnym etapie",
    excerpt: `${BOM} to wsparcie dla małych browarów: system plug-and-play, który w kilka minut mierzy barwę, goryczkę, kwasowość, cukier i alkohol.`,
  },
};

/* --------------------------------------------------- siteSettings (PL arm) */
/* internationalized-array fields: only the entry keyed "pl" is replaced. */

const SETTINGS_PL = {
  footerTagline: "Praktyczna analityka procesowa dla układów żywych.",
  navCtaLabel: "Napisz do nas",
  "footerColumns[_key==\"explore\"].title": "Na skróty",
  "news.heroTitle": "Nowości i",
  "news.heroAccent": "kamienie milowe",
  "news.heroLead": "Kamienie milowe produktu, wydarzenia, granty, partnerstwa i ogłoszenia firmowe SG Papertronics.",
  "news.listDesc": `Aktualności SG Papertronics - kamienie milowe ${QT}a, jego browarnicze zastosowanie ${BOM}, wydarzenia, granty, partnerstwa i ogłoszenia firmowe.`,
  "news.readMore": "Przeczytaj całość",
  "news.allNews": "Wszystkie aktualności",
  "news.articleCta": "Porozmawiajmy o Twoim procesie",
  "news.ctaHeading": "Masz na myśli konkretne zastosowanie?",
  "news.ctaBody": `Napisz nam, z jakim organizmem pracujesz, na jakim etapie jest proces i jaki analit Cię interesuje - odpowiemy, czy pasuje istniejące workflow ${QT}a, czy raczej ma sens ścieżka rozwoju nowego zastosowania.`,
  "news.ctaButton": "Porozmawiajmy o zastosowaniu",
  "news.comingSoon": "Pełny artykuł już wkrótce.",
  "news.byPrefix": "Autor:",
  "news.categoryDefault": "Firma",
};

/* ------------------------------------------------------ privacy notice PL */
/* privacy-pl had no body at all, so the Polish page was serving the English
   notice through the deliberate fallback in sanity/lib/privacy.ts. This is a
   faithful translation of privacy-en; no legal meaning is added or dropped. */

const PRIVACY_PL = [
  ["h2", "Kto jest administratorem"],
  ["normal", "Za dane osobowe opisane w tej informacji odpowiada SG Papertronics B.V., Blauwborgje 31, 9747 AW Groningen, Holandia. Możesz się z nami skontaktować pod adresem contact@sgpapertronics.com."],
  ["normal", "Ta informacja wyjaśnia, jakie dane osobowe przetwarzamy, gdy korzystasz z sgpapertronics.com lub kontaktujesz się z nami, dlaczego to robimy i jakie masz prawa."],
  ["h2", "Jakie dane zbieramy"],
  ["normal", "Formularz kontaktowy: imię i nazwisko, służbowy adres e-mail, firmę lub organizację, wybrany rodzaj zapytania oraz treść wiadomości. O tym, co w niej napiszesz, decydujesz Ty."],
  ["normal", "Korespondencja: wiadomości, które do nas wysyłasz, i nasze odpowiedzi."],
  ["normal", "Logi techniczne: nasz dostawca hostingu zapisuje standardowe dane serwerowe, takie jak adres IP, typ przeglądarki i żądana strona, żeby strony mogły być wyświetlane, a serwis pozostawał bezpieczny."],
  ["h2", "Dlaczego przetwarzamy te dane i na jakiej podstawie"],
  ["normal", "Żeby odpowiedzieć na Twoje zapytanie i - jeśli to zasadne - przygotować lub wykonać umowę z Tobą albo z Twoją organizacją."],
  ["normal", "Żeby prowadzić, zabezpieczać i ulepszać stronę, co stanowi nasz prawnie uzasadniony interes."],
  ["normal", "Nie wykorzystujemy Twoich danych do zautomatyzowanego podejmowania decyzji i ich nie sprzedajemy."],
  ["h2", "Kto jeszcze ma do nich dostęp"],
  ["normal", "Dostawcy usług, którzy hostują stronę, przechowują jej treści i obsługują naszą pocztę, przetwarzają dane na nasze polecenie i nie mogą wykorzystywać ich do własnych celów."],
  ["normal", "Danymi dzielimy się z innymi podmiotami wyłącznie wtedy, gdy wymaga tego prawo."],
  ["h2", "Jak długo je przechowujemy"],
  ["normal", "Zapytanie przechowujemy tak długo, jak jest nam potrzebne, żeby Ci odpowiedzieć i zachować zapis naszych kontaktów biznesowych, a następnie je usuwamy. Logi serwera przechowujemy krótko - dla bezpieczeństwa i diagnostyki."],
  ["h2", "Pliki cookie i analityka"],
  ["normal", "Nie stosujemy cookies reklamowych i nie sprzedajemy Twoich danych ani nie udostępniamy ich reklamodawcom."],
  ["normal", "Za Twoją zgodą korzystamy z Google Analytics, żeby sprawdzać, jak używana jest strona, i móc ją ulepszać. Narzędzie zapisuje plik cookie w Twojej przeglądarce i przesyła dane o korzystaniu, w tym skrócony adres IP, do Google jako naszego dostawcy usług."],
  ["normal", "Analityka działa tylko wtedy, gdy ją zaakceptujesz. Pytamy przy pierwszej wizycie, do momentu Twojej zgody nic nie mierzymy, a decyzję możesz zmienić w każdej chwili przez „Ustawienia cookie” na dole każdej strony. Wszystko inne, co zapisujemy w Twojej przeglądarce, jest niezbędne do wyświetlenia stron, o które prosisz."],
  ["h2", "Twoje prawa"],
  ["normal", "Możesz poprosić nas o kopię swoich danych osobowych oraz o ich sprostowanie, usunięcie lub ograniczenie przetwarzania. Możesz wnieść sprzeciw wobec przetwarzania opartego na naszym prawnie uzasadnionym interesie i poprosić o przekazanie danych w formacie umożliwiającym przeniesienie."],
  ["normal", "Napisz na contact@sgpapertronics.com - odpowiemy w ciągu miesiąca. Masz również prawo wnieść skargę do holenderskiego organu ochrony danych (Autoriteit Persoonsgegevens)."],
  ["h2", "Zmiany"],
  ["normal", "Aktualizujemy tę informację, gdy zmienia się sposób, w jaki przetwarzamy dane osobowe. Data powyżej wskazuje obowiązującą wersję."],
];

/* ----------------------------------------------------------------- runner */

const commit = process.argv.includes("--commit");

/** Merge `patch` into `base`, replacing arrays of objects entry-by-entry on
 *  `_key` so image asset references and other untouched fields survive. */
function merge(base, patch) {
  if (Array.isArray(patch)) {
    if (!Array.isArray(base)) return patch;
    return patch.map((p) => {
      if (p && typeof p === "object" && p._key) {
        const b = base.find((x) => x && x._key === p._key);
        return b ? merge(b, p) : p;
      }
      return p;
    });
  }
  if (patch && typeof patch === "object") {
    const out = { ...(base && typeof base === "object" ? base : {}) };
    for (const [k, v] of Object.entries(patch)) out[k] = merge(out[k], v);
    return out;
  }
  return patch;
}

/** Replace the "pl" entry of an internationalized-array field in place. */
function setPl(arr, value) {
  if (!Array.isArray(arr)) return [{ _key: "pl", value }];
  const out = arr.map((e) => (e && e._key === "pl" ? { ...e, value } : e));
  return out.some((e) => e && e._key === "pl") ? out : [...out, { _key: "pl", value }];
}

const changes = [];

function diffDoc(id, before, patch) {
  const merged = merge(before, patch);
  const flat = (o, p = "", acc = {}) => {
    if (o && typeof o === "object") {
      for (const [k, v] of Object.entries(o)) {
        if (k.startsWith("_") || k === "asset") continue;
        flat(v, p ? `${p}.${k}` : k, acc);
      }
    } else if (typeof o === "string") acc[p] = o;
    return acc;
  };
  const a = flat(before), b = flat(merged);
  for (const k of Object.keys(b)) if (a[k] !== b[k]) changes.push({ id, field: k, from: a[k] ?? "(empty)", to: b[k] });
  return merged;
}

const tx = client.transaction();

for (const [id, patch] of Object.entries({ ...PAGES, ...CASES })) {
  const doc = await client.getDocument(id);
  if (!doc) { console.warn(`! missing ${id}`); continue; }
  const merged = diffDoc(id, doc, patch);
  const { _id, _rev, _createdAt, _updatedAt, _type, ...fields } = merged;
  tx.patch(id, { set: fields });
}

for (const [id, patch] of Object.entries(NEWS)) {
  const doc = await client.getDocument(id);
  if (!doc) { console.warn(`! missing ${id}`); continue; }
  const seo = {
    ...(doc.seo ?? {}),
    title: patch.title,
    description: patch.excerpt.length <= 158 ? patch.excerpt : patch.excerpt.slice(0, 155).replace(/[\s,.;:-]+\S*$/, "") + "…",
  };
  const merged = diffDoc(id, doc, { ...patch, seo });
  tx.patch(id, { set: { title: merged.title, excerpt: merged.excerpt, seo: merged.seo } });
}

{
  const s = await client.getDocument("siteSettings");
  const set = {};
  for (const [pathKey, value] of Object.entries(SETTINGS_PL)) {
    if (pathKey.startsWith("footerColumns")) {
      const col = s.footerColumns.find((c) => c._key === "explore");
      const before = (col.title || []).find((e) => e._key === "pl")?.value;
      if (before !== value) changes.push({ id: "siteSettings", field: "footerColumns.explore.title", from: before ?? "(empty)", to: value });
      set.footerColumns = s.footerColumns.map((c) => (c._key === "explore" ? { ...c, title: setPl(c.title, value) } : c));
      continue;
    }
    const [group, leaf] = pathKey.includes(".") ? pathKey.split(".") : [null, pathKey];
    const current = leaf && group ? s[group]?.[leaf] : s[pathKey];
    const before = (current || []).find((e) => e._key === "pl")?.value;
    if (before !== value) changes.push({ id: "siteSettings", field: pathKey, from: before ?? "(empty)", to: value });
    if (group) set[group] = { ...(set[group] ?? s[group] ?? {}), [leaf]: setPl(current, value) };
    else set[pathKey] = setPl(current, value);
  }
  tx.patch("siteSettings", { set });
}

{
  const p = await client.getDocument("privacy-pl");
  const body = PRIVACY_PL.map(([style, text], i) => ({
    _key: `pl${i}`,
    _type: "block",
    style,
    markDefs: [],
    children: [{ _key: `pl${i}s`, _type: "span", marks: [], text }],
  }));
  changes.push({ id: "privacy-pl", field: "body", from: `(empty - page was serving the EN notice)`, to: `${body.length} bloków po polsku` });
  if (p.title !== "Polityka prywatności") changes.push({ id: "privacy-pl", field: "title", from: p.title, to: "Polityka prywatności" });
  tx.patch("privacy-pl", { set: { title: "Polityka prywatności", body } });
}

/* ------------------------------------------------------------------ report */

let last = null;
for (const c of changes) {
  if (c.id !== last) { console.log(`\n\x1b[1m${c.id}\x1b[0m`); last = c.id; }
  console.log(`  ${c.field}`);
  console.log(`    \x1b[31m- ${c.from}\x1b[0m`);
  console.log(`    \x1b[32m+ ${c.to}\x1b[0m`);
}
console.log(`\n${changes.length} zmienionych pól.`);

if (!commit) {
  console.log("Dry run - nic nie zapisano. Uruchom z --commit, żeby zapisać.");
} else {
  await tx.commit();
  console.log("Zapisano w Sanity.");
}
