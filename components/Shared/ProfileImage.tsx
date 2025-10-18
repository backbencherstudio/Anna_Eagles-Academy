import React, { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/rtk/hooks';
import { useUpdateProfileMutation } from '@/rtk/api/authApi';
import { updateUserProfile } from '@/rtk/slices/authSlice';
import Image from 'next/image';
import toast from 'react-hot-toast';


export default function ProfileImage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const user = useAppSelector((state) => state.auth.user)
    const dispatch = useAppDispatch()
    const [updateProfile, { isLoading: isUploading }] = useUpdateProfileMutation()

    // Use user data directly from Redux
    const avatarUrl = user?.avatar_url || user?.avatar || '';
    const userName = user?.name || 'User';

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            setSelectedFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadToServer = async () => {
        if (!selectedFile) return;

        try {
            // Create FormData for image upload
            const formData = new FormData();
            formData.append('image', selectedFile);

            // Use updateProfile API to upload image
            const result = await updateProfile(formData).unwrap();

            console.log('Image uploaded successfully:', result);

            // Create a temporary URL for the uploaded image to show immediately
            const tempImageUrl = URL.createObjectURL(selectedFile);

            // Update Redux store immediately with the preview image URL
            // This will show the image instantly - no reload needed!
            dispatch(updateUserProfile({
                avatar_url: tempImageUrl
            }));

            // Clear preview and selected file
            setPreviewImage(null);
            setSelectedFile(null);

            // Show success message
            toast.success('Profile image updated successfully!');

        } catch (error) {
            console.error('Failed to upload image:', error);
            toast.error('Failed to upload image. Please try again.');
        }
    };

    const handleCancelUpload = () => {
        setPreviewImage(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
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
        if (file) {
            handleFileUpload({ target: { files: e.dataTransfer.files } } as any);
        }
    };
    return (
        <div className="border-0 p-6">
            {/* <h1 className="text-lg md:text-2xl font-semibold text-[#1D1F2C]">Edit Profile</h1> */}
            <div className="flex flex-col xl:flex-row justify-between items-center gap-4 ">
                <div className="w-full xl:w-1/2 ">
                    <h1 className="text-lg md:text-xl font-semibold text-[#1D1F2C]">Profile Picture</h1>
                    <p className="text-md text-[#80868B]">Choose your best picture that represents you</p>
                </div>


                <div className='flex flex-col lg:flex-row items-center gap-4 w-full xl:w-1/2'>
                    {/* Current Avatar */}
                    <div className="flex flex-col items-center space-y-2 ">
                        <Image
                            src={previewImage || avatarUrl || '/placeholder-avatar.png'}
                            alt={userName}
                            width={128}
                            height={128}
                            className='w-32 h-32 xl:w-32 xl:h-32 border-2  p-1 object-cover rounded-full'
                        />
                        <span className="text-xs text-gray-500">
                            {previewImage ? 'Preview' : 'Current'}
                        </span>
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
                                        SVG, PNG, JPG
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

                        {/* Upload/Cancel Buttons */}
                        {previewImage && (
                            <div className="mt-4 flex gap-2 justify-center">
                                <button
                                    onClick={handleUploadToServer}
                                    disabled={isUploading}
                                    className="px-4 py-2 cursor-pointer bg-[#0F2598] text-white text-sm rounded-md hover:bg-[#0F2598]/80 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    {isUploading ? 'Uploading...' : 'Upload'}
                                </button>
                                <button
                                    onClick={handleCancelUpload}
                                    disabled={isUploading}
                                    className="px-4 py-2 cursor-pointer bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
