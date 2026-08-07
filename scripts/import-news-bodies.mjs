/**
 * One-off (idempotent) import of legacy news article bodies into Sanity.
 * Scraped from the old sgpapertronics.com site, converted to portable text,
 * emojis stripped. Sets `body` on the EN docs and clears their `externalUrl`
 * so the articles resolve internally (/news/[slug]).
 *
 * Run: node scripts/import-news-bodies.mjs
 */
import { createClient } from "next-sanity";
import { readFileSync, existsSync } from "node:fs";

const root = process.cwd();
for (const line of existsSync(`${root}/.env.local`) ? readFileSync(`${root}/.env.local`, "utf8").split("\n") : []) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2];
}
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-10-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

/* ---------- emoji / cleanup ---------- */
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{200D}]/gu;
const clean = (s) => s.replace(EMOJI, "").replace(/[ \t]{2,}/g, " ").trim();

/* ---------- markdown -> portable text ---------- */
let keyN = 0;
const key = () => `k${(keyN++).toString(36)}`;

// inline parser: **bold** and [text](url)
function spans(text) {
  const out = [];
  const markDefs = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((https?:\/\/[^)]+)\)/g;
  let last = 0, m;
  const push = (t, marks) => { if (t) out.push({ _type: "span", _key: key(), text: t, marks: marks || [] }); };
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index));
    if (m[1] !== undefined) push(m[1], ["strong"]);
    else { const dk = key(); markDefs.push({ _type: "link", _key: dk, href: m[3] }); push(m[2], [dk]); }
    last = re.lastIndex;
  }
  push(text.slice(last));
  if (!out.length) out.push({ _type: "span", _key: key(), text: "", marks: [] });
  return { children: out, markDefs };
}

function block(style, text, listItem) {
  const { children, markDefs } = spans(text);
  const b = { _type: "block", _key: key(), style, markDefs, children };
  if (listItem) { b.listItem = listItem; b.level = 1; }
  return b;
}

function toPortableText(md) {
  const lines = md.split("\n");
  const blocks = [];
  for (let raw of lines) {
    const line = clean(raw);
    if (!line) continue;
    if (line.startsWith("# ")) continue; // drop H1 (title lives in its own field)
    if (line.startsWith("## ")) blocks.push(block("h2", line.slice(3).trim()));
    else if (/^[-*]\s+/.test(line)) blocks.push(block("normal", line.replace(/^[-*]\s+/, ""), "bullet"));
    else blocks.push(block("normal", line));
  }
  return blocks;
}

