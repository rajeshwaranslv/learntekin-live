/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1e4ed8",
          blueSoft: "#3b82f6",
          orange: "#f59e0b",
          orangeSoft: "#fb923c",
          ink: "#0f172a",
        },
      },
      boxShadow: {
        auth: "0 24px 60px -24px rgba(15, 23, 42, 0.45)",
      },
      backgroundImage: {
        "auth-gradient":
          "linear-gradient(135deg, rgba(30,78,216,0.12), rgba(245,158,11,0.12))",
      },
    },
  },
  plugins: [],
};
