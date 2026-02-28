import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0A0A14',
        'bg-secondary': '#08080F',
        'bg-elevated': '#0F0F1E',
        gold: '#D4AF72',
        'gold-light': '#F0D090',
        blush: '#F2B5C7',
        'white-soft': '#F8F4F0',
        'purple-accent': '#9B6FD4',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 40px rgba(212, 175, 114, 0.15)',
        blush: '0 0 40px rgba(242, 181, 199, 0.15)',
        card: '0 24px 60px rgba(0, 0, 0, 0.4)',
        'gold-lg': '0 0 80px rgba(212, 175, 114, 0.25)',
      },
      backdropBlur: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '40px',
      },
      borderColor: {
        glass: 'rgba(255, 255, 255, 0.10)',
        gold: 'rgba(212, 175, 114, 0.35)',
        blush: 'rgba(242, 181, 199, 0.35)',
      },
      backgroundImage: {
        'glass-light': 'rgba(255, 255, 255, 0.06)',
        'glass-medium': 'rgba(255, 255, 255, 0.09)',
        'glass-heavy': 'rgba(255, 255, 255, 0.13)',
        'glass-gold': 'rgba(212, 175, 114, 0.08)',
        'glass-blush': 'rgba(242, 181, 199, 0.08)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF72 0%, #F0D090 50%, #D4AF72 100%)',
        'gradient-blush': 'linear-gradient(135deg, #F2B5C7 0%, #F8D4E0 50%, #F2B5C7 100%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        markerPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(212,175,114,0.4)' },
          '70%': { boxShadow: '0 0 0 20px rgba(212,175,114,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(212,175,114,0)' },
        },
        'gradient-rotate': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        curtain: {
          '0%': { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0)' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: '0.5' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        'running-dash': {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-20' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'draw-stroke': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        markerPulse: 'markerPulse 2s infinite',
        'gradient-rotate': 'gradient-rotate 6s ease infinite',
        ticker: 'ticker 20s linear infinite',
        fadeIn: 'fadeIn 0.5s ease-out',
        slideUp: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-dot': 'bounce-dot 1.4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'draw-stroke': 'draw-stroke 1.5s ease-out forwards',
        confetti: 'confetti 3s ease-out forwards',
      },
      screens: {
        xs: '480px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '104': '26rem',
        '112': '28rem',
        '128': '32rem',
      },
      aspectRatio: {
        '3/4': '3 / 4',
        '4/3': '4 / 3',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        '9999': '9999',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'curtain': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
    },
  },
  plugins: [],
}

export default config
