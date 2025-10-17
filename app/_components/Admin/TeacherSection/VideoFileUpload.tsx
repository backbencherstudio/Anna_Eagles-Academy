import React from 'react'
import { UploadCloud, X } from 'lucide-react'

interface VideoFileUploadProps {
  file: File | null
  onFileChange: (file: File | null) => void
  accept?: string
  inputId?: string
  existingFileUrl?: string | null
  disabled?: boolean
}

export default function VideoFileUpload({ file, onFileChange, accept = 'video/*', inputId, existingFileUrl, disabled = false }: VideoFileUploadProps) {
  const generatedId = React.useId()
  const id = inputId ?? `video-input-${generatedId}`

  const onDrop = React.useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files?.[0]
    if (droppedFile) onFileChange(droppedFile)
  }, [onFileChange])

  const onPickFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0]
    if (f) onFileChange(f)
  }

  const onDeleteFile = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    onFileChange(null)
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      {/* Existing File Display */}
      {existingFileUrl && !file && (
        <div className="border border-green-200 rounded-md p-2 bg-green-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <UploadCloud className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Current Video File</p>
              <p className="text-xs text-green-600 truncate max-w-[200px]">{existingFileUrl.split('/').pop()}</p>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Area */}
      <div className="relative">
        <label
          onDrop={disabled ? undefined : onDrop}
          onDragOver={disabled ? undefined : (e) => e.preventDefault()}
          htmlFor={disabled ? undefined : id}
          className={`border border-dashed rounded-md p-2 flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground transition-colors ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-primary/60'
            }`}
        >
          <UploadCloud className="h-6 w-6 text-[#0F2598]" />
          <div className="text-sm text-[#4A4C56] font-medium">
            {disabled ? 'File upload disabled' : 'Click to upload or drag and drop your video file'}
          </div>
          <p className="text-[#777980] text-xs">MP4 AVI MOV up to 500MB</p>
          {file && (
            <div className="mt-2">
              <p className="text-[#0F2598] text-xs font-medium">Selected: {file.name}</p>
            </div>
          )}
        </label>
        {file && !disabled && (
          <button
            type="button"
            onClick={onDeleteFile}
            className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white cursor-pointer shadow hover:text-red-600 text-red-600 hover:bg-red-50"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {!disabled && <input id={id} type="file" accept={accept} className="hidden" onChange={onPickFile} />}
      </div>
    </div>
  )
}
