export { metadata, viewport } from "next-sanity/studio";

export const dynamic = "force-static";

/** Root layout for the Studio. It sits outside the localized trees, so it owns
 *  its own document shell and deliberately skips the site chrome and CSS. */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
