import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { 
  HiOutlineXMark,
  HiOutlineGlobeAlt,
  HiOutlineShieldCheck,
  HiOutlineHeart,
  HiOutlineEnvelope,
} from 'react-icons/hi2'

const AboutModal = ({ isOpen, onClose }) => {
  const overlayRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      // 打开动画
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      )
    }
  }, [isOpen])

  const handleClose = () => {
    // 关闭动画
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
    })
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: onClose,
    })
  }

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      handleClose()
    }
  }

  // ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      style={{ opacity: 0 }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{ opacity: 0 }}
      >
        {/* 顶部装饰渐变 */}
        <div className="h-32 bg-gradient-to-br from-apple-blue via-blue-500 to-indigo-600 relative overflow-hidden">
          {/* 装饰圆形 */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-white/5 rounded-full" />
          
          {/* Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center p-2">
              <img src="/logo.svg" alt="UNHub" className="w-full h-full" />
            </div>
          </div>
          
          {/* 关闭按钮 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 
                       backdrop-blur rounded-full flex items-center justify-center 
                       transition-colors duration-200"
          >
            <HiOutlineXMark className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6 md:p-8">
          {/* 标题 */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-apple-black mb-1">
              UNHub Favorites
            </h2>
            <p className="text-sm text-apple-gray-dark">
              联合库 · 杖雍皓 · 资源导航站
            </p>
          </div>

          {/* 介绍内容 */}
          <div className="space-y-4 mb-6">
            <p className="text-apple-gray-dark leading-relaxed text-center">
              UNHub Favorites 是<span className="text-apple-black font-medium">联合库 UNHub</span>旗下的资源导航平台，
              为杖雍皓个人团队的互联网资源收藏与快速导航服务平台。
            </p>
          </div>

          {/* 信息卡片 */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-apple-gray-light rounded-xl">
              <div className="w-10 h-10 bg-apple-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <HiOutlineShieldCheck className="w-5 h-5 text-apple-blue" />
              </div>
              <div>
                <p className="text-sm font-medium text-apple-black">统一管理</p>
                <p className="text-xs text-apple-gray-dark">由联合库 UNHub（杖雍皓）统一运营管理</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-apple-gray-light rounded-xl">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <HiOutlineHeart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-apple-black">非商业用途</p>
                <p className="text-xs text-apple-gray-dark">本站仅用于资源收藏与分享，不涉及任何商业目的</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-apple-gray-light rounded-xl">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <HiOutlineGlobeAlt className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-apple-black">访问地址</p>
                <p className="text-xs text-apple-blue">nav.zyhorg.cn</p>
              </div>
            </div>
          </div>

          {/* 版权信息 */}
          <div className="pt-4 border-t border-black/5">
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-apple-gray-dark text-center">
                © {new Date().getFullYear()} UNHub · 联合库. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a 
                  href="https://zyhorg.cn" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-apple-blue hover:underline"
                >
                  访问主站
                </a>
                <span className="text-apple-gray-dark/30">|</span>
                <a 
                  href="mailto:info@zyhorg.cn" 
                  className="text-xs text-apple-blue hover:underline flex items-center gap-1"
                >
                  <HiOutlineEnvelope className="w-3 h-3" />
                  联系我们
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="h-1 bg-gradient-to-r from-apple-blue via-purple-500 to-pink-500" />
      </div>
    </div>
  )
}

export default AboutModal