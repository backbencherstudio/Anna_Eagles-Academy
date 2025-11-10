'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/rtk'
import { hideUpload, requestAbort } from '@/rtk/slices/admin/uploadProgressSlice'
import { Button } from '@/components/ui/button'
import { useAbortChunkUploadMutation } from '@/rtk/api/admin/managementCourseApis'
import toast from 'react-hot-toast'

export default function UploadProgressBar() {
  const dispatch = useDispatch()
  const { isVisible, percent, status, message, currentFileName, canCancel } = useSelector((s: RootState) => s.uploadProgress)
  const [localShow, setLocalShow] = useState(false)
  const [abortChunk] = useAbortChunkUploadMutation()
  const [isCancelling, setIsCancelling] = useState(false)

  // Smooth mount animation
  useEffect(() => {
    if (isVisible) {
      setLocalShow(true)
    }
  }, [isVisible])

  // Auto hide a bit after success or cancel with a smooth fade
  useEffect(() => {
    if (!isVisible) return
    if (status === 'success' || (status === 'error' && message === 'Upload aborted')) {
      const t = setTimeout(() => {
        setLocalShow(false)
        const t2 = setTimeout(() => dispatch(hideUpload()), 250)
        return () => clearTimeout(t2)
      }, 900)
      return () => clearTimeout(t)
    }
  }, [isVisible, status, message, dispatch])

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
  const isCancelled = isError && message === 'Upload aborted'
  const color = isCancelled ? '#F59E0B' : isError ? '#EF4444' : '#27A376'
  const label = isSuccess ? 'Done' : isCancelled ? 'Cancelled' : isError ? 'Failed' : 'Uploading...'
  const showPercent = status === 'uploading'

  const handleCancel = async () => {
    try {
      setIsCancelling(true)
      // signal hook to stop after current in-flight chunk
      dispatch(requestAbort())
      if (currentFileName) {
        const res: any = await abortChunk({ fileName: currentFileName }).unwrap()
        const message =
          res?.data?.message ||
          res?.message ||
          res?.data ||
          'Upload aborted'
        toast.success(message)
      } else {
        toast.success('Upload aborted')
      }
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || 'Failed to abort upload')
    } finally {
      setIsCancelling(false)
    }
  }

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
                {label}
              </span>
              {showPercent && (
                <span className="text-xs font-semibold text-gray-900">{progress}%</span>
              )}
            </div>
            <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`${isError ? 'bg-red-500' : 'bg-[#27A376]'} h-1.5 transition-all duration-150`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Cancel button while uploading */}
            {status === 'uploading' && canCancel && (
              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="h-7 px-2 cursor-pointer py-0 text-xs border-red-500 text-red-600 hover:bg-red-50"
                  onClick={handleCancel}
                  disabled={isCancelling}
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Upload'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


