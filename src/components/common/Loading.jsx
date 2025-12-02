// D:\unhub-favorites\src\components\common\Loading.jsx

import React from 'react';

const Loading = ({ text = "正在连接并加载数据..." }) => {
  return (
    // 使用您配置的背景色
    <div className="min-h-screen bg-apple-gray-light flex items-center justify-center p-4">
      <div className="text-center w-full max-w-sm">
        
        {/* Logo 和品牌区域 */}
        <div className="relative w-24 h-24 mx-auto mb-8 transition-all duration-500 ease-out transform hover:scale-105">
          
          {/* 精致的圆形进度条/光环 (注意边框颜色使用了 apple-blue) */}
          <div 
            // 类名使用 'apple-blue'
            className="absolute inset-0 rounded-full border-4 border-t-apple-blue border-r-apple-blue/50 border-b-apple-blue/20 border-l-apple-blue/10 animate-spin-slow" 
            style={{ animationDuration: '2.5s' }}
          />

          {/* Logo 容器 */}
          <div className="absolute inset-2 rounded-full bg-white shadow-xl flex items-center justify-center transition-shadow duration-300">
            <img 
              src="/logo.svg" 
              alt="Loading" 
              className="w-12 h-12 transition-all duration-500 ease-in-out transform scale-100 opacity-90"
            />
          </div>
        </div>
        
        {/* 加载文字和状态 (注意文字颜色使用了 apple-gray-dark) */}
        <p className="text-2xl font-semibold text-apple-gray-dark mb-2 animate-fade-in-up">
          {text}
        </p>
        
        {/* 子文本 */}
        <p className="text-sm text-apple-gray-dark/50 font-light mt-1 tracking-wider animate-pulse" style={{ animationDuration: '2s' }}>
          UNHub Favorites
        </p>

        
      </div>
    </div>
  )
}

export default Loading;