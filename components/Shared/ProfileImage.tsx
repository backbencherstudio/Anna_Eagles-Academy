import React, { useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Upload } from 'lucide-react';
import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';


export default function ProfileImage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const user = useAppSelector((state) => state.auth.user)

    const [formData, setFormData] = useState({
        name: user?.name || 'John Doe',
        avatar: user?.avatar || ''
    });

    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            // Simulate file upload
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    avatar: e.target?.result as string
                }));
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && fileInputRef.current) {
            fileInputRef.current.files = e.dataTransfer.files;
            handleFileUpload({ target: { files: e.dataTransfer.files } } as any);
        }
    };
    return (
        <div className="border-0 p-6">
            <h1 className="text-lg md:text-2xl font-semibold text-[#1D1F2C]">Edit Profile</h1>
            <div className="flex flex-col xl:flex-row justify-between items-center gap-4">
                <div className="w-full xl:w-1/2">
                    <h1 className="text-lg md:text-xl font-semibold text-[#1D1F2C]">Profile Picture</h1>
                    <p className="text-md text-[#80868B]">Choose your best picture that represents you</p>
                </div>


                <div className='flex flex-col lg:flex-row items-center gap-4 w-full xl:w-1/2'>
                    {/* Current Avatar */}
                    <div className="flex flex-col items-center space-y-2">
                        <Avatar className="w-32 h-32 xl:w-32 xl:h-32">
                            <AvatarImage src={formData.avatar} alt={formData.name} />
                            <AvatarFallback className="bg-orange-50 text-[#F1C27D]">
                                <User className="w-6 h-6 md:w-8 md:h-8" />
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">Current</span>
                    </div>

                    {/* Upload Area */}
                    <div className="flex-1">
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
                            onClick={handleUploadClick}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <div className="space-y-3 md:space-y-4">
                                <div className="mx-auto w-10 h-10 md:w-12 md:h-12 bg-orange-50 rounded-full flex items-center justify-center">
                                    <Upload className="w-5 h-5 md:w-6 md:h-6 text-[#F1C27D]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        SVG, PNG, JPG, or GIF (max 800x400px)
                                    </p>
                                </div>
                            </div>
                            {isUploading && (
                                <div className="mt-4">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F1C27D] mx-auto"></div>
                                    <p className="text-xs text-gray-500 mt-2">Uploading...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
