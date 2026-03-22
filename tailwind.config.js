/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        anurati: ['Anurati', 'sans-serif'],
      },
      animation: {
        'marquee-reverse': 'marqueeReverse 60s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(139,92,246,0.3)' },
          '50%': { boxShadow: '0 0 24px rgba(139,92,246,0.7)' },
        },
      },
    },
  },
  plugins: [],
}
