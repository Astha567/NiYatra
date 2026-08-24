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
        forest: {
          50: '#e8f0eb',
          100: '#c5dcd0',
          600: '#1b4028',
          800: '#16311F',
          900: '#132A1E', // Sidebar deep forest green
          950: '#0B1B13',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FFFDF7', // Secondary panel lighter cream
          200: '#FDF6E7', // Main content page background
          300: '#F5E9D3',
          400: '#E8D4B4',
        },
        gold: {
          300: '#FBEAAE', // KPI stat card soft warm-gold tint
          400: '#F7D97B',
          500: '#F0C954', // Solid warm-gold pill / primary CTA
          600: '#D4A31C',
          700: '#A87D0F',
        },
        coral: {
          400: '#ED7A71',
          500: '#E2574C', // Alert / negative indicator
          600: '#C73E34',
        },
        khaki: {
          300: '#C2CE9F',
          400: '#A8B88A',
        },
        brown: {
          500: '#6B6355', // Warm brown-gray secondary text
        },
        dept: {
          eng: '#F59E0B',
          snt: '#0EA5E9',
          trd: '#8B5CF6',
        },
        status: {
          critical: '#DC2626',
          major: '#F59E0B',
          minor: '#6B7280',
          approved: '#16A34A',
        },
        railway: {
          darkBase: '#171F1A',
          darkCard: '#222E26',
          darkBorder: '#2E3D33',
        }
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'Georgia', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
