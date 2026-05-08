import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  safelist: [
    "bg-card-diagnostic",
    "bg-card-assessment",
    "bg-card-worksheet",
    "bg-card-lessonplan",
    "bg-card-presentation",
    "bg-card-games",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1B2A4E",
        teal: "#0FA3A3",
        coral: "#FF6B6B",
        gold: "#F4B400",
        purple: "#6C5CE7",
        bgLight: "#F5F3FF",
        card: {
          diagnostic: "#B6F2D7",
          assessment: "#FFD9B3",
          worksheet: "#FFE066",
          lessonplan: "#C9B8FF",
          presentation: "#B3E0FF",
          games: "#FFC0DD",
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(27, 42, 78, 0.06), 0 4px 12px rgba(27, 42, 78, 0.04)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "owl-blink": {
          "0%, 90%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(0.1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out forwards",
        "owl-blink": "owl-blink 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
