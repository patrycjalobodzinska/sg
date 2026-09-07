// Diagonal up-right arrow used on CTAs. Plain inline SVG (currentColor) so it
// renders identically on every browser — the "↗" glyph turned into a colored
// emoji on Safari.
export default function ArrowUpRight({ size = 15 }: { size?: number }) {
  return (
    <svg

    width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "middle", flex: "none" }}
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
