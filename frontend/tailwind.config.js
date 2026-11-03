/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        github: {
          bg: '#0d1117',
          surface: '#161b22',
          border: '#30363d',
          accent: '#238636',
          blue: '#388bfd',
          text: '#c9d1d9',
          muted: '#8b949e',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
      },
    },
  },
  plugins: [],
}

