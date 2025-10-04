'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download } from 'lucide-react'
import TinyMCEeditor from '@/components/Resuable/TinyMCEeditor'
const Img1 = '/images/gift_image/image1.png'
const Img2 = '/images/gift_image/image2.png'
const Img3 = '/images/gift_image/image3.png'
import CardStyleWithCustomBackground from './CardStyleWithCustomBackground'
import { useGenerateGiftCardMutation } from '@/rtk/api/admin/giftCardGenerateApis'
import LogoCard from '@/components/Icons/LogoCard'
import { useCardExport } from '@/hooks/useCardExport'

// Redux
import { RootState } from '@/rtk'
import {
    setSelectedStudent,
    setSenderName,
    setCardTitle,
    setMessage,
    setGiftCardLoading,
    setGiftCardError,
    setGiftCardSuccess,
} from '@/rtk/slices/admin/giftCardGenerateSlice'

// Components
import CardGeneratorStudentDropdown from './CardGeneratorStudentDropdown'
import toast from 'react-hot-toast'

// Types
interface Student {
    id: string
    name: string
    email: string
}

export default function CardGenerator() {
    const [generateGiftCard, { isLoading: isSending }] = useGenerateGiftCardMutation()
    const dispatch = useDispatch()
    const [selectedStyle, setSelectedStyle] = useState(2)
    const previewRef = useRef<HTMLDivElement | null>(null)
    const exportRef = useRef<HTMLDivElement | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [customBackground, setCustomBackground] = useState<string | null>(null)
    const [exportImageLoaded, setExportImageLoaded] = useState<boolean>(false)
    const [bgScale, setBgScale] = useState<number>(1)
    const [textScale, setTextScale] = useState<number>(1)
    const [bgPosX, setBgPosX] = useState<number>(50)
    const [bgPosY, setBgPosY] = useState<number>(50)
    const { getExportDataUrl } = useCardExport({ exportRef, previewRef, exportImageLoaded, width: 1200, height: 800, pixelRatio: 4 })

    // Redux state
    const {
        selectedStudent,
        studentEmail,
        recipientName,
        senderName,
        cardTitle,
        message,
        isLoading,
        error,
        isSuccess
    } = useSelector((state: RootState) => state.giftCardGenerate)


    // Event handlers
    const handleStudentSelect = (student: Student) => {
        dispatch(setSelectedStudent(student))
    }

    const handleSenderNameChange = (value: string) => {
        dispatch(setSenderName(value))
    }

    const handleCardTitleChange = (html: string) => {
        dispatch(setCardTitle(html))
    }

    const handleMessageChange = (html: string) => {
        dispatch(setMessage(html))
    }



    // Form submission
    const handleSendCard = async () => {
        try {
            dispatch(setGiftCardLoading(true))
            dispatch(setGiftCardError(null))

            if (!selectedStudent?.id) {
                throw new Error('No student selected')
            }

            // capture using common exporter
            const dataUrl = await getExportDataUrl()

            // convert dataUrl to Blob
            const blob = await (await fetch(dataUrl)).blob()
            const fileNameBase = selectedStudent?.name?.replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '').toLowerCase() || 'card'
            const file = new File([blob], `${fileNameBase}.png`, { type: 'image/png' })

            const formData = new FormData()
            formData.append('student_id', selectedStudent.id)
            formData.append('image', file)

            const res = await generateGiftCard(formData).unwrap()
            dispatch(setGiftCardSuccess(true))
            if (typeof window !== 'undefined') {
                const msg = (res && (res.message || res.msg)) || 'Gift card generated and sent successfully!'
                toast.success(msg)
            }

            // Reset form and local UI state to defaults
            try {
                const { resetForm } = await import('@/rtk/slices/admin/giftCardGenerateSlice')
                dispatch(resetForm())
            } catch { }
            setSelectedStyle(2)
            setCustomBackground(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            setBgScale(1)
            setTextScale(1)
            setBgPosX(50)
            setBgPosY(50)
            setExportImageLoaded(false)
        } catch (error: any) {
            console.error('Error sending card:', error)
            const apiMsg = error?.data?.message || error?.error || error?.message || 'Failed to send card. Please try again.'
            dispatch(setGiftCardError(apiMsg))
            if (typeof window !== 'undefined') {
                toast.error(apiMsg)
            }
        } finally {
            dispatch(setGiftCardLoading(false))
        }
    }

    const handleDownloadCard = async () => {
        try {
            const dataUrl = await getExportDataUrl()
            const link = document.createElement('a')
            const fileBase = selectedStudent?.name?.replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '').toLowerCase() || 'card-preview'
            link.href = dataUrl
            link.download = `${fileBase}.png`
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error('Error downloading card:', error)
        }
    }

    // getExportDataUrl now provided by useCardExport hook

    // Resolve background image (custom overrides selected style)
    const backgroundSrc = customBackground || (
        selectedStyle === 1 ? Img1 : selectedStyle === 2 ? Img2 : Img3
    )

    const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            setCustomBackground(typeof reader.result === 'string' ? reader.result : null)
        }
        reader.readAsDataURL(file)
    }

    useEffect(() => {
        // reset flag when background changes so we wait again before export
        setExportImageLoaded(false)
    }, [backgroundSrc])

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column - Customize Card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Customize Card</h2>
                <p className="text-gray-600 text-sm mb-6">Personalize your card content.</p>

                <div className="space-y-4">
                    {/* Student Selection Dropdown */}
                    <CardGeneratorStudentDropdown
                        onStudentSelect={handleStudentSelect}
                        placeholder="Select student..."
                        label="Recipient Name"
                    />

                    {/* Email Address (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <Input
                            placeholder="Student Email Address"
                            value={studentEmail}
                            readOnly
                            className="w-full bg-gray-50"
                        />
                    </div>

                    {/* Sender Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sender Name</label>
                        <Input
                            placeholder="Your name or department"
                            value={senderName}
                            onChange={(e) => handleSenderNameChange(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Title</label>
                        <TinyMCEeditor
                            value={cardTitle}
                            onChange={handleCardTitleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message (Max 40 words)</label>
                        <TinyMCEeditor
                            value={message}
                            onChange={handleMessageChange}
                            maxWords={40}
                        />
                    </div>
                </div>


                <div className="flex items-center justify-end gap-3 mt-6">
                    <Button
                        onClick={handleSendCard}
                        disabled={isLoading || !selectedStudent}
                        className="bg-[#0F2598] hover:bg-[#0F2598]/80 text-white px-6 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Sending...' : 'Send Now'}
                    </Button>
                </div>

            </div>

            {/* Right Column - Card Style & Preview */}
            <div className="space-y-6">
                {/* Hidden fixed-size export canvas for consistent downloads across devices */}
                <div
                    aria-hidden
                    className="fixed -left-[10000px] top-0 pointer-events-none select-none"
                >
                    <div
                        ref={exportRef}
                        className="relative overflow-hidden bg-white"
                        style={{ width: 1200, height: 800 }}
                    >
                        <div className="absolute inset-0" style={{ transform: `scale(${bgScale})`, transformOrigin: `${bgPosX}% ${bgPosY}%` }}>
                            <div className="absolute inset-0">
                                <img
                                    src={backgroundSrc}
                                    alt="Card background"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    onLoad={() => setExportImageLoaded(true)}
                                />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center max-w-[800px] mx-auto px-10" style={{ transform: `scale(${textScale})`, transformOrigin: 'center center', maxWidth: 800, overflow: 'hidden' }}>
                                    <div
                                        className="mt-20 mb-4 text-black drop-shadow-sm [&_h1]:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl [&_h4]:text-xl [&_h5]:text-lg [&_h6]:text-base [&_*]:font-bold"
                                        dangerouslySetInnerHTML={{ __html: cardTitle }}
                                    />
                                    <p className="text-black mb-4 drop-shadow-sm text-2xl">Dear {recipientName || 'Recipient Name'},</p>
                                    <div style={{ maxWidth: 500, margin: '0 auto', overflow: 'hidden' }}>
                                        <div
                                            className="text-black leading-relaxed mb-7 drop-shadow-sm text-xl font-sans"
                                            style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                                            dangerouslySetInnerHTML={{ __html: message }}
                                        />
                                    </div>
                                    <p className="text-black mb-1  drop-shadow-sm text-xl">From: {senderName || 'Your Name'}</p>
                                    <div className="flex mt-7 text-start items-center justify-center gap-2 text-[#F1C27D] drop-shadow-sm">
                                        <div>
                                            <LogoCard className="w-8 h-8" />
                                        </div>
                                        <span className="text-base leading-6">The White br Eagles <br /> Academy</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <CardStyleWithCustomBackground
                    images={[{ id: 1, image: Img1 }, { id: 2, image: Img2 }, { id: 3, image: Img3 }]}
                    selectedStyle={selectedStyle}
                    onSelectStyle={(styleId) => { if (customBackground) { setCustomBackground(null); if (fileInputRef.current) { fileInputRef.current.value = '' } } setSelectedStyle(styleId) }}
                    customBackground={customBackground}
                    fileInputRef={fileInputRef}
                    onBackgroundUpload={handleBackgroundUpload}
                    bgScale={bgScale}
                    setBgScale={setBgScale}
                    textScale={textScale}
                    setTextScale={setTextScale}
                    bgPosX={bgPosX}
                    setBgPosX={setBgPosX}
                    bgPosY={bgPosY}
                    setBgPosY={setBgPosY}
                />

                {/* Preview */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Preview</h2>
                    <p className="text-gray-600 text-sm mb-4">Live preview of your card</p>

                    <div ref={previewRef} className="border-2 border-dashed border-gray-300 rounded-lg relative overflow-hidden bg-white">
                        {/* Maintain a consistent 3:2 aspect ratio in preview to match export (1200x800) */}
                        <div className="relative w-full aspect-[3/2]" style={{ width: '100%', height: 'auto' }}>
                            <div className="absolute inset-0" style={{ transform: `scale(${bgScale})`, transformOrigin: `${bgPosX}% ${bgPosY}%` }}>
                                <img
                                    src={backgroundSrc}
                                    alt="Card background"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                            </div>
                        </div>

                        {/* Content overlay */}
                        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${bgScale})`, transformOrigin: `${bgPosX}% ${bgPosY}%` }}>
                            <div className="text-center mx-auto px-6 max-w-[800px]" style={{ transform: `scale(${textScale})`, transformOrigin: 'center center', maxWidth: 500, overflow: 'hidden' }}>
                                <div
                                    className="mt-14 lg:mt-0 lg:mb-4 text-black drop-shadow-sm [&_h1]:text-lg sm:[&_h1]:text-xl md:[&_h1]:text-2xl lg:[&_h1]:text-3xl [&_h2]:text-base sm:[&_h2]:text-lg md:[&_h2]:text-xl lg:[&_h2]:text-2xl [&_h3]:text-sm sm:[&_h3]:text-base md:[&_h3]:text-lg lg:[&_h3]:text-xl [&_h4]:text-xs sm:[&_h4]:text-sm md:[&_h4]:text-base lg:[&_h4]:text-lg [&_h5]:text-xs sm:[&_h5]:text-sm md:[&_h5]:text-base [&_h6]:text-xs sm:[&_h6]:text-sm [&_*]:font-bold"
                                    dangerouslySetInnerHTML={{ __html: cardTitle }}
                                />
                                <p className="text-black mb-4 drop-shadow-sm text-sm sm:text-base md:text-lg lg:text-xl">Dear {recipientName || 'Anna'},</p>
                                <div style={{ maxWidth: 800, margin: '0 auto', overflow: 'hidden' }}>
                                    <div
                                        className="text-black leading-relaxed lg:mb-6 mb-2 drop-shadow-sm text-xs sm:text-sm md:text-base lg:text-lg"
                                        style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                                        dangerouslySetInnerHTML={{ __html: message }}
                                    />
                                </div>

                                <p className="text-black lg:mb-2 mb-0 drop-shadow-sm text-xs sm:text-sm md:text-base">From: {senderName || 'Aarunu.Jl Hazn'}</p>

                                {/*  */}
                                <div className="flex mt-2 lg:mt-8 text-start items-center justify-center gap-1 text-[#F1C27D] drop-shadow-sm">
                                    <div >
                                        <LogoCard className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                    </div>
                                    <span className="text-xs leading-5 sm:text-sm lg:text-base">The White br Eagles <br /> Academy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6">

                        <Button
                            variant="outline"
                            className="px-4 py-2 cursor-pointer"
                            onClick={handleDownloadCard}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download Card
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

