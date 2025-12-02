import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { gsap } from 'gsap'
import {
  HiOutlineXMark,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineNoSymbol,
  HiOutlineArrowPath,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2'
import { fetchSites, fetchCategories, addSite, updateSite, deleteSite, toggleSiteActive, clearApiCache } from '../../services/api'
import SiteFormModal from './SiteFormModal'

// 图片组件 - 带懒加载和错误处理
const SiteImage = ({ src, url, alt }) => {
  const [imgSrc, setImgSrc] = useState(src)
  const [loaded, setLoaded] = useState(false)

  const fallbackSrc = `https://www.google.com/s2/favicons?domain=${url}&sz=64`

  return (
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-apple-gray-light flex-shrink-0 overflow-hidden">
      {!loaded && (
        <div className="w-full h-full animate-pulse bg-apple-gray-medium" />
      )}
      <img
        src={imgSrc || fallbackSrc}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setImgSrc(fallbackSrc)
          setLoaded(true)
        }}
      />
    </div>
  )
}

const AdminPanel = ({ isOpen, onClose }) => {
  const [sites, setSites] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  
  // 弹窗状态
  const [showForm, setShowForm] = useState(false)
  const [editingSite, setEditingSite] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  
  // 操作状态
  const [actionLoading, setActionLoading] = useState(null)
  
  const panelRef = useRef(null)
  const initialLoadRef = useRef(false)

  // 加载数据
  const loadData = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      clearApiCache()
    }
    
    setLoading(true)
    try {
      const [sitesData, categoriesData] = await Promise.all([
        fetchSites(!forceRefresh),
        fetchCategories(!forceRefresh)
      ])
      setSites(sitesData || [])
      setCategories((categoriesData || []).filter(c => c.id !== 'all'))
    } catch (error) {
      console.error('Failed to load data:', error)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (isOpen && !initialLoadRef.current) {
      initialLoadRef.current = true
      loadData()
      gsap.fromTo(
        panelRef.current,
        { x: '100%' },
        { x: 0, duration: 0.4, ease: 'power2.out' }
      )
    } else if (isOpen) {
      // 再次打开时使用缓存
      loadData(false)
      gsap.to(panelRef.current, { x: 0, duration: 0.3, ease: 'power2.out' })
    }
  }, [isOpen, loadData])

  // 关闭时重置
  useEffect(() => {
    if (!isOpen) {
      initialLoadRef.current = false
    }
  }, [isOpen])

  const handleClose = () => {
    gsap.to(panelRef.current, {
      x: '100%',
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClose,
    })
  }

  // 退出登录
  const handleLogout = () => {
    sessionStorage.removeItem('unhub_admin_logged')
    sessionStorage.removeItem('unhub_admin_time')
    clearApiCache()
    handleClose()
  }

  // 添加网站
  const handleAdd = () => {
    setEditingSite(null)
    setShowForm(true)
  }

  // 编辑网站
  const handleEdit = (site) => {
    setEditingSite(site)
    setShowForm(true)
  }

  // 保存网站
  const handleSave = async (siteData) => {
    if (editingSite) {
      await updateSite(editingSite.id, siteData)
    } else {
      await addSite(siteData)
    }
    await loadData(true)
    setShowForm(false)
    setEditingSite(null)
  }

  // 删除网站
  const handleDelete = async (id) => {
    try {
      setActionLoading(id)
      await deleteSite(id)
      await loadData(true)
      setDeleteConfirm(null)
    } catch (error) {
      alert('删除失败: ' + error.message)
    } finally {
      setActionLoading(null)
    }
  }

  // 切换启用状态
  const handleToggleActive = async (site) => {
    try {
      setActionLoading(site.id)
      await toggleSiteActive(site.id, !site.is_active)
      // 本地更新状态，避免重新加载
      setSites(prev => prev.map(s => 
        s.id === site.id ? { ...s, is_active: !s.is_active } : s
      ))
    } catch (error) {
      alert('操作失败: ' + error.message)
    } finally {
      setActionLoading(null)
    }
  }

  // 使用 useMemo 优化过滤
  const filteredSites = useMemo(() => {
    return sites.filter(site => {
      const matchSearch = !searchTerm || 
        site.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.url?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchCategory = filterCategory === 'all' || site.category === filterCategory
      
      const matchStatus = filterStatus === 'all' || 
        (filterStatus === 'active' && site.is_active) ||
        (filterStatus === 'inactive' && !site.is_active)
      
      return matchSearch && matchCategory && matchStatus
    })
  }, [sites, searchTerm, filterCategory, filterStatus])

  // 分类名称映射
  const categoryNameMap = useMemo(() => {
    const map = {}
    categories.forEach(c => {
      map[c.id] = c.name
    })
    return map
  }, [categories])

  const getCategoryName = (categoryId) => {
    return categoryNameMap[categoryId] || categoryId
  }

  // 统计数据
  const stats = useMemo(() => ({
    total: sites.length,
    active: sites.filter(s => s.is_active).length,
    inactive: sites.filter(s => !s.is_active).length,
    filtered: filteredSites.length
  }), [sites, filteredSites])

  if (!isOpen) return null

  return (
    <>
      {/* 遮罩 */}
      <div 
        className="fixed inset-0 bg-black/40 z-40"
        onClick={handleClose}
      />
      
      {/* 面板 */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-screen w-full max-w-4xl bg-white shadow-2xl z-50 flex flex-col"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-black/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg md:text-xl font-bold text-apple-black">资源管理</h2>
            <span className="px-2 py-1 bg-apple-blue/10 text-apple-blue text-xs md:text-sm rounded-lg">
              {stats.total} 条
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">退出</span>
            </button>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-apple-gray-light rounded-xl transition-colors"
            >
              <HiOutlineXMark className="w-6 h-6 text-apple-gray-dark" />
            </button>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="px-4 md:px-6 py-4 border-b border-black/5 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* 搜索 */}
            <div className="relative flex-1 min-w-[150px]">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray-dark" />
              <input
                type="text"
                placeholder="搜索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-apple-gray-light rounded-xl outline-none
                         focus:ring-2 focus:ring-apple-blue/20 transition-all"
              />
            </div>

            {/* 分类筛选 */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-sm bg-apple-gray-light rounded-xl outline-none cursor-pointer
                       focus:ring-2 focus:ring-apple-blue/20"
            >
              <option value="all">全部分类</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* 状态筛选 */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm bg-apple-gray-light rounded-xl outline-none cursor-pointer
                       focus:ring-2 focus:ring-apple-blue/20"
            >
              <option value="all">全部状态</option>
              <option value="active">已启用 ({stats.active})</option>
              <option value="inactive">已停用 ({stats.inactive})</option>
            </select>

            {/* 刷新 */}
            <button
              onClick={() => loadData(true)}
              disabled={loading}
              className="p-2 hover:bg-apple-gray-light rounded-xl transition-colors"
              title="强制刷新"
            >
              <HiOutlineArrowPath className={`w-5 h-5 text-apple-gray-dark ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* 添加按钮 */}
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-apple-blue text-white rounded-xl
                       hover:bg-apple-blue/90 transition-colors"
            >
              <HiOutlinePlus className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">添加</span>
            </button>
          </div>
        </div>

        {/* 表格 */}
        <div className="flex-1 overflow-auto">
          {loading && sites.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-apple-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-apple-gray-dark">加载中...</p>
              </div>
            </div>
          ) : filteredSites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-apple-gray-dark">
              <p className="text-lg mb-2">暂无数据</p>
              <p className="text-sm">
                {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                  ? '没有匹配的结果，试试调整筛选条件'
                  : '点击上方"添加"按钮添加网站'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-apple-gray-light sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-apple-black">网站</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-apple-black hidden md:table-cell">分类</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-apple-black hidden lg:table-cell">标签</th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-apple-black w-24">状态</th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-apple-black w-24">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredSites.map((site) => (
                  <tr 
                    key={site.id} 
                    className={`hover:bg-apple-gray-light/50 transition-colors ${
                      !site.is_active ? 'opacity-60' : ''
                    } ${actionLoading === site.id ? 'pointer-events-none' : ''}`}
                  >
                    {/* 网站信息 */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <SiteImage 
                          src={site.image} 
                          url={site.url} 
                          alt={site.title} 
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-apple-black text-sm truncate max-w-[120px] md:max-w-[200px]">
                            {site.title}
                          </p>
                          <p className="text-xs text-apple-gray-dark truncate max-w-[120px] md:max-w-[200px]">
                            {site.url}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 分类 */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2 py-1 bg-apple-gray-light rounded-lg text-xs text-apple-gray-dark">
                        {getCategoryName(site.category)}
                      </span>
                    </td>

                    {/* 标签 */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {site.tags && site.tags.length > 0 ? (
                          site.tags.map((tag, i) => (
                            <span 
                              key={i}
                              className="px-1.5 py-0.5 bg-apple-blue/10 text-apple-blue text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-apple-gray-dark">-</span>
                        )}
                      </div>
                    </td>

                    {/* 状态 */}
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleToggleActive(site)}
                          disabled={actionLoading === site.id}
                          className={`inline-flex items-center justify-center gap-1 px-2 md:px-3 py-1 rounded-full 
                                    text-xs font-medium transition-colors min-w-[60px] ${
                            site.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          } ${actionLoading === site.id ? 'opacity-50' : ''}`}
                        >
                          {actionLoading === site.id ? (
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : site.is_active ? (
                            <>
                              <HiOutlineCheck className="w-3 h-3" />
                              <span className="hidden sm:inline">启用</span>
                            </>
                          ) : (
                            <>
                              <HiOutlineNoSymbol className="w-3 h-3" />
                              <span className="hidden sm:inline">停用</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>

                    {/* 操作 */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEdit(site)}
                          className="p-2 hover:bg-apple-blue/10 rounded-lg transition-colors group"
                          title="编辑"
                        >
                          <HiOutlinePencilSquare className="w-4 h-4 text-apple-gray-dark group-hover:text-apple-blue" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(site)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                          title="删除"
                        >
                          <HiOutlineTrash className="w-4 h-4 text-apple-gray-dark group-hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 底部统计 */}
        <div className="px-4 md:px-6 py-3 border-t border-black/5 bg-apple-gray-light/50 flex-shrink-0">
          <div className="flex items-center justify-between text-xs md:text-sm text-apple-gray-dark">
            <span>显示 {stats.filtered} / {stats.total} 条</span>
            <span>
              <span className="text-green-600">启用: {stats.active}</span>
              <span className="mx-2">|</span>
              <span className="text-red-500">停用: {stats.inactive}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 表单弹窗 */}
      <SiteFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingSite(null)
        }}
        onSave={handleSave}
        site={editingSite}
        categories={categories}
      />

      {/* 删除确认弹窗 */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-apple-black mb-2">确认删除</h3>
            <p className="text-apple-gray-dark mb-6">
              确定要删除 <span className="font-medium text-apple-black">{deleteConfirm.title}</span> 吗？此操作无法撤销。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={actionLoading === deleteConfirm.id}
                className="flex-1 py-2.5 bg-apple-gray-light text-apple-black rounded-xl font-medium
                         hover:bg-apple-gray-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={actionLoading === deleteConfirm.id}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium
                         hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                {actionLoading === deleteConfirm.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    删除中...
                  </>
                ) : (
                  '删除'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminPanel