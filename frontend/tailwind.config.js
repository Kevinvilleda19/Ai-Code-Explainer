module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        '960': '960px', // Exact 25% increase from 768px
      },
      animation: {
        scroll: "scroll 20s linear infinite",
        "scroll-delayed": "scroll 20s linear infinite 10s",
        gradient: "gradient 8s ease infinite",
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        gradient: {
          "0%, 100%": { "background-size": "200% 200%", "background-position": "left center" },
          "50%": { "background-size": "200% 200%", "background-position": "right center" },
        },
      },
    },
  },
  plugins: [],
};