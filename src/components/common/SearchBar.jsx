import { useState, useRef, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineXMark,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
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
} from 'react-icons/hi2'

// 图标映射
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

const SearchBar = ({ 
  onSearch,
  allTags = [],
  categories = [],
  activeCategory = 'all',
  onCategoryChange,
  placeholder = "搜索网站名称、分类或关键词..." 
}) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const advancedRef = useRef(null)

  // 使用数据库的标签
  const popularTags = useMemo(() => {
    return allTags.slice(0, 20)
  }, [allTags])

  // 过滤分类（排除"全部"）
  const filterCategories = useMemo(() => {
    return categories.filter(c => c.id !== 'all')
  }, [categories])

  useEffect(() => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: isFocused ? 1.01 : 1,
        duration: 0.2,
        ease: 'power2.out',
      })
    }
  }, [isFocused])

  // 高级筛选动画
  useEffect(() => {
    if (advancedRef.current) {
      gsap.to(advancedRef.current, {
        height: showAdvanced ? 'auto' : 0,
        opacity: showAdvanced ? 1 : 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [showAdvanced])

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value, selectedTags)
  }

  const handleClear = () => {
    setQuery('')
    setSelectedTags([])
    onSearch('', [])
    if (onCategoryChange) {
      onCategoryChange('all')
    }
    inputRef.current?.focus()
  }

  const handleTagClick = (tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    setSelectedTags(newTags)
    onSearch(query, newTags)
  }

  const handleCategoryClick = (categoryId) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId)
    }
  }

  // 计算已选筛选条件数量
  const filterCount = selectedTags.length + (activeCategory !== 'all' ? 1 : 0)

  return (
    <div className="w-full">
      {/* 主搜索框 */}
      <div 
        ref={containerRef}
        className={`relative transition-shadow duration-300 ${
          isFocused ? 'shadow-lg' : 'shadow-sm'
        }`}
      >
        <div className={`flex items-center bg-white rounded-2xl border-2 transition-colors duration-200 ${
          isFocused ? 'border-apple-blue' : 'border-transparent'
        }`}>
          {/* 搜索图标 */}
          <div className="pl-4 pr-2">
            <HiOutlineMagnifyingGlass className={`w-5 h-5 transition-colors duration-200 ${
              isFocused ? 'text-apple-blue' : 'text-apple-gray-dark'
            }`} />
          </div>
          
          {/* 输入框 */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="flex-1 py-3 bg-transparent outline-none text-apple-black 
                       placeholder:text-apple-gray-dark/60 font-normal text-sm md:text-base"
          />
          
          {/* 筛选条件数量 */}
          {filterCount > 0 && (
            <div className="px-2">
              <span className="px-2 py-0.5 bg-apple-blue text-white text-xs rounded-full font-medium">
                {filterCount}
              </span>
            </div>
          )}
          
          {/* 清除按钮 */}
          {(query || filterCount > 0) && (
            <button
              onClick={handleClear}
              className="px-2 text-apple-gray-dark hover:text-apple-black transition-colors"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          )}
          
          {/* 高级筛选按钮 */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3 py-1.5 mr-2 rounded-xl flex items-center gap-1 text-sm font-medium
                       transition-colors duration-200 ${
                         showAdvanced || filterCount > 0
                           ? 'bg-apple-blue text-white' 
                           : 'bg-apple-gray-light text-apple-gray-dark hover:bg-apple-gray-medium'
                       }`}
          >
            <HiOutlineAdjustmentsHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">筛选</span>
            {showAdvanced ? (
              <HiOutlineChevronUp className="w-3 h-3" />
            ) : (
              <HiOutlineChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* 高级筛选面板 */}
      <div 
        ref={advancedRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="mt-3 p-4 bg-white rounded-2xl shadow-sm border border-black/5 space-y-5">
          
          {/* 分类筛选 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-apple-black">分类导航</h4>
              <span className="text-xs text-apple-gray-dark">共 {filterCategories.length} 个分类</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* 全部按钮 */}
              <button
                onClick={() => handleCategoryClick('all')}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 
                           flex items-center gap-1.5 ${
                  activeCategory === 'all'
                    ? 'bg-apple-blue text-white shadow-sm'
                    : 'bg-apple-gray-light text-apple-gray-dark hover:bg-apple-gray-medium'
                }`}
              >
                <HiOutlineSquares2X2 className="w-4 h-4" />
                全部
              </button>
              
              {/* 分类列表 */}
              {filterCategories.map((category) => {
                const IconComponent = iconMap[category.icon] || HiOutlineSquares2X2
                const isActive = activeCategory === category.id
                
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 
                               flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-apple-blue text-white shadow-sm'
                        : 'bg-apple-gray-light text-apple-gray-dark hover:bg-apple-gray-medium'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {category.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 分割线 */}
          <div className="border-t border-black/5" />

          {/* 标签筛选 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-apple-black">热门标签</h4>
              <span className="text-xs text-apple-gray-dark">共 {allTags.length} 个标签</span>
            </div>
            {popularTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {popularTags.map(({ tag, count }) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 
                               flex items-center gap-1.5 ${
                      selectedTags.includes(tag)
                        ? 'bg-apple-blue text-white shadow-sm'
                        : 'bg-apple-gray-light text-apple-gray-dark hover:bg-apple-gray-medium'
                    }`}
                  >
                    {tag}
                    <span className={`text-xs ${
                      selectedTags.includes(tag) ? 'text-white/70' : 'text-apple-gray-dark/50'
                    }`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-apple-gray-dark">暂无标签数据</p>
            )}
          </div>

          {/* 已选筛选条件 */}
          {filterCount > 0 && (
            <>
              <div className="border-t border-black/5" />
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-apple-gray-dark">已选条件:</span>
                    
                    {/* 已选分类 */}
                    {activeCategory !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 
                                     text-green-700 rounded-md text-sm">
                        {(() => {
                          const cat = categories.find(c => c.id === activeCategory)
                          const IconComponent = iconMap[cat?.icon] || HiOutlineSquares2X2
                          return (
                            <>
                              <IconComponent className="w-3.5 h-3.5" />
                              {cat?.name}
                            </>
                          )
                        })()}
                        <button 
                          onClick={() => handleCategoryClick('all')}
                          className="hover:bg-green-200 rounded p-0.5 ml-0.5"
                        >
                          <HiOutlineXMark className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    
                    {/* 已选标签 */}
                    {selectedTags.map((tag) => (
                      <span 
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-apple-blue/10 
                                   text-apple-blue rounded-md text-sm"
                      >
                        {tag}
                        <button 
                          onClick={() => handleTagClick(tag)}
                          className="hover:bg-apple-blue/20 rounded p-0.5"
                        >
                          <HiOutlineXMark className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleClear}
                    className="text-sm text-apple-gray-dark hover:text-apple-blue transition-colors"
                  >
                    清除全部
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchBar