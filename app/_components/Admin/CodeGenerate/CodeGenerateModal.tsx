"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { Copy, Check } from 'lucide-react'

// Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Custom Components
import StudentDropdown from '@/app/_components/Admin/CodeGenerate/StudentDropdown'
import SeriesDropdown from '@/app/_components/Admin/CodeGenerate/SeriesDropdown'
import SeriesCourseDropdown from '@/app/_components/Admin/CodeGenerate/SeriesCourseDropdown'

// Redux
import { RootState } from '@/rtk'
import { useGenerateScholarshipCodeMutation } from '@/rtk/api/admin/scholarshipCodeGenerateApis'
import {
    setSelectedSeries,
    setSelectedCourses,
    setSelectedStudent,
    setCodeType,
    setGeneratedCode,
    setLoading,
    setError,
    resetForm,
    clearSuccess
} from '@/rtk/slices/admin/scholarshipCodeGenerateSlice'

// Types
interface Course {
    id: string
    title: string
}

interface Student {
    id: string
    name: string
    email: string
}

interface SeriesWithCourses {
    id: string
    title: string
    created_at: string
    courses: Course[]
}

interface FormData {
    student_id: string
    series_id: string
    course_ids: string[]
    scholarship_type: string
}

// Constants
const CODE_TYPES = [
    { value: 'scholarship', label: 'Scholarship / Sponsored Student' },
    { value: 'free', label: 'Free Student' },
    { value: 'paid', label: 'Paid Student' }
] as const

interface CodeGenerateModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function CodeGenerateModal({ open, onOpenChange }: CodeGenerateModalProps) {
    const dispatch = useDispatch()
    const [copied, setCopied] = useState(false)

    // Redux state
    const {
        selectedSeries,
        selectedCourses,
        selectedStudent,
        studentEmail,
        codeType,
        generatedCode,
        isSuccess,
        isLoading
    } = useSelector((state: RootState) => state.scholarshipCodeGenerate)

    // API mutation
    const [generateScholarshipCode] = useGenerateScholarshipCodeMutation()

    // React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm<FormData>({
        defaultValues: {
            student_id: '',
            series_id: '',
            course_ids: [],
            scholarship_type: ''
        }
    })

    // Event handlers
    const handleSeriesSelect = (series: SeriesWithCourses | null) => {
        dispatch(setSelectedSeries(series))
        setValue('series_id', series?.id || '')
    }

    const handleCourseSelect = (courses: Course[]) => {
        dispatch(setSelectedCourses(courses))
        setValue('course_ids', courses.map(course => course.id))
    }

    const handleStudentSelect = (student: Student) => {
        dispatch(setSelectedStudent(student))
        setValue('student_id', student?.id || '')
    }

    const handleCodeTypeChange = (value: string) => {
        dispatch(setCodeType(value))
        setValue('scholarship_type', value)
    }

    // Sync form values with Redux state
    useEffect(() => {
        if (!selectedSeries) setValue('series_id', '')
        if (selectedCourses.length === 0) setValue('course_ids', [])
        if (!selectedStudent) setValue('student_id', '')
        if (!codeType) setValue('scholarship_type', '')
    }, [selectedSeries, selectedCourses, selectedStudent, codeType, setValue])

    // Clear success state when modal closes
    useEffect(() => {
        if (!open && isSuccess) {
            dispatch(clearSuccess())
        }
    }, [open, isSuccess, dispatch])

    // Form submission
    const onSubmit = async (data: FormData) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))

            const response = await generateScholarshipCode(data).unwrap()
            const code = response.code || response.data?.code || 'Code generated successfully'

            dispatch(setGeneratedCode(code))
            dispatch(resetForm())
            reset()
        } catch (error) {
            console.error('Error generating code:', error)
            dispatch(setError('Failed to generate code. Please try again.'))
        } finally {
            dispatch(setLoading(false))
        }
    }

    // Copy to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                        Generate Scholarship Code
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Hidden validation inputs */}
                        <input type="hidden" {...register('student_id', { required: 'Student is required' })} />
                        <input type="hidden" {...register('series_id', { required: 'Series is required' })} />
                        <input type="hidden" {...register('course_ids', { required: 'At least one course is required' })} />

                        {/* Series Selection */}
                        <div className="space-y-2">
                            <SeriesDropdown
                                key={`series-${selectedSeries?.id || 'empty'}`}
                                onSeriesSelect={handleSeriesSelect}
                                placeholder="Select series..."
                                label="Series"
                            />
                            {errors.series_id && (
                                <p className="text-sm text-red-500">{errors.series_id.message}</p>
                            )}
                        </div>

                        {/* Course Selection */}
                        <div className="space-y-2">
                            <SeriesCourseDropdown
                                key={`courses-${selectedCourses.length}-${selectedSeries?.id || 'empty'}`}
                                onSelectionChange={handleCourseSelect}
                                selectedSeries={selectedSeries}
                                placeholder="Select courses..."
                                label="Courses"
                            />
                            {errors.course_ids && (
                                <p className="text-sm text-red-500">{errors.course_ids.message}</p>
                            )}
                        </div>

                        {/* Student Selection */}
                        <div className="space-y-2">
                            <StudentDropdown
                                key={`student-${selectedStudent?.id || 'empty'}`}
                                onStudentSelect={handleStudentSelect}
                                placeholder="Select student..."
                                label="Student Name"
                            />
                            {errors.student_id && (
                                <p className="text-sm text-red-500">{errors.student_id.message}</p>
                            )}
                        </div>

                        {/* Student Email (Read-only) */}
                        <div className="space-y-2">
                            <Label htmlFor="student-email" className="text-sm font-medium text-gray-700">
                                Student Email Address
                            </Label>
                            <Input
                                id="student-email"
                                type="email"
                                placeholder="example@email.com"
                                value={studentEmail}
                                readOnly
                                className="w-full bg-gray-50"
                            />
                        </div>

                        {/* Code Type Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="code-type" className="text-sm font-medium text-gray-700">
                                Code Type
                            </Label>
                            <Select value={codeType} onValueChange={handleCodeTypeChange}>
                                <SelectTrigger id="code-type" className="w-full">
                                    <SelectValue placeholder="Select code type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CODE_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <input type="hidden" {...register('scholarship_type', { required: 'Code type is required' })} />
                            {errors.scholarship_type && (
                                <p className="text-sm text-red-500">{errors.scholarship_type.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full cursor-pointer bg-[#0F2598] hover:bg-[#0F2598]/90 text-white py-5 text-base font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Generating Code...' : 'Code Generate'}
                        </Button>
                    </form>

                    {/* Success Card */}
                    {isSuccess && (
                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="space-y-4 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                                        <Check className="w-4 h-4" />
                                        The code has been fully generated.
                                    </div>
                                    <Button
                                        onClick={() => dispatch(clearSuccess())}
                                        variant="outline"
                                        size="sm"
                                        className="text-green-700 border-green-300 hover:bg-green-100"
                                    >
                                        Generate New Code
                                    </Button>
                                </div>

                                {/* Generated Code Display */}
                                <div className="flex items-center justify-between bg-white border border-green-200 p-4 rounded-md">
                                    <span className="font-mono text-lg font-semibold text-gray-900">
                                        {generatedCode}
                                    </span>
                                    <Button
                                        onClick={copyToClipboard}
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2 border-green-300 hover:bg-green-50"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 text-green-600" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
