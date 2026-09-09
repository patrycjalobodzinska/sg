import SiteNav from "@/app/site-nav";
import Harness from "./Harness";

export const metadata = { title: "Home hero — photo variants" };

export default function Page() {
  return (
    <>
      {/* the real nav, so the hero's top spacing is judged against what ships */}
      <SiteNav lang="en" />
      <Harness />
    </>
  );
}
