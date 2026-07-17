import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Q-Tector technology — SG Papertronics",
  description:
    "A compact at-line testing platform for process-relevant measurements: readout device, ready-to-use assay pods, QR-guided workflows and cloud-connected data.",
};

const steps = [
  { n: "01", title: "Take a small sample", text: "Collect a small process sample from your culture, fermentation or product stream." },
  { n: "02", title: "Run the guided assay", text: "Use the ready-to-use assay pod and follow the app-guided workflow." },
  { n: "03", title: "Read the result", text: "Q-Tector provides a clear result through the connected readout system." },
  { n: "04", title: "Track the process", text: "Results are stored and used for trend analysis, batch comparison and export." },
  { n: "05", title: "Act on the data", text: "Support feeding, process timing, formulation, stabilization, release or troubleshooting." },
];

const focusTags = [
  "Glucose & sucrose",
  "Culture media",
  "Fermentation",
  "Cell culture",
  "Media optimization",
  "Feed strategy",
  "Production monitoring",
];

export default function TechnologyPage() {
  return (
    <div style={{ background: "#EFF1F5", color: "#14161C", overflowX: "hidden" }}>
      {/* NAV */}
      <nav className="tech-nav">
        <a href="/" className="tech-logo">
          <span className="tech-logo-dot">
            <span />
          </span>
          SG&nbsp;Papertronics
        </a>
        <div className="tech-links">
          <a href="/technology" className="active">Technology</a>
          <a href="/#applications">Applications</a>
          <a href="/#projects">Projects</a>
          <a href="/#investors">Investors</a>
          <a href="/#news">News</a>
        </div>
        <a href="/#contact" className="tech-cta sheen">
          Talk to us <span>↗</span>
        </a>
      </nav>

      {/* HERO — light, minimal */}
      <header style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(104px,14vw,152px) clamp(20px,5vw,64px) clamp(20px,4vw,48px)" }}>
        <div
          data-techgrid="1"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: "clamp(28px,5vw,72px)",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                border: "1px solid rgba(24,30,48,.1)",
                color: "#3A4152",
                fontSize: 12.5,
                fontWeight: 500,
                padding: "6px 13px 6px 7px",
                borderRadius: 999,
                marginBottom: 22,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  width: 17,
                  height: 17,
                  borderRadius: 5,
                  background: "#2E6BE6",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 11,
                }}
              >
                ✓
              </span>
              Q-Tector platform
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(40px,6.4vw,76px)", lineHeight: 1.0, letterSpacing: "-.025em" }}>
              At-line analytics{" "}
              <span style={{ color: "#AEB4C4", fontWeight: 500, fontStyle: "italic" }}>for living processes</span>
            </h1>
            <p style={{ margin: "24px 0 0", color: "#2E6BE6", fontSize: "clamp(17px,1.8vw,21px)", fontWeight: 500, lineHeight: 1.5, maxWidth: 520 }}>
              A compact at-line testing platform for process-relevant measurements.
            </p>
            <p style={{ margin: "16px 0 0", color: "#4A5163", fontSize: 16.5, lineHeight: 1.6, maxWidth: 560 }}>
              Q-Tector combines a readout device, ready-to-use assay pods, QR-guided
              workflows, app-based instructions and cloud-connected data handling —
              designed for quick measurements close to where the process happens.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 26px", marginTop: 30 }}>
              <a href="/#contact" className="sheen" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#2E6BE6", color: "#fff", padding: "14px 24px", borderRadius: 999, fontWeight: 500, fontSize: 16 }}>
                Talk to us about your process <span>↗</span>
              </a>
              <a href="/#applications" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#14161C", fontSize: 16, fontWeight: 500, borderBottom: "1px solid rgba(20,26,48,.2)", paddingBottom: 4 }}>
                See applications <span>↗</span>
              </a>
            </div>
          </div>

          <div style={{ position: "relative", borderRadius: 26, overflow: "hidden", minHeight: 320, background: "#E7EAF0", aspectRatio: "4 / 3", boxShadow: "0 24px 60px rgba(20,26,48,.1)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/hero-beer.png"
              alt="Q-Tector device in use"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
            <div
              style={{
                position: "absolute",
                left: 16,
                top: 16,
                background: "rgba(255,255,255,.9)",
                backdropFilter: "blur(8px)",
                padding: "7px 13px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                color: "#14161C",
              }}
            >
              Lab-in-a-box · at-line
            </div>
          </div>
        </div>
      </header>

      {/* HOW IT WORKS — connected stepper */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(44px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 620, marginBottom: 44 }}>
          <div style={{ color: "#2E6BE6", fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>
            How it works
          </div>
          <h2 style={{ margin: 0, fontSize: "clamp(30px,4.4vw,52px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.05 }}>
            Sample to decision, <span style={{ color: "#AEB4C4" }}>in five steps</span>
          </h2>
        </div>
        <div className="tech-flow">
          <div className="tech-flow-line" />
          <div className="tech-flow-grid">
            {steps.map((s) => (
              <div className="tech-step" key={s.n}>
                <div className="tech-node">{s.n}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CURRENT ANALYTICAL FOCUS */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(12px,2vw,24px) clamp(20px,5vw,64px)" }}>
        <div
          data-techfocus="1"
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr .9fr",
            gap: "clamp(24px,4vw,56px)",
            alignItems: "center",
            background: "linear-gradient(180deg,#EDF1F8,#E3EAF6)",
            border: "1px solid rgba(24,30,48,.06)",
            borderRadius: "clamp(24px,3vw,40px)",
            padding: "clamp(28px,4vw,52px)",
          }}
        >
          <div>
            <div style={{ color: "#2E6BE6", fontSize: 12.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 14 }}>
              Current analytical focus
            </div>
            <h2 style={{ margin: "0 0 16px", fontSize: "clamp(26px,3.2vw,40px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.1 }}>
              Quick glucose &amp; sucrose monitoring
            </h2>
            <p style={{ margin: "0 0 22px", color: "#4A5163", fontSize: 16.5, lineHeight: 1.6 }}>
              Q-Tector currently focuses on quick glucose and sucrose monitoring in culture
              media, with additional sugars and metabolites available for development on
              request — especially relevant for fermentation, cell culture, media optimization,
              feed strategy development and production monitoring.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {focusTags.map((t) => (
                <span key={t} style={{ background: "#fff", border: "1px solid rgba(24,30,48,.1)", color: "#14161C", fontSize: 13.5, fontWeight: 500, padding: "8px 14px", borderRadius: 999 }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid rgba(24,30,48,.07)", boxShadow: "0 16px 44px rgba(20,26,48,.06)", aspectRatio: "4 / 3", minHeight: 220 }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <defs>
                <linearGradient id="qtAreaT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2E6BE6" stopOpacity=".2" />
                  <stop offset="1" stopColor="#2E6BE6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g stroke="rgba(24,30,48,.08)" strokeWidth="1" vectorEffect="non-scaling-stroke">
                <line x1="9" y1="30" x2="92" y2="30" />
                <line x1="9" y1="50" x2="92" y2="50" />
                <line x1="9" y1="70" x2="92" y2="70" />
              </g>
              <path d="M10,30 C26,31 30,34 42,44 C54,54 60,63 76,66 C84,68 88,68 92,68 L92,74 L10,74 Z" fill="url(#qtAreaT)" />
              <path d="M10,30 C26,31 30,34 42,44 C54,54 60,63 76,66 C84,68 88,68 92,68" fill="none" stroke="#2E6BE6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="92" cy="68" r="6" fill="#2E6BE6" fillOpacity=".2" />
              <circle cx="92" cy="68" r="2.6" fill="#2E6BE6" />
            </svg>
            <div style={{ position: "absolute", top: 14, left: 16, color: "#8990A0", fontSize: 11, letterSpacing: ".04em", fontWeight: 500 }}>
              Glucose · g/L
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 16px", background: "linear-gradient(0deg,rgba(255,255,255,.95),rgba(255,255,255,0))" }}>
              <div style={{ fontSize: 12.5, color: "#8990A0" }}>Depletion across a fermentation run</div>
            </div>
          </div>
        </div>
      </section>

      {/* BUILT FOR SCALE-UP */}
      <section
        style={{
          background: "#0E1526",
          color: "#fff",
          borderRadius: "clamp(28px,4vw,48px)",
          margin: "clamp(24px,3vw,40px) clamp(12px,2vw,24px)",
          padding: "clamp(44px,5vw,80px) clamp(24px,5vw,64px)",
        }}
      >
        <div data-techscale="1" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }}>
          <div>
            <div style={{ color: "#6AA6FF", fontSize: 14, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>
              Built for scale-up
            </div>
            <h2 style={{ margin: "0 0 20px", fontSize: "clamp(28px,4vw,48px)", fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.05 }}>
              Carry process knowledge into pilot and production
            </h2>
            <p style={{ margin: "0 0 14px", color: "rgba(255,255,255,.7)", fontSize: 17, lineHeight: 1.6 }}>
              Processes often fail to scale because the data collected in early development is
              not structured, frequent or comparable enough.
            </p>
            <p style={{ margin: 0, color: "rgba(255,255,255,.7)", fontSize: 17, lineHeight: 1.6 }}>
              Q-Tector helps teams build process datasets from early experiments onward. With
              repeatable workflows and connected data capture, you can compare experiments,
              monitor trends and carry knowledge into pilot and production.
            </p>
            <a href="/#contact" className="sheen" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 30, background: "#2E6BE6", color: "#fff", padding: "14px 26px", borderRadius: 999, fontWeight: 500, fontSize: 16 }}>
              Request a Q-Tector introduction <span>↗</span>
            </a>
          </div>

          <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 22, padding: "clamp(22px,3vw,30px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,.55)", fontSize: 12, marginBottom: 18 }}>
              <span>R&amp;D</span>
              <span>Dev</span>
              <span>Pilot</span>
              <span>Production</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 150 }}>
              {[36, 54, 72, 100].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "6px 6px 0 0", background: i < 2 ? "rgba(106,166,255,.35)" : "linear-gradient(180deg,#6AA6FF,#2E6BE6)" }} />
              ))}
            </div>
            <div style={{ marginTop: 16, color: "rgba(255,255,255,.55)", fontSize: 13.5, lineHeight: 1.5 }}>
              Comparable datasets accumulate as the process moves toward production.
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "clamp(40px,5vw,64px) clamp(20px,5vw,64px)",
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "space-between",
          alignItems: "center",
          color: "#8990A0",
          fontSize: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#14161C", fontWeight: 600 }}>
          <span className="tech-logo-dot">
            <span />
          </span>
          SG Papertronics
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <a href="/" style={{ color: "#3A4152" }}>Home</a>
          <a href="/#applications" style={{ color: "#3A4152" }}>Applications</a>
          <a href="/#contact" style={{ color: "#3A4152" }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
