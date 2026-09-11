/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "Dusk garden" palette — warm paper background, sage-green growth
        // accent (ties to the companion), soft blush for warmth, amber gold
        // for the star currency. Deliberately not terracotta/cream default.
        paper: {
          50: '#FCFAF6',
          100: '#F8F4EC',
          200: '#F1EADB',
        },
        ink: {
          600: '#5B564F',
          700: '#453F38',
          900: '#2E2A25',
        },
        sprout: {
          50: '#EEF4ED',
          100: '#D8E7D4',
          200: '#B4D2AC',
          300: '#8FBD84',
          400: '#6FA562',
          500: '#588C4B',
          600: '#456E3B',
          700: '#33512C',
        },
        bloom: {
          50: '#FCEFEF',
          100: '#F7D9D9',
          200: '#F0B7B8',
          300: '#E7999B',
          400: '#DC7A7D',
          500: '#C75F63',
        },
        gold: {
          100: '#FBEFD0',
          300: '#F0CD7C',
          400: '#E4B54D',
          500: '#C7963A',
        },
        dusk: {
          400: '#8D82A6',
          500: '#6E6289',
          600: '#564C6E',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.375rem',
      },
      boxShadow: {
        soft: '0 2px 14px -4px rgba(46, 42, 37, 0.14)',
        card: '0 1px 2px rgba(46,42,37,0.06), 0 8px 20px -10px rgba(46,42,37,0.18)',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-40px)', opacity: '0' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1) translateY(0)' },
          '50%': { transform: 'scale(1.03) translateY(-3px)' },
        },
      },
      animation: {
        floatUp: 'floatUp 1.1s ease-out forwards',
        breathe: 'breathe 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
