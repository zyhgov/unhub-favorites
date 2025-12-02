import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { 
  HiOutlineSquares2X2,
  HiOutlineCpuChip,
  HiOutlineAcademicCap,
  HiOutlineCodeBracket,
  HiOutlineCommandLine,
  HiOutlinePaintBrush,
  HiOutlinePlayCircle,
  HiOutlineUserGroup,
  HiOutlineNewspaper,
  HiOutlineWrenchScrewdriver,
  HiOutlineBookOpen,
  HiOutlineShoppingCart,
  HiOutlineStar,
  HiOutlineBuildingOffice,
  HiOutlineBriefcase,
  HiOutlineFolder,
  HiOutlineInformationCircle,
  HiOutlineCog6Tooth,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineXMark,
} from 'react-icons/hi2'
import AboutModal from '../common/AboutModal'
import LoginModal from '../admin/LoginModal'
import AdminPanel from '../admin/AdminPanel'

const iconMap = {
  grid: HiOutlineSquares2X2,
  cpu: HiOutlineCpuChip,
  academic: HiOutlineAcademicCap,
  code: HiOutlineCodeBracket,
  terminal: HiOutlineCommandLine,
  palette: HiOutlinePaintBrush,
  play: HiOutlinePlayCircle,
  users: HiOutlineUserGroup,
  newspaper: HiOutlineNewspaper,
  wrench: HiOutlineWrenchScrewdriver,
  book: HiOutlineBookOpen,
  cart: HiOutlineShoppingCart,
  star: HiOutlineStar,
  building: HiOutlineBuildingOffice,
  briefcase: HiOutlineBriefcase,
  folder: HiOutlineFolder,
}

