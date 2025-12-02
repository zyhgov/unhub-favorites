import { supabase } from '../lib/supabase'

// 请求重试配置
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

// 带重试的请求函数
const withRetry = async (fn, retries = MAX_RETRIES) => {
  let lastError
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      console.warn(`请求失败，第 ${i + 1} 次重试...`, error.message)
      
      if (i < retries - 1) {
        // 等待后重试，每次等待时间递增
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)))
      }
    }
  }
  
  throw lastError
}

// 简单的请求缓存
const requestCache = new Map()
const CACHE_TTL = 30 * 1000

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

  return withRetry(async () => {
    const { data, error } = await supabase
      .from('nav_categories')
      .select('id, name, icon, sort_order')
      .order('sort_order')
    
    if (error) throw error
    
    setCache(cacheKey, data || [])
    return data || []
  })
}

// ============ 网站相关 ============
export const fetchSites = async (useCache = true) => {
  const cacheKey = 'sites_all'
  
  if (useCache) {
    const cached = getCached(cacheKey)
    if (cached) return cached
  }

  return withRetry(async () => {
    const { data, error } = await supabase
      .from('nav_sites')
      .select('id, title, subtitle, url, image, category, tags, is_active, created_at')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    setCache(cacheKey, data || [])
    return data || []
  })
}

// 获取启用的网站
export const fetchActiveSites = async (useCache = true) => {
  const cacheKey = 'sites_active'
  
  if (useCache) {
    const cached = getCached(cacheKey)
    if (cached) return cached
  }

  return withRetry(async () => {
    const { data, error } = await supabase
      .from('nav_sites')
      .select('id, title, subtitle, url, image, category, tags, is_active')
      .eq('is_active', true)
      .order('sort_order')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    setCache(cacheKey, data || [])
    return data || []
  })
}

// 添加网站
export const addSite = async (site) => {
  const siteData = {
    title: site.title?.trim() || '',
    subtitle: site.subtitle?.trim() || '',
    url: site.url?.trim() || '',
    image: site.image?.trim() || null,
    category: site.category || '',
    tags: Array.isArray(site.tags) ? site.tags.filter(t => t) : [],
    is_active: site.is_active !== false,
  }
  
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('nav_sites')
      .insert([siteData])
      .select()
      .single()
    
    if (error) throw error
    
    clearApiCache()
    return data
  })
}

// 更新网站
export const updateSite = async (id, updates) => {
  const updateData = {
    title: updates.title?.trim() || '',
    subtitle: updates.subtitle?.trim() || '',
    url: updates.url?.trim() || '',
    image: updates.image?.trim() || null,
    category: updates.category || '',
    tags: Array.isArray(updates.tags) ? updates.tags.filter(t => t) : [],
    is_active: updates.is_active !== false,
  }
  
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('nav_sites')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    clearApiCache()
    return data
  })
}

// 删除网站
export const deleteSite = async (id) => {
  return withRetry(async () => {
    const { error } = await supabase
      .from('nav_sites')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    clearApiCache()
    return true
  })
}

// 切换启用状态
export const toggleSiteActive = async (id, isActive) => {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('nav_sites')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    clearApiCache()
    return data
  })
}

// ============ 标签相关 ============
export const fetchTags = async (useCache = true) => {
  const cacheKey = 'tags'
  
  if (useCache) {
    const cached = getCached(cacheKey)
    if (cached) return cached
  }

  return withRetry(async () => {
    const { data, error } = await supabase
      .from('nav_sites')
      .select('tags')
    
    if (error) throw error
    
    const tagCount = {}
    ;(data || []).forEach(site => {
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
  })
}