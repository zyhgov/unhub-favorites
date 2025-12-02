import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { HiOutlineXMark, HiOutlinePlus, HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi2'
import FaviconImage from '../common/FaviconImage'

const SiteFormModal = ({ isOpen, onClose, onSave, site, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    url: '',
    image: '',
    category: '',
    tags: [],
    is_active: true,
  })
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' })
  
  const modalRef = useRef(null)
  const overlayRef = useRef(null)

  // 初始化表单数据
  useEffect(() => {
    if (isOpen) {
      if (site) {
        setFormData({
          title: site.title || '',
          subtitle: site.subtitle || '',
          url: site.url || '',
          image: site.image || '',
          category: site.category || '',
          tags: Array.isArray(site.tags) ? [...site.tags] : [],
          is_active: site.is_active !== false,
        })
      } else {
        setFormData({
          title: '',
          subtitle: '',
          url: '',
          image: '',
          category: categories[0]?.id || '',
          tags: [],
          is_active: true,
        })
      }
      setErrors({})
      setSaveStatus({ type: '', message: '' })
      setTagInput('')
    }
  }, [site, categories, isOpen])

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 })
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      )
    }
  }, [isOpen])

  const handleClose = () => {
    if (loading) return // 保存中不允许关闭
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.2,
      onComplete: onClose,
    })
  }

  // 添加标签
  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
      setTagInput('')
    }
  }

  // 删除标签
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // 验证表单
  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = '请输入网站名称'
    if (!formData.url.trim()) newErrors.url = '请输入网址'
    if (!formData.category) newErrors.category = '请选择分类'
    
    if (formData.url && !formData.url.match(/^https?:\/\/.+/)) {
      newErrors.url = '请输入有效的网址（以 http:// 或 https:// 开头）'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    setLoading(true)
    setSaveStatus({ type: '', message: '' })
    
    try {
      const submitData = {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        url: formData.url.trim(),
        image: formData.image.trim() || null,
        category: formData.category,
        tags: formData.tags.filter(t => t && typeof t === 'string'),
        is_active: formData.is_active,
      }
      
      await onSave(submitData)
      setSaveStatus({ type: 'success', message: '保存成功！' })
      
      // 延迟关闭
      setTimeout(() => {
        handleClose()
      }, 500)
      
    } catch (error) {
      console.error('Save error:', error)
      setSaveStatus({ 
        type: 'error', 
        message: error.message || '保存失败，请重试' 
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && handleClose()}
      className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-black/50"
      style={{ opacity: 0 }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
        style={{ opacity: 0 }}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          <h3 className="text-lg font-bold text-apple-black">
            {site ? '编辑网站' : '添加网站'}
          </h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-apple-gray-light rounded-lg transition-colors disabled:opacity-50"
          >
            <HiOutlineXMark className="w-5 h-5 text-apple-gray-dark" />
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* 状态提示 */}
          {saveStatus.message && (
            <div className={`flex items-center gap-2 p-3 rounded-xl ${
              saveStatus.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {saveStatus.type === 'success' ? (
                <HiOutlineCheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <HiOutlineExclamationCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm">{saveStatus.message}</p>
            </div>
          )}

          {/* 网站名称 */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-1">
              网站名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="如：ChatGPT"
              disabled={loading}
              className={`w-full px-4 py-2.5 bg-apple-gray-light rounded-xl outline-none
                       focus:ring-2 focus:ring-apple-blue/20 transition-all disabled:opacity-50
                       ${errors.title ? 'ring-2 ring-red-300' : ''}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* 网站描述 */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-1">
              网站描述
            </label>
            <textarea
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="简要描述这个网站..."
              rows={2}
              disabled={loading}
              className="w-full px-4 py-2.5 bg-apple-gray-light rounded-xl outline-none resize-none
                       focus:ring-2 focus:ring-apple-blue/20 transition-all disabled:opacity-50"
            />
          </div>

          {/* 网址 */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-1">
              网址 <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com"
              disabled={loading}
              className={`w-full px-4 py-2.5 bg-apple-gray-light rounded-xl outline-none
                       focus:ring-2 focus:ring-apple-blue/20 transition-all disabled:opacity-50
                       ${errors.url ? 'ring-2 ring-red-300' : ''}`}
            />
            {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
          </div>

          {/* 图标链接 + 预览 */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-1">
              图标链接
            </label>
            <div className="flex gap-3 items-start">
              <FaviconImage
                src={formData.image}
                url={formData.url || 'https://example.com'}
                alt={formData.title || '预览'}
                size="md"
              />
              <div className="flex-1">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="留空将自动获取网站图标"
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-apple-gray-light rounded-xl outline-none
                           focus:ring-2 focus:ring-apple-blue/20 transition-all disabled:opacity-50"
                />
                <p className="text-xs text-apple-gray-dark mt-1">
                  💡 留空时会自动尝试获取网站图标
                </p>
              </div>
            </div>
          </div>

          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-1">
              分类 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              disabled={loading}
              className={`w-full px-4 py-2.5 bg-apple-gray-light rounded-xl outline-none cursor-pointer
                       focus:ring-2 focus:ring-apple-blue/20 transition-all disabled:opacity-50
                       ${errors.category ? 'ring-2 ring-red-300' : ''}`}
            >
              <option value="">请选择分类</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-1">
              标签
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="输入标签后按回车添加"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-apple-gray-light rounded-xl outline-none
                         focus:ring-2 focus:ring-apple-blue/20 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || loading}
                className="px-4 py-2 bg-apple-blue text-white rounded-xl hover:bg-apple-blue/90 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiOutlinePlus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[32px]">
              {formData.tags.length === 0 ? (
                <span className="text-sm text-apple-gray-dark">暂无标签</span>
              ) : (
                formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-apple-blue/10 text-apple-blue 
                             rounded-lg text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      disabled={loading}
                      className="hover:bg-apple-blue/20 rounded p-0.5 transition-colors"
                    >
                      <HiOutlineXMark className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* 状态开关 */}
          <div className="flex items-center justify-between p-4 bg-apple-gray-light rounded-xl">
            <div>
              <p className="font-medium text-apple-black">启用状态</p>
              <p className="text-sm text-apple-gray-dark">停用后用户无法点击访问</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                disabled={loading}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-apple-gray-dark/30 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
                            after:bg-white after:rounded-full after:h-5 after:w-5 
                            after:transition-all peer-checked:bg-apple-blue
                            peer-disabled:opacity-50"></div>
            </label>
          </div>
        </form>

        {/* 底部按钮 */}
        <div className="flex gap-3 px-6 py-4 border-t border-black/5 bg-apple-gray-light/30">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-2.5 bg-apple-gray-light text-apple-black rounded-xl font-medium
                     hover:bg-apple-gray-medium transition-colors disabled:opacity-50"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 bg-apple-blue text-white rounded-xl font-medium
                     hover:bg-apple-blue/90 transition-colors disabled:opacity-50
                     flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                保存中...
              </>
            ) : (
              '保存'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SiteFormModal