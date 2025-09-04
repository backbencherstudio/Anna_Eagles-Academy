'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAppDispatch } from '@/lib/hooks'
import { stopAudio } from '@/lib/store/audioSlice'

export default function RouteAudioGuard() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const lastPathRef = useRef<string | null>(null)

  useEffect(() => {
    if (lastPathRef.current !== null && lastPathRef.current !== pathname) {
      dispatch(stopAudio())
    }
    lastPathRef.current = pathname
  }, [pathname, dispatch])

  return null
}


