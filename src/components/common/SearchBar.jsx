import { useState, useRef, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineXMark,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
} from 'react-icons/hi2'
import { sites } from '../../data/sites'

const SearchBar = ({ 
  onSearch, 
  placeholder = "搜索网站名称、分类或关键词..." 
}) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const advancedRef = useRef(null)

  // 从 sites 数据中动态提取所有标签并统计数量
  const allTags = useMemo(() => {
    const tagCount = {}
    sites.forEach(site => {
      site.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    })
    // 按使用频率排序
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }))
  }, [])

  // 热门标签（取前12个）
  const popularTags = useMemo(() => {
    return allTags.slice(0, 12)
  }, [allTags])

  // 快捷搜索（取热门网站标题）
  const quickSearchItems = useMemo(() => {
    return sites.slice(0, 5).map(site => site.title)
  }, [])

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
    inputRef.current?.focus()
  }

  const handleTagClick = (tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    setSelectedTags(newTags)
    onSearch(query, newTags)
  }

  const handleQuickSearch = (value) => {
    setQuery(value)
    onSearch(value, selectedTags)
    setIsFocused(false)
    inputRef.current?.blur()
  }

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
          
          {/* 已选标签数量 */}
          {selectedTags.length > 0 && (
            <div className="px-2">
              <span className="px-2 py-0.5 bg-apple-blue text-white text-xs rounded-full font-medium">
                {selectedTags.length}
              </span>
            </div>
          )}
          
          {/* 清除按钮 */}
          {(query || selectedTags.length > 0) && (
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
                         showAdvanced 
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
        <div className="mt-3 p-4 bg-white rounded-2xl shadow-sm border border-black/5">
          {/* 标签筛选 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-apple-black">热门标签</h4>
              <span className="text-xs text-apple-gray-dark">共 {allTags.length} 个标签</span>
            </div>
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
          </div>

          {/* 快捷搜索 */}
          <div>
            <h4 className="text-sm font-semibold text-apple-black mb-3">快捷搜索</h4>
            <div className="flex flex-wrap gap-2">
              {quickSearchItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleQuickSearch(item)}
                  className="px-3 py-1.5 bg-white border border-apple-gray-dark/20 rounded-full 
                             text-sm text-apple-gray-dark hover:border-apple-blue hover:text-apple-blue
                             transition-colors duration-200"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* 已选筛选条件 */}
          {selectedTags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-black/5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-apple-gray-dark">已选:</span>
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
                  onClick={() => {
                    setSelectedTags([])
                    onSearch(query, [])
                  }}
                  className="text-sm text-apple-gray-dark hover:text-apple-blue transition-colors"
                >
                  清除全部
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 搜索提示下拉 */}
      {isFocused && !query && !showAdvanced && (
        <div className="absolute left-0 right-0 mt-2 p-4 bg-white rounded-xl shadow-lg border border-black/5 z-20">
          <p className="text-sm text-apple-gray-dark mb-2">试试搜索</p>
          <div className="flex flex-wrap gap-2">
            {popularTags.slice(0, 6).map(({ tag }) => (
              <button
                key={tag}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleQuickSearch(tag)
                }}
                className="px-3 py-1.5 bg-apple-gray-light rounded-full text-sm text-apple-gray-dark
                           hover:bg-apple-blue hover:text-white transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar