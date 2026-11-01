import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        planora: {
          deep: "#173B2D",
          forest: "#28523D",
          ivory: "#FAF7F1",
          gold: "#C6A56B",
          "gold-light": "#E5D4B5",
          "gold-dark": "#A88344",
          sage: "#9DAE91",
          "sage-light": "#D8E2D2",
          "sage-dark": "#718563",
          dark: "#1C2921",
          muted: "#72756D",
          card: "#FFFDF9",
          border: "#E9E3D8",
          cream: "#F4EFEA",
          surface: "#FBF9F5",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 2px 10px rgba(23, 59, 45, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
        "card-hover": "0 10px 25px -5px rgba(23, 59, 45, 0.08), 0 8px 10px -6px rgba(23, 59, 45, 0.04)",
        dropdown: "0 12px 30px -4px rgba(23, 59, 45, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
