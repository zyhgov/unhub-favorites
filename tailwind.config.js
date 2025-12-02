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
// 👇👇👇 新增的 Keyframes 和 Animation 配置 👇👇👇
      keyframes: {
        // 用于圆形进度条的平稳旋转
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        // 用于文字的渐显效果
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // 用于线性进度条的来回推进效果
        'linear-progress': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        }
      },
      animation: {
        // 保留原有的 pulse (如果需要)
        'pulse': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite', 
        
        // 新增的加载动画
        'spin-slow': 'spin-slow 2.5s linear infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'linear-progress': 'linear-progress 2s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate',
      },
      // 👆👆👆 新增的 Keyframes 和 Animation 配置 👆👆👆
    },
  },
  plugins: [],
}