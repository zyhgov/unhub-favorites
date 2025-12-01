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

        {/* 底部 */}
<footer className="px-4 md:px-6 lg:px-8 py-4 md:py-6 border-t border-black/5 mt-6 md:mt-8">
  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
    {/* 左侧：技术栈 */}
    <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
      <span className="text-xs text-apple-gray-dark">Powered by</span>
      <div className="flex items-center gap-2">
        {/* React */}
        <div className="flex items-center gap-1 px-2 py-1 bg-[#61DAFB]/10 rounded-md">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#61DAFB">
            <path d="M12 9.861a2.139 2.139 0 100 4.278 2.139 2.139 0 000-4.278zm-5.992 6.394l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 001.363 3.578l.101.213-.101.213a23.307 23.307 0 00-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 011.182-3.046 24.752 24.752 0 01-1.182-3.046zm12.675 7.305l-.133-.469a23.357 23.357 0 00-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 001.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.14s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 01-1.182 3.046zM5.31 8.945l-.133-.467C4.188 4.992 4.488 2.494 6 1.622c1.483-.856 3.864.155 6.359 2.716l.34.349-.34.349a23.552 23.552 0 00-2.422 2.967l-.135.193-.235.02a23.657 23.657 0 00-3.785.61l-.472.119zm1.896-6.63c-.268 0-.505.058-.705.173-.994.573-1.17 2.565-.485 5.253a25.122 25.122 0 013.233-.501 24.847 24.847 0 012.052-2.544c-1.56-1.519-3.037-2.381-4.095-2.381zm9.589 20.362c-.001 0-.001 0 0 0-1.425 0-3.255-1.073-5.154-3.023l-.34-.349.34-.349a23.53 23.53 0 002.421-2.968l.135-.193.234-.02a23.63 23.63 0 003.787-.609l.472-.119.134.468c.987 3.484.688 5.983-.824 6.854a2.38 2.38 0 01-1.205.308zm-4.096-3.381c1.56 1.519 3.037 2.381 4.095 2.381h.001c.267 0 .505-.058.704-.173.994-.573 1.171-2.566.485-5.254a25.02 25.02 0 01-3.234.501 24.674 24.674 0 01-2.051 2.545zM18.69 8.945l-.472-.119a23.479 23.479 0 00-3.787-.61l-.234-.02-.135-.193a23.414 23.414 0 00-2.421-2.967l-.34-.349.34-.349C14.135 1.778 16.515.767 18 1.622c1.512.872 1.812 3.37.824 6.855l-.134.468zM14.75 7.24c1.142.104 2.227.273 3.234.501.686-2.688.509-4.68-.485-5.253-.988-.571-2.845.304-4.8 2.208A24.849 24.849 0 0114.75 7.24zM7.206 22.677A2.38 2.38 0 016 22.369c-1.512-.871-1.812-3.369-.823-6.854l.132-.468.472.119c1.155.291 2.429.496 3.785.609l.235.02.135.193a23.455 23.455 0 002.422 2.968l.34.349-.34.349c-1.898 1.95-3.728 3.023-5.151 3.023zm-1.19-6.427c-.686 2.688-.509 4.681.485 5.254.987.563 2.843-.305 4.8-2.208a24.998 24.998 0 01-2.052-2.545 24.976 24.976 0 01-3.233-.501zm5.984.628c-.823 0-1.669-.036-2.516-.106l-.235-.02-.135-.193a30.388 30.388 0 01-1.35-2.122 30.354 30.354 0 01-1.166-2.228l-.1-.213.1-.213a30.3 30.3 0 011.166-2.228c.414-.716.869-1.43 1.35-2.122l.135-.193.235-.02a29.785 29.785 0 015.033 0l.234.02.134.193a30.006 30.006 0 012.517 4.35l.101.213-.101.213a29.6 29.6 0 01-2.517 4.35l-.134.193-.234.02c-.847.07-1.694.106-2.517.106zm-2.197-1.084c1.48.111 2.914.111 4.395 0a29.006 29.006 0 002.196-3.798 28.585 28.585 0 00-2.197-3.798 29.031 29.031 0 00-4.394 0 28.477 28.477 0 00-2.197 3.798 29.114 29.114 0 002.197 3.798z"/>
          </svg>
          <span className="text-xs font-medium text-[#61DAFB]">React</span>
        </div>
        
        {/* Tailwind CSS */}
        <div className="flex items-center gap-1 px-2 py-1 bg-[#06B6D4]/10 rounded-md">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#06B6D4">
            <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
          </svg>
          <span className="text-xs font-medium text-[#06B6D4]">Tailwind</span>
        </div>
        
        {/* GSAP */}
        <div className="flex items-center gap-1 px-2 py-1 bg-[#88CE02]/10 rounded-md">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#88CE02">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4a9.6 9.6 0 110 19.2 9.6 9.6 0 010-19.2zM9.6 7.2v9.6l7.2-4.8-7.2-4.8z"/>
          </svg>
          <span className="text-xs font-medium text-[#88CE02]">GSAP</span>
        </div>
      </div>
    </div>
    
    {/* 中间：Cloudflare 安全防护 */}
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F38020]/10 rounded-full">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#F38020">
        <path d="M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123c-.0537-.0009-.1038-.0235-.1377-.0623-.0339-.0389-.0483-.0908-.0397-.1413.0156-.0908.0997-.1591.1914-.1591l8.7157-.1132c1.0635-.0674 2.2178-.9453 2.5918-2.0166l.4746-1.3584c.0322-.0923.0312-.1845.0039-.2696C17.5957 8.4961 14.9834 6.2178 11.8438 6.2178c-2.8848 0-5.3535 1.8193-6.3223 4.3799-.5313-.4004-1.2188-.6406-1.9678-.5908-1.2373.0825-2.2305 1.0752-2.3252 2.3125-.0244.3203.0127.6289.0986.9131C.5986 13.393 0 14.3945 0 15.5225c0 .2031.0156.4014.0449.5947.0215.1387.1396.2422.2803.2432l15.5058.1016c.0566.0009.1084-.0205.1484-.0596.0401-.039.0606-.0927.0586-.1484l-.0264-.5205c-.0752-1.1162-.8848-2.0869-2.0928-2.498zm4.7344-3.7324c-.0264 0-.0489.0176-.0547.0430-.0645.2793-.1475.5518-.2471.8164-.0156.0400-.0029.0859.0293.1133.8193.6953 1.3408 1.7334 1.3408 2.8906 0 .5986-.1387 1.1641-.3848 1.668-.0195.0391-.0127.0869.0176.1182.0303.0322.0771.0430.1172.0283.6338-.2373 1.1846-.623 1.6045-1.1074.0205-.0225.0322-.0527.0322-.0840V15.543c0-1.3574-1.1016-2.4580-2.4551-2.4307z"/>
      </svg>
      <span className="text-xs font-medium text-[#F38020]">Cloudflare</span>
      <span className="text-xs text-apple-gray-dark">安全防护</span>
    </div>
    
    {/* 右侧：版权信息 */}
    <p className="text-xs text-apple-gray-dark">
      © {new Date().getFullYear()} UNHub · 联合库 Favorites | 由 杖雍皓 个人团队 维护
    </p>
  </div>
</footer>
      </main>
    </div>
  )
}

export default MainLayout