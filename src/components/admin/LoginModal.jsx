import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { 
  HiOutlineXMark, 
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from 'react-icons/hi2'

// 管理员账号密码（实际项目建议使用环境变量或 Supabase Auth）
const ADMIN_USERNAME = 'zyhorg'
const ADMIN_PASSWORD = 'zyh040410'

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const overlayRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
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
      onComplete: () => {
        setUsername('')
        setPassword('')
        setError('')
        onClose()
      },
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // 登录成功，保存到 sessionStorage
      sessionStorage.setItem('unhub_admin_logged', 'true')
      sessionStorage.setItem('unhub_admin_time', Date.now().toString())
      onLoginSuccess()
      handleClose()
    } else {
      setError('用户名或密码错误')
    }
    
    setLoading(false)
  }

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
      onClick={(e) => e.target === overlayRef.current && handleClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      style={{ opacity: 0 }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{ opacity: 0 }}
      >
        {/* 顶部装饰 */}
        <div className="h-2 bg-gradient-to-r from-apple-blue via-purple-500 to-pink-500" />
        
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 bg-apple-gray-light hover:bg-apple-gray-medium 
                     rounded-full flex items-center justify-center transition-colors"
        >
          <HiOutlineXMark className="w-5 h-5 text-apple-gray-dark" />
        </button>

        {/* 内容 */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-apple-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HiOutlineLockClosed className="w-8 h-8 text-apple-blue" />
            </div>
            <h2 className="text-2xl font-bold text-apple-black">管理员登录</h2>
            <p className="text-sm text-apple-gray-dark mt-1">请输入账号密码以访问管理后台</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                用户名
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-dark" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className="w-full pl-12 pr-4 py-3 bg-apple-gray-light rounded-xl border-2 border-transparent
                           focus:border-apple-blue focus:bg-white outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                密码
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-dark" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-12 pr-12 py-3 bg-apple-gray-light rounded-xl border-2 border-transparent
                           focus:border-apple-blue focus:bg-white outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-gray-dark hover:text-apple-black"
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-apple-blue text-white rounded-xl font-semibold
                       hover:bg-apple-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginModal