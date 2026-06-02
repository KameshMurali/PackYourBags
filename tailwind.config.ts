import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fbf7ee",
        ink: "#15130f",
        muted: "#706a60",
        sand: "#efe5d3",
        clay: "#c9834f",
      },
    },
  },
  plugins: [],
};

export default config;

