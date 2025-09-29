"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useGetSeriesWithCoursesQuery } from '@/rtk/api/admin/courseFilterApis';
import { Course, SeriesWithCourses } from '@/rtk/api/admin/courseFilterApis';
import { useCreateMaterialMutation, useUpdateSingleMaterialMutation } from '@/rtk/api/admin/manageMaterialsApis';
import toast from 'react-hot-toast';

interface MaterialsUploadProps {
    activeTab: string;
    editingMaterial?: {
        id: string;
        title: string;
        description: string | null;
        lecture_type: string;
        series_id: string;
        course_id: string;
        file_url: string | null;
    } | null;
    onCancelEdit?: () => void;
}

interface MaterialFormData {
    series: string;
    course: string;
    title: string;
    description: string;
    file: FileList | null;
}

interface UploadConfig {
    label: string;
    accept: string;
    description: string;
}

const FILE_SIZE_LIMITS = {
    'video-lectures': 300 * 1024 * 1024, // 300MB
    'audio-lessons': 100 * 1024 * 1024,  // 100MB
    'lecture-slides': 50 * 1024 * 1024,   // 50MB
    'other-document': 50 * 1024 * 1024    // 50MB
} as const;

const UPLOAD_CONFIGS: Record<string, UploadConfig> = {
    'lecture-slides': {
        label: 'Upload Document',
        accept: '.pdf,.ppt,.pptx,.doc,.docx',
        description: 'Accepted formats: PDF, PPT, PPTX, DOC, DOCX - Max 50MB'
    },
    'video-lectures': {
        label: 'Upload Video',
        accept: 'video/mp4,video/avi,video/mov',
        description: 'Accepted formats: Video (MP4, AVI, MOV) - Max 300MB'
    },
    'audio-lessons': {
        label: 'Upload Audio',
        accept: 'audio/mp3,audio/wav,audio/m4a',
        description: 'Accepted formats: Audio (MP3, WAV, M4A) - Max 100MB'
    },
    'other-document': {
        label: 'Upload Document',
        accept: '.pdf,.doc,.docx,.txt,.rtf',
        description: 'Accepted formats: PDF, DOC, DOCX, TXT, RTF - Max 50MB'
    }
};

