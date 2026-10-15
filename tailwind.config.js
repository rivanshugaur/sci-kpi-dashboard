/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#dbe4f1',
          200: '#b8cde3',
          300: '#8baed1',
          400: '#5a8bbc',
          500: '#386da6',
          600: '#28558a',
          700: '#204470',
          800: '#1c395c',
          900: '#0b1329',
          950: '#070c1a',
        },
        kpi: {
          income: '#38bdf8', // Sky Blue
          doe: '#f97316',    // Orange
          ioe: '#10b981',    // Emerald
          pbt: '#ef4444',    // Rose
          gop: '#a855f7',    // Purple
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
