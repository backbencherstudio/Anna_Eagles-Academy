import React, { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import ButtonSpring from '@/components/Resuable/ButtonSpring'

export default function WatchWelcomeVideo() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleOpen = () => {
        if (timerRef.current) clearTimeout(timerRef.current)
        setLoading(true)
        timerRef.current = setTimeout(() => {
            setOpen(true)
            setLoading(false)
        }, 100)
    }

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    return (
        <div className="w-full bg-[#0F2598] rounded-xl px-5 py-4  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-4">
            {/* Left side - Text content */}
            <div className="flex-1 space-y-2">
                <h2 className="text-white text-lg sm:text-lg lg:text-xl font-semibold leading-tight font-spline-sans">
                    Welcome to Your Learning Journey!
                </h2>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-spline-sans">
                    Join our new "Advanced Biblical Studies" course starting next Monday!
                </p>
            </div>

            {/* Right side - Watch Video Button */}
            <div className="flex-shrink-0">
                <button
                    className="bg-[#E9E9EA] cursor-pointer hover:bg-gray-300 transition-colors duration-200 rounded-lg px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 text-gray-800 font-medium text-sm font-spline-sans disabled:opacity-70"
                    onClick={handleOpen}
                    disabled={loading}
                >
                    {loading ? (
                        <ButtonSpring size={16} color="#0F2598" />
                    ) : (
                        <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                    <span>{loading ? 'Please wait...' : 'Watch Welcome Video'}</span>
                </button>
            </div>

            {/* Video Modal */}
            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setLoading(false) }}>
                <DialogContent
                    showOverlay={true}
                    showCloseButton={true}
                    className="!max-w-4xl !p-0 !border-0 !bg-transparent shadow-none"
                    closeButtonClassName="text-white hover:text-white/90"
                >
                    <DialogTitle className="sr-only">Welcome Video</DialogTitle>
                    <div className="w-full">
                        <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black">
                            <video
                                className="absolute inset-0 h-full w-full"
                                controls
                                preload="metadata"
                                src="/videos/welcome.mp4"
                                onLoadedMetadata={() => setLoading(false)} 
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
