/**
 * 从 URL 提取域名
 */
export const getDomain = (url) => {
  if (!url) return ''
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0]
  }
}