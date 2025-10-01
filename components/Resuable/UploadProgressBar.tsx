'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/rtk'
import { hideUpload } from '@/rtk/slices/uploadProgressSlice'

export default function UploadProgressBar() {
  const dispatch = useDispatch()
  const { isVisible, percent, status } = useSelector((s: RootState) => s.uploadProgress)
  const [localShow, setLocalShow] = useState(false)

  // Smooth mount animation
  useEffect(() => {
    if (isVisible) {
      setLocalShow(true)
    }
  }, [isVisible])

  // Auto hide a bit after success with a smooth fade
  useEffect(() => {
    if (!isVisible) return
    if (status === 'success') {
      const t = setTimeout(() => {
        setLocalShow(false)
        const t2 = setTimeout(() => dispatch(hideUpload()), 250)
        return () => clearTimeout(t2)
      }, 900)
      return () => clearTimeout(t)
    }
  }, [isVisible, status, dispatch])

  const radius = 26
  const stroke = 6
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius])
  const progress = Math.max(0, Math.min(100, percent))
  const dashOffset = useMemo(
    () => circumference - (progress / 100) * circumference,
    [circumference, progress]
  )

  const isError = status === 'error'
  const isSuccess = status === 'success'
  const color = isError ? '#EF4444' : '#27A376'

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-4 right-4 z-[9999] w-[280px] transition-all duration-300 ${localShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="rounded-xl bg-white border shadow-lg p-3">
        <div className="flex items-center gap-3">
          {/* Circular progress */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="#E5E7EB"
                strokeWidth={stroke}
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke={color}
                strokeWidth={stroke}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-[stroke-dashoffset] duration-200 ease-linear"
              />
            </svg>

            {/* Center content: percent or check */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isSuccess ? (
                <svg className="w-7 h-7 text-[#27A376]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : isError ? (
                <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <span className="text-sm font-semibold text-gray-900">{progress}%</span>
              )}
            </div>
          </div>

          {/* Labels */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 truncate">
                {isSuccess ? 'Done' : isError ? 'Failed' : 'Uploading...'}
              </span>
              {!isSuccess && !isError && (
                <span className="text-xs font-semibold text-gray-900">{progress}%</span>
              )}
            </div>
            <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`${isError ? 'bg-red-500' : 'bg-[#27A376]'} h-1.5 transition-all duration-150`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


