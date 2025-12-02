import { useState, useCallback, useRef } from 'react'

// 简单的内存缓存
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

export const useDataCache = (key) => {
  const [loading, setLoading] = useState(false)
  const fetchingRef = useRef(false)

  const getCachedData = useCallback(() => {
    const cached = cache.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
    return null
  }, [key])

  const setCachedData = useCallback((data) => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }, [key])

  const clearCache = useCallback(() => {
    cache.delete(key)
  }, [key])

  const clearAllCache = useCallback(() => {
    cache.clear()
  }, [])

  return {
    loading,
    setLoading,
    getCachedData,
    setCachedData,
    clearCache,
    clearAllCache,
    fetchingRef
  }
}

// 全局缓存清除
export const clearAllDataCache = () => {
  cache.clear()
}