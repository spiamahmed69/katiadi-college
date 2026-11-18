/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: {
    colors: { brand: { DEFAULT: '#0B4DA2', dark: '#083A7A', light: '#E8F1FC', accent: '#1E6FD9', gold: '#C9A227' }, ink: '#111827' },
    fontFamily: { bengali: ['"Noto Serif Bengali"','"Noto Sans Bengali"','serif'], sans: ['"Noto Sans Bengali"','system-ui','sans-serif'] },
  }},
  plugins: [],
};
