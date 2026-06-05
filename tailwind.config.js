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
        darkBg: '#020817',
        cardBg: 'rgba(15, 23, 42, 0.45)',
        cardBorder: 'rgba(255, 255, 255, 0.08)',
        neonHappy: '#FFD700',
        neonSad: '#4A90D9',
        neonAngry: '#FF4444',
        neonSurprised: '#B44FFF',
        neonNeutral: '#AAAAAA',
        neonFearful: '#00CED1',
        neonDisgusted: '#7FBA00',
        themeAccent: 'rgb(var(--color-accent) / <alpha-value>)',
        themeAccentGlow: 'rgb(var(--color-accent-glow) / <alpha-value>)',
        themeAccentSec: 'rgb(var(--color-accent-secondary) / <alpha-value>)',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        neonHappy: '0 0 15px rgba(255, 215, 0, 0.3)',
        neonSad: '0 0 15px rgba(74, 144, 217, 0.3)',
        neonAngry: '0 0 15px rgba(255, 68, 68, 0.3)',
        neonSurprised: '0 0 15px rgba(180, 79, 255, 0.3)',
        neonNeutral: '0 0 15px rgba(170, 170, 170, 0.3)',
        neonFearful: '0 0 15px rgba(0, 206, 209, 0.3)',
        neonDisgusted: '0 0 15px rgba(127, 186, 0, 0.3)',
      },
      animation: {
        'scanline': 'scanline 6s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in-out': 'fadeInOut 1.5s ease-in-out infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 2px currentColor)' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 8px currentColor)' },
        },
        fadeInOut: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
