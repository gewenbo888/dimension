import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // the void before dimensions — near-absolute black with a blue undertone
        void: {
          950: "#020207",
          900: "#04050e",
          800: "#080a18",
          700: "#0e1126",
          600: "#161a38",
          500: "#22264f",
        },
        // ion — violet-indigo, the primary dimensional glow
        ion: {
          600: "#5a3cff",
          500: "#7b5cff",
          400: "#9d83ff",
          300: "#c0aeff",
        },
        // cyan — the event horizon / quantum shimmer
        cyan: {
          600: "#0fb6dc",
          500: "#22e0ff",
          400: "#5cebff",
          300: "#9bf4ff",
        },
        // plasma — magenta, higher-dimensional folding
        plasma: {
          600: "#a51fce",
          500: "#c84dff",
          400: "#dc8cff",
          300: "#ecbcff",
        },
        // flare — singularity gold, the highest dimensions & the white-light collapse
        flare: {
          600: "#e0871f",
          500: "#ffb454",
          400: "#ffcd86",
          300: "#ffe3b6",
        },
        // light on the void
        ghost: {
          50: "#f5f6ff",
          100: "#e8eaff",
          200: "#cacfee",
          300: "#9ba2cf",
          500: "#666d96",
          700: "#3a3f63",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "ui-serif", "Georgia", "serif"],
        sans: ['"Sora"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        zh: ['"Noto Serif SC"', "serif"],
      },
      boxShadow: {
        ioncard: "inset 0 1px 0 rgba(157,131,255,0.10), 0 24px 70px -30px rgba(0,0,0,0.95)",
        glow: "0 0 48px -10px rgba(123,92,255,0.6)",
        glowcyan: "0 0 40px -10px rgba(34,224,255,0.55)",
        glowflare: "0 0 50px -12px rgba(255,180,84,0.55)",
      },
    },
  },
  plugins: [],
};

export default config;
