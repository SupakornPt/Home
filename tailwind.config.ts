import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#f9f9fe",
        background: "#f9f9fe",
        "surface-dim": "#d9dade",
        "surface-bright": "#f9f9fe",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f8",
        "surface-container": "#ededf2",
        "surface-container-high": "#e8e8ed",
        "surface-container-highest": "#e2e2e7",
        "surface-variant": "#e2e2e7",
        "on-surface": "#1a1c1f",
        "on-surface-variant": "#4c4546",
        "on-background": "#1a1c1f",
        outline: "#7e7576",
        "outline-variant": "#cfc4c5",
        primary: "#000000",
        "on-primary": "#ffffff",
        secondary: "#005cba",
        "on-secondary": "#ffffff",
        error: "#ba1a1a",
        "inverse-surface": "#2f3034",
        "inverse-on-surface": "#f0f0f5",
      },
      spacing: {
        "margin-desktop": "40px",
        "margin-mobile": "20px",
        gutter: "24px",
        unit: "8px",
        "section-gap": "120px",
      },
      maxWidth: {
        "container-max": "1200px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "64px",
          { lineHeight: "1.1", letterSpacing: "-0.022em", fontWeight: "600" },
        ],
        "headline-lg": [
          "40px",
          { lineHeight: "1.2", letterSpacing: "-0.021em", fontWeight: "600" },
        ],
        "headline-md": [
          "32px",
          { lineHeight: "1.25", letterSpacing: "-0.019em", fontWeight: "600" },
        ],
        "body-lg": [
          "19px",
          { lineHeight: "1.5", letterSpacing: "-0.011em", fontWeight: "400" },
        ],
        "body-md": [
          "17px",
          {
            lineHeight: "1.47",
            letterSpacing: "-0.011em",
            fontWeight: "400",
          },
        ],
        "label-sm": [
          "14px",
          { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "500" },
        ],
        caption: [
          "12px",
          { lineHeight: "1.3", letterSpacing: "0em", fontWeight: "400" },
        ],
      },
      borderRadius: {
        stitch: "32px",
        "stitch-lg": "48px",
      },
    },
  },
  plugins: [],
};

export default config;
