/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        es: {
          // ── D1 official design tokens ─────────────────────────────────
          // Surfaces / backgrounds
          'bg-page':        '#050506',
          'bg-black':       '#08080A',
          panel:            '#151519',
          'panel-elevated': '#1B1B20',
          'panel-soft':     '#202026',

          // Text
          'text-primary':   '#F5F5F7',
          'text-secondary': '#B8B8BE',
          'text-muted':     '#75757D',
          'text-disabled':  '#5A5A62',

          // Brand magenta
          magenta:          '#C2186A',
          'magenta-bright': '#F02C93',
          'magenta-deep':   '#A41C64',
          'magenta-accent': '#C0246E',

          // Supporting
          'grey-premium':      '#888899',
          'amber-strongkidz':  '#E19A47',
          success:             '#22C55E',
          warning:             '#F59E0B',
          danger:              '#EF4444',

          // ── Legacy aliases (kept for backward compat) ─────────────────
          black:         '#050505',
          dark:          '#0D0D0D',
          charcoal:      '#141414',
          card:          '#1C1C1C',
          'card-mid':    '#2A2A2A',
          grey:          '#3C3C3C',
          'grey-light':  '#4A4A4A',
          'grey-dark':   '#2C2C2C',
          accent:        '#A41C64',
          'accent-dark': '#7A1349',
          'accent-mid':  '#C0246E',
          'accent-muted':'#5A1038',
          amber:         '#E19A47',
          'amber-dark':  '#B87932',
          'amber-light': '#EFB060',
          'amber-muted': '#7A5020',
          white:         '#FFFFFF',
          'off-white':   '#EDEDED',
          muted:         '#888888',
          subtle:        '#555555',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      backgroundImage: {
        'es-hero':
          'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(164,28,100,0.22) 0%, transparent 65%), linear-gradient(180deg, #141414 0%, #0D0D0D 100%)',
        'es-card':
          'linear-gradient(135deg, #1C1C1C 0%, #141414 100%)',
      },

      boxShadow: {
        'es-card':   '0 4px 24px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)',
        'es-accent': '0 0 28px rgba(164,28,100,0.28), 0 4px 16px rgba(0,0,0,0.6)',
        'es-amber':  '0 0 20px rgba(225,154,71,0.25)',
      },

      borderRadius: { es: '6px' },

      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
