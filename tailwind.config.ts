import type { Config } from "tailwindcss";

// "Golden hour" palette: lagoon teals and night blues for depth, sunset coral and
// sun yellow for energy, warm paper underneath. Text colours (ink, muted, clay,
// lagoon) all clear WCAG AA on cream; coral and sun are for fills, not small text.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fff8ee",
        ink: "#0e2a3b",
        muted: "#4b6272",
        sand: "#fde8d3",
        clay: "#b5391c",
        coral: "#ff6b4a",
        sun: "#ffb938",
        lagoon: "#087a7a",
        "lagoon-deep": "#0a4d5c",
        night: "#0a2233",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(255,107,74,0.55)" },
          "100%": { boxShadow: "0 0 0 16px rgba(255,107,74,0)" },
        },
      },
      animation: {
        marquee: "marquee 48s linear infinite",
        "rise-in": "rise-in 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        "pulse-ring": "pulse-ring 2.2s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
