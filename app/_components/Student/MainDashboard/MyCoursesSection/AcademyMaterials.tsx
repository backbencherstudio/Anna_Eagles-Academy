import React from 'react'
import { Button } from '@/components/ui/button'
import { Download, Play } from 'lucide-react'

export default function AcademyMaterials() {
    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1D1F2C]">Academy Materials</h2>

                {/* Academy Brochure Button */}
                <Button className="bg-[#0F2598] hover:bg-[#0F2598]/90 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Academy Brochure</span>
                </Button>
            </div>

            {/* Large Image with Play Button */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-gray-200">
                <div className="aspect-video relative">
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-16 cursor-pointer h-16  bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                            <Play className="w-6 h-6 text-black fill-black ml-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
