import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import SiteCard from './SiteCard'
import { 
  HiOutlineSquares2X2,
  HiOutlineCpuChip,
  HiOutlineCodeBracket,
  HiOutlinePaintBrush,
  HiOutlinePlayCircle,
  HiOutlineUserGroup,
  HiOutlineNewspaper,
  HiOutlineWrenchScrewdriver,
  HiOutlineBookOpen,
  HiOutlineShoppingCart,
  HiOutlineBriefcase,
  HiOutlineChevronRight,
} from 'react-icons/hi2'

const iconMap = {
  grid: HiOutlineSquares2X2,
  cpu: HiOutlineCpuChip,
  code: HiOutlineCodeBracket,
  palette: HiOutlinePaintBrush,
  play: HiOutlinePlayCircle,
  users: HiOutlineUserGroup,
  newspaper: HiOutlineNewspaper,
  wrench: HiOutlineWrenchScrewdriver,
  book: HiOutlineBookOpen,
  cart: HiOutlineShoppingCart,
  work: HiOutlineBriefcase,
}

const CategorySection = ({ category, sites, onViewAll }) => {
  const sectionRef = useRef(null)
  const IconComponent = iconMap[category.icon] || HiOutlineSquares2X2

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, [])

  if (sites.length === 0) return null

  return (
    <section ref={sectionRef} className="mb-8 md:mb-10">
      {/* 分类标题 */}
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-apple-blue/10 flex items-center justify-center">
            <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-apple-blue" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-apple-black">{category.name}</h2>
            <p className="text-xs md:text-sm text-apple-gray-dark">{sites.length} 个网站</p>
          </div>
        </div>
        {onViewAll && sites.length > 4 && (
          <button
            onClick={() => onViewAll(category.id)}
            className="text-sm font-medium text-apple-blue hover:text-apple-blue/80 
                       transition-colors flex items-center gap-1 group"
          >
            <span className="hidden sm:inline">查看全部</span>
            <span className="sm:hidden">更多</span>
            <HiOutlineChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* 网站卡片网格 - 一行3-4个 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {sites.slice(0, 8).map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>
    </section>
  )
}

export default CategorySection