/** @type {import('tailwindcss').Config} */

import typography from '@tailwindcss/typography';

const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./component/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        grid: "grid 15s linear infinite",
      },
      keyframes: {
        grid: {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      spacing: {
        'size-full': '100%',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%', // proseクラスのデフォルト最大幅を上書き
            color: 'inherit',
            h1: {
              color: 'inherit',
            },
            h2: {
              color: 'inherit',
            },
            h3: {
              color: 'inherit',
            },
            a: {
              color: '#3182ce',
              '&:hover': {
                color: '#2c5282',
              },
            },
            code: {
              color: '#805ad5',
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
};

export default config;
