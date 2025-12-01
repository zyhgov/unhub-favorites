import { useState, useEffect } from 'react'
import lunisolar from 'lunisolar'

const Clock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 使用 lunisolar 获取农历信息
  const lunar = lunisolar(time)
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

  const formatNumber = (num) => num.toString().padStart(2, '0')

  return (
    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2.5 
                    shadow-sm border border-black/5">
      {/* 时间 */}
      <div className="text-xl font-bold text-apple-black tracking-tight font-mono">
        {formatNumber(time.getHours())}
        <span className="animate-pulse">:</span>
        {formatNumber(time.getMinutes())}
        <span className="animate-pulse">:</span>
        {formatNumber(time.getSeconds())}
      </div>
      
      {/* 分隔线 */}
      <div className="w-px h-8 bg-black/10"></div>
      
      {/* 日期信息 */}
      <div className="text-sm">
        <div className="text-apple-black font-medium">
          {time.getFullYear()}/{formatNumber(time.getMonth() + 1)}/{formatNumber(time.getDate())}
          <span className="ml-2 text-apple-blue">{weekDays[time.getDay()]}</span>
        </div>
        <div className="text-apple-gray-dark text-xs">
          {lunar.format('lMlD')} · {lunar.format('cY')}年
        </div>
      </div>
    </div>
  )
}

export default Clock