/* ---------- scraped bodies (markdown) ---------- */
const bodies = {
  "living-fermentation": `Fermented drinks are gaining attention for a good reason. They offer complexity, acidity, freshness and a culinary role that can sit next to beer and wine, while opening new possibilities for consumers looking for flavourful alternatives. A recent article in Dagblad van het Noorden highlighted this movement through the work of Floris and his team in Groningen, who are developing living foods and drinks with a clear culinary ambition.

At SG Papertronics and Beer-o-Meter, we are excited to support this type of local innovation with something every fermentation-driven product needs: actionable process data.

Fermentation is powerful, but it is also dynamic. A living drink is not simply a recipe in a bottle. It is the result of microbial activity, sugars, acidity, time, temperature and stabilization choices. Small changes in these parameters can influence flavour, alcohol formation, shelf-life stability and product consistency. This is why process control becomes so important.

Our collaboration with Parrhesia focuses on helping the team better understand what happens during production and product development. By measuring key parameters such as sugars and pH at different stages of the process, we can support decisions that are normally difficult to make by sensory evaluation alone.

For product developers, this creates immediate value. Data can show when fermentation is complete, how much fermentable sugar remains, whether a formulation is stable after flavouring, and whether the final product behaves consistently over time. It also helps identify the right moment for interventions such as cooling, pasteurization, filtration or recipe adjustment.

This is especially relevant for fermented drinks positioned as premium, culinary or alcohol-free alternatives. In these categories, quality is not only about taste. It is also about consistency, safety, labelling confidence and consumer trust. Reliable process data helps producers protect the product story they want to tell.

We also want to thank SNN for stimulating local collaborations like this. SNN's proeftuin approach highlights the value of giving entrepreneurs access to knowledge, expertise and facilities to test and develop innovative ideas in the Northern Netherlands.

For us, this is exactly what regional innovation should look like: local companies working together, combining practical product development with analytical technology, and turning promising ideas into scalable businesses.

These collaborations do more than solve technical questions. They build long-term business relationships in the Groningen region. They connect startups, food producers, researchers, technologists and support organisations around real market needs. They also help create meaningful work for technical talent in the region.

That matters. If we want Groningen and the Northern Netherlands to become stronger in food innovation, fermentation, biotechnology and process technology, we need projects where local talent can learn, contribute and grow. Collaborations like this help retain people in the region, attract new talent, and show that high-quality innovation does not only happen in traditional biotech or food hubs.

At SG Papertronics and Beer-o-Meter, our goal is simple: make laboratory-grade process insights easier to access, closer to production, and more useful for decision-making.

Whether it is beer, kombucha, water kefir, precision fermentation or other fermented products, the principle is the same. Better data leads to better decisions. Better decisions lead to better products.

We are proud to contribute to this growing fermentation ecosystem in Groningen and look forward to supporting more local producers with the tools and data they need to develop consistent, high-quality products.`,

  "cbc26-future": `The 2026 Craft Brewers Conference & BrewExpo America in Philadelphia made one thing clear: the brewing industry is evolving rapidly, and breweries are actively searching for smarter, more practical ways to adapt.

This year's CBC felt different from previous editions (as we have heard). The atmosphere was still energetic and optimistic, but the conversations were noticeably more focused on operational reality. Brewers are no longer discussing growth for the sake of growth. Instead, they are asking deeper questions:

- How do we improve consistency?
- How do we remain profitable?
- How do we optimize fermentation and reduce waste?
- How do we produce high-quality lagers and non-alcoholic beers?
- How do we build stronger local customer relationships?
- How do we modernize quality control without overwhelming the brewery team?

For us at Beer-o-Meter, these discussions strongly confirmed that brewing is entering a new era, one where accessible innovation and practical process control will become essential.

## Hop creep became one of the biggest conversation starters

Interestingly, hop creep generated some of the strongest reactions at our booth. Brewers immediately recognized the problem:

- unexpected refermentation
- unstable final gravity
- carbonation issues
- process unpredictability

Even breweries that are not heavily focused on dry hopping appreciated the idea of having better process control available when needed. Brewers are actively looking for tools that help them make better operational decisions without creating excessive complexity.

## Brewing is becoming more community driven

Another fascinating observation was how breweries are responding to market consolidation. Larger breweries increasingly view mergers, acquisitions, and strategic partnerships as part of the natural evolution of the market. Smaller breweries, however, are often focusing on local communities, brewpubs, restaurants, customer experiences and collaborations with neighboring breweries.

Breweries are adapting rather than resisting change. This creates an environment where consistency, customer trust, and operational professionalism become increasingly valuable competitive advantages.

## German-style lagers and cleaner beer trends

German-style lagers, Helles, Pilsners, Rice lagers, and lower alcohol and sessionable beers represent a significant market shift. This shift toward cleaner, more delicate beer styles creates new technical challenges. Unlike heavily hopped beers, lagers expose process inconsistencies very quickly. Oxygen pickup, fermentation instability, sulfur compounds, hop creep, and microbiological issues become much more visible.

As breweries increasingly move toward these styles, quality control and fermentation monitoring become more important than ever.

## Non-alcoholic beer is no longer a niche

Another major theme at CBC26 was non-alcoholic beer. What stood out most was that breweries are no longer asking if they should explore NA beer but they are asking how to do it efficiently and profitably. Many breweries are experimenting with specialized yeast strains, low-alcohol fermentation approaches, soda and hybrid beverage concepts and alternative fermentation products.

At the same time, many brewers openly discussed the operational challenges associated with NA production: residual sugars, microbiological risks, shelf stability, process validation and alcohol verification. These are exactly the types of challenges where modern analytical tools and structured brewing data become critical.

## Breweries want simplicity, not more complexity

One of the most valuable lessons from CBC26 came directly from our conversations with brewers. Breweries do not want another complicated system, they want practical workflows, easy-to-use tools, clear process insights, portable solutions, systems that fit breweries of different sizes and solutions that can scale with their organization.

What resonated most strongly was not hardware specifications but the ability to solve real brewing problems in a practical and accessible way.

## What CBC26 confirmed for Beer-o-Meter

CBC26 strongly reinforced our belief that the future of brewing quality control is not industrial complexity. The future is accessible innovation, practical fermentation analytics, scalable QC workflows, actionable brewing insights and flexible process control systems.

Breweries want solutions that help them improve step by step, solutions that can grow together with the organization. And that is exactly the direction we continue to build toward with Beer-o-Meter.

We would like to thank everyone who visited our booth, shared insights, challenged our thinking, and discussed the future of brewing with us. CBC26 gave us enormous energy and confidence about where the brewing industry is heading and we are excited to continue building solutions that help breweries adapt, improve, and grow.`,

  "cbc26-relationships": `CBC26 and BrewExpo America in Philadelphia were an incredibly important milestone for Beer-o-Meter.

For several days we had the opportunity to meet brewers, suppliers, laboratories, consultants, yeast companies, and brewing organizations from across the United States and beyond. The conference gave us not only visibility, but also direct insight into the real operational challenges breweries are currently facing.

Most importantly, CBC26 confirmed that breweries are actively searching for practical and scalable approaches to process control and quality assurance.

## Our mission at CBC26

Our goal for the conference was not simply to sell a device. We came to CBC26 to understand the US brewing market better, learn how breweries approach process control, build relationships with brewers and industry partners, identify where Beer-o-Meter can create the most value, refine our value proposition and test commercial messaging. And the response exceeded our expectations.

## The conversations that defined the conference

One of the biggest positives was how strongly brewers responded to discussions around hop creep. Almost every brewer immediately recognized the issue: unstable fermentation, unexpected refermentation, carbonation problems, process inconsistency and dry hopping unpredictability.

Hop creep became one of the strongest conversation starters at our booth because it connects directly to real operational pain points. What was especially encouraging was that brewers did not only react positively to the idea of measurement, they appreciated the possibility of gaining practical control over their process.

## Brewers want practical solutions

A recurring theme during CBC26 was simplicity. Breweries repeatedly told us they are overwhelmed by disconnected systems, complicated workflows, excessive data without interpretation and solutions that require too much time or expertise.

What resonated most strongly about Beer-o-Meter was portability, ease of use, flexibility, structured brewing data, fermentation control support and practical implementation & data integration.

Many breweries openly admitted that they want better process control, but they are unsure whether their organization is mature enough to implement large QC systems. This was a very important insight for us. It reinforced our belief that the future belongs to solutions that can start small, solve one practical problem first, scale with the brewery and support gradual process improvement.

## Pilot projects generated strong interest

One of the strongest commercial approaches during the conference was offering breweries small pilot projects and paid trials. This approach worked very well because it reduced perceived risk, built trust, allowed breweries to test the workflow themselves and demonstrated value operationally.

Breweries responded very positively to the idea that Beer-o-Meter is not only a product, but also a partner willing to support data interpretation, process setup, implementation and operational learning. This low-risk, high-support approach appears extremely compatible with the US brewing market.

## Building relationships across the industry

Beyond brewer conversations, CBC26 also allowed us to establish valuable relationships with yeast suppliers, laboratories, brewing organizations, consultants, educational institutions and technical media. These relationships may create exciting opportunities for developing our presence on the professional brewing scene thanks to webinars, collaborative studies and educational projects.

## Looking ahead

CBC26 confirmed for us that the brewing industry is ready for a new approach to quality control, one that is practical, scalable, flexible, brewery-friendly and operationally realistic.

For Beer-o-Meter, this conference was about learning, validating, improving, and building long-term relationships. We are leaving Philadelphia energized, motivated, and excited about the future.

A huge thank you to everyone who visited our booth, shared insights, challenged our ideas, and discussed the future of brewing with us. This is only the beginning.`,

  "kvk-top-100": `Big news! SG Papertronics has qualified for the KVK Innovatie Top 100.

We're proud to see our hard work in developing the Beer-o-Meter recognized as one of the most promising innovations in the Netherlands. This recognition is about the power of local entrepreneurship and the role that innovative SMEs play in shaping the future of the Dutch economy.

With the Beer-o-Meter, we're on a mission to empower Dutch craft brewers. By making quality control accessible and easy, we help breweries focus on creativity and consistency, while contributing to the strength and reputation of Dutch craft beer, both at home and abroad.

Now, we ask for your support! You can help us climb higher in the ranking by casting your vote. Every click is a step towards showing how much impact small, ambitious companies can make.

[KVK Innovatie Top 100 editie 2025](https://www.kvkinnovatietop100.nl/site/029FF1044C6FB7C4C1258CBC003B5C4A)

Together, let's raise a glass to Dutch innovation, entrepreneurship, and the vibrant SME community that keeps our economy strong!`,

  "ces-2025": `We're thrilled to announce SG Papertronics will be exhibiting at CES 2025 in Las Vegas, where innovation transforms industry! As a leader in real-time lab testing for the food and beverage sector, we bring to the table a groundbreaking lab-in-a-box solution designed to optimize production, improve quality, and reduce waste. Our technology empowers producers to achieve up to a 15% increase in output while cutting waste by over 10%, all from under an ounce of sample.

We're eager to connect with partners and clients who share our vision for a sustainable future. With us, agriculture, food, and beverage industries can ensure precision, quality, and efficiency, delivering consistent, eco-friendly products to consumers.

Ready to take your business to the next level? Discover how our innovations can transform your processes at CES 2025. See you in Las Vegas!`,

  "finally-here": `Last Wednesday was a day to remember for SG Papertronics! We introduced our latest and greatest innovation, the Beer-o-Meter, to a diverse audience comprising customers, employees, investors, financiers, friends, family, and other partners. The atmosphere was electric, filled with excitement, joy, and meaningful conversations. We celebrated our team's hard work, dedication, and progress and toasted to the future!

Our new product is a game-changer for Craft Brewers. The Beer-o-Meter makes the critical testing elements of Total Quality Management accessible like never before. Our device, pods, and tests result from our team's relentless pursuit of excellence. We are proud of what we've achieved and thirsty for more. We were thrilled to share this experience with our guests. Some even tried their hands at the Beer-o-Meter for the first time, while others quickly demonstrated their expertise!

We want to express our heartfelt thanks to everyone who supported us in person or spirit. Your belief and support of our vision motivate us to reach new heights. Let's keep pushing boundaries and achieving new milestones together. The Beer-o-Meter and SG Papertronics' success are all thanks to you!

Stay tuned for more exciting updates, and thank you for being part of our journey!`,

  "mit-grant": `The consortium of Levels Diagnostics, Omnigen and SG Papertronics has been granted the MIT R&D collaboration grant.

By combining expertise in clinical biomarker development, bioinformatics and paper-based microfluidics the consortium will develop a novel liver damage assay.

Over the course of 2 years the consortium filled with young and ambitious SMEs will develop a test that can quickly and easily identify early signs of liver damage in patients resulting in reduction of treatment costs and the optimisation of treatment.

Conditions resulting from damaged liver are a huge societal burden resulting in increase of costs for the healthcare, therefore robust and quick screening testing for liver damage would provide a viable solution to the problem.

The grant proposal has been ranked in the top 10 of applications within the region. The total associated project budget is €1.000.000. And the province of Zuid Holland will be awarding a subsidy of €349.996 towards the project for the realisation of its goals and deliverables.`,

  "mit-subsidy": `In the one year project, we will develop a glucose sensor for microbial fermentation.

## The challenge

Effective oversight of processes involving living organisms is crucial for success. Regular monitoring of nutrient availability for microorganisms is vital, yet this monitoring carries significant costs and labor requirements. For experimental cultures, which are inherently small, the volume of medium consumed during testing becomes problematic, as resources get diverted from feeding the organisms to conducting tests.

## The solution

SG Papertronics and EV Biotech will collaborate to tackle these issues through their testing system. The companies aim to reduce the volume of the samples necessary for glucose testing and labour related to the performance of the test by leveraging microfluidic expertise. This approach will deliver a user-friendly solution enabling EV Biotech to validate and implement their microbial strain optimization efficiently.`,

  "flinc-pitch": `Rapid testing of craft beer. This is what SG Papertronics specializes in. Once again, we had the opportunity to present our innovative product. This time at Pitch Camp by Flinc.

The results are: enthusiastic brewers, interest from the market and the profit in the brand-new Flinc Pitch Camp, a favorable loan of 20 000 euros.

We are very grateful that we got another chance to improve the pace of development of our device. As our COO, Richard Rushby, said at the event, we are convinced we can use the prize to speed up our plans, namely to further improve our product and make it to the market.

The technology we are working on has again been recognized as innovative and worth appreciating. It is particularly important for us, as the competition was fierce and in the final, when we met Flow Money Automation, we were not sure of our victory until the very last moment. However, the jury chairman Bjorn Redmeijer, project manager at Flinc, stated: We have concluded that Papertronics can take the biggest step with the prize money.

## Winning pitch

The event, which was held digitally due to the current situation in the country, was preceded by a period of intensive preparation. Our management team received pitch training, we were coached by Flinc and assisted in their plans and forecasts.

On Oct 29th, we gave a 15-minute presentation on camera, from a studio in Leeuwarden. Two of the best startups had to stand in front of the lens again in the final to answer questions from the jury, consisting of representatives of NOM, Flinc and an external investor. Our CEO found this a surprisingly new experience: Very exciting. I have spoken to more than a thousand people. I didn't find that scary at all, but such a camera is much more terrifying.

SG Papertronics is working on developing an intuitive, portable and accurate device and the test system that can fathom brewed beer in a few minutes. The amount of alcohol, the acidity, the content of sugar, the color, the bitterness, these are all registered very quickly. And that helps brewers enormously to maintain or improve the quality of their beer.`,

  "nom-rug": `With the Beer-o-Meter, Groningen's SG Papertronics ensures that craft beer brewers can supply the highest quality beer. With this simple but high-quality plug-and-play testing system, we can register and analyse many values on the spot, such as colour, bitterness, acidity, sugar content and alcohol, within minutes.

For the fast-growing sector of craft beer brewers, the test system is a game changer, according to the founder of SG Papertronics, Maciej Grajewski. Continuous quality of the beer normally requires laboratory and trained personnel. The costs are simply too high for most craft breweries.

This test system, the Beer-o-Meter, makes a huge difference in costs and will also enable brewers to develop new specialty beers more quickly. The analysis will help the growing crowd of craft brewers to produce innovative beer of high and, above all, continuous quality.

The Beer-o-Meter has great potential which the NOM and RUG Holding also see. Jointly, they are making an early-phase investment in the development of our system.

It is precisely in the very first phase that no money is made, but a good product is produced. Soon, when the first paying customers arrive, other investors will follow too. - Dina Boonstra, General Director, NOM

The NOM and RUG Houdstermaatschappij (RHM) see the great potential of SG Papertronics, because the Beer-o-Meter technology can be used in many markets.

Maciek Grajewski has worked hard to complete the investment process. That was difficult for him because as a technician he had to sell a concept. But Grajewski does deliver. - Corina Prent, Director, RHM

Prent points out that the test system improves after each analysis through so-called machine learning.

Grajewski warmly welcomes the support of NOM and RHM. Thanks to them, we've been able to build a competent team that helps craft brewers brew the best beer within their reach.

SG Papertronics is already working together with two local brewers from Groningen: Martinus and BaxBier. The utility of the Beer-o-Meter is also recognized by the craft beer brewers. Several parties are already interested in our technology.

SG Papertronics will establish itself in Innolab Agrifood, an open innovation lab on Campus Groningen. The Campus ecosystem is proving itself once again, because investors and facilitators support the entrepreneurs.`,
};

/* ---------- apply ---------- */
const docs = await client.fetch(`*[_type=="newsArticle" && language=="en"]{_id,"slug":slug.current}`);
let tx = client.transaction();
let done = 0;
const missing = [];
for (const d of docs) {
  const md = bodies[d.slug];
  if (!md) { missing.push(d.slug); continue; }
  const body = toPortableText(md);
  tx = tx.patch(d._id, (p) => p.set({ body }).unset(["externalUrl"]));
  done++;
}
console.log(`Importing bodies for ${done}/${docs.length} EN articles…`);
if (missing.length) console.log("No body text for slugs:", missing.join(", "));
const res = await tx.commit();
console.log("Committed. transactionId:", res.transactionId);
