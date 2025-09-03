import React, { useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export type VideoModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  videoSrc: string
  title?: string
  poster?: string
  autoPlay?: boolean
  controls?: boolean
  className?: string
  overlayClassName?: string
  onLoadedMetadata?: () => void
}

export default function VideoModal({
  open,
  onOpenChange,
  videoSrc,
  title = 'Video',
  poster,
  autoPlay = false,
  controls = true,
  className,
  overlayClassName = '!bg-black/80',
  onLoadedMetadata,
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!open && videoRef.current) {
      try {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      } catch (_) {
        // ignore
      }
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showOverlay={true}
        showCloseButton={true}
        className={`!max-w-4xl !px-4 !border-0 !bg-transparent shadow-none ${className ?? ''}`}
        overlayClassName={overlayClassName}
        closeButtonClassName="absolute -top-0 -right-0 z-10 rounded-full bg-white/15 hover:bg-white/25 text-white p-2 backdrop-blur-sm transition focus:outline-hidden focus:ring-2 focus:ring-white/40"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="w-full">
          <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full cursor-pointer"
              controls={controls}
              preload="metadata"
              src={videoSrc}
              poster={poster}
              autoPlay={autoPlay}
              onLoadedMetadata={onLoadedMetadata}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
