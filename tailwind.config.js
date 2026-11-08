/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            950: '#060d17',
            900: '#0a192f',
            800: '#0f2744',
            700: '#1e3a5f',
            600: '#2d5482',
            100: '#e8f0fe',
            50: '#f0f5ff',
          },
          gold: {
            600: '#b45309',
            500: '#d97706',
            400: '#f59e0b',
            300: '#fbbf24',
            200: '#fde68a',
            100: '#fef3c7',
            50: '#fffbeb',
          },
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'gold-glow': '0 8px 24px -4px rgba(245, 158, 11, 0.25)',
      },
    },
  },
  plugins: [],
}
