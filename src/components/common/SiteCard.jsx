import { useRef } from 'react'
import { gsap } from 'gsap'
import { HiOutlineArrowTopRightOnSquare, HiOutlineNoSymbol } from 'react-icons/hi2'

const SiteCard = ({ site }) => {
  const cardRef = useRef(null)
  const imageRef = useRef(null)

  const isActive = site.is_active !== false

  const handleMouseEnter = () => {
    if (!isActive) return
    gsap.to(cardRef.current, {
      y: -4,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    })
    gsap.to(imageRef.current, {
      scale: 1.1,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    })
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleImageError = (e) => {
    const domain = new URL(site.url).hostname
    e.target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  }

  const handleClick = (e) => {
    if (!isActive) {
      e.preventDefault()
    }
  }

  return (
    <a
      ref={cardRef}
      href={isActive ? site.url : undefined}
      target={isActive ? "_blank" : undefined}
      rel={isActive ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`block bg-white rounded-2xl overflow-hidden shadow-sm transition-shadow duration-300 
                 border border-black/5 ${
                   isActive 
                     ? 'hover:shadow-lg cursor-pointer group' 
                     : 'opacity-60 cursor-not-allowed'
                 }`}
    >
      <div className="flex items-center p-3 md:p-4 gap-3 md:gap-4">
        {/* 左侧图片 */}
        <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-xl overflow-hidden bg-apple-gray-light">
          <img
            ref={imageRef}
            src={site.image || `https://www.google.com/s2/favicons?domain=${site.url}&sz=128`}
            alt={site.title}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
          {/* 悬浮图标 */}
          {isActive && (
            <div className="absolute inset-0 bg-apple-black/0 group-hover:bg-apple-black/20 
                            transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                              transform scale-50 group-hover:scale-100">
                <HiOutlineArrowTopRightOnSquare className="w-4 h-4 text-white drop-shadow-lg" />
              </div>
            </div>
          )}
          {/* 停用标识 */}
          {!isActive && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <HiOutlineNoSymbol className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        
        {/* 右侧内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-semibold text-sm md:text-base truncate transition-colors duration-200 ${
              isActive 
                ? 'text-apple-black group-hover:text-apple-blue' 
                : 'text-apple-gray-dark'
            }`}>
              {site.title}
            </h3>
            {isActive && (
              <HiOutlineArrowTopRightOnSquare 
                className="w-4 h-4 text-apple-gray-dark opacity-0 group-hover:opacity-100 
                           transition-opacity flex-shrink-0 mt-0.5 hidden md:block" 
              />
            )}
          </div>
          <p className="text-xs md:text-sm text-apple-gray-dark leading-relaxed mt-0.5 line-clamp-2">
            {site.subtitle}
          </p>
          
          {/* 标签 - 显示所有标签 */}
          {site.tags && site.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {site.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-1.5 py-0.5 bg-apple-gray-light rounded text-xs 
                             text-apple-gray-dark font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  )
}

export default SiteCard