import SiteNavClient from "./_components/SiteNavClient";
import { getSiteSettings } from "../sanity/lib/settings";
import { defaultLocale, type Locale } from "./i18n";

const keyFor = (href: string) => href.replace(/[/#]/g, "") || "home";

export default async function SiteNav({ active, lang = defaultLocale }: { active?: string; lang?: Locale }) {
  const s = await getSiteSettings(lang);
  const nav = s.nav.map((l) => ({ ...l, key: keyFor(l.href) }));
  return <SiteNavClient active={active} nav={nav} cta={s.navCta} />;
}
