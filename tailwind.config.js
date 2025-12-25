/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores do Governo do Distrito Federal
        gdf: {
          blue: {
            50: '#e6f0f7',
            100: '#cce0ef',
            200: '#99c2df',
            300: '#66a3cf',
            400: '#3385bf',
            500: '#0050A0', // Primary blue
            600: '#004080',
            700: '#003060',
            800: '#002040',
            900: '#001020',
          },
          green: {
            50: '#e6f7f0',
            100: '#ccefe1',
            200: '#99dfc3',
            300: '#66cfa5',
            400: '#33bf87',
            500: '#00A86B', // Secondary green
            600: '#008656',
            700: '#006540',
            800: '#00432b',
            900: '#002215',
          },
        },
        // Semantic colors
        primary: {
          DEFAULT: '#0050A0',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#00A86B',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#00A86B',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#000000',
        },
        error: {
          DEFAULT: '#DC2626',
          foreground: '#ffffff',
        },
        background: '#ffffff',
        foreground: '#1a1a1a',
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#737373',
        },
        accent: {
          DEFAULT: '#f5f5f5',
          foreground: '#0050A0',
        },
        border: '#e5e5e5',
        input: '#e5e5e5',
        ring: '#0050A0',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1a1a1a',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Accessible font sizes (WCAG)
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        // Touch target minimum (44x44px)
        'touch': '2.75rem',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
