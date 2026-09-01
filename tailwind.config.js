/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        ink: '#06060a',
        surface: '#0c0c13',
        elevated: '#13131d',
        line: 'rgba(255,255,255,0.08)',
        mist: '#a1a1b5',
        magenta: '#e246c8',
        grape: '#a855f7',
        violetdeep: '#6d28d9',
        electric: '#5b6cff',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 40px -12px rgba(226,70,200,0.55)',
        card: '0 24px 60px -30px rgba(0,0,0,0.9)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.35' },
          '50%': { transform: 'translateY(-28px) rotate(8deg)', opacity: '0.8' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        eq: {
          '0%, 100%': { transform: 'scaleY(0.25)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        float: 'float 9s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        eq: 'eq 900ms ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
