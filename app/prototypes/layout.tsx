import "../globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = { title: "Prototypes", robots: { index: false, follow: false } };

/** Isolated root layout for design prototypes. Nothing here is imported by
 *  production routes; the folder is deleted once a variant is promoted. */
export default function PrototypeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
