/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Indian Heritage Colors
        saffron: {
          50: '#FFF4E6',
          100: '#FFE4CC',
          200: '#FFC999',
          300: '#FFAD66',
          400: '#FF9233',
          500: '#FF9933', // Primary Saffron
          600: '#CC7A29',
          700: '#995C1F',
          800: '#663D14',
          900: '#331F0A',
        },
        'indian-red': {
          50: '#FDF2F2',
          100: '#FCE6E6',
          200: '#F9CCCC',
          300: '#F5B3B3',
          400: '#F29999',
          500: '#E44C4C', // Primary Indian Red
          600: '#B83B3B',
          700: '#8C2C2C',
          800: '#5F1E1E',
          900: '#330F0F',
        },
        turmeric: {
          50: '#FFFAE6',
          100: '#FFF5CC',
          200: '#FFEB99',
          300: '#FFE066',
          400: '#FFD633',
          500: '#FFD700', // Primary Turmeric Yellow
          600: '#CCAC00',
          700: '#998100',
          800: '#665600',
          900: '#332B00',
        },
        emerald: {
          50: '#E6F3E9',
          100: '#CCE7D4',
          200: '#99CFA9',
          300: '#66B77E',
          400: '#339F53',
          500: '#046A38', // Primary Emerald Green
          600: '#035C30',
          700: '#024524',
          800: '#012E18',
          900: '#00170C',
        },
        sapphire: {
          50: '#E6F0F7',
          100: '#CCE1F0',
          200: '#99C3E0',
          300: '#66A5D1',
          400: '#3387C1',
          500: '#004C8C', // Primary Sapphire Blue
          600: '#003D70',
          700: '#002E54',
          800: '#001E38',
          900: '#000F1C',
        },
        'royal-purple': {
          500: '#6A1B9A',
        },
        marigold: {
          500: '#FFA500',
        },
        cream: {
          500: '#FFF8E7',
        },
        sand: {
          500: '#F5E6D3',
        },
        brown: {
          500: '#8B4513',
        },
      },
      fontFamily: {
        'heading': ['Kalam', 'cursive'],
        'body': ['Poppins', 'sans-serif'],
        'decorative': ['Prata', 'serif'],
      },
      backgroundImage: {
        'mandala-pattern': "url('/src/assets/patterns/mandala-bg.svg')",
        'jaali-pattern': "url('/src/assets/patterns/jaali-pattern.svg')",
        'mehendi-pattern': "url('/src/assets/patterns/mehendi-border.svg')",
      },
      animation: {
        'diya-flicker': 'flicker 3s infinite',
        'float': 'float 6s infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}