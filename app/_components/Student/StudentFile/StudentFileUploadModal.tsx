'use client'
import React, { useState, useEffect } from 'react'
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
import SeriesFilterStudentResauble from '@/components/Resuable/SeriesFilter/SeriesFilterStudentResauble'
import { useCreateStudentFileMutation } from '@/rtk/api/users/studentFileApis'
import { useDispatch } from 'react-redux'
import { createStart, createSuccess, createFailure } from '@/rtk/slices/users/studentFileSlice'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

interface StudentFileUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function StudentFileUploadModal({
  open,
  onOpenChange
}: StudentFileUploadModalProps) {
  const dispatch = useDispatch()
  const [createStudentFile, { isLoading: isCreating }] = useCreateStudentFileMutation()
  const [selectedSeries, setSelectedSeries] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [fileType, setFileType] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [touched, setTouched] = useState({
    selectedSeries: false,
    selectedCourse: false,
    fileType: false,
    selectedFile: false
  })

  // Validation: Check if all required fields are filled
  const isFormValid = selectedSeries && selectedCourse && fileType && selectedFile

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedSeries('')
      setSelectedCourse('')
      setFileType('')
      setSelectedFile(null)
      setTouched({ selectedSeries: false, selectedCourse: false, fileType: false, selectedFile: false })
    }
  }, [open])


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

  const handleSeriesChange = (value: string) => {
    setSelectedSeries(value)
    setTouched(prev => ({ ...prev, selectedSeries: true }))
  }

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value)
    setTouched(prev => ({ ...prev, selectedCourse: true }))
  }

  const handleUploadToLocal = async () => {
    if (!isFormValid) {
      // Mark all fields as touched to show validation errors
      setTouched({ selectedSeries: true, selectedCourse: true, fileType: true, selectedFile: true })
      return
    }
    try {
      dispatch(createStart())
      const form = new FormData()
      form.append('series_id', selectedSeries)
      form.append('course_id', selectedCourse)
      form.append('section_type', fileType)
      form.append('file', selectedFile as File)
      const res: any = await createStudentFile(form).unwrap()
      const successMsg = res?.message || res?.data?.message || 'File uploaded successfully'
      dispatch(createSuccess(successMsg))
      toast.success(successMsg)
      onOpenChange(false)
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to upload file'
      dispatch(createFailure(msg))
      toast.error(msg)
    }
  }

  // const handleUploadToGoogleDrive = () => {
  //   if (!isFormValid) {

  //     setTouched({ selectedSeries: true, selectedCourse: true, fileType: true, selectedFile: true })
  //     return
  //   }

  //   onOpenChange(false)
  // }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Series & Course (dynamic from student API) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Selected Series & Courses <span className="text-red-500">*</span></Label>
            <SeriesFilterStudentResauble
              className="w-full"
              seriesPlaceholder="Selected Series"
              coursePlaceholder="Selected Courses"
              onSeriesChange={(v) => {
                handleSeriesChange(v ?? '')
              }}
              onCourseChange={(v) => {
                handleCourseChange(v ?? '')
              }}
            />
            {touched.selectedSeries && !selectedSeries && (
              <p className="text-xs text-red-500">Please select a series</p>
            )}
            {selectedSeries && touched.selectedCourse && !selectedCourse && (
              <p className="text-xs text-red-500">Please select a course</p>
            )}
          </div>

          {/* File Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="file-type" className="text-sm font-medium">
              File Type <span className="text-red-500">*</span>
            </Label>
            <Select value={fileType} onValueChange={handleFileTypeChange}>
              <SelectTrigger className={`w-full ${touched.fileType && !fileType ? 'border-red-300' : ''} cursor-pointer`}>
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly-video-diary" className='cursor-pointer'>Weekly Video Diary</SelectItem>

                <SelectItem value="other-document" className='cursor-pointer'>Other Document</SelectItem>
              </SelectContent>
            </Select>
            {touched.fileType && !fileType && (
              <p className="text-xs text-red-500">Please select a file type</p>
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
        <div className="flex flex-col sm:flex-row gap-3 pt-4 w-fit">
          <Button
            onClick={handleUploadToLocal}
            disabled={!isFormValid || isCreating}
            className={`flex-1 text-sm  ${isFormValid
              ? 'bg-[#0F2598] text-white hover:bg-[#0F2598]/90 cursor-pointer'
              : 'bg-gray-400 text-gray-200  cursor-not-allowed'
              }`}
          >
            {isCreating ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
              </span>
            ) : (
              'Upload to Local Storage'
            )}
          </Button>
          <Button
            // onClick={handleUploadToGoogleDrive}
            disabled={!isFormValid}
            variant="outline"
            className={`flex-1 text-sm  ${isFormValid
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
