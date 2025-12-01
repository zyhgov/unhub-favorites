import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import SearchBar from '../common/SearchBar'
import SiteCard from '../common/SiteCard'
import CategorySection from '../common/CategorySection'
import Clock from '../common/Clock'
import { categories, sites } from '../../data/sites'
import { HiOutlineSquares2X2, HiOutlineBars3 } from 'react-icons/hi2'

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [filteredSites, setFilteredSites] = useState(sites)
  
  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(true)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 过滤网站
  useEffect(() => {
    let result = sites

    // 按分类过滤
    if (activeCategory !== 'all') {
      result = result.filter(site => site.category === activeCategory)
    }

    // 按搜索词过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(site => 
        site.title.toLowerCase().includes(query) ||
        site.subtitle.toLowerCase().includes(query) ||
        site.url.toLowerCase().includes(query) ||
        site.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 按标签过滤
    if (selectedTags.length > 0) {
      result = result.filter(site =>
        selectedTags.some(tag => 
          site.tags.some(siteTag => siteTag.toLowerCase().includes(tag.toLowerCase()))
        )
      )
    }

    setFilteredSites(result)
  }, [activeCategory, searchQuery, selectedTags])

  // 搜索处理
  const handleSearch = (query, tags = []) => {
    setSearchQuery(query)
    setSelectedTags(tags)
  }

  // 查看全部分类
  const handleViewAll = (categoryId) => {
    setActiveCategory(categoryId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 获取当前分类
  const currentCategory = categories.find(c => c.id === activeCategory)

  // 按分类分组网站（用于全部视图）
  const groupedSites = categories
    .filter(c => c.id !== 'all')
    .map(category => ({
      category,
      sites: filteredSites.filter(site => site.category === category.id)
    }))
    .filter(group => group.sites.length > 0)

  // 计算主内容区的左边距
  const mainMarginLeft = isMobile ? 0 : (isCollapsed ? 72 : 260)

  return (
    <div className="min-h-screen bg-apple-gray-light">
      {/* 侧边栏 */}
      <Sidebar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* 主内容区 */}
      <main 
        className="transition-all duration-300 min-h-screen"
        style={{ marginLeft: mainMarginLeft }}
      >
        {/* 顶部区域 - 搜索框和时钟 */}
        <header className="sticky top-0 z-30 bg-apple-gray-light/80 backdrop-blur-xl border-b border-black/5">
          <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4">
            <div className="flex items-center gap-3 md:gap-4">
              {/* 移动端菜单按钮 */}
              {isMobile && (
                <button
                  onClick={() => setIsCollapsed(false)}
                  className="p-2 rounded-xl bg-white shadow-sm border border-black/5
                             hover:bg-apple-gray-light transition-colors flex-shrink-0"
                >
                  <HiOutlineBars3 className="w-5 h-5 text-apple-black" />
                </button>
              )}
              
              {/* 搜索框 - 左侧 */}
              <div className="flex-1 relative">
                <SearchBar onSearch={handleSearch} />
              </div>
              
              {/* 时钟 - 右侧 */}
              <div className="hidden md:block flex-shrink-0">
                <Clock />
              </div>
            </div>
          </div>
        </header>

        {/* 内容区域 */}
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
          {/* 分类标题栏 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-apple-black">
                {currentCategory?.name || '全部'}
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-sm text-apple-gray-dark">
                  共 {filteredSites.length} 个网站
                </p>
                {searchQuery && (
                  <span className="px-2 py-0.5 bg-apple-blue/10 text-apple-blue rounded-md text-xs font-medium">
                    搜索: {searchQuery}
                  </span>
                )}
                {selectedTags.length > 0 && (
                  <span className="px-2 py-0.5 bg-apple-blue/10 text-apple-blue rounded-md text-xs font-medium">
                    标签: {selectedTags.length}个
                  </span>
                )}
              </div>
            </div>
            
            {/* 移动端显示时钟 */}
            <div className="md:hidden">
              <Clock />
            </div>
          </div>

          {/* 网站内容 */}
          {filteredSites.length > 0 ? (
            activeCategory === 'all' ? (
              // 全部视图：按分类分组展示
              <div className="space-y-6 md:space-y-8">
                {groupedSites.map(({ category, sites }) => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    sites={sites}
                    onViewAll={handleViewAll}
                  />
                ))}
              </div>
            ) : (
              // 单分类视图：网格展示 - 一行3-4个
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {filteredSites.map((site) => (
                  <SiteCard key={site.id} site={site} />
                ))}
              </div>
            )
          ) : (
            // 空状态
            <div className="flex flex-col items-center justify-center py-16 md:py-20">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-apple-gray-medium rounded-full flex items-center justify-center mb-4 md:mb-6">
                <HiOutlineSquares2X2 className="w-8 h-8 md:w-10 md:h-10 text-apple-gray-dark" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-apple-black mb-2">
                没有找到网站
              </h3>
              <p className="text-sm md:text-base text-apple-gray-dark text-center max-w-md px-4">
                {searchQuery 
                  ? `没有找到与 "${searchQuery}" 相关的网站，试试其他关键词吧`
                  : '当前分类下暂无网站'
                }
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedTags([])
                  setActiveCategory('all')
                }}
                className="mt-4 md:mt-6 px-5 py-2 bg-apple-blue text-white rounded-full 
                           font-medium text-sm hover:bg-apple-blue/90 transition-colors"
              >
                查看全部网站
              </button>
            </div>
          )}
        </div>

<footer className="px-4 md:px-6 lg:px-8 py-4 md:py-6 border-t border-black/5 mt-6 md:mt-8">
  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
    {/* 左侧：技术栈 */}
    <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
      <span className="text-xs text-apple-gray-dark">Powered by</span>
      <div className="flex items-center gap-2">
        {/* React */}
        <div className="flex items-center gap-1 px-2 py-1 bg-[#61DAFB]/10 rounded-md">
          <img src="/tubiao/react.svg" alt="React" className="w-3.5 h-3.5" />
          <span className="text-xs font-medium text-[#61DAFB]">React</span>
        </div>

        {/* Tailwind CSS */}
        <div className="flex items-center gap-1 px-2 py-1 bg-[#06B6D4]/10 rounded-md">
          <img src="/tubiao/tailwindcss.svg" alt="Tailwind CSS" className="w-3.5 h-3.5" />
          <span className="text-xs font-medium text-[#06B6D4]">Tailwind</span>
        </div>

        {/* GSAP */}
        <div className="flex items-center gap-1 px-2 py-1 bg-[#88CE02]/10 rounded-md">
          <img src="/tubiao/GSAP.svg" alt="GSAP" className="w-3.5 h-3.5" />
          <span className="text-xs font-medium text-[#88CE02]">GSAP</span>
        </div>
      </div>
    </div>

    {/* 中间：Cloudflare 安全防护 */}
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F38020]/10 rounded-full">
      <img src="/tubiao/cloudflare.svg" alt="Cloudflare" className="w-4 h-4" />
      <span className="text-xs font-medium text-[#F38020]">Cloudflare</span>
      <span className="text-xs text-apple-gray-dark">提供全面安全防护、DDoS 防御与全球 CDN 加速服务</span>
    </div>

    {/* 右侧：版权信息 + 小 logo */}
    <div className="flex items-center gap-1.5">
      <img src="/unhub.svg" alt="UNHub" className="w-4 h-4" />
      <p className="text-xs text-apple-gray-dark">
        © {new Date().getFullYear()} UNHub · 联合库 Favorites | 由 杖雍皓 制作维护
      </p>
    </div>
  </div>
</footer>
      </main>
    </div>
  )
}

export default MainLayout