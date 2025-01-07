import type { Config } from "tailwindcss";
import { colors as defaultColors } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ...defaultColors,
        ...{
          lightBg: "#ffffff",
          darkBg: "#1a202c",
          lightText: "#333333",
          darkText: "#f5f5f5",
        },
      },
    },
  },
  plugins: [],
};

export default config;
