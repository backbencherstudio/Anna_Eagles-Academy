'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Printer } from 'lucide-react'
import TinyMCEeditor from '@/components/Resuable/TinyMCEeditor'
const Img1 = '/images/gift_image/image1.png'
const Img2 = '/images/gift_image/image2.png'
const Img3 = '/images/gift_image/image3.png'
import Image from 'next/image'
import LogoCard from '@/components/Icons/LogoCard'

export default function CardGenerator() {
    const [formData, setFormData] = useState({
        emailAddress: '',
        recipientName: '',
        senderName: '',
        cardTitle: 'Holiday Greetings',
        message: 'Wishing you and your family a joyous holiday season filled with peace, love and happiness.'
    })
    const [selectedStyle, setSelectedStyle] = useState(2)

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column - Customize Card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Customize Card</h2>
                <p className="text-gray-600 text-sm mb-6">Personalize your card content.</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <Input
                            placeholder="Student Email Address"
                            value={formData.emailAddress}
                            onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
                        <Input
                            placeholder="Student name"
                            value={formData.recipientName}
                            onChange={(e) => handleInputChange('recipientName', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sender Name</label>
                        <Input
                            placeholder="Your name or department"
                            value={formData.senderName}
                            onChange={(e) => handleInputChange('senderName', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Title</label>
                        <TinyMCEeditor
                            value={formData.cardTitle}
                            onChange={(html) => handleInputChange('cardTitle', html)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message (Max 25 words)</label>
                        <TinyMCEeditor
                            value={formData.message}
                            onChange={(html) => handleInputChange('message', html)}
                            maxWords={25}
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <Button className="bg-[#0F2598] hover:bg-[#0F2598]/80 text-white px-6 py-2">
                        Send Now
                    </Button>
                    <Button variant="outline" className="px-4 py-2">
                        <Download className="h-4 w-4 mr-2" />
                        Download Card
                    </Button>
                </div>
            </div>

            {/* Right Column - Card Style & Preview */}
            <div className="space-y-6">
                {/* Card Style */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Card Style</h2>
                            <p className="text-gray-600 text-sm">Live preview of your card</p>
                        </div>
                        <Button variant="outline" className="px-4 py-2">
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
                        {[
                            { id: 1, image: Img1 },
                            { id: 2, image: Img2 },
                            { id: 3, image: Img3 }
                        ].map((style) => (
                            <button
                                key={style.id}
                                onClick={() => setSelectedStyle(style.id)}
                                className={`w-36 h-24 sm:w-48 sm:h-32 cursor-pointer rounded-lg border-2 overflow-hidden relative ${selectedStyle === style.id
                                    ? 'border-blue-500'
                                    : 'border-gray-200'
                                    }`}
                            >
                                <Image
                                    fill
                                    src={style.image}
                                    alt={`Card style ${style.id}`}
                                    className="object-contain"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Preview</h2>
                    <p className="text-gray-600 text-sm mb-4">Live preview of your card</p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg relative overflow-hidden">
                        {/* Background image based on selected style */}
                        <div className="h-full w-full relative">
                            <Image
                                width={1000}
                                height={1000}
                                src={
                                    selectedStyle === 1 ? Img1 :
                                        selectedStyle === 2 ? Img2 :
                                            Img3
                                }
                                alt="Card background"
                                className="object-contain"
                            />
                        </div>

                        {/* Content overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center max-w-md mx-auto px-6">
                                <div
                                    className="mt-14 lg:mt-0 lg:mb-4 text-black drop-shadow-sm [&_h1]:text-lg sm:[&_h1]:text-xl md:[&_h1]:text-2xl lg:[&_h1]:text-3xl [&_h2]:text-base sm:[&_h2]:text-lg md:[&_h2]:text-xl lg:[&_h2]:text-2xl [&_h3]:text-sm sm:[&_h3]:text-base md:[&_h3]:text-lg lg:[&_h3]:text-xl [&_h4]:text-xs sm:[&_h4]:text-sm md:[&_h4]:text-base lg:[&_h4]:text-lg [&_h5]:text-xs sm:[&_h5]:text-sm md:[&_h5]:text-base [&_h6]:text-xs sm:[&_h6]:text-sm [&_*]:font-bold"
                                    dangerouslySetInnerHTML={{ __html: formData.cardTitle }}
                                />
                                <p className="text-black mb-4 drop-shadow-sm text-sm sm:text-base md:text-lg lg:text-xl">Dear {formData.recipientName || 'Anna'},</p>
                                <div
                                    className="text-black leading-relaxed lg:mb-6 mb-2 drop-shadow-sm text-xs sm:text-sm md:text-base lg:text-lg"
                                    dangerouslySetInnerHTML={{ __html: formData.message }}
                                />

                                <p className="text-black lg:mb-2 mb-0 drop-shadow-sm text-xs sm:text-sm md:text-base">From: {formData.senderName || 'Aarunu.Jl Hazn'}</p>

                                <div className="flex mt-2 lg:mt-8 text-start items-center justify-center gap-1 text-[#F1C27D] drop-shadow-sm">
                                    <div >
                                        <LogoCard className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                    </div>
                                    <span className="text-xs leading-5 sm:text-sm lg:text-base">The White br Eagles <br /> Academy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
