import React from 'react'
import { UploadCloud, X } from 'lucide-react'

interface VideoFileUploadProps {
  file: File | null
  onFileChange: (file: File | null) => void
  accept?: string
  inputId?: string
}

export default function VideoFileUpload({ file, onFileChange, accept = 'video/*', inputId }: VideoFileUploadProps) {
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
    <div className="flex flex-col gap-2">
      <div className="relative">
        <label
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          htmlFor={id}
          className="border border-dashed rounded-md p-10 flex flex-col items-center justify-center gap-3 text-center cursor-pointer text-sm text-muted-foreground hover:border-primary/60 transition-colors"
        >
          <UploadCloud className="h-8 w-8 text-[#0F2598]" />
          <div className="text-sm text-[#4A4C56] font-medium">Click to upload or drag and drop your video file</div>
          <p className="text-[#777980] text-xs">MP4 AVI MOV up to 500MB</p>
          {file && <p className="text-[#0F2598] text-xs font-medium">Selected: {file.name}</p>}
        </label>
        {file && (
          <button
            type="button"
            onClick={onDeleteFile}
            className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white cursor-pointer shadow hover:text-red-600 text-red-600 hover:bg-red-50"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <input id={id} type="file" accept={accept} className="hidden" onChange={onPickFile} />
      </div>
    </div>
  )
}