const Sidebar = ({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  isCollapsed,
  onToggleCollapse,
  onDataUpdate, // 新增：数据更新回调
}) => {
  const sidebarRef = useRef(null)
  const [showAbout, setShowAbout] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 检查登录状态
  useEffect(() => {
    const logged = sessionStorage.getItem('unhub_admin_logged')
    const loginTime = sessionStorage.getItem('unhub_admin_time')
    
    // 登录有效期 2 小时
    if (logged === 'true' && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime)
      if (elapsed < 2 * 60 * 60 * 1000) {
        setIsLoggedIn(true)
      } else {
        sessionStorage.removeItem('unhub_admin_logged')
        sessionStorage.removeItem('unhub_admin_time')
      }
    }
  }, [])

  useEffect(() => {
    if (sidebarRef.current && window.innerWidth >= 768) {
      gsap.to(sidebarRef.current, {
        width: isCollapsed ? 72 : 260,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [isCollapsed])

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId)
    if (window.innerWidth < 768) {
      onToggleCollapse()
    }
  }

  const handleAboutClick = () => {
    setShowAbout(true)
    if (window.innerWidth < 768) {
      onToggleCollapse()
    }
  }

  const handleAdminClick = () => {
    if (isLoggedIn) {
      setShowAdmin(true)
    } else {
      setShowLogin(true)
    }
    if (window.innerWidth < 768) {
      onToggleCollapse()
    }
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setShowAdmin(true)
  }

  const handleAdminClose = () => {
    setShowAdmin(false)
    // 通知父组件刷新数据
    if (onDataUpdate) {
      onDataUpdate()
    }
  }

  return (
    <>
      {/* 移动端遮罩 */}
      <div 
        className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity duration-300 ${
          isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={onToggleCollapse}
      />
      
      <aside 
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-screen bg-white border-r border-black/5 
                   flex flex-col z-40 overflow-hidden
                   transition-transform duration-300 md:transition-none
                   ${isCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
                   w-[260px] md:w-auto`}
        style={{ width: window.innerWidth >= 768 ? (isCollapsed ? 72 : 260) : 260 }}
      >
        {/* Logo 区域 */}
        <div className="h-14 md:h-16 flex items-center justify-between px-4 border-b border-black/5 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              src="/logo.svg" 
              alt="UNHub" 
              className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0"
            />
            {(!isCollapsed || window.innerWidth < 768) && (
              <span 
                className="font-extrabold text-base md:text-lg text-apple-black leading-tight"
                style={{ lineHeight: '1.1' }}
              >
                联合库<br />
                UNHub Favorites
              </span>
            )}
          </div>
          
          <button
            onClick={onToggleCollapse}
            className="md:hidden p-1.5 rounded-lg hover:bg-apple-gray-light transition-colors"
          >
            <HiOutlineXMark className="w-5 h-5 text-apple-gray-dark" />
          </button>
        </div>

        {/* 分类导航 */}
        <nav className="flex-1 py-3 md:py-4 overflow-y-auto overflow-x-hidden scrollbar-thin">
          {(!isCollapsed || window.innerWidth < 768) && (
            <div className="px-4 mb-2">
              <span className="text-xs font-medium text-apple-gray-dark uppercase tracking-wider">
                Category navigation sidebar
              </span>
            </div>
          )}
          
          <ul className="space-y-0.5 px-2">
            {categories.map((category) => {
              const IconComponent = iconMap[category.icon] || HiOutlineSquares2X2
              const isActive = activeCategory === category.id
              
              return (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl
                               transition-all duration-200 group
                               ${isActive 
                                 ? 'bg-apple-blue text-white shadow-sm' 
                                 : 'text-apple-gray-dark hover:bg-apple-gray-light hover:text-apple-black'
                               }`}
                    title={isCollapsed && window.innerWidth >= 768 ? category.name : ''}
                  >
                    <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-apple-gray-dark group-hover:text-apple-black'
                    }`} />
                    {(!isCollapsed || window.innerWidth < 768) && (
                      <span className="font-medium whitespace-nowrap text-sm md:text-base">
                        {category.name}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* 底部区域 */}
        <div className="border-t border-black/5 p-2 md:p-3 flex-shrink-0 space-y-1 md:space-y-2">
          {/* 展开/收起按钮 */}
          <button 
            onClick={onToggleCollapse}
            className={`hidden md:flex w-full items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl
                       bg-apple-gray-light text-apple-gray-dark 
                       hover:bg-apple-gray-medium hover:text-apple-black
                       transition-all duration-200`}
            title={isCollapsed ? '展开菜单' : '收起菜单'}
          >
            {isCollapsed ? (
              <HiOutlineChevronDoubleRight className="w-5 h-5 flex-shrink-0 mx-auto" />
            ) : (
              <>
                <HiOutlineChevronDoubleLeft className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap text-sm">收起菜单</span>
              </>
            )}
          </button>

          {/* 关于本站 */}
          <button 
            onClick={handleAboutClick}
            className={`w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl
                       text-apple-gray-dark hover:bg-apple-gray-light hover:text-apple-black
                       transition-all duration-200`}
            title={isCollapsed && window.innerWidth >= 768 ? '关于本站' : ''}
          >
            <HiOutlineInformationCircle className="w-5 h-5 flex-shrink-0" />
            {(!isCollapsed || window.innerWidth < 768) && (
              <span className="font-medium whitespace-nowrap text-sm">关于本站</span>
            )}
          </button>

          {/* 管理资源 */}
          <button 
            onClick={handleAdminClick}
            className={`w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl
                       transition-all duration-200 ${
                         isLoggedIn 
                           ? 'bg-apple-blue/10 text-apple-blue hover:bg-apple-blue/20' 
                           : 'text-apple-gray-dark hover:bg-apple-gray-light hover:text-apple-black'
                       }`}
            title={isCollapsed && window.innerWidth >= 768 ? '管理资源' : ''}
          >
            <HiOutlineCog6Tooth className="w-5 h-5 flex-shrink-0" />
            {(!isCollapsed || window.innerWidth < 768) && (
              <span className="font-medium whitespace-nowrap text-sm">
                {isLoggedIn ? '管理资源' : '添加资源'}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* 弹窗 */}
      <AboutModal 
        isOpen={showAbout} 
        onClose={() => setShowAbout(false)} 
      />
      
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <AdminPanel
        isOpen={showAdmin}
        onClose={handleAdminClose}
      />
    </>
  )
}

export default Sidebar