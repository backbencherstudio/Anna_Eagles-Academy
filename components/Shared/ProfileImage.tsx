import React, { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Upload } from 'lucide-react';
import { useState } from 'react';
import { useUserData } from '@/context/UserDataContext';


export default function ProfileImage() {
    const user = useUserData();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: user.name || 'Peter Parker',
        title: 'Jr. Web/Mobile Developer',
        avatar: user.avatar_url || ''
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
        <div className="border-0">
            <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="text-lg md:text-xl font-semibold">Profile Picture</CardTitle>
                <p className="text-md text-gray-400">Choose your best picture that represents you</p>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    {/* Current Avatar */}
                    <div className="flex flex-col items-center space-y-2">
                        <Avatar className="w-16 h-16 md:w-20 md:h-20">
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
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
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
            </CardContent>
        </div>
    )
}
