import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/* ---------- env ---------- */
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
const LANGS = ["en", "nl", "pl"];

/* ---------- images ---------- */
const PE = (id, w = 1200) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const IMG_SOURCES = {
  logo: "/assets/SGPT_logo.png",
  og: "/assets/sg_og.jpeg",
  heroBg: "/assets/newHero.JPG",
  lab: "/assets/SG-papertronics009b.jpg",
  team: "/assets/SGP-team.jpg",
  techHero: "/assets/hero-beer.png",
  appHero: PE(18915643),
  cat1: PE(8386434), cat2: PE(8770717), cat3: PE(1267700), cat4: PE(2255801),
  life1: PE(8392613), life2: PE(18915643), life3: PE(8770717),
  caseBeer: "/assets/beerometer-1080x675.jpeg", caseFerment: PE(8392613), caseAgri: PE(1435904),
  n_feat: "/assets/news/n1.jpg", n_cbc: "/assets/news/cbc.png", n_kvk: "/assets/news/kvk.png",
  n_ces: "/assets/news/ces.png", n_launch: "/assets/news/launch.jpeg", n_grant: "/assets/news/mit-grant.png",
  n_subsidy: "/assets/news/mit-subsidy.png", n_flinc: "/assets/news/flinc.jpg", n_nomrug: "/assets/news/nomrug.jpg",
};
const assets = {};
async function uploadAll() {
  for (const [name, src] of Object.entries(IMG_SOURCES)) {
    let buf, filename;
    if (src.startsWith("http")) {
      const r = await fetch(src);
      buf = Buffer.from(await r.arrayBuffer());
      filename = `${name}.jpg`;
    } else {
      buf = readFileSync(`${root}/public${src}`);
      filename = path.basename(src);
    }
    const asset = await client.assets.upload("image", buf, { filename });
    assets[name] = asset._id;
    process.stdout.write(`  ↑ ${name}\n`);
  }
}
const imageField = (name, alt) => (assets[name] ? { _type: "image", asset: { _type: "reference", _ref: assets[name] }, alt } : undefined);
const ref = (id) => ({ _type: "reference", _ref: id });

/* ---------- i18n helpers ---------- */
const intl = (type, values) => LANGS.map((l) => ({ _key: l, _type: `internationalizedArray${type}Value`, value: values[l] }));
async function putTranslated(baseType, baseKey, perLang) {
  const tx = client.transaction();
  for (const l of LANGS) {
    tx.createOrReplace({ _id: `${baseKey}-${l}`, _type: baseType, language: l, ...perLang[l] });
  }
  tx.createOrReplace({
    _id: `${baseKey}.translation`,
    _type: "translation.metadata",
    schemaTypes: [baseType],
    translations: LANGS.map((l) => ({
      _key: l, language: l, _type: "internationalizedArrayReferenceValue",
      value: { _type: "reference", _ref: `${baseKey}-${l}`, _weak: true, _strengthenOnPublish: { type: baseType } },
    })),
  });
  await tx.commit();
  process.stdout.write(`  ✓ ${baseType}: ${baseKey}\n`);
}

/* ==================================================================== */
async function main() {
  console.log("Uploading images…");
  await uploadAll();

  /* ---------- partners ---------- */
  console.log("Partners…");
  const partners = ["Bioclear Earth", "Fascinating", "University of Groningen", "Hanze UAS", "ISPT"];
  const partnerIds = [];
  {
    const tx = client.transaction();
    for (const name of partners) {
      const id = `partner-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      partnerIds.push(id);
      tx.createOrReplace({ _id: id, _type: "partner", name });
    }
    await tx.commit();
  }

  /* ---------- authors ---------- */
  const authors = { marcin: "Marcin Bator", grzegorz: "Grzegorz Babiarz", hubert: "Hubert Hurban", job: "SG Papertronics" };
  {
    const tx = client.transaction();
    for (const [k, name] of Object.entries(authors)) tx.createOrReplace({ _id: `author-${k}`, _type: "author", name });
    await tx.commit();
  }

  /* ---------- case studies ---------- */
  console.log("Case studies…");
  const cs = {
    beer: {
      img: "caseBeer",
      en: { tag: "Brewing", title: "Beer-o-Meter: brewing quality control", description: "Our first commercial application of Q‑Tector - fast, at-line testing of sugars, alcohol and key parameters for craft breweries, close to the tank." },
      nl: { tag: "Brouwen", title: "Beer-o-Meter: kwaliteitscontrole bij het brouwen", description: "Onze eerste commerciele toepassing van Q‑Tector - snelle, at-line metingen van suikers, alcohol en belangrijke parameters voor ambachtelijke brouwerijen, dicht bij de tank." },
      pl: { tag: "Piwowarstwo", title: "Beer-o-Meter: kontrola jakości w browarnictwie", description: "Nasze pierwsze komercyjne zastosowanie Q‑Tectora - szybkie, przyprocesowe pomiary cukrów, alkoholu i kluczowych parametrów dla rzemieślniczych browarów, tuż przy tanku." },
    },
    ferment: {
      img: "caseFerment",
      en: { tag: "Precision fermentation", title: "Media & feed monitoring across runs", description: "Tracking glucose and sucrose in culture media so teams can compare feed strategies and act during the run - not days after it." },
      nl: { tag: "Precisiefermentatie", title: "Media- en voedingsmonitoring over runs heen", description: "Glucose en sucrose in kweekmedia volgen, zodat teams voedingsstrategieen kunnen vergelijken en tijdens de run kunnen ingrijpen - niet pas dagen later." },
      pl: { tag: "Fermentacja precyzyjna", title: "Monitoring mediów i zasilania między seriami", description: "Śledzenie glukozy i sacharozy w mediach hodowlanych, aby zespoły mogły porównywać strategie zasilania i reagować w trakcie serii - a nie dni po niej." },
    },
    agri: {
      img: "caseAgri",
      en: { tag: "Agri-food", title: "PotatoSense - Fascinating / ISPT", description: "Applying Q‑Tector measurement workflows to agri-food process questions through a regional innovation collaboration." },
      nl: { tag: "Agri-food", title: "PotatoSense - Fascinating / ISPT", description: "Q‑Tector-meetworkflows toegepast op agri-food-procesvragen via een regionale innovatiesamenwerking." },
      pl: { tag: "Rolno-spożywczy", title: "PotatoSense - Fascinating / ISPT", description: "Zastosowanie workflow pomiarowych Q‑Tectora do pytań procesowych w agri-food w ramach regionalnej współpracy innowacyjnej." },
    },
  };
  const caseIds = {};
  for (const [key, data] of Object.entries(cs)) {
    caseIds[key] = `caseStudy-${key}`;
    const per = {};
    for (const l of LANGS) per[l] = { ...data[l], image: imageField(data.img, data.en.title), link: "/applications" };
    await putTranslated("caseStudy", `caseStudy-${key}`, per);
  }

  /* ---------- news ---------- */
  console.log("News…");
  const news = [
    { key: "living-fermentation", img: "n_feat", date: "2026-07-07", author: "marcin", cat: { en: "News", nl: "Nieuws", pl: "Aktualności" }, featured: true, url: "https://sgpapertronics.com/from-living-fermentation-to-actionable-data-supporting-product-development-in-groningen/",
      title: { en: "From Living Fermentation to Actionable Data: Supporting Product Development in Groningen", nl: "Van levende fermentatie naar bruikbare data: productontwikkeling in Groningen", pl: "Od żywej fermentacji do użytecznych danych: rozwój produktu w Groningen" },
      excerpt: { en: "Fermented drinks are gaining attention for a good reason. A recent article in Dagblad van het Noorden highlighted the work of Floris and his team in Groningen, developing living foods and drinks with a clear culinary ambition.", nl: "Gefermenteerde dranken krijgen terecht aandacht. Een recent artikel in Dagblad van het Noorden belichtte het werk van Floris en zijn team in Groningen, die levende voeding en dranken ontwikkelen met een duidelijke culinaire ambitie.", pl: "Napoje fermentowane nie bez powodu zyskują uwagę. Niedawny artykuł w Dagblad van het Noorden przybliżył pracę Florisa i jego zespołu w Groningen, tworzących żywe produkty i napoje z wyraźną ambicją kulinarną." } },
    { key: "cbc26-relationships", img: "n_cbc", date: "2026-04-29", author: "grzegorz", cat: { en: "News", nl: "Nieuws", pl: "Aktualności" }, url: "https://sgpapertronics.com/beer-o-meter-at-cbc26-building-relationships-validating-the-market-and-shaping-the-future-of-brewing-qc/",
      title: { en: "Beer-o-Meter at CBC26: Building Relationships, Validating the Market, and Shaping the Future of Brewing QC", nl: "Beer-o-Meter op CBC26: relaties bouwen, de markt valideren en de toekomst van brouw-QC vormgeven", pl: "Beer-o-Meter na CBC26: budowanie relacji, walidacja rynku i kształtowanie przyszłości QC w browarnictwie" },
      excerpt: { en: "CBC26 and BrewExpo America in Philadelphia were an incredibly important milestone for Beer-o-Meter.", nl: "CBC26 en BrewExpo America in Philadelphia waren een ontzettend belangrijke mijlpaal voor Beer-o-Meter.", pl: "CBC26 i BrewExpo America w Filadelfii były niezwykle ważnym kamieniem milowym dla Beer-o-Meter." } },
    { key: "cbc26-future", img: "n_cbc", date: "2026-04-29", author: "grzegorz", cat: { en: "News", nl: "Nieuws", pl: "Aktualności" }, url: "https://sgpapertronics.com/cbc26-philadelphia-what-the-future-of-brewing-looks-like/",
      title: { en: "CBC26 Philadelphia: What the Future of Brewing Looks Like", nl: "CBC26 Philadelphia: hoe de toekomst van het brouwen eruitziet", pl: "CBC26 Filadelfia: jak wygląda przyszłość browarnictwa" },
      excerpt: { en: "The 2026 Craft Brewers Conference & BrewExpo America made one thing clear: the brewing industry is evolving rapidly, and breweries are actively searching for smarter, more practical ways to adapt.", nl: "De Craft Brewers Conference & BrewExpo America 2026 maakte een ding duidelijk: de brouwsector evolueert snel en brouwerijen zoeken actief naar slimmere, praktischere manieren om zich aan te passen.", pl: "Craft Brewers Conference & BrewExpo America 2026 pokazała jedno: branża browarnicza szybko się zmienia, a browary aktywnie szukają mądrzejszych, bardziej praktycznych sposobów adaptacji." } },
    { key: "kvk-top-100", img: "n_kvk", date: "2025-09-22", author: "hubert", cat: { en: "Recognition", nl: "Erkenning", pl: "Wyróżnienie" }, url: "https://sgpapertronics.com/kvk-innovatie-top-100-edition-2025/",
      title: { en: "KVK Innovatie Top 100 edition 2025", nl: "KVK Innovatie Top 100 editie 2025", pl: "KVK Innovatie Top 100 edycja 2025" },
      excerpt: { en: "Big news! SG Papertronics has qualified for the KVK Innovatie Top 100.", nl: "Groot nieuws! SG Papertronics heeft zich gekwalificeerd voor de KVK Innovatie Top 100.", pl: "Wielka wiadomość! SG Papertronics zakwalifikowało się do KVK Innovatie Top 100." } },
    { key: "ces-2025", img: "n_ces", date: "2024-11-13", author: "hubert", cat: { en: "Event", nl: "Evenement", pl: "Wydarzenie" }, url: "https://sgpapertronics.com/ces-2025/",
      title: { en: "Join us at CES 2025 - Elevate Your Production Efficiency!", nl: "Ontmoet ons op CES 2025 - verhoog uw productie-efficientie!", pl: "Spotkajmy się na CES 2025 - zwiększ efektywność produkcji!" },
      excerpt: { en: "We brought our lab-in-a-box solution for the food and beverage sector to CES 2025 in Las Vegas.", nl: "We brachten onze lab-in-a-box-oplossing voor de food- en drankensector naar CES 2025 in Las Vegas.", pl: "Nasze rozwiązanie lab-in-a-box dla sektora spożywczego zaprezentowaliśmy na CES 2025 w Las Vegas." } },
    { key: "finally-here", img: "n_launch", date: "2024-04-19", author: "hubert", cat: { en: "Company", nl: "Bedrijf", pl: "Firma" }, url: "https://sgpapertronics.com/were-finally-here/",
      title: { en: "We're finally here!", nl: "We zijn er eindelijk!", pl: "Wreszcie jesteśmy!" },
      excerpt: { en: "Our Beer-o-Meter launch event brought together customers, investors and partners to celebrate the result of the team's development work.", nl: "Ons Beer-o-Meter-lanceringsevenement bracht klanten, investeerders en partners samen om het resultaat van het ontwikkelwerk te vieren.", pl: "Nasze wydarzenie premierowe Beer-o-Meter zgromadziło klientów, inwestorów i partnerów, by uczcić efekt pracy zespołu." } },
    { key: "mit-grant", img: "n_grant", date: "2021-01-18", author: "job", cat: { en: "Grant", nl: "Subsidie", pl: "Grant" }, url: "https://sgpapertronics.com/mit-rd-grant/",
      title: { en: "Levels Diagnostics, Omnigen and SG Papertronics granted the MIT R&D collaboration grant", nl: "Levels Diagnostics, Omnigen en SG Papertronics ontvangen de MIT R&D-samenwerkingssubsidie", pl: "Levels Diagnostics, Omnigen i SG Papertronics otrzymują grant współpracy B+R MIT" },
      excerpt: { en: "By combining expertise in clinical biomarker development, bioinformatics and paper-based microfluidics, the consortium will develop a novel liver-damage assay.", nl: "Door expertise in klinische biomarkerontwikkeling, bio-informatica en papiergebaseerde microfluidica te combineren, ontwikkelt het consortium een nieuwe leverschadetest.", pl: "Łącząc wiedzę z rozwoju biomarkerów klinicznych, bioinformatyki i mikropłynów papierowych, konsorcjum opracuje nowatorski test uszkodzenia wątroby." } },
    { key: "mit-subsidy", img: "n_subsidy", date: "2020-12-18", author: "job", cat: { en: "Grant", nl: "Subsidie", pl: "Grant" }, url: "https://sgpapertronics.com/mit-rd-subsidy/",
      title: { en: "SG Papertronics and EV Biotech rewarded with the MIT R&D subsidy", nl: "SG Papertronics en EV Biotech beloond met de MIT R&D-subsidie", pl: "SG Papertronics i EV Biotech nagrodzone subwencją B+R MIT" },
      excerpt: { en: "In this one-year project we will develop a glucose sensor for microbial fermentation, reducing sample volume and manual labour.", nl: "In dit eenjarige project ontwikkelen we een glucosesensor voor microbiele fermentatie, met minder monstervolume en handwerk.", pl: "W tym rocznym projekcie opracujemy czujnik glukozy do fermentacji mikrobiologicznej, zmniejszając objętość próbek i nakład pracy." } },
    { key: "flinc-pitch", img: "n_flinc", date: "2020-11-18", author: "job", cat: { en: "Award", nl: "Prijs", pl: "Nagroda" }, url: "https://sgpapertronics.com/winning-pitch-camp-by-flinc/",
      title: { en: "Winning pitch at Pitch Camp by Flinc", nl: "Winnende pitch op Pitch Camp van Flinc", pl: "Zwycięski pitch na Pitch Camp by Flinc" },
      excerpt: { en: "Rapid testing of craft beer is what SG Papertronics specializes in - and it earned us a favourable EUR 20,000 loan at Flinc Pitch Camp.", nl: "Snel testen van speciaalbier is de specialiteit van SG Papertronics - en het leverde ons een gunstige lening van EUR 20.000 op bij Flinc Pitch Camp.", pl: "Szybkie testowanie piwa rzemieślniczego to specjalność SG Papertronics - dzięki niej zdobyliśmy korzystną pożyczkę 20 000 EUR na Flinc Pitch Camp." } },
    { key: "nom-rug", img: "n_nomrug", date: "2020-09-24", author: "job", cat: { en: "Investment", nl: "Investering", pl: "Inwestycja" }, url: "https://sgpapertronics.com/post/",
      title: { en: "NOM and RUG Holding jointly make an early-phase investment", nl: "NOM en RUG Holding doen samen een investering in de vroege fase", pl: "NOM i RUG Holding wspólnie dokonują inwestycji we wczesnej fazie" },
      excerpt: { en: "The Beer-O-Meter gives small brewers a boost: a plug-and-play testing system that registers colour, bitterness, acidity, sugar and alcohol within minutes.", nl: "De Beer-O-Meter geeft kleine brouwers een boost: een plug-and-play-testsysteem dat kleur, bitterheid, zuurgraad, suiker en alcohol binnen minuten registreert.", pl: "Beer-O-Meter to wsparcie dla małych browarów: system plug-and-play mierzący barwę, goryczkę, kwasowość, cukier i alkohol w kilka minut." } },
  ];
  for (const n of news) {
    const per = {};
    for (const l of LANGS) {
      per[l] = {
        title: n.title[l], slug: { _type: "slug", current: `${n.key}${l === "en" ? "" : "-" + l}` },
        date: n.date, author: ref(`author-${n.author}`), category: n.cat[l],
        coverImage: imageField(n.img, n.title.en), excerpt: n.excerpt[l],
        externalUrl: n.url, featured: !!n.featured,
      };
    }
    await putTranslated("newsArticle", `newsArticle-${n.key}`, per);
  }

  /* ---------- siteSettings ---------- */
  console.log("Site settings…");
  await client.createOrReplace({
    _id: "siteSettings", _type: "siteSettings", title: "Site settings",
    logo: imageField("logo", "SG Papertronics"),
    ogImage: imageField("og", "SG Papertronics"),
    nav: [
      { _key: "technology", _type: "navItem", label: intl("String", { en: "Technology", nl: "Technologie", pl: "Technologia" }), href: "/technology" },
      { _key: "applications", _type: "navItem", label: intl("String", { en: "Applications", nl: "Toepassingen", pl: "Zastosowania" }), href: "/applications" },
      { _key: "investors", _type: "navItem", label: intl("String", { en: "Investors", nl: "Investeerders", pl: "Inwestorzy" }), href: "/investors" },
      { _key: "news", _type: "navItem", label: intl("String", { en: "News", nl: "Nieuws", pl: "Aktualności" }), href: "/news" },
      { _key: "contact", _type: "navItem", label: intl("String", { en: "Contact", nl: "Contact", pl: "Kontakt" }), href: "/#contact" },
    ],
    navCta: { _type: "ctaButton", label: "Talk to us", href: "/#contact", style: "primary" },
    footerTagline: intl("Text", {
      en: "Actionable process data for biotech & fermentation - powered by Q‑Tector.",
      nl: "Bruikbare procesdata voor biotech & fermentatie - mogelijk gemaakt door Q‑Tector.",
      pl: "Użyteczne dane procesowe dla biotechnologii i fermentacji - napędzane przez Q‑Tector.",
    }),
    footerColumns: [
      { _key: "explore", _type: "footerColumn", title: intl("String", { en: "Explore", nl: "Ontdek", pl: "Odkryj" }),
        links: [
          { _key: "t", _type: "footerLink", label: intl("String", { en: "Technology", nl: "Technologie", pl: "Technologia" }), href: "/technology" },
          { _key: "a", _type: "footerLink", label: intl("String", { en: "Applications", nl: "Toepassingen", pl: "Zastosowania" }), href: "/applications" },
          { _key: "n", _type: "footerLink", label: intl("String", { en: "News", nl: "Nieuws", pl: "Aktualności" }), href: "/news" },
        ] },
      { _key: "company", _type: "footerColumn", title: intl("String", { en: "Company", nl: "Bedrijf", pl: "Firma" }),
        links: [
          { _key: "ab", _type: "footerLink", label: intl("String", { en: "About", nl: "Over ons", pl: "O nas" }), href: "/about" },
          { _key: "in", _type: "footerLink", label: intl("String", { en: "Investors", nl: "Investeerders", pl: "Inwestorzy" }), href: "/investors" },
          { _key: "co", _type: "footerLink", label: intl("String", { en: "Contact", nl: "Contact", pl: "Kontakt" }), href: "/#contact" },
        ] },
    ],
    contactEmail: "contact@sgpapertronics.com",
    address: "Blauwborgje 31, 9747 AW Groningen, NL",
    socials: [{ _key: "web", _type: "social", label: "testmybeer.com", url: "https://testmybeer.com" }],
    defaultSeo: { _type: "seo", title: "SG Papertronics - Process control for biotech and fermentation", description: "Q‑Tector is an at-line testing platform built for living processes." },
  });
  console.log("  ✓ siteSettings");

  /* ---------- pages ---------- */
  console.log("Pages…");
  const T = (en, nl, pl) => ({ en, nl, pl });
  const cta = (label, href, style = "primary") => ({ _type: "ctaButton", label, href, style });

  // HOME
  {
    const H = {
      hero: T(
        { eyebrow: "At-line process control", titleLine1: "Turn small samples into", titleAccent: "actionable process data", subtitle: "Q‑Tector is an at-line testing platform built for living processes - from development to production.", bgImage: imageField("heroBg", "Lab"), primaryCta: cta("Talk to us", "#contact"), secondaryCta: cta("See the technology", "/technology", "ghost") },
        { eyebrow: "At-line procescontrole", titleLine1: "Maak van kleine monsters", titleAccent: "bruikbare procesdata", subtitle: "Q‑Tector is een at-line testplatform voor levende processen - van ontwikkeling tot productie.", bgImage: imageField("heroBg", "Lab"), primaryCta: cta("Neem contact op", "#contact"), secondaryCta: cta("Bekijk de technologie", "/technology", "ghost") },
        { eyebrow: "Przyprocesowa kontrola", titleLine1: "Zamień małe próbki w", titleAccent: "użyteczne dane procesowe", subtitle: "Q‑Tector to przyprocesowa platforma pomiarowa dla żywych procesów - od rozwoju po produkcję.", bgImage: imageField("heroBg", "Lab"), primaryCta: cta("Napisz do nas", "#contact"), secondaryCta: cta("Zobacz technologię", "/technology", "ghost") },
      ),
      intro: T(
        { heading: "Better decisions start with better process data", body: "Biological processes are dynamic. Q‑Tector helps you measure the parameters that matter, close to the process, so you can act in minutes - not days." },
        { heading: "Betere beslissingen beginnen met betere procesdata", body: "Biologische processen zijn dynamisch. Q‑Tector helpt u de parameters te meten die ertoe doen, dicht bij het proces, zodat u binnen minuten kunt handelen - niet dagen." },
        { heading: "Lepsze decyzje zaczynają się od lepszych danych procesowych", body: "Procesy biologiczne są dynamiczne. Q‑Tector pomaga mierzyć istotne parametry blisko procesu, dzięki czemu działasz w minuty - nie w dni." },
      ),
      benefits: T(
        [{ _key: "b1", _type: "benefit", title: "Analytics closer to production", text: "Run process-relevant measurements at-line, without shipping samples to a central lab." },
         { _key: "b2", _type: "benefit", title: "Knowledge from day one", text: "Build structured datasets from the first experiment through to production." },
         { _key: "b3", _type: "benefit", title: "Reduce uncertainty", text: "See deviations while you can still act on them." }],
        [{ _key: "b1", _type: "benefit", title: "Analyses dichter bij productie", text: "Voer procesrelevante metingen at-line uit, zonder monsters naar een centraal lab te sturen." },
         { _key: "b2", _type: "benefit", title: "Kennis vanaf dag een", text: "Bouw gestructureerde datasets op, van het eerste experiment tot de productie." },
         { _key: "b3", _type: "benefit", title: "Verminder onzekerheid", text: "Zie afwijkingen terwijl u er nog op kunt reageren." }],
        [{ _key: "b1", _type: "benefit", title: "Analiza bliżej produkcji", text: "Wykonuj istotne pomiary przyprocesowo, bez wysyłki próbek do centralnego laboratorium." },
         { _key: "b2", _type: "benefit", title: "Wiedza od pierwszego dnia", text: "Buduj ustrukturyzowane zbiory danych od pierwszego eksperymentu aż po produkcję." },
         { _key: "b3", _type: "benefit", title: "Ogranicz niepewność", text: "Dostrzegaj odchylenia, gdy jeszcze możesz zareagować." }],
      ),
      explore: T(
        { badge: "Let's explore together", heading: "Explore what", headingAccent: "we can do", body: "Tell us your organism, process stage and goal - we'll show where Q‑Tector fits and how fast you can start.", primaryCta: cta("Talk to us", "#contact"), secondaryCta: cta("See the technology", "/technology", "ghost") },
        { badge: "Laten we samen ontdekken", heading: "Ontdek wat", headingAccent: "wij kunnen", body: "Vertel ons uw organisme, procesfase en doel - wij laten zien waar Q‑Tector past en hoe snel u kunt starten.", primaryCta: cta("Neem contact op", "#contact"), secondaryCta: cta("Bekijk de technologie", "/technology", "ghost") },
        { badge: "Odkryjmy to razem", heading: "Zobacz, co", headingAccent: "potrafimy", body: "Powiedz nam o organizmie, etapie procesu i celu - pokażemy, gdzie pasuje Q‑Tector i jak szybko zaczniesz.", primaryCta: cta("Napisz do nas", "#contact"), secondaryCta: cta("Zobacz technologię", "/technology", "ghost") },
      ),
      lifecycle: T(
        { badge: "Data & analytics", heading: "From single measurements to", headingAccent: "scalable process intelligence", subtitle: "A single measurement is useful. A structured dataset is powerful.",
          columns: [
            { _key: "c1", _type: "col", badge: "01", title: "Analyze goals", text: "Understand the process and goals - then we propose a customised process-control setup to test.", image: imageField("life1", "Analyze goals") },
            { _key: "c2", _type: "col", badge: "02", title: "Pilot & test", text: "Piloting, testing and in-process analytics to validate the workflow on real runs.", image: imageField("life2", "Pilot & test") },
            { _key: "c3", _type: "col", badge: "03", title: "Roll out", text: "Roll the tested process out - with deeper, proactive analytics insights.", image: imageField("life3", "Roll out") },
          ] },
        { badge: "Data & analyse", heading: "Van losse metingen naar", headingAccent: "schaalbare procesintelligentie", subtitle: "Een enkele meting is nuttig. Een gestructureerde dataset is krachtig.",
          columns: [
            { _key: "c1", _type: "col", badge: "01", title: "Doelen analyseren", text: "Begrijp het proces en de doelen - daarna stellen we een op maat gemaakte opzet voor om te testen.", image: imageField("life1", "Doelen") },
            { _key: "c2", _type: "col", badge: "02", title: "Pilot & test", text: "Piloten, testen en in-proces-analyses om de workflow op echte runs te valideren.", image: imageField("life2", "Pilot") },
            { _key: "c3", _type: "col", badge: "03", title: "Uitrollen", text: "Rol het geteste proces uit - met diepere, proactieve analyse-inzichten.", image: imageField("life3", "Uitrollen") },
          ] },
        { badge: "Dane i analityka", heading: "Od pojedynczych pomiarów do", headingAccent: "skalowalnej inteligencji procesowej", subtitle: "Pojedynczy pomiar jest użyteczny. Ustrukturyzowany zbiór danych daje moc.",
          columns: [
            { _key: "c1", _type: "col", badge: "01", title: "Analiza celów", text: "Rozumiemy proces i cele - proponujemy dopasowaną konfigurację kontroli do przetestowania.", image: imageField("life1", "Analiza") },
            { _key: "c2", _type: "col", badge: "02", title: "Pilotaż i testy", text: "Pilotaż, testy i analityka w toku, aby zweryfikować workflow na realnych seriach.", image: imageField("life2", "Pilotaż") },
            { _key: "c3", _type: "col", badge: "03", title: "Wdrożenie", text: "Wdróż przetestowany proces - z głębszą, proaktywną analityką.", image: imageField("life3", "Wdrożenie") },
          ] },
      ),
      howWeWork: T(
        { badge: "How we work", heading: "A partner in process control", subtitle: "From first sample to a running at-line routine - we work alongside your team.", bannerImage: imageField("lab", "In the lab"), steps: [
          { _key: "s1", _type: "step", title: "Analyze goals", text: "We map the process and the decisions you need to make." },
          { _key: "s2", _type: "step", title: "Pilot & test", text: "We validate the workflow on your real runs." },
          { _key: "s3", _type: "step", title: "Generate & act on data", text: "You run the routine and act on structured, connected data." }] },
        { badge: "Hoe we werken", heading: "Een partner in procescontrole", subtitle: "Van eerste monster tot een draaiende at-line-routine - we werken samen met uw team.", bannerImage: imageField("lab", "In het lab"), steps: [
          { _key: "s1", _type: "step", title: "Doelen analyseren", text: "We brengen het proces en de benodigde beslissingen in kaart." },
          { _key: "s2", _type: "step", title: "Pilot & test", text: "We valideren de workflow op uw echte runs." },
          { _key: "s3", _type: "step", title: "Data genereren & benutten", text: "U draait de routine en handelt op gestructureerde, verbonden data." }] },
        { badge: "Jak pracujemy", heading: "Partner w kontroli procesu", subtitle: "Od pierwszej próbki po działającą rutynę przyprocesową - działamy razem z Twoim zespołem.", bannerImage: imageField("lab", "W laboratorium"), steps: [
          { _key: "s1", _type: "step", title: "Analiza celów", text: "Mapujemy proces i decyzje, które musisz podejmować." },
          { _key: "s2", _type: "step", title: "Pilotaż i testy", text: "Weryfikujemy workflow na Twoich realnych seriach." },
          { _key: "s3", _type: "step", title: "Generuj dane i działaj", text: "Uruchamiasz rutynę i działasz na ustrukturyzowanych, połączonych danych." }] },
      ),
      contact: T(
        { heading: "Let's talk about your process", body: "Tell us what you're working on and we'll get back within one business day.", email: "contact@sgpapertronics.com" },
        { heading: "Laten we over uw proces praten", body: "Vertel ons waar u aan werkt en we reageren binnen een werkdag.", email: "contact@sgpapertronics.com" },
        { heading: "Porozmawiajmy o Twoim procesie", body: "Napisz, nad czym pracujesz, a odpowiemy w ciągu jednego dnia roboczego.", email: "contact@sgpapertronics.com" },
      ),
    };
    const per = {};
    for (const l of LANGS) per[l] = {
      hero: H.hero[l], intro: H.intro[l], benefits: H.benefits[l], explore: H.explore[l],
      lifecycle: H.lifecycle[l], howWeWork: H.howWeWork[l],
      partners: partnerIds.map((id, i) => ({ _key: "p" + i, ...ref(id) })), contact: H.contact[l],
    };
    await putTranslated("homePage", "home", per);
  }

  // TECHNOLOGY
  {
    const steps = {
      en: [["01", "Take a small sample", "Collect a small process sample from your culture, fermentation or product stream."], ["02", "Run the guided assay", "Use the ready-to-use assay pod and follow the app-guided workflow."], ["03", "Read the result", "Q‑Tector provides a clear result through the connected readout system."], ["04", "Track the process", "Results are stored and can be used for trend analysis, batch comparison and export."], ["05", "Act on the data", "Use the result to support feeding, process timing, formulation, stabilization, release or troubleshooting decisions."]],
      nl: [["01", "Neem een klein monster", "Neem een klein procesmonster uit uw kweek, fermentatie of productstroom."], ["02", "Voer de begeleide test uit", "Gebruik de kant-en-klare assay-pod en volg de app-workflow."], ["03", "Lees het resultaat", "Q‑Tector geeft een duidelijk resultaat via het verbonden uitleessysteem."], ["04", "Volg het proces", "Resultaten worden opgeslagen voor trendanalyse, batchvergelijking en export."], ["05", "Handel op de data", "Gebruik het resultaat voor beslissingen over voeding, timing, formulering, stabilisatie, vrijgave of probleemoplossing."]],
      pl: [["01", "Pobierz małą próbkę", "Pobierz małą próbkę procesową z hodowli, fermentacji lub strumienia produktu."], ["02", "Wykonaj prowadzony test", "Użyj gotowej kapsuły assay i postępuj zgodnie z workflow w aplikacji."], ["03", "Odczytaj wynik", "Q‑Tector podaje czytelny wynik przez połączony czytnik."], ["04", "Śledź proces", "Wyniki są zapisywane i służą do analizy trendów, porównania serii i eksportu."], ["05", "Działaj na danych", "Wykorzystaj wynik do decyzji o zasilaniu, czasie procesu, formulacji, stabilizacji, zwolnieniu lub diagnostyce."]],
    };
    const t = {
      en: { hero: { title: "Q‑Tector", titleAccent: "technology", lead: "A compact at-line testing platform for process-relevant measurements.", body1: "Q‑Tector combines a readout device, ready-to-use assay pods, QR-guided workflows, app-based instructions and cloud-connected data handling.", body2: "The goal is simple: make it easier to measure important process parameters close to where the process happens.", image: imageField("techHero", "Q‑Tector device"), primaryCta: cta("Talk to us about your process", "#contact"), secondaryCta: cta("See applications", "/applications", "ghost") }, focus: { eyebrow: "Current analytical focus", heading: "Quick glucose & sucrose monitoring", body: "Current focus is glucose and sucrose monitoring in culture media, with more sugars and metabolites available for development on request.", tags: ["Glucose & sucrose", "Culture media", "Fermentation", "Cell culture", "Media optimization", "Feed strategy", "Production monitoring"], image: imageField("lab", "Monitoring") }, scale: { heading: "Built for scale-up", body1: "Q‑Tector is designed to move with your process, from lab to pilot to production.", body2: "By using repeatable testing workflows and connected data capture, teams can compare experiments, monitor trends and carry process knowledge into pilot and production." } },
      nl: { hero: { title: "Q‑Tector", titleAccent: "technologie", lead: "Een compact at-line testplatform voor procesrelevante metingen.", body1: "Q‑Tector combineert een uitleesapparaat, kant-en-klare assay-pods, QR-workflows, app-instructies en cloud-gekoppelde dataverwerking.", body2: "Het doel is simpel: het makkelijker maken om belangrijke procesparameters te meten dicht bij waar het proces plaatsvindt.", image: imageField("techHero", "Q‑Tector"), primaryCta: cta("Praat over uw proces", "#contact"), secondaryCta: cta("Bekijk toepassingen", "/applications", "ghost") }, focus: { eyebrow: "Huidige analytische focus", heading: "Snelle glucose- & sucrosemonitoring", body: "De huidige focus ligt op glucose- en sucrosemonitoring in kweekmedia, met meer suikers en metabolieten op aanvraag.", tags: ["Glucose & sucrose", "Kweekmedia", "Fermentatie", "Celkweek", "Media-optimalisatie", "Voedingsstrategie", "Productiemonitoring"], image: imageField("lab", "Monitoring") }, scale: { heading: "Gebouwd voor opschaling", body1: "Q‑Tector beweegt mee met uw proces, van lab naar pilot naar productie.", body2: "Met herhaalbare testworkflows en gekoppelde datacaptatie kunnen teams experimenten vergelijken, trends volgen en proceskennis meenemen naar pilot en productie." } },
      pl: { hero: { title: "Q‑Tector", titleAccent: "technologia", lead: "Kompaktowa przyprocesowa platforma do istotnych pomiarów.", body1: "Q‑Tector łączy czytnik, gotowe kapsuły assay, workflow z kodami QR, instrukcje w aplikacji i dane w chmurze.", body2: "Cel jest prosty: ułatwić pomiar ważnych parametrów blisko miejsca, gdzie zachodzi proces.", image: imageField("techHero", "Q‑Tector"), primaryCta: cta("Porozmawiaj o procesie", "#contact"), secondaryCta: cta("Zobacz zastosowania", "/applications", "ghost") }, focus: { eyebrow: "Obecny zakres analityczny", heading: "Szybki pomiar glukozy i sacharozy", body: "Obecnie skupiamy się na pomiarze glukozy i sacharozy w mediach hodowlanych; kolejne cukry i metabolity dostępne na zamówienie.", tags: ["Glukoza i sacharoza", "Media hodowlane", "Fermentacja", "Hodowla komórkowa", "Optymalizacja mediów", "Strategia zasilania", "Monitoring produkcji"], image: imageField("lab", "Monitoring") }, scale: { heading: "Stworzony do skalowania", body1: "Q‑Tector rozwija się razem z procesem: od laboratorium przez pilotaż po produkcję.", body2: "Dzięki powtarzalnym workflow i połączonym danym zespoły porównują eksperymenty, monitorują trendy i przenoszą wiedzę do pilotażu i produkcji." } },
    };
    const per = {};
    for (const l of LANGS) per[l] = {
      hero: t[l].hero,
      steps: steps[l].map(([n, title, text], i) => ({ _key: "st" + i, _type: "step", n, title, text })),
      focus: t[l].focus, builtForScale: t[l].scale,
    };
    await putTranslated("technologyPage", "technology", per);
  }

  // APPLICATIONS
  {
    const cats = {
      en: [["Biotech & precision fermentation", "Understand how your cultures behave", "Monitor nutrient consumption and performance across strains, media and scale-up steps.", "cat1", ["Track nutrient availability during culture development", "Compare media and feed strategies", "Generate datasets for scale-up decisions"]], ["CDMOs & contract development", "Standardize monitoring across projects", "A consistent at-line workflow for early development, process transfer and troubleshooting.", "cat2", ["Monitor key parameters across client projects", "Reduce dependency on delayed feedback", "Build clear datasets for client reporting"]], ["Fermented food & beverage", "Control living products with better data", "Make process-relevant measurements easy during development and production.", "cat3", ["Monitor residual sugars during fermentation", "Know when fermentation is complete", "Reduce batch-to-batch variation"]], ["Agri-food & applied biotech", "Insight into complex biological systems", "Adaptable to new assay development and application-specific workflows.", "cat4", ["Develop practical testing workflows", "Monitor process-relevant analytes", "Now live: PotatoSense - Fascinating / ISPT"]]],
      nl: [["Biotech & precisiefermentatie", "Begrijp hoe uw kweken zich gedragen", "Monitor nutrientenverbruik en prestaties over stammen, media en opschaalstappen.", "cat1", ["Volg nutrientenbeschikbaarheid tijdens kweekontwikkeling", "Vergelijk media- en voedingsstrategieen", "Genereer datasets voor opschaalbeslissingen"]], ["CDMO's & contractontwikkeling", "Standaardiseer monitoring over projecten", "Een consistente at-line-workflow voor vroege ontwikkeling, procesoverdracht en probleemoplossing.", "cat2", ["Monitor sleutelparameters over klantprojecten", "Verminder afhankelijkheid van vertraagde feedback", "Bouw heldere datasets voor klantrapportage"]], ["Gefermenteerde food & beverage", "Beheers levende producten met betere data", "Maak procesrelevante metingen eenvoudig tijdens ontwikkeling en productie.", "cat3", ["Monitor restsuikers tijdens fermentatie", "Weet wanneer de fermentatie klaar is", "Verminder batch-tot-batch-variatie"]], ["Agri-food & toegepaste biotech", "Inzicht in complexe biologische systemen", "Aanpasbaar aan nieuwe assay-ontwikkeling en applicatiespecifieke workflows.", "cat4", ["Ontwikkel praktische testworkflows", "Monitor procesrelevante analyten", "Nu live: PotatoSense - Fascinating / ISPT"]]],
      pl: [["Biotech i fermentacja precyzyjna", "Zrozum, jak zachowują się Twoje hodowle", "Monitoruj zużycie składników i wydajność dla szczepów, mediów i etapów skalowania.", "cat1", ["Śledź dostępność składników podczas rozwoju hodowli", "Porównuj strategie mediów i zasilania", "Twórz zbiory danych do decyzji o skalowaniu"]], ["CDMO i rozwój kontraktowy", "Ujednolić monitoring w projektach", "Spójny workflow przyprocesowy dla wczesnego rozwoju, transferu procesu i diagnostyki.", "cat2", ["Monitoruj kluczowe parametry w projektach klientów", "Ogranicz zależność od opóźnionego feedbacku", "Buduj czytelne dane do raportów dla klientów"]], ["Żywność i napoje fermentowane", "Kontroluj żywe produkty lepszymi danymi", "Ułatw istotne pomiary podczas rozwoju i produkcji.", "cat3", ["Monitoruj cukry resztkowe podczas fermentacji", "Wiedz, kiedy fermentacja się kończy", "Ogranicz zmienność między seriami"]], ["Agri-food i biotech stosowana", "Wgląd w złożone systemy biologiczne", "Elastyczny wobec nowych testów i workflow specyficznych dla zastosowania.", "cat4", ["Twórz praktyczne workflow pomiarowe", "Monitoruj istotne anality", "Już działa: PotatoSense - Fascinating / ISPT"]]],
    };
    const h = {
      en: { eyebrow: "Applications", title: "Built for biological", titleAccent: "production", lead: "Q‑Tector adapts to how different teams work with living processes - from early development to production monitoring.", cE: "Where Q‑Tector fits", cH: "Four ways teams put it to work", csE: "Case studies", csH: "Q‑Tector in the real world", ctaH: "Have a process in mind?", ctaB: "Tell us your organism, process stage and goal - we'll show where Q‑Tector fits and how fast you can start.", primary: "Talk to us about your process", secondary: "See the technology" },
      nl: { eyebrow: "Toepassingen", title: "Gebouwd voor biologische", titleAccent: "productie", lead: "Q‑Tector past zich aan hoe verschillende teams met levende processen werken - van vroege ontwikkeling tot productiemonitoring.", cE: "Waar Q‑Tector past", cH: "Vier manieren om het in te zetten", csE: "Case studies", csH: "Q‑Tector in de praktijk", ctaH: "Een proces in gedachten?", ctaB: "Vertel ons uw organisme, procesfase en doel - wij laten zien waar Q‑Tector past en hoe snel u kunt starten.", primary: "Praat over uw proces", secondary: "Bekijk de technologie" },
      pl: { eyebrow: "Zastosowania", title: "Stworzony do produkcji", titleAccent: "biologicznej", lead: "Q‑Tector dopasowuje się do tego, jak różne zespoły pracują z żywymi procesami - od wczesnego rozwoju po monitoring produkcji.", cE: "Gdzie pasuje Q‑Tector", cH: "Cztery sposoby wykorzystania", csE: "Case studies", csH: "Q‑Tector w praktyce", ctaH: "Masz proces na oku?", ctaB: "Powiedz nam o organizmie, etapie procesu i celu - pokażemy, gdzie pasuje Q‑Tector i jak szybko zaczniesz.", primary: "Porozmawiaj o procesie", secondary: "Zobacz technologię" },
    };
    const per = {};
    for (const l of LANGS) per[l] = {
      hero: { eyebrow: h[l].eyebrow, title: h[l].title, titleAccent: h[l].titleAccent, lead: h[l].lead, image: imageField("appHero", "Fermentation"), primaryCta: cta(h[l].primary, "#contact"), secondaryCta: cta(h[l].secondary, "/technology", "ghost") },
      categoriesEyebrow: h[l].cE, categoriesHeading: h[l].cH,
      categories: cats[l].map(([tag, title, text, im, points], i) => ({ _key: "cat" + i, _type: "category", tag, title, text, image: imageField(im, title), points })),
      caseStudiesEyebrow: h[l].csE, caseStudiesHeading: h[l].csH,
      caseStudies: Object.keys(cs).map((k, i) => ({ _key: "cs" + i, ...ref(`caseStudy-${k}-${l}`) })),
      cta: { heading: h[l].ctaH, body: h[l].ctaB, button: cta(h[l].primary === "Talk to us about your process" ? "Talk to us" : h[l].primary, "#contact") },
    };
    await putTranslated("applicationsPage", "applications", per);
  }

  // INVESTORS
  {
    const d = {
      en: {
        hero: { title: "Accessible process control for the next generation of", titleAccent: "biotech & fermentation", body1: "SG Papertronics develops compact analytical platforms that help companies monitor biological and fermentation processes with actionable data - closer to production, easier to use, and scalable.", body2: "We are preparing for our Series A round to accelerate commercial expansion and bring Q‑Tector into more biotech, fermentation, CDMO and food-tech environments.", primary: "Request investor deck", secondary: "Contact investor relations" },
        whyNow: { eyebrow: "Why now", heading: "Biological production is scaling - process control isn't keeping up", body1: "Precision fermentation, cellular agriculture, functional foods and contract biomanufacturing all depend on understanding and controlling living processes.", body2: "Yet many teams still make critical decisions with limited real-time data. SG Papertronics is positioned to serve that need.", pains: ["Samples are sent to central labs - results arrive too late", "Process development teams struggle to compare runs", "Production teams lack simple tools for frequent monitoring", "CDMOs need scalable, standardized ways to support many client processes"] },
        mission: { eyebrow: "Our mission", heading: "Make process control", headingAccent: "accessible, actionable and scalable", body: "The earlier teams start measuring, the faster they learn. The more consistently they measure, the easier it is to scale." },
        platform: { eyebrow: "The platform", heading: "Q‑Tector: at-line analytics for living processes", body: "A compact lab-in-a-box for process-relevant measurements - simple enough for routine use, while creating structured data.", features: ["A compact readout device", "Ready-to-use assay pods", "QR-guided workflows", "App-based instructions", "Cloud-connected result storage", "Trend analysis & exportable datasets"] },
        problem: { eyebrow: "What we solve", heading: "Biological processes are dynamic - data often arrives too late", body: "Without frequent process data, teams may only discover deviations after a batch is finished. Q‑Tector helps teams move from delayed analysis to actionable process control." },
        benefits: [["Biotech & precision fermentation", "Monitor nutrient consumption, compare media and feed strategies, and generate structured datasets from early experiments onward.", "Faster learning cycles and stronger process understanding."], ["CDMOs", "Standardize process monitoring across client projects and provide clearer process data to customers.", "More scalable analytical workflows and stronger client reporting."], ["Fermented food & beverage", "Monitor sugars, acidity and process stability during fermentation, formulation and shelf-life validation.", "Better control of product consistency, quality and regulatory risk."], ["Applied biotech & agri-food", "Support practical measurement workflows in complex biological systems.", "Better connection between R&D, pilot testing and real-world implementation."]],
        market: { eyebrow: "Market opportunity", heading: "Process control is becoming a bottleneck for biological production", subtitle: "Companies working with microbial, enzymatic or cell-based processes need more frequent and accessible data.", items: ["Precision fermentation companies", "CDMOs & contract development teams", "Food-tech & functional beverage companies", "Industrial biotechnology companies", "Agri-food innovation projects", "Research & pilot production facilities"] },
        seriesA: { eyebrow: "Series A focus", heading: "Scaling Q‑Tector commercially and technically", items: [["Commercial expansion", "Grow sales and business development toward biotech, fermentation, CDMO and food-tech customers."], ["Product & assay portfolio", "Broaden the Q‑Tector application range with additional assays."], ["Data platform", "Strengthen the software around result history, trends, batch comparison and reporting."], ["Manufacturing scale-up", "Improve production readiness for devices, assay pods and support."], ["Application partnerships", "Build deeper collaborations to validate use cases and create commercial proof points."]] },
        thesis: { eyebrow: "Investment thesis", heading: "The process-control layer for accessible biomanufacturing", items: ["A platform technology with multiple application markets", "A validated first commercial use case through Beer-o-Meter", "Growing relevance in fermentation, biotech and CDMO environments", "A clear shift from single measurements to structured process data", "A scalable consumables model through assay pods", "Strong regional innovation links in the Northern Netherlands", "A mission aligned with the future of biological production"] },
      },
      nl: {
        hero: { title: "Toegankelijke procescontrole voor de volgende generatie", titleAccent: "biotech & fermentatie", body1: "SG Papertronics ontwikkelt compacte analytische platforms die bedrijven helpen biologische en fermentatieprocessen te monitoren met bruikbare data - dichter bij productie, eenvoudiger en schaalbaar.", body2: "We bereiden onze Series A-ronde voor om commerciele groei te versnellen en Q‑Tector naar meer biotech-, fermentatie-, CDMO- en food-tech-omgevingen te brengen.", primary: "Vraag investor deck aan", secondary: "Contact investor relations" },
        whyNow: { eyebrow: "Waarom nu", heading: "Biologische productie schaalt op - procescontrole houdt geen gelijke tred", body1: "Precisiefermentatie, cellulaire landbouw, functionele voeding en contractproductie zijn afhankelijk van het begrijpen en beheersen van levende processen.", body2: "Toch nemen veel teams cruciale beslissingen met beperkte realtime data. SG Papertronics is gepositioneerd om die behoefte te bedienen.", pains: ["Monsters gaan naar centrale labs - resultaten komen te laat", "Ontwikkelteams kunnen runs moeilijk vergelijken", "Productieteams missen eenvoudige tools voor frequente monitoring", "CDMO's hebben schaalbare, gestandaardiseerde manieren nodig"] },
        mission: { eyebrow: "Onze missie", heading: "Maak procescontrole", headingAccent: "toegankelijk, bruikbaar en schaalbaar", body: "Hoe eerder teams gaan meten, hoe sneller ze leren. Hoe consistenter ze meten, hoe makkelijker het opschaalt." },
        platform: { eyebrow: "Het platform", heading: "Q‑Tector: at-line analyse voor levende processen", body: "Een compacte lab-in-a-box voor procesrelevante metingen - eenvoudig genoeg voor routinegebruik, terwijl het gestructureerde data creeert.", features: ["Een compact uitleesapparaat", "Kant-en-klare assay-pods", "QR-workflows", "App-instructies", "Cloud-opslag van resultaten", "Trendanalyse & exporteerbare datasets"] },
        problem: { eyebrow: "Wat we oplossen", heading: "Biologische processen zijn dynamisch - data komt vaak te laat", body: "Zonder frequente procesdata ontdekken teams afwijkingen pas na afloop van een batch. Q‑Tector helpt van vertraagde analyse naar bruikbare procescontrole." },
        benefits: [["Biotech & precisiefermentatie", "Monitor nutrientenverbruik, vergelijk media- en voedingsstrategieen en genereer gestructureerde datasets.", "Snellere leercycli en beter procesbegrip."], ["CDMO's", "Standaardiseer procesmonitoring over klantprojecten en lever helderdere procesdata.", "Schaalbaardere workflows en sterkere klantrapportage."], ["Gefermenteerde food & beverage", "Monitor suikers, zuurgraad en processtabiliteit tijdens fermentatie en houdbaarheidsvalidatie.", "Betere controle over consistentie, kwaliteit en regelgevingsrisico."], ["Toegepaste biotech & agri-food", "Ondersteun praktische meetworkflows in complexe biologische systemen.", "Betere verbinding tussen R&D, pilot en implementatie."]],
        market: { eyebrow: "Marktkans", heading: "Procescontrole wordt een knelpunt voor biologische productie", subtitle: "Bedrijven met microbiele, enzymatische of celgebaseerde processen hebben frequentere en toegankelijkere data nodig.", items: ["Precisiefermentatiebedrijven", "CDMO's & contractontwikkeling", "Food-tech & functionele dranken", "Industriele biotechnologie", "Agri-food-innovatieprojecten", "Onderzoek & pilotproductie"] },
        seriesA: { eyebrow: "Series A-focus", heading: "Q‑Tector commercieel en technisch opschalen", items: [["Commerciele expansie", "Sales en business development richting biotech-, fermentatie-, CDMO- en food-tech-klanten."], ["Product- & assay-portfolio", "Breid het Q‑Tector-toepassingsbereik uit met extra assays."], ["Dataplatform", "Versterk de software rond resultaathistorie, trends, batchvergelijking en rapportage."], ["Productie-opschaling", "Verbeter productiegereedheid voor apparaten, assay-pods en support."], ["Applicatiepartnerschappen", "Bouw diepere samenwerkingen om use cases te valideren."]] },
        thesis: { eyebrow: "Investeringsthese", heading: "De procescontrole-laag voor toegankelijke biomanufacturing", items: ["Een platformtechnologie met meerdere toepassingsmarkten", "Een gevalideerde eerste use case via Beer-o-Meter", "Groeiende relevantie in fermentatie, biotech en CDMO", "Een duidelijke verschuiving naar gestructureerde procesdata", "Een schaalbaar verbruiksmodel via assay-pods", "Sterke regionale innovatieverbindingen in Noord-Nederland", "Een missie afgestemd op de toekomst van biologische productie"] },
      },
      pl: {
        hero: { title: "Dostępna kontrola procesu dla nowej generacji", titleAccent: "biotech i fermentacji", body1: "SG Papertronics tworzy kompaktowe platformy analityczne, które pomagają firmom monitorować procesy biologiczne i fermentacyjne użytecznymi danymi - bliżej produkcji, prościej i skalowalnie.", body2: "Przygotowujemy rundę Series A, aby przyspieszyć ekspansję komercyjną i wprowadzić Q‑Tector do kolejnych środowisk biotech, fermentacji, CDMO i food-tech.", primary: "Poproś o deck inwestorski", secondary: "Kontakt dla inwestorów" },
        whyNow: { eyebrow: "Dlaczego teraz", heading: "Produkcja biologiczna się skaluje - kontrola procesu nie nadąża", body1: "Fermentacja precyzyjna, rolnictwo komórkowe, żywność funkcjonalna i produkcja kontraktowa zależą od rozumienia i kontroli żywych procesów.", body2: "Wiele zespołów wciąż podejmuje kluczowe decyzje przy ograniczonych danych w czasie rzeczywistym. SG Papertronics odpowiada na tę potrzebę.", pains: ["Próbki jadą do centralnych laboratoriów - wyniki są za późno", "Zespoły rozwoju trudno porównują serie", "Produkcja nie ma prostych narzędzi do częstego monitoringu", "CDMO potrzebują skalowalnych, ustandaryzowanych metod"] },
        mission: { eyebrow: "Nasza misja", heading: "Uczyń kontrolę procesu", headingAccent: "dostępną, użyteczną i skalowalną", body: "Im wcześniej zespoły zaczynają mierzyć, tym szybciej się uczą. Im bardziej konsekwentnie mierzą, tym łatwiej skalować." },
        platform: { eyebrow: "Platforma", heading: "Q‑Tector: analityka przyprocesowa dla żywych procesów", body: "Kompaktowe lab-in-a-box do istotnych pomiarów - proste w rutynowym użyciu, a tworzące ustrukturyzowane dane.", features: ["Kompaktowy czytnik", "Gotowe kapsuły assay", "Workflow z kodami QR", "Instrukcje w aplikacji", "Zapis wyników w chmurze", "Analiza trendów i eksport danych"] },
        problem: { eyebrow: "Co rozwiązujemy", heading: "Procesy biologiczne są dynamiczne - dane często docierają za późno", body: "Bez częstych danych zespoły wykrywają odchylenia dopiero po zakończeniu serii. Q‑Tector przenosi z opóźnionej analizy do użytecznej kontroli procesu." },
        benefits: [["Biotech i fermentacja precyzyjna", "Monitoruj zużycie składników, porównuj strategie mediów i zasilania oraz twórz ustrukturyzowane dane.", "Szybsze cykle nauki i lepsze rozumienie procesu."], ["CDMO", "Ujednolić monitoring w projektach klientów i dostarczaj czytelniejsze dane procesowe.", "Bardziej skalowalne workflow i lepsze raporty dla klientów."], ["Żywność i napoje fermentowane", "Monitoruj cukry, kwasowość i stabilność podczas fermentacji i walidacji trwałości.", "Lepsza kontrola spójności, jakości i ryzyka regulacyjnego."], ["Biotech stosowana i agri-food", "Wspieraj praktyczne workflow pomiarowe w złożonych systemach biologicznych.", "Lepsze powiązanie R&D, pilotażu i wdrożenia."]],
        market: { eyebrow: "Szansa rynkowa", heading: "Kontrola procesu staje się wąskim gardłem produkcji biologicznej", subtitle: "Firmy pracujące z procesami mikrobiologicznymi, enzymatycznymi lub komórkowymi potrzebują częstszych i dostępniejszych danych.", items: ["Firmy fermentacji precyzyjnej", "CDMO i rozwój kontraktowy", "Food-tech i napoje funkcjonalne", "Biotechnologia przemysłowa", "Projekty innowacji agri-food", "Ośrodki badawcze i pilotażowe"] },
        seriesA: { eyebrow: "Fokus Series A", heading: "Skalowanie Q‑Tectora komercyjnie i technicznie", items: [["Ekspansja komercyjna", "Rozwój sprzedaży do klientów biotech, fermentacji, CDMO i food-tech."], ["Portfolio produktu i testów", "Poszerzenie zakresu zastosowań Q‑Tectora o kolejne testy."], ["Platforma danych", "Wzmocnienie oprogramowania: historia wyników, trendy, porównania serii, raporty."], ["Skalowanie produkcji", "Gotowość produkcyjna urządzeń, kapsuł i wsparcia."], ["Partnerstwa aplikacyjne", "Głębsze współprace do walidacji zastosowań."]] },
        thesis: { eyebrow: "Teza inwestycyjna", heading: "Warstwa kontroli procesu dla dostępnej biomanufaktury", items: ["Technologia platformowa z wieloma rynkami zastosowań", "Zwalidowany pierwszy przypadek użycia przez Beer-o-Meter", "Rosnące znaczenie w fermentacji, biotech i CDMO", "Wyraźne przejście do ustrukturyzowanych danych procesowych", "Skalowalny model materiałów zużywalnych przez kapsuły", "Silne regionalne powiązania innowacyjne w północnej Holandii", "Misja zgodna z przyszłością produkcji biologicznej"] },
      },
    };
    const per = {};
    for (const l of LANGS) {
      const x = d[l];
      per[l] = {
        hero: { title: x.hero.title, titleAccent: x.hero.titleAccent, body1: x.hero.body1, body2: x.hero.body2, image: imageField("lab", "SG Papertronics"), primaryCta: cta(x.hero.primary, "mailto:m.grajewski@sgpapertronics.com"), secondaryCta: cta(x.hero.secondary, "mailto:m.grajewski@sgpapertronics.com", "ghost") },
        whyNow: { eyebrow: x.whyNow.eyebrow, heading: x.whyNow.heading, body1: x.whyNow.body1, body2: x.whyNow.body2, painPoints: x.whyNow.pains },
        mission: x.mission,
        platform: x.platform,
        problem: x.problem,
        benefits: x.benefits.map(([tag, text, benefit], i) => ({ _key: "b" + i, _type: "b", tag, text, benefit })),
        marketEyebrow: x.market.eyebrow, marketHeading: x.market.heading, marketSubtitle: x.market.subtitle, market: x.market.items,
        seriesAEyebrow: x.seriesA.eyebrow, seriesAHeading: x.seriesA.heading,
        seriesA: x.seriesA.items.map(([title, text], i) => ({ _key: "s" + i, _type: "s", title, text })),
        thesisEyebrow: x.thesis.eyebrow, thesisHeading: x.thesis.heading, thesis: x.thesis.items,
      };
    }
    await putTranslated("investorsPage", "investors", per);
  }

  // ABOUT
  {
    const d = {
      en: { hero: { eyebrow: "About us", title: "About", titleAccent: "SG Papertronics", lead: "SG Papertronics develops accessible analytical technology for companies working with biological and fermentation processes.", caption: "The team · Groningen", primary: "Talk to us", secondary: "See the technology" }, why: { eyebrow: "Why we exist", heading: "Better process data shouldn't be reserved for big labs", body1: "We believe better process data should not be limited to large laboratories or late-stage quality control. Teams developing living products need practical, frequent and actionable measurements.", body2: "Our core platform, Q‑Tector, brings at-line testing, guided workflows and connected data handling into one compact system." }, valuesE: "What Q‑Tector delivers", valuesH: "Understand earlier, act faster, scale with confidence", values: [["Understand earlier", "Practical, frequent measurements throughout development, optimization and production - not only late-stage QC."], ["Act faster", "At-line testing, guided workflows and connected data handling in one compact system."], ["Scale with confidence", "Structured process data that carries knowledge from the first experiment through to production."]], mission: { eyebrow: "Our mission", lead: "Our background combines biotechnology, microfluidics, assay development, device engineering and real-world process-control experience.", heading: "Make process control", headingAccent: "accessible, actionable and scalable." } },
      nl: { hero: { eyebrow: "Over ons", title: "Over", titleAccent: "SG Papertronics", lead: "SG Papertronics ontwikkelt toegankelijke analytische technologie voor bedrijven die met biologische en fermentatieprocessen werken.", caption: "Het team · Groningen", primary: "Neem contact op", secondary: "Bekijk de technologie" }, why: { eyebrow: "Waarom we bestaan", heading: "Betere procesdata hoort niet alleen bij grote labs", body1: "Wij geloven dat betere procesdata niet beperkt mag zijn tot grote laboratoria of late kwaliteitscontrole. Teams die levende producten ontwikkelen hebben praktische, frequente en bruikbare metingen nodig.", body2: "Ons kernplatform Q‑Tector brengt at-line testen, begeleide workflows en verbonden dataverwerking samen in een compact systeem." }, valuesE: "Wat Q‑Tector levert", valuesH: "Eerder begrijpen, sneller handelen, met vertrouwen opschalen", values: [["Eerder begrijpen", "Praktische, frequente metingen door ontwikkeling, optimalisatie en productie - niet alleen late QC."], ["Sneller handelen", "At-line testen, begeleide workflows en verbonden data in een compact systeem."], ["Met vertrouwen opschalen", "Gestructureerde procesdata die kennis meeneemt van eerste experiment tot productie."]], mission: { eyebrow: "Onze missie", lead: "Onze achtergrond combineert biotechnologie, microfluidica, assay-ontwikkeling, apparaatengineering en praktijkervaring met procescontrole.", heading: "Maak procescontrole", headingAccent: "toegankelijk, bruikbaar en schaalbaar." } },
      pl: { hero: { eyebrow: "O nas", title: "O", titleAccent: "SG Papertronics", lead: "SG Papertronics tworzy dostępną technologię analityczną dla firm pracujących z procesami biologicznymi i fermentacyjnymi.", caption: "Zespół · Groningen", primary: "Napisz do nas", secondary: "Zobacz technologię" }, why: { eyebrow: "Dlaczego istniejemy", heading: "Lepsze dane procesowe nie są tylko dla dużych laboratoriów", body1: "Wierzymy, że lepsze dane procesowe nie powinny być ograniczone do dużych laboratoriów czy późnej kontroli jakości. Zespoły tworzące żywe produkty potrzebują praktycznych, częstych i użytecznych pomiarów.", body2: "Nasza platforma Q‑Tector łączy testy przyprocesowe, prowadzone workflow i połączone dane w jednym kompaktowym systemie." }, valuesE: "Co daje Q‑Tector", valuesH: "Rozumiej wcześniej, działaj szybciej, skaluj pewnie", values: [["Rozumiej wcześniej", "Praktyczne, częste pomiary w rozwoju, optymalizacji i produkcji - nie tylko późna kontrola jakości."], ["Działaj szybciej", "Testy przyprocesowe, prowadzone workflow i połączone dane w kompaktowym systemie."], ["Skaluj pewnie", "Ustrukturyzowane dane przenoszące wiedzę od pierwszego eksperymentu po produkcję."]], mission: { eyebrow: "Nasza misja", lead: "Nasze doświadczenie łączy biotechnologię, mikropłyny, rozwój testów, inżynierię urządzeń i praktykę kontroli procesu.", heading: "Uczyń kontrolę procesu", headingAccent: "dostępną, użyteczną i skalowalną." } },
    };
    const per = {};
    for (const l of LANGS) {
      const x = d[l];
      per[l] = {
        hero: { eyebrow: x.hero.eyebrow, title: x.hero.title, titleAccent: x.hero.titleAccent, lead: x.hero.lead, image: imageField("team", "The team"), imageCaption: x.hero.caption, primaryCta: cta(x.hero.primary, "#contact"), secondaryCta: cta(x.hero.secondary, "/technology", "ghost") },
        whyWeExist: { eyebrow: x.why.eyebrow, heading: x.why.heading, body1: x.why.body1, body2: x.why.body2, image: imageField("lab", "Lab") },
        valuesEyebrow: x.valuesE, valuesHeading: x.valuesH,
        values: x.values.map(([title, text], i) => ({ _key: "v" + i, _type: "v", title, text })),
        mission: x.mission,
        partners: partnerIds.map((id, i) => ({ _key: "p" + i, ...ref(id) })),
      };
    }
    await putTranslated("aboutPage", "about", per);
  }

  /* ---------- SEO (meta title / description) ---------- */
  console.log("SEO…");
  {
    const clip = (s, n = 158) => { s = (s || "").trim(); if (s.length <= n) return s; const cut = s.slice(0, n); return cut.slice(0, cut.lastIndexOf(" ")) + "…"; };
    const S = (title, description) => ({ _type: "seo", title, description: clip(description) });
    const pageSeo = {
      homePage: {
        en: S("SG Papertronics - Process control for biotech and fermentation", "Q‑Tector is an at-line testing platform built for living processes. Turn small samples into actionable process data - from development to production."),
        nl: S("SG Papertronics - Procescontrole voor biotech en fermentatie", "Q‑Tector is een at-line testplatform voor levende processen. Verander kleine monsters in bruikbare procesdata - van ontwikkeling tot productie."),
        pl: S("SG Papertronics - Kontrola procesu dla biotech i fermentacji", "Q‑Tector to przyprocesowa platforma testowa dla żywych procesów. Zamień małe próbki w użyteczne dane procesowe - od rozwoju po produkcję."),
      },
      technologyPage: {
        en: S("Q‑Tector technology - SG Papertronics", "A compact at-line testing platform for process-relevant measurements: readout device, ready-to-use assay pods, QR-guided workflows and cloud-connected data."),
        nl: S("Q‑Tector-technologie - SG Papertronics", "Een compact at-line testplatform voor procesrelevante metingen: uitleesapparaat, kant-en-klare assay-pods, QR-gestuurde workflows en cloud-gekoppelde data."),
        pl: S("Technologia Q‑Tector - SG Papertronics", "Kompaktowa przyprocesowa platforma testowa do pomiarów istotnych dla procesu: czytnik, gotowe pody assay, workflow z kodem QR i dane w chmurze."),
      },
      applicationsPage: {
        en: S("Applications - SG Papertronics", "Q‑Tector applications across biotech & precision fermentation, CDMOs, fermented food & beverage and applied biotech & agri-food."),
        nl: S("Toepassingen - SG Papertronics", "Q‑Tector-toepassingen in biotech & precisiefermentatie, CDMO's, gefermenteerd eten & drinken en toegepaste biotech & agri-food."),
        pl: S("Zastosowania - SG Papertronics", "Zastosowania Q‑Tectora w biotechnologii i fermentacji precyzyjnej, CDMO, fermentowanej żywności i napojach oraz agri-food."),
      },
      investorsPage: {
        en: S("Investor relations - SG Papertronics", "SG Papertronics is preparing for its Series A round - accessible, at-line process-control technology (Q‑Tector) for biotech, fermentation, CDMO and food-tech companies."),
        nl: S("Investor relations - SG Papertronics", "SG Papertronics bereidt zijn Series A-ronde voor - toegankelijke, at-line procescontroletechnologie (Q‑Tector) voor biotech, fermentatie, CDMO en food-tech."),
        pl: S("Relacje inwestorskie - SG Papertronics", "SG Papertronics przygotowuje rundę Series A - dostępna, przyprocesowa technologia kontroli procesu (Q‑Tector) dla biotech, fermentacji, CDMO i food-tech."),
      },
      aboutPage: {
        en: S("About - SG Papertronics", "SG Papertronics develops accessible analytical technology for companies working with biological and fermentation processes."),
        nl: S("Over ons - SG Papertronics", "SG Papertronics ontwikkelt toegankelijke analytische technologie voor bedrijven die met biologische en fermentatieprocessen werken."),
        pl: S("O nas - SG Papertronics", "SG Papertronics tworzy dostępną technologię analityczną dla firm pracujących z procesami biologicznymi i fermentacyjnymi."),
      },
    };
    let tx = client.transaction();
    const pageDocs = await client.fetch(`*[_type in $t]{_id,_type,language}`, { t: Object.keys(pageSeo) });
    for (const p of pageDocs) { const s = pageSeo[p._type]?.[p.language] ?? pageSeo[p._type]?.en; if (s) tx = tx.patch(p._id, (patch) => patch.set({ seo: s })); }
    const newsDocs = await client.fetch(`*[_type=="newsArticle"]{_id,title,excerpt}`);
    for (const a of newsDocs) tx = tx.patch(a._id, (patch) => patch.set({ seo: S(a.title, a.excerpt || a.title) }));
    await tx.commit();
    console.log(`  ✓ SEO on ${pageDocs.length} pages + ${newsDocs.length} news`);
  }

  console.log("\nDone ✓");
}

main().catch((e) => { console.error(e); process.exit(1); });
