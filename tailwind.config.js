/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        espresso: '#1E1613',
        taupe: '#4A3B32',
        sand: '#C2B2A2',
        bone: '#F9F6F0',
        steel: '#E2E8F0',
        umber: '#2C211C',
        tobacco: '#7A6456'
      },
      fontFamily: {
        display: ['Inter Tight', 'Arial Narrow', 'Arial', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        editorial: '0 24px 90px rgba(0, 0, 0, 0.38)',
        lens: '0 40px 110px rgba(10, 7, 6, 0.56), inset 0 0 90px rgba(249, 246, 240, 0.08)'
      },
      keyframes: {
        equalize: {
          '0%, 100%': { transform: 'scaleY(0.34)' },
          '45%': { transform: 'scaleY(1)' },
          '70%': { transform: 'scaleY(0.62)' }
        },
        floatIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' }
        }
      },
      animation: {
        equalize: 'equalize 1s ease-in-out infinite',
        floatIn: 'floatIn 0.8s ease-out both',
        marquee: 'marquee 24s linear infinite'
      }
    }
  },
  plugins: []
};
