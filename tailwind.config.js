/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 苹果官网主题色
        apple: {
          gray: {
            light: '#f5f5f7',
            medium: '#f3f3f5',
            dark: '#313132',
          },
          black: '#1d1d1f',
          blue: '#0071e3',
        }
      },
      fontFamily: {
        // 设置 OpenAI Sans 为默认字体
        sans: [
          'OpenAI Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      animation: {
        'pulse': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}