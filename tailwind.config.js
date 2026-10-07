/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // The prototype stylesheet relies on browser defaults (lists, headings), so Tailwind's reset is off.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        sunk: "var(--sunk)",
        line: "var(--line)",
        ink: "var(--fg)",
        muted: "var(--muted)",
        teal: { DEFAULT: "var(--olive)", soft: "var(--olive-soft)" },
        coral: { DEFAULT: "var(--terra)", soft: "var(--terra-soft)" },
        lilac: "var(--info)",
        mark: "var(--mark-solid)",
        band: "var(--band)",
      },
      fontFamily: {
        serif: ["Literata", "Georgia", "serif"],
        sans: ["Figtree", "system-ui", "sans-serif"],
        mono: ["DM Mono", "ui-monospace", "monospace"],
      },
      borderRadius: { card: "12px" },
    },
  },
  plugins: [],
};
