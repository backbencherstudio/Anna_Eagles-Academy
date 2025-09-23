import React from 'react'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon } from 'lucide-react'
import NextImage from 'next/image'

interface UploadImageProps {
  onFileSelect: (file: File | null) => void
  thumbnailFile: File | null
  onRemove: () => void
  existingUrl?: string | null
}

export default function UploadImage({ onFileSelect, thumbnailFile, onRemove, existingUrl }: UploadImageProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('thumbnail-upload')?.click()}
          className="flex items-center gap-2 cursor-pointer shadow-none"
        >
          <ImageIcon className="h-4 w-4" />
          Upload Thumbnail
        </Button>
        <input
          id="thumbnail-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Thumbnail Preview */}
      {thumbnailFile && (
        <div className="mt-3">
          <div className="relative inline-block">
            <NextImage
              src={URL.createObjectURL(thumbnailFile)}
              alt="Course thumbnail"
              width={400}
              height={200}
              className="w-24 h-24 object-cover rounded-lg border cursor-pointer"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="absolute cursor-pointer -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
            >
              ×
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-1">{thumbnailFile.name}</p>
        </div>
      )}

      {!thumbnailFile && existingUrl && (
        <div className="mt-3">
          <div className="relative inline-block">
            <NextImage
              src={existingUrl}
              alt="Course thumbnail"
              width={400}
              height={200}
              className="w-24 h-24 object-cover rounded-lg border"
            />
          </div>
        </div>
      )}
    </div>
  )
}
