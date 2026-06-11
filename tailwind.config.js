/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          900: "#0a0a23",
          800: "#11102e",
          700: "#1a1640",
          600: "#241c55",
        },
        dream: {
          purple: "#3b2a7a",
          violet: "#6d5acf",
          glow: "#a896ff",
        },
        moon: {
          100: "#fff8e7",
          200: "#ffeebf",
          300: "#ffe39a",
          glow: "#ffd97a",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(168, 150, 255, 0.35)",
        "glow-moon": "0 0 60px rgba(255, 217, 122, 0.45)",
        card: "0 20px 60px -20px rgba(0, 0, 0, 0.7)",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.85)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(30px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 30px rgba(255, 217, 122, 0.35)" },
          "50%": { boxShadow: "0 0 70px rgba(255, 217, 122, 0.6)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        drift: {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(110%)" },
        },
      },
      animation: {
        twinkle: "twinkle 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 14s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 3s linear infinite",
        drift: "drift 40s linear infinite",
      },
    },
  },
  plugins: [],
};
