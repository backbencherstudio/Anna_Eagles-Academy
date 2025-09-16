"use client";

import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface MaterialsUploadProps {
    activeTab: string;
}

export default function MaterialsUpload({ activeTab }: MaterialsUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        series: '',
        course: '',
        title: '',
        description: ''
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedFile(file || null);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', { ...formData, file: selectedFile, type: activeTab });
        // Handle form submission here
    };

    // Get upload configuration based on active tab
    const getUploadConfig = () => {
        switch (activeTab) {
            case 'lecture-slides':
                return {
                    label: 'Upload Document',
                    accept: '.pdf,.ppt,.pptx,.doc,.docx',
                    description: 'Accepted formats: PDF, PPT, PPTX, DOC, DOCX - Max 50MB'
                };
            case 'video-lectures':
                return {
                    label: 'Upload Video',
                    accept: 'video/mp4,video/avi,video/mov',
                    description: 'Accepted formats: Video (MP4, AVI, MOV) - Max 300MB'
                };
            case 'audio-lessons':
                return {
                    label: 'Upload Audio',
                    accept: 'audio/mp3,audio/wav,audio/m4a',
                    description: 'Accepted formats: Audio (MP3, WAV, M4A) - Max 100MB'
                };
            case 'other-document':
                return {
                    label: 'Upload Document',
                    accept: '.pdf,.doc,.docx,.txt,.rtf',
                    description: 'Accepted formats: PDF, DOC, DOCX, TXT, RTF - Max 50MB'
                };
            default:
                return {
                    label: 'Upload File',
                    accept: '*/*',
                    description: 'Select a file to upload'
                };
        }
    };

    const uploadConfig = getUploadConfig();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="series" className="text-sm font-medium text-gray-700">
                        Select Series
                    </Label>
                    <Select value={formData.series} onValueChange={(value) => handleInputChange('series', value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a course to review" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className="cursor-pointer" value="biblical-leadership">Biblical Leadership Series</SelectItem>
                            <SelectItem className="cursor-pointer" value="spiritual-growth">Spiritual Growth Series</SelectItem>
                            <SelectItem className="cursor-pointer" value="ministry-training">Ministry Training Series</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="course" className="text-sm font-medium text-gray-700">
                        Select Course
                    </Label>
                    <Select value={formData.course} onValueChange={(value) => handleInputChange('course', value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a course to review" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className="cursor-pointer" value="leadership-principles">Leadership Principles</SelectItem>
                            <SelectItem className="cursor-pointer" value="biblical-foundations">Biblical Foundations</SelectItem>
                            <SelectItem className="cursor-pointer" value="practical-ministry">Practical Ministry</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Title
                </Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description
                </Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Share your insights, learnings, or spiritual experiences from this week..."
                    className="min-h-[100px]"
                />
            </div>

            {/* Conditional Upload Section based on active tab */}
            <div className="space-y-2">
                <Label htmlFor="file-upload" className="text-sm font-medium text-gray-700">
                    {uploadConfig.label}
                </Label>
                <div className="relative">
                    <div className="flex items-center justify-between w-full py-2 px-2 border border-gray-300 rounded-md bg-white">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 px-5 py-1 rounded text-sm font-medium transition-colors"
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                Choose file
                            </button>
                            <span className="text-sm text-gray-500">
                                {selectedFile ? selectedFile.name : 'No file chosen'}
                            </span>
                        </div>
                        {selectedFile && (
                            <button
                                type="button"
                                onClick={() => setSelectedFile(null)}
                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                title="Remove file"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                    <input
                        id="file-upload"
                        type="file"
                        accept={uploadConfig.accept}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
                <p className="text-xs text-gray-500">
                    {uploadConfig.description}
                </p>
            </div>

            <Button
                type="submit"
                className="w-fit bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/80 text-white font-medium py-3 rounded-lg"
            >
                Submit Review
            </Button>
        </form>
    );
}
