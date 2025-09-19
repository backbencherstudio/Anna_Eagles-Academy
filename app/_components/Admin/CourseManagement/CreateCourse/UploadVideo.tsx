import React, { useCallback } from 'react'
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
    uniqueId?: string // Add unique identifier for each upload component
}

export default function UploadVideo({
    label,
    enabled,
    onToggle,
    onFileSelect,
    selectedFile,
    onRemove,
    accept = "video/mp4",
    uniqueId,
}: UploadVideoProps) {
    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            onFileSelect(file)
        }
        // Clear the input to allow re-uploading the same file
        event.target.value = ''
    }, [onFileSelect])

    const handleToggle = useCallback((checked: boolean) => {
        onToggle(checked)
        // If disabling, also remove the file
        if (!checked && selectedFile) {
            onRemove()
        }
    }, [onToggle, onRemove, selectedFile])

    const handleFileClick = useCallback(() => {
        const inputId = uniqueId 
            ? `file-upload-${uniqueId}-${label.replace(/\s+/g, '-').toLowerCase()}`
            : `file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`
        const input = document.getElementById(inputId)
        input?.click()
    }, [label, uniqueId])

    return (
        <div className="space-y-2">
            {/* Header with Label and Toggle */}
            <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-800">{label}</Label>
                <Switch
                    checked={enabled}
                    className="cursor-pointer data-[state=checked]:bg-[#0F2598]"
                    onCheckedChange={handleToggle}
                />
            </div>

            <div className="flex items-center gap-3 p-1 border border-gray-200 rounded-lg">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleFileClick}
                    className="flex items-center gap-2 cursor-pointer"
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
                        className="text-red-600 cursor-pointer hover:text-red-700 h-6 w-6 p-0 rounded-full ml-auto"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <p className="text-xs text-gray-500">
                Accepted formats: Video (MP4) - Max 300MB
            </p>

            {/* Hidden File Input */}
            <input
                id={uniqueId 
                    ? `file-upload-${uniqueId}-${label.replace(/\s+/g, '-').toLowerCase()}`
                    : `file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`
                }
                type="file"
                accept={accept}
                onChange={handleFileUpload}
                className="hidden"
                disabled={!enabled}
            />
        </div>
    )
}
