import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Upload, X } from 'lucide-react'

interface UploadVideoProps {
    label: string
    enabled: boolean
    onToggle: (enabled: boolean) => void
    onFileSelect: (file: File | null) => void
    selectedFile: File | null
    onRemove: () => void
    accept?: string
    maxSize?: string
}

export default function UploadVideo({
    label,
    enabled,
    onToggle,
    onFileSelect,
    selectedFile,
    onRemove,
    accept = "video/mp4",
    maxSize = "300MB"
}: UploadVideoProps) {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            onFileSelect(file)
        }
    }

    return (
        <div className="space-y-2">
            {/* Header with Label and Toggle */}
            <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-800">{label}</Label>
                <Switch
                    checked={enabled}
                    className="cursor-pointer data-[state=checked]:bg-[#0F2598]"
                    onCheckedChange={onToggle}
                />
            </div>

            {/* File Input Area */}
            <div className="flex items-center gap-3 p-1  border border-gray-200 rounded-lg">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById(`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`)?.click()}
                    className={`flex items-center gap-2 cursor-pointer transition-all duration-200 ${enabled
                        ? 'bg-transparent border-none text-[#1D1F2C] shadow-none border-gray-800'
                        : 'bg-transparent border-none text-[#1D1F2C] shadow-none border-gray-200 cursor-not-allowed'
                        }`}
                    disabled={!enabled}
                >
                    <Upload className="h-4 w-4" />
                    Choose file
                </Button>
                <span className={`text-sm ${selectedFile ? 'text-gray-800' : 'text-gray-500'}`}>
                    {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
                {selectedFile && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onRemove}
                        className="text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0 rounded-full ml-auto"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* File Format Info */}
            <p className="text-xs text-gray-500">
                Accepted formats: Video (MP4) - Max {maxSize}
            </p>

            {/* Hidden File Input */}
            <input
                id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
                type="file"
                accept={accept}
                onChange={handleFileUpload}
                className="hidden"
                disabled={!enabled}
            />
        </div>
    )
}
