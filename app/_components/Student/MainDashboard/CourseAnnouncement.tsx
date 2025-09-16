'use client'

import React, { useState, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { X, Volume2 } from 'lucide-react'
import AnnouncementIcon from '@/components/Icons/CustomIcon/AnnouncementIcon'

interface Announcement {
    id: number
    title: string
    message: string
}

const announcements: Announcement[] = [
    {
        id: 1,
        title: "New Course Available",
        message: 'Join our new "Advanced Biblical Studies" course starting next Monday!'
    },
    {
        id: 2,
        title: "Special Offer",
        message: 'Get 20% off on all premium courses this month only!'
    },
    {
        id: 3,
        title: "Live Session",
        message: 'Join our live Q&A session with expert instructors tomorrow at 2 PM.'
    }
]

export default function CourseAnnouncement() {
    const [isVisible, setIsVisible] = useState(true)
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
    const [selectedIndex, setSelectedIndex] = useState(0)

    const scrollTo = useCallback(
        (index: number) => emblaApi && emblaApi.scrollTo(index),
        [emblaApi]
    )

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    React.useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
    }, [emblaApi, onSelect])

    if (!isVisible) return null

    return (
        <div className="relative bg-[#0F25980D] border border-[#C4CEFF] rounded-lg shadow-sm px-5 py-3 mb-4">
            <div className=" flex items-center justify-between gap-2 sm:gap-3 font-spline-sans">
                {/* Left side: Icon + Text */}
                <div className="flex items-center gap-2 ">
                    {/* Megaphone Icon */}
                    <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                        <AnnouncementIcon />
                    </div>

                    {/* Carousel Content */}
                    <div className="embla flex items-center flex-1 overflow-hidden" ref={emblaRef}>
                        <div className="embla__container flex">
                            {announcements.map((announcement) => (
                                <div key={announcement.id} className="embla__slide cursor-pointer flex-shrink-0 w-full">
                                    <div className="flex items-center ju">
                                        <span className="text-gray-700  text-xs sm:text-base leading-relaxed ">
                                            <span className="font-semibold">{announcement.title}:</span> {announcement.message}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right side: Dots + Close Button */}
                <div className="flex items-center gap-2">
                    {/* Carousel Indicators */}
                    <div className="flex items-center space-x-1">
                        {announcements.map((_, index) => (
                            <button
                                key={index}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 cursor-pointer rounded-full transition-colors ${index === selectedIndex ? 'bg-[#0F2598]' : 'bg-[#C4CEFF]'
                                    }`}
                                onClick={() => scrollTo(index)}
                                aria-label={`Go to announcement ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-[#1D1F2C] cursor-pointer hover:text-gray-700 transition-colors p-1"
                        aria-label="Close announcement"
                    >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
