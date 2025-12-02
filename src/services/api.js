import { supabase } from '../lib/supabase'

// 简单的请求缓存
const requestCache = new Map()
const CACHE_TTL = 30 * 1000 // 30秒缓存

const getCached = (key) => {
  const cached = requestCache.get(key)
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data
  }
  return null
}

const setCache = (key, data) => {
  requestCache.set(key, { data, time: Date.now() })
}

export const clearApiCache = () => {
  requestCache.clear()
}

// ============ 分类相关 ============
export const fetchCategories = async (useCache = true) => {
  const cacheKey = 'categories'
  
  if (useCache) {
    const cached = getCached(cacheKey)
    if (cached) return cached
  }

  const { data, error } = await supabase
    .from('nav_categories')
    .select('id, name, icon, sort_order')
    .order('sort_order')
  
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  
  setCache(cacheKey, data)
  return data
}

// ============ 网站相关 ============
export const fetchSites = async (useCache = true) => {
  const cacheKey = 'sites_all'
  
  if (useCache) {
    const cached = getCached(cacheKey)
    if (cached) return cached
  }

  const { data, error } = await supabase
    .from('nav_sites')
    .select('id, title, subtitle, url, image, category, tags, is_active, created_at')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching sites:', error)
    return []
  }
  
  setCache(cacheKey, data)
  return data
}

// 获取启用的网站（前台展示用）
export const fetchActiveSites = async (useCache = true) => {
  const cacheKey = 'sites_active'
  
  if (useCache) {
    const cached = getCached(cacheKey)
    if (cached) return cached
  }

  const { data, error } = await supabase
    .from('nav_sites')
    .select('id, title, subtitle, url, image, category, tags, is_active')
    .eq('is_active', true)
    .order('sort_order')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching active sites:', error)
    return []
  }
  
  setCache(cacheKey, data)
  return data
}

// 添加网站
export const addSite = async (site) => {
  const siteData = {
    ...site,
    tags: Array.isArray(site.tags) ? site.tags : []
  }
  
  const { data, error } = await supabase
    .from('nav_sites')
    .insert([siteData])
    .select()
    .single()
  
  if (error) {
    console.error('Error adding site:', error)
    throw new Error(error.message || '添加失败')
  }
  
  // 清除缓存
  clearApiCache()
  return data
}

// 更新网站
export const updateSite = async (id, updates) => {
  const updateData = {
    ...updates,
    tags: Array.isArray(updates.tags) ? updates.tags : []
  }
  
  const { data, error } = await supabase
    .from('nav_sites')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating site:', error)
    throw new Error(error.message || '更新失败')
  }
  
  // 清除缓存
  clearApiCache()
  return data
}

// 删除网站
export const deleteSite = async (id) => {
  const { error } = await supabase
    .from('nav_sites')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting site:', error)
    throw new Error(error.message || '删除失败')
  }
  
  // 清除缓存
  clearApiCache()
  return true
}

// 切换网站启用状态
export const toggleSiteActive = async (id, isActive) => {
  const { data, error } = await supabase
    .from('nav_sites')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error toggling site:', error)
    throw new Error(error.message || '操作失败')
  }
  
  // 清除缓存
  clearApiCache()
  return data
}

// ============ 标签相关 ============
export const fetchTags = async (useCache = true) => {
  const cacheKey = 'tags'
  
  if (useCache) {
    const cached = getCached(cacheKey)
    if (cached) return cached
  }

  const { data, error } = await supabase
    .from('nav_sites')
    .select('tags')
  
  if (error) {
    console.error('Error fetching tags:', error)
    return []
  }
  
  const tagCount = {}
  data.forEach(site => {
    if (site.tags && Array.isArray(site.tags)) {
      site.tags.forEach(tag => {
        if (tag && typeof tag === 'string') {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        }
      })
    }
  })
  
  const result = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }))
  
  setCache(cacheKey, result)
  return result
}