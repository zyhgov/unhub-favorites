import { useRef } from 'react'
import { gsap } from 'gsap'
import { HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2'

const SiteCard = ({ site }) => {
  const cardRef = useRef(null)
  const imageRef = useRef(null)

  const handleMouseEnter = () => {
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
    // 使用 Google Favicon API 作为后备
    const domain = new URL(site.url).hostname
    e.target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  }

  return (
    <a
      ref={cardRef}
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg 
                 transition-shadow duration-300 group cursor-pointer border border-black/5"
    >
      <div className="flex items-center p-3 md:p-4 gap-3 md:gap-4">
        {/* 左侧图片 */}
        <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-xl overflow-hidden bg-apple-gray-light">
          <img
            ref={imageRef}
            src={site.image}
            alt={site.title}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
          {/* 悬浮图标 */}
          <div className="absolute inset-0 bg-apple-black/0 group-hover:bg-apple-black/20 
                          transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            transform scale-50 group-hover:scale-100">
              <HiOutlineArrowTopRightOnSquare className="w-4 h-4 text-white drop-shadow-lg" />
            </div>
          </div>
        </div>
        
        {/* 右侧内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-apple-black text-sm md:text-base truncate
                           group-hover:text-apple-blue transition-colors duration-200">
              {site.title}
            </h3>
            <HiOutlineArrowTopRightOnSquare 
              className="w-4 h-4 text-apple-gray-dark opacity-0 group-hover:opacity-100 
                         transition-opacity flex-shrink-0 mt-0.5 hidden md:block" 
            />
          </div>
          <p className="text-xs md:text-sm text-apple-gray-dark leading-relaxed mt-0.5 line-clamp-2">
            {site.subtitle}
          </p>
          
          {/* 标签 */}
          <div className="flex flex-wrap gap-1 mt-2">
            {site.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="px-1.5 py-0.5 bg-apple-gray-light rounded text-xs 
                           text-apple-gray-dark font-medium"
              >
                {tag}
              </span>
            ))}
            {site.tags.length > 2 && (
              <span className="px-1.5 py-0.5 text-xs text-apple-gray-dark">
                +{site.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  )
}

export default SiteCard