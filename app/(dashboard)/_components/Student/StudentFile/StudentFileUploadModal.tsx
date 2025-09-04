'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface StudentFileUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function StudentFileUploadModal({ 
  open, 
  onOpenChange 
}: StudentFileUploadModalProps) {
  const [fileType, setFileType] = useState('')
  const [weekNumber, setWeekNumber] = useState(1)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [touched, setTouched] = useState({
    fileType: false,
    weekNumber: false,
    selectedFile: false
  })

  // Validation: Check if all required fields are filled
  const isFormValid = fileType && weekNumber > 0 && selectedFile

  // Check if field has been touched and is invalid
  const showError = (field: keyof typeof touched) => touched[field] && !isFormValid

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setTouched(prev => ({ ...prev, selectedFile: true }))
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleFileTypeChange = (value: string) => {
    setFileType(value)
    setTouched(prev => ({ ...prev, fileType: true }))
  }

  const handleWeekNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    setWeekNumber(value)
    setTouched(prev => ({ ...prev, weekNumber: true }))
  }

  const handleUploadToLocal = () => {
    if (!isFormValid) {
      // Mark all fields as touched to show validation errors
      setTouched({ fileType: true, weekNumber: true, selectedFile: true })
      return
    }
    
    // Handle local storage upload
    console.log('Uploading to local storage:', {
      fileType,
      weekNumber,
      file: selectedFile
    })
    onOpenChange(false)
  }

  const handleUploadToGoogleDrive = () => {
    if (!isFormValid) {
      // Mark all fields as touched to show validation errors
      setTouched({ fileType: true, weekNumber: true, selectedFile: true })
      return
    }
    
    // Handle Google Drive upload
    console.log('Uploading to Google Drive:', {
      fileType,
      weekNumber,
      file: selectedFile
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* File Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="file-type" className="text-sm font-medium">
              File Type <span className="text-red-500">*</span>
            </Label>
            <Select value={fileType}  onValueChange={handleFileTypeChange}>
              <SelectTrigger className={`w-full ${touched.fileType && !fileType ? 'border-red-300' : ''} cursor-pointer`}>
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly-video-diary" className='cursor-pointer'>Weekly Video Diary</SelectItem>
                <SelectItem value="assignment-submission" className='cursor-pointer'>Assignment Submission</SelectItem>
                <SelectItem value="other-document" className='cursor-pointer'>Other Document</SelectItem>
              </SelectContent>
            </Select>
            {touched.fileType && !fileType && (
              <p className="text-xs text-red-500">Please select a file type</p>
            )}
          </div>

          {/* Week Number */}
          <div className="space-y-2">
            <Label htmlFor="week-number" className="text-sm font-medium">
              Week Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="week-number"
              type="number"
              min="1"
              value={weekNumber}
              onChange={handleWeekNumberChange}
              className={`w-full cursor-pointer ${touched.weekNumber && weekNumber <= 0 ? 'border-red-300' : ''}`}
            />
            {touched.weekNumber && weekNumber <= 0 && (
              <p className="text-xs text-red-500">Please enter a valid week number</p>
            )}
          </div>

          {/* File Selection */}
          <div className="space-y-2">
            <Label htmlFor="file-upload" className="text-sm font-medium">
              Select File <span className="text-red-500">*</span>
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept="video/*,audio/*,.mp4,.mov,.mp3,.wav,.avi,.mkv"
              onChange={handleFileChange}
              className={`w-full cursor-pointer ${touched.selectedFile && !selectedFile ? 'border-red-300' : ''}`}
            />
            <p className="text-sm text-muted-foreground">
              Accepted formats: Video/Audio files (MP4, MOV, MP3, etc.) - Max 100MB
            </p>
            {touched.selectedFile && !selectedFile && (
              <p className="text-xs text-red-500">Please select a file to upload</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 w-fit">
          <Button
            onClick={handleUploadToLocal}
            disabled={!isFormValid}
            className={`flex-1 text-base  ${
              isFormValid 
                ? 'bg-[#0F2598] text-white hover:bg-[#0F2598]/90 cursor-pointer' 
                : 'bg-gray-400 text-gray-200  cursor-not-allowed'
            }`}
          >
            Upload to Local Storage
          </Button>
          <Button
            onClick={handleUploadToGoogleDrive}
            disabled={!isFormValid}
            variant="outline"
            className={`flex-1 text-base  ${
              isFormValid 
                ? 'border-[#0F2598] text-[#0F2598] hover:bg-[#0F2598]/5 cursor-pointer' 
                : 'border-gray-400 text-gray-400 cursor-not-allowed'
            }`}
          >
            Upload to Google Drive
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
