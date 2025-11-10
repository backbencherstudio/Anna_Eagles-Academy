import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import { startUpload, setUploadProgress, finishUpload, errorUpload, setCurrentFileName, clearAbort } from '@/rtk/slices/admin/uploadProgressSlice'
import { useUploadChunkMutation, useMergeChunksMutation, useAbortChunkUploadMutation } from '@/rtk/api/admin/managementCourseApis'
import toast from 'react-hot-toast'

interface ChunkUploadOptions {
    courseId: string
    title?: string
    chunkSizeMB?: number
    onSuccess?: (result: any) => void
    onError?: (error: any) => void
    lessonFileId?: string
}

export function useChunkUpload() {
    const dispatch = useAppDispatch()
    const abortRequested = useAppSelector(s => s.uploadProgress.abortRequested)
    const [uploadChunk] = useUploadChunkMutation()
    const [mergeChunks] = useMergeChunksMutation()
    const [abortChunkUpload] = useAbortChunkUploadMutation()

    const abortControllerRef = useRef<AbortController | null>(null)
    const currentFileNameRef = useRef<string | null>(null)
    const [isUploadingState, setIsUploadingState] = useState(false)
    const abortRequestedRef = useRef(false)

    useEffect(() => {
        abortRequestedRef.current = abortRequested
    }, [abortRequested])

    const uploadFileInChunks = useCallback(async (
        file: File,
        options: ChunkUploadOptions
    ) => {
        const { courseId, title, chunkSizeMB = 5, onSuccess, onError, lessonFileId } = options

        // Validate inputs
        if (!file) {
            const error = 'Please select a file'
            toast.error(error)
            onError?.(error)
            return
        }

        if (!courseId) {
            const error = 'Course ID is required'
            toast.error(error)
            onError?.(error)
            return
        }

        // Initialize upload
        const chunkSize = chunkSizeMB * 1024 * 1024
        const totalChunks = Math.ceil(file.size / chunkSize)
        currentFileNameRef.current = file.name
        abortControllerRef.current = new AbortController()
        setIsUploadingState(true)
        dispatch(setCurrentFileName(file.name))

        // Start upload progress (enable Cancel button for lesson video uploads)
        dispatch(startUpload({ canCancel: true }))

        try {
            // Upload chunks sequentially
            for (let i = 0; i < totalChunks; i++) {
                // Check if upload was aborted
                if (abortControllerRef.current?.signal.aborted || abortRequestedRef.current) {
                    throw new Error('Upload aborted by user')
                }

                const start = i * chunkSize
                const end = Math.min(file.size, start + chunkSize)
                const chunk = file.slice(start, end)

                const formData = new FormData()
                formData.append('chunk', chunk, file.name)
                formData.append('index', i.toString())
                formData.append('totalChunks', totalChunks.toString())
                formData.append('fileName', file.name)
                formData.append('courseId', courseId)
                formData.append('fileType', file.type || 'application/octet-stream')

                // Respect external abort signal
                if (abortRequested) {
                    throw new Error('Upload aborted by user')
                }

                // Upload chunk (progress is handled by baseQuery, but we override with overall progress)
                try {
                    await uploadChunk(formData).unwrap()
                } catch (chunkError: any) {
                    throw new Error(
                        chunkError?.data?.message ||
                        `Failed to upload chunk ${i + 1}/${totalChunks}: ${chunkError?.message || 'Unknown error'}`
                    )
                }

                // Update overall progress (chunk-level progress from baseQuery is ignored)
                const chunkProgress = Math.round(((i + 1) / totalChunks) * 100)
                dispatch(setUploadProgress(chunkProgress))
                if (abortControllerRef.current?.signal.aborted || abortRequestedRef.current) {
                    throw new Error('Upload aborted by user')
                }
            }

            // All chunks uploaded, now merge
            if (abortControllerRef.current?.signal.aborted || abortRequestedRef.current) {
                throw new Error('Upload aborted by user')
            }
            dispatch(setUploadProgress(95)) // Show 95% while merging

            const mergeResult = await mergeChunks({
                fileName: file.name,
                courseId,
                fileType: file.type || 'application/octet-stream',
                fileSize: file.size,
                title,
                lessonFileId,
            }).unwrap()

            // Complete upload - finishUpload already sets percent to 100 and status to 'success'
            dispatch(finishUpload())
            onSuccess?.(mergeResult)

            return mergeResult
        } catch (error: any) {
            const message = error?.message || error?.data?.message || 'Upload failed'
            if (message === 'Upload aborted by user') {
                dispatch(errorUpload('Upload aborted'))
            } else {
                dispatch(errorUpload(message))
                toast.error(message)
            }
            onError?.(error)
            throw error
        } finally {
            // Cleanup
            currentFileNameRef.current = null
            abortControllerRef.current = null
            setIsUploadingState(false)
            dispatch(setCurrentFileName(null))
            dispatch(clearAbort())
        }
    }, [dispatch, uploadChunk, mergeChunks, abortRequested])

    const abortUpload = useCallback(async () => {
        if (!currentFileNameRef.current) {
            return
        }

        try {
            // Abort the controller
            abortControllerRef.current?.abort()

            // Call abort endpoint
            await abortChunkUpload({ fileName: currentFileNameRef.current }).unwrap()

            dispatch(errorUpload('Upload aborted'))
            toast('Upload aborted', { icon: 'ℹ️' })
        } catch (error: any) {
            console.error('Error aborting upload:', error)
        } finally {
            currentFileNameRef.current = null
            abortControllerRef.current = null
            setIsUploadingState(false)
        }
    }, [dispatch, abortChunkUpload])

    return {
        uploadFileInChunks,
        abortUpload,
        isUploading: isUploadingState,
    }
}

