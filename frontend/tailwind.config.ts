import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "hsl(var(--brand-blue))",
          purple: "hsl(var(--brand-purple))",
          emerald: "hsl(var(--brand-emerald))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        elevated: "hsl(var(--elevated))",
        surface: "hsl(var(--surface))",
        text: {
          DEFAULT: "hsl(var(--text-default))",
          muted: "hsl(var(--text-muted))",
        }
      },
      borderRadius: {
        xl: "0.85rem",
        "2xl": "1.1rem",
      },
      boxShadow: {
        glow: "0 0 0 1px hsl(var(--border)), 0 18px 40px -24px hsl(var(--foreground) / .34)",
        neon: "0 0 15px rgba(0, 240, 255, 0.4)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up .45s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
