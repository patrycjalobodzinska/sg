import RootDocument from "@/app/_components/RootDocument";
import { siteMetadata } from "@/app/site-metadata";

export const metadata = siteMetadata;

/** Root layout for the default-locale (unprefixed) routes. */
export default function EnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
