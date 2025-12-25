import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b0f1c',
        surface: '#10172d',
        accent: '#3dd68c',
        accentMuted: '#2ca972',
        card: '#141a2f',
        border: '#1f2742',
        text: '#e4ecff',
        muted: '#9fb0d3',
        warning: '#f5a524',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      borderRadius: {
        xl: '18px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(61, 214, 140, 0.2), 0 18px 50px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
