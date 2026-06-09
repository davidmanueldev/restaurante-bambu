/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#298254', // bambu-600
          50: '#f2fbf5',
          100: '#e1f7e9',
          200: '#c4ebd4',
          300: '#96d8b3',
          400: '#60be8b',
          500: '#3ca26d',
          600: '#298254',
          700: '#246845',
          800: '#1f5339',
          900: '#1b4430',
          950: '#0e261b',
        },
        bambu: {
          50: '#f2fbf5',
          100: '#e1f7e9',
          200: '#c4ebd4',
          300: '#96d8b3',
          400: '#60be8b',
          500: '#3ca26d',
          600: '#298254',
          700: '#246845',
          800: '#1f5339',
          900: '#1b4430',
          950: '#0e261b',
        },
        accent: {
          fire: '#ea580c',
          leaf: '#059669',
        },
        whatsapp: '#40c351',
        background: '#ffffff',
        foreground: '#171717',
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