export default function MaterialsUpload({ activeTab, editingMaterial, onCancelEdit }: MaterialsUploadProps) {
    // ==================== REACT HOOK FORM ====================
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<MaterialFormData>({
        defaultValues: {
            series: '',
            course: '',
            title: '',
            description: '',
            file: null
        },
        mode: 'onChange'
    });

    const watchedSeries = watch('series');

    // ==================== STATE MANAGEMENT ====================
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // ==================== API HOOKS ====================
    const { data: seriesData, isLoading: isLoadingSeries, error: seriesError } = useGetSeriesWithCoursesQuery();
    const [createMaterial, { isLoading: isCreating }] = useCreateMaterialMutation();
    const [updateMaterial, { isLoading: isUpdating }] = useUpdateSingleMaterialMutation();

    // ==================== COMPUTED VALUES ====================
    const availableCourses = useMemo(() => {
        if (!seriesData?.data || !watchedSeries) return [];
        const selectedSeries = seriesData.data.find((series: SeriesWithCourses) => series.id === watchedSeries);
        return selectedSeries?.courses || [];
    }, [seriesData, watchedSeries]);

    const uploadConfig = useMemo((): UploadConfig => {
        return UPLOAD_CONFIGS[activeTab] || {
            label: 'Upload File',
            accept: '*/*',
            description: 'Select a file to upload'
        };
    }, [activeTab]);

    // ==================== EFFECTS ====================
    useEffect(() => {
        if (editingMaterial) {
            setValue('series', editingMaterial.series_id);
            setValue('course', editingMaterial.course_id);
            setValue('title', editingMaterial.title);
            setValue('description', editingMaterial.description || '');
            setValue('file', null);
            setSelectedFile(null); 
        } else {
            reset();
            setSelectedFile(null);
        }
    }, [editingMaterial, setValue, reset]);

    // Additional effect to ensure course is set when series data loads
    useEffect(() => {
        if (editingMaterial && seriesData?.data && watchedSeries && !watch('course')) {
            // If we're editing and have series data but no course selected, set the course
            setValue('course', editingMaterial.course_id);
        }
    }, [seriesData, editingMaterial, watchedSeries, setValue, watch]);

    // ==================== EVENT HANDLERS ====================
    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedFile(file || null);
        setValue('file', event.target.files, { shouldValidate: true });
    }, [setValue]);

    const handleFileRemove = useCallback(() => {
        setSelectedFile(null);
        setValue('file', null, { shouldValidate: true });
    }, [setValue]);

    const handleFileSelect = useCallback(() => {
        document.getElementById('file-upload')?.click();
    }, []);

    const createFormData = useCallback((data: MaterialFormData): FormData => {
        const materialFormData = new FormData();
        materialFormData.append('title', data.title);
        materialFormData.append('series_id', data.series);
        materialFormData.append('course_id', data.course);
        materialFormData.append('lecture_type', activeTab);

        if (data.file && data.file.length > 0) {
            materialFormData.append('file', data.file[0]);
        }

        if (data.description) {
            materialFormData.append('description', data.description);
        }

        return materialFormData;
    }, [activeTab]);

    const getErrorMessage = useCallback((error: any, isEditing: boolean) => {
        return error?.data?.message || error?.message ||
            (isEditing ? 'Failed to update material' : 'Failed to upload material');
    }, []);

    const onSubmit = useCallback(async (data: MaterialFormData) => {
        try {
            const materialFormData = createFormData(data);

            if (editingMaterial) {
                // Update existing material
                const response: any = await updateMaterial({
                    material_id: editingMaterial.id,
                    formData: materialFormData
                }).unwrap();

                toast.success(response?.message || 'Material updated successfully');
                onCancelEdit?.();
            } else {
                // Create new material
                const response: any = await createMaterial(materialFormData).unwrap();

                toast.success(response?.message || 'Material uploaded successfully');
                reset();
                setSelectedFile(null);
            }
        } catch (error: any) {
            const errorMessage = getErrorMessage(error, !!editingMaterial);
            toast.error(typeof errorMessage === 'string' ? errorMessage : 'Operation failed');
        }
    }, [createFormData, createMaterial, updateMaterial, editingMaterial, onCancelEdit, reset, getErrorMessage]);

    // ==================== RENDER HELPERS ====================
    const renderSeriesOptions = useCallback(() => {
        if (isLoadingSeries) {
            return <SelectItem value="loading" disabled>Loading series...</SelectItem>;
        }

        if (seriesError) {
            return <SelectItem value="error" disabled>Error loading series</SelectItem>;
        }

        return seriesData?.data?.map((series: SeriesWithCourses) => (
            <SelectItem key={series.id} value={series.id} className="cursor-pointer">
                {series.title}
            </SelectItem>
        ));
    }, [isLoadingSeries, seriesError, seriesData]);

    const renderCourseOptions = useCallback(() => {
        if (availableCourses.length === 0) {
            return <SelectItem value="no-courses" disabled>No courses available</SelectItem>;
        }

        return availableCourses.map((course: Course) => (
            <SelectItem key={course.id} value={course.id} className="cursor-pointer">
                {course.title}
            </SelectItem>
        ));
    }, [availableCourses]);

    const getCoursePlaceholder = useCallback(() => {
        if (!watchedSeries) return "Select a series first";
        if (availableCourses.length === 0) return "No courses available";
        if (editingMaterial && watch('course')) {
            const selectedCourse = availableCourses.find((course: Course) => course.id === watch('course'));
            return selectedCourse ? selectedCourse.title : "Choose a course";
        }
        return "Choose a course";
    }, [watchedSeries, availableCourses, editingMaterial, watch]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Series and Course Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="series" className="text-sm font-medium text-gray-700">
                        Select Series <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                        name="series"
                        control={control}
                        rules={{ required: 'Please select a series' }}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    setValue('course', ''); // Reset course when series changes
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={isLoadingSeries ? "Loading series..." : "Choose a series"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {renderSeriesOptions()}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.series && (
                        <p className="text-sm text-red-500 mt-1">{errors.series.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="course" className="text-sm font-medium text-gray-700">
                        Select Course <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                        name="course"
                        control={control}
                        rules={{ required: 'Please select a course' }}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={!watchedSeries || availableCourses.length === 0}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={getCoursePlaceholder()} />
                                </SelectTrigger>
                                <SelectContent>
                                    {renderCourseOptions()}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.course && (
                        <p className="text-sm text-red-500 mt-1">{errors.course.message}</p>
                    )}
                </div>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                </Label>
                <Controller
                    name="title"
                    control={control}
                    rules={{
                        required: 'Title is required',
                        minLength: {
                            value: 3,
                            message: 'Title must be at least 3 characters'
                        },
                        maxLength: {
                            value: 100,
                            message: 'Title must be less than 100 characters'
                        }
                    }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            id="title"
                            className="w-full"
                            placeholder="Enter material title"
                        />
                    )}
                />
                {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                )}
            </div>

            {/* Description Input */}
            <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description
                </Label>
                <Controller
                    name="description"
                    control={control}
                    rules={{
                        maxLength: {
                            value: 500,
                            message: 'Description must be less than 500 characters'
                        }
                    }}
                    render={({ field }) => (
                        <Textarea
                            {...field}
                            id="description"
                            placeholder="Enter material description..."
                            className="min-h-[100px]"
                        />
                    )}
                />
                {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
                <Label htmlFor="file-upload" className="text-sm font-medium text-gray-700">
                    {uploadConfig.label} {!editingMaterial && <span className="text-red-500">*</span>}
                </Label>
                <Controller
                    name="file"
                    control={control}
                    rules={{
                        required: !editingMaterial ? 'Please select a file to upload' : false,
                        validate: (value) => {
                            // For new materials, file is required
                            if (!editingMaterial) {
                                if (!value || value.length === 0) {
                                    return 'Please select a file to upload';
                                }
                                const file = value[0];
                                const maxSize = FILE_SIZE_LIMITS[activeTab as keyof typeof FILE_SIZE_LIMITS] || FILE_SIZE_LIMITS['lecture-slides'];
                                if (file.size > maxSize) {
                                    return `File size must be less than ${maxSize / (1024 * 1024)}MB`;
                                }
                            } else {
                                // For editing, file is optional but if provided, validate size
                                if (value && value.length > 0) {
                                    const file = value[0];
                                    const maxSize = FILE_SIZE_LIMITS[activeTab as keyof typeof FILE_SIZE_LIMITS] || FILE_SIZE_LIMITS['lecture-slides'];
                                    if (file.size > maxSize) {
                                        return `File size must be less than ${maxSize / (1024 * 1024)}MB`;
                                    }
                                }
                            }
                            return true;
                        }
                    }}
                    render={({ field }) => (
                        <div className="relative">
                            <div className="flex items-center justify-between w-full py-2 px-2 border border-gray-300 rounded-md bg-white">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 px-5 py-1 rounded text-sm font-medium transition-colors"
                                        onClick={handleFileSelect}
                                    >
                                        {editingMaterial?.file_url ? 'Replace file' : 'Choose file'}
                                    </button>
                                    <span className="text-sm text-gray-500">
                                        {selectedFile ? selectedFile.name :
                                            editingMaterial?.file_url ? `Current: ${editingMaterial.file_url.split('/').pop()}` :
                                                'No file chosen'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {editingMaterial?.file_url && !selectedFile && (
                                        <a
                                            href={editingMaterial.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                                            title="View current file"
                                        >
                                            View
                                        </a>
                                    )}
                                    {selectedFile && (
                                        <button
                                            type="button"
                                            onClick={handleFileRemove}
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                            title="Remove file"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <input
                                id="file-upload"
                                type="file"
                                accept={uploadConfig.accept}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    )}
                />
                {errors.file && (
                    <p className="text-sm text-red-500 mt-1">{errors.file.message}</p>
                )}
                <p className="text-xs text-gray-500">
                    {uploadConfig.description}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    type="submit"
                    disabled={isCreating || isUpdating || isSubmitting}
                    className="w-fit bg-[#0F2598] hover:bg-[#0F2598]/80 text-white font-medium py-3 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isCreating || isUpdating || isSubmitting ?
                        (editingMaterial ? 'Updating...' : 'Uploading...') :
                        (editingMaterial ? 'Update Material' : 'Upload Material')
                    }
                </Button>

                {editingMaterial && onCancelEdit && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancelEdit}
                        className="w-fit cursor-pointer font-medium py-3 rounded-lg"
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}