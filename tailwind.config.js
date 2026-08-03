/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Sourced from Designsource/Color Palette.png + Background.txt.
      // Values live in :root (src/styles.css) so a token change propagates everywhere.
      colors: {
        espresso: 'rgb(var(--ink) / <alpha-value>)',
        umber: 'rgb(var(--ink-deep) / <alpha-value>)',
        slateLine: 'rgb(var(--line) / <alpha-value>)',
        taupe: 'rgb(var(--taupe) / <alpha-value>)',
        sand: 'rgb(var(--sand) / <alpha-value>)',
        bone: 'rgb(var(--bone) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
        paperInk: 'rgb(var(--paper-ink) / <alpha-value>)',
        paperLine: 'rgb(var(--paper-line) / <alpha-value>)',
        paperMute: 'rgb(var(--paper-mute) / <alpha-value>)',
        accent1: 'rgb(var(--accent-1) / <alpha-value>)',
        accent2: 'rgb(var(--accent-2) / <alpha-value>)',
        accent3: 'rgb(var(--accent-3) / <alpha-value>)'
      },
      fontFamily: {
        display: ['Inter Tight', 'Arial Narrow', 'Arial', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      boxShadow: {
        editorial: '0 24px 90px rgba(0, 0, 0, 0.38)',
        lens: '0 40px 110px rgba(10, 7, 6, 0.56), inset 0 0 90px rgba(249, 246, 240, 0.08)'
      },
      keyframes: {
        floatIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        marqueeWide: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' }
        },
        marqueeReverse: {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' }
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        }
      },
      animation: {
        floatIn: 'floatIn 0.8s ease-out both',
        marqueeWide: 'marqueeWide 42s linear infinite',
        marqueeReverse: 'marqueeReverse 48s linear infinite',
        blink: 'blink 1s step-start infinite'
      }
    }
  },
  plugins: []
};
