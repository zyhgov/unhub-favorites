import { useState, useEffect, useRef, useCallback } from 'react'
import { getDomain } from '../../utils/favicon'

// 图标服务列表
const FAVICON_SERVICES = [
  (domain) => `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  (domain) => `https://icon.horse/icon/${domain}`,
  (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  (domain) => `https://${domain}/favicon.ico`,
  (domain) => `https://${domain}/favicon.png`,
]

// 地球图标 SVG
const GLOBE_ICON = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0F9FF"/>
      <stop offset="100%" stop-color="#E0F2FE"/>
    </linearGradient>
    <linearGradient id="globe" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0071E3"/>
      <stop offset="100%" stop-color="#00C7BE"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#bg)"/>
  <g transform="translate(12, 12)">
    <circle cx="20" cy="20" r="17" fill="none" stroke="url(#globe)" stroke-width="2"/>
    <ellipse cx="20" cy="20" rx="7" ry="17" fill="none" stroke="url(#globe)" stroke-width="1.5"/>
    <line x1="3" y1="20" x2="37" y2="20" stroke="url(#globe)" stroke-width="1.5"/>
    <ellipse cx="20" cy="10" rx="12" ry="4" fill="none" stroke="url(#globe)" stroke-width="1.5"/>
    <ellipse cx="20" cy="30" rx="12" ry="4" fill="none" stroke="url(#globe)" stroke-width="1.5"/>
  </g>
</svg>
`)}`

// 生成带首字母的地球图标
const generateGlobeIcon = (letter = '') => {
  const char = (letter || '?').charAt(0).toUpperCase()
  return `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0F9FF"/>
      <stop offset="100%" stop-color="#E0F2FE"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#bg)"/>
  <g transform="translate(12, 8)" opacity="0.5">
    <circle cx="20" cy="16" r="12" fill="none" stroke="#0071E3" stroke-width="1.5"/>
    <ellipse cx="20" cy="16" rx="5" ry="12" fill="none" stroke="#0071E3" stroke-width="1.5"/>
    <line x1="8" y1="16" x2="32" y2="16" stroke="#0071E3" stroke-width="1.5"/>
  </g>
  <text x="32" y="48" font-family="-apple-system, sans-serif" font-size="18" font-weight="600" fill="#0071E3" text-anchor="middle">${char}</text>
</svg>
  `)}`
}

const FaviconImage = ({ 
  src, 
  url, 
  alt = '', 
  size = 'md',
  className = '',
}) => {
  const [currentSrc, setCurrentSrc] = useState(GLOBE_ICON) // 默认显示地球图标
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const attemptIndexRef = useRef(0)
  const urlListRef = useRef([])

  // 尺寸映射
  const sizeClasses = {
    sm: 'w-6 h-6 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 md:w-16 md:h-16 rounded-xl',
  }

  // 构建 URL 列表
  useEffect(() => {
    const domain = getDomain(url || '')
    const urls = []
    
    // 自定义图片优先
    if (src && src.trim() && !src.startsWith('data:')) {
      urls.push(src.trim())
    }
    
    // 添加各个服务的 URL
    if (domain) {
      FAVICON_SERVICES.forEach(getUrl => {
        try {
          urls.push(getUrl(domain))
        } catch {}
      })
    }
    
    urlListRef.current = urls
    attemptIndexRef.current = 0
    
    // 如果有 URL 可尝试，开始加载
    if (urls.length > 0) {
      setCurrentSrc(urls[0])
      setLoading(true)
      setImageLoaded(false)
    } else {
      // 没有可用 URL，直接显示地球图标
      setCurrentSrc(generateGlobeIcon(alt))
      setLoading(false)
      setImageLoaded(true)
    }
  }, [src, url, alt])

  const handleLoad = useCallback(() => {
    setLoading(false)
    setImageLoaded(true)
  }, [])

  const handleError = useCallback(() => {
    attemptIndexRef.current += 1
    const urls = urlListRef.current
    
    if (attemptIndexRef.current < urls.length) {
      // 尝试下一个 URL
      setCurrentSrc(urls[attemptIndexRef.current])
    } else {
      // 所有 URL 都失败，显示地球图标
      setCurrentSrc(generateGlobeIcon(alt))
      setLoading(false)
      setImageLoaded(true)
    }
  }, [alt])

  return (
    <div className={`${sizeClasses[size]} bg-apple-gray-light overflow-hidden flex-shrink-0 relative ${className}`}>
      {/* 加载占位 - 显示地球图标 */}
      {loading && (
        <img
          src={GLOBE_ICON}
          alt=""
          className="absolute inset-0 w-full h-full object-cover animate-pulse"
        />
      )}
      
      {/* 实际图片 */}
      <img
        key={currentSrc}
        src={currentSrc}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded && !loading ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}

export default FaviconImage