'use client'

import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'

type Props = {
    images: Array<{ id: number, image: string }>
    selectedStyle: number
    onSelectStyle: (styleId: number) => void
    customBackground: string | null
    fileInputRef: React.RefObject<HTMLInputElement | null>
    onBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    bgScale: number
    setBgScale: (v: number) => void
    textScale: number
    setTextScale: (v: number) => void
    bgPosX: number
    setBgPosX: (v: number) => void
    bgPosY: number
    setBgPosY: (v: number) => void
}

export default function CardStyleWithCustomBackground(props: Props) {
    const {
        images,
        selectedStyle,
        onSelectStyle,
        customBackground,
        fileInputRef,
        onBackgroundUpload,
        bgScale,
        setBgScale,
        textScale,
        setTextScale,
        bgPosX,
        setBgPosX,
        bgPosY,
        setBgPosY,
    } = props

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Card Style</h2>
                    <p className="text-gray-600 text-sm">Live preview of your card</p>
                </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
                {images.map((style) => (
                    <button
                        key={style.id}
                        onClick={() => onSelectStyle(style.id)}
                        className={`w-36 h-24 sm:w-48 sm:h-32 rounded-lg border-2 overflow-hidden relative ${selectedStyle === style.id ? 'border-blue-500' : 'border-gray-200'} cursor-pointer`}
                    >
                        <Image
                            fill
                            src={style.image}
                            alt={`Card style ${style.id}`}
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Custom Background */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Background (optional)</label>
                <Input className="cursor-pointer" ref={fileInputRef} type="file" accept="image/*" onChange={onBackgroundUpload} />
                {customBackground && (
                    <div className="mt-2 text-xs text-gray-500">Custom background applied. Selecting a Card Style will replace it.</div>
                )}
            </div>

            {/* Background Scale */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Bg Scale ({bgScale.toFixed(2)}x)</label>
                    <input
                        type="range"
                        min={0.8}
                        max={1.5}
                        step={0.01}
                        value={bgScale}
                        onChange={(e) => setBgScale(parseFloat(e.target.value))}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Text Scale ({textScale.toFixed(2)}x)</label>
                    <input
                        type="range"
                        min={0.8}
                        max={2}
                        step={0.01}
                        value={textScale}
                        onChange={(e) => setTextScale(parseFloat(e.target.value))}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Position X ({bgPosX}%)</label>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={bgPosX}
                        onChange={(e) => setBgPosX(parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Position Y ({bgPosY}%)</label>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={bgPosY}
                        onChange={(e) => setBgPosY(parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    )
}


