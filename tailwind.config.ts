import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  safelist: [
    "bg-card-diagnostic",
    "bg-card-assessment",
    "bg-card-worksheet",
    "bg-card-lessonplan",
    "bg-card-presentation",
    "bg-card-games",
    "bg-soft-lavender",
    "bg-soft-peach",
    "bg-soft-mint",
    "bg-soft-rose",
    "bg-soft-sky",
    "bg-soft-cream",
    "bg-soft-yellow",
  ],
  theme: {
    extend: {
      colors: {
        // ── Legacy aliases — `navy` and `bgLight` are CSS vars so they theme-switch.
        // Other accents (purple, teal, coral, gold) stay constant.
        navy: "rgb(var(--ss-text) / <alpha-value>)",
        bgLight: "rgb(var(--ss-bg) / <alpha-value>)",
        purple: "#FF6B1F",     // brand primary (recolored from purple → orange)
        teal: "#0EA5A4",       // wellness accent
        coral: "#EC4899",      // pink accent
        gold: "#FACC15",       // yellow accent

        // ── Super Sheldon tokens (canonical)
        ss: {
          orange: {
            50: "#FFF1E6",
            100: "#FFE0C7",
            200: "#FFC089",
            300: "#FFA14B",
            400: "#FF8526",
            500: "#FF6B1F",
            600: "#E85A12",
            700: "#C24808",
            800: "#8F3505",
            900: "#5C2203",
          },
          ink: {
            100: "#F2F4F7",
            200: "#E5E8EE",
            300: "#C4C9D2",
            400: "#8A91A1",
            500: "#5B6271",
            700: "#2A2E36",
            900: "#0F1115",
          },
          bg: { 0: "#FFFFFF", 50: "#FFF8F2" },
          accent: {
            purple: "#7C3AED",
            teal: "#0EA5A4",
            pink: "#EC4899",
            yellow: "#FACC15",
          },
        },

        // ── Soft pastel surfaces — theme-switching via CSS vars
        soft: {
          lavender: "rgb(var(--soft-lavender) / <alpha-value>)",
          peach:    "rgb(var(--soft-peach) / <alpha-value>)",
          mint:     "rgb(var(--soft-mint) / <alpha-value>)",
          rose:     "rgb(var(--soft-rose) / <alpha-value>)",
          sky:      "rgb(var(--soft-sky) / <alpha-value>)",
          cream:    "rgb(var(--soft-cream) / <alpha-value>)",
          yellow:   "rgb(var(--soft-yellow) / <alpha-value>)",
        },

        // ── Dark-mode equivalents (deeper, richer)
        deep: {
          bg: "#0B0D11",
          surface: "#16191F",
          border: "#272B33",
          lavender: "#2D1B4E",
          peach: "#3D2515",
          mint: "#143524",
          rose: "#3F1B2A",
          sky: "#0E2A4A",
          cream: "#3A2810",
        },

        card: {
          diagnostic:   "rgb(var(--card-diagnostic) / <alpha-value>)",
          assessment:   "rgb(var(--card-assessment) / <alpha-value>)",
          worksheet:    "rgb(var(--card-worksheet) / <alpha-value>)",
          lessonplan:   "rgb(var(--card-lessonplan) / <alpha-value>)",
          presentation: "rgb(var(--card-presentation) / <alpha-value>)",
          games:        "rgb(var(--card-games) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(15,17,21,.06)",
        "soft-lg": "0 12px 32px rgba(15,17,21,.08)",
        brand: "0 8px 24px rgba(255,107,31,.25)",
        ring: "0 0 0 3px rgba(255,107,31,.18)",
        "deep-soft": "0 4px 16px rgba(0,0,0,.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "owl-blink": {
          "0%, 90%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(0.1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(.2,.8,.2,1) forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "scale-in": "scale-in 0.35s cubic-bezier(.2,.8,.2,1) forwards",
        "owl-blink": "owl-blink 4s ease-in-out infinite",
        "shimmer": "shimmer 1.6s linear infinite",
        "float": "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
