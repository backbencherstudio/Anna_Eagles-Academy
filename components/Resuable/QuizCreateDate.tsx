import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

interface QuizCreateDateProps {
    onPublish?: () => void
    publishButtonText?: string
    publishButtonDisabled?: boolean
    showValidation?: boolean
    className?: string
}

interface DeadlineFormData {
    startDateDeadline: Date
    startTimeDeadline: string
    submissionDeadline: Date
    submissionTimeDeadline: string
}

export default function QuizCreateDate({
    onPublish,
    publishButtonText = "+ Publish",
    publishButtonDisabled = false,
    showValidation = true,
    className = ""
}: QuizCreateDateProps) {
    const {
        control,
        formState: { errors, isSubmitted },
        getValues,
        setValue,
        watch
    } = useForm<DeadlineFormData>({
        defaultValues: {
            startDateDeadline: new Date(),
            startTimeDeadline: '09:00',
            submissionDeadline: new Date(),
            submissionTimeDeadline: '09:00'
        },
        mode: 'onSubmit'
    })

    const handlePublish = () => {
        if (onPublish) {
            onPublish()
        }
    }

    return (
        <div className={`mb-5 ${className}`}>
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {/* Start Date Deadline */}
                    <div className="flex flex-col space-y-2">
                        <span className="text-sm font-medium text-gray-700">Start date Deadline <span className='text-red-500'>*</span></span>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Controller
                                name="startDateDeadline"
                                control={control}
                                rules={{
                                    required: "Start date deadline is required",
                                    validate: (value) => {
                                        if (!value) return "Start date deadline is required"
                                        const today = new Date()
                                        today.setHours(0, 0, 0, 0)
                                        const selectedDate = new Date(value)
                                        selectedDate.setHours(0, 0, 0, 0)

                                        if (selectedDate < today) {
                                            return "Start date deadline cannot be in the past"
                                        }
                                        return true
                                    }
                                }}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <div className="relative flex-1">
                                                <Input
                                                    value={field.value ? format(field.value, "MMM do, yyyy") : ""}
                                                    placeholder="Select date"
                                                    readOnly
                                                    className={`pr-10 cursor-pointer bg-gray-50 border-gray-200 w-full ${errors.startDateDeadline && isSubmitted && showValidation ? 'border-red-500' : ''}`}
                                                />
                                                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date: Date | undefined) => field.onChange(date || new Date())}
                                                disabled={(date) => {
                                                    const today = new Date()
                                                    today.setHours(0, 0, 0, 0)
                                                    const selectedDate = new Date(date)
                                                    selectedDate.setHours(0, 0, 0, 0)
                                                    return selectedDate < today
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            <Controller
                                name="startTimeDeadline"
                                control={control}
                                rules={{
                                    required: "Start time is required"
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="time"
                                        value={field.value || '09:00'}
                                        onChange={field.onChange}
                                        className="w-full sm:w-32 lg:w-36 bg-gray-50 border-gray-200 cursor-pointer"
                                        onFocus={(e) => {
                                            // Trigger the time picker when focused
                                            e.target.showPicker?.()
                                        }}
                                    />
                                )}
                            />
                        </div>
                        {errors.startDateDeadline && isSubmitted && showValidation && (
                            <span className="text-xs text-red-500">{errors.startDateDeadline.message}</span>
                        )}
                    </div>

                    {/* Submission Deadline */}
                    <div className="flex flex-col space-y-2">
                        <span className="text-sm font-medium text-gray-700">Submission Deadline <span className='text-red-500'>*</span></span>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Controller
                                name="submissionDeadline"
                                control={control}
                                rules={{
                                    required: "Submission deadline is required",
                                    validate: (value) => {
                                        if (!value) return "Submission deadline is required"
                                        const today = new Date()
                                        today.setHours(0, 0, 0, 0)
                                        const selectedDate = new Date(value)
                                        selectedDate.setHours(0, 0, 0, 0)

                                        if (selectedDate < today) {
                                            return "Submission deadline cannot be in the past"
                                        }
                                        return true
                                    }
                                }}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <div className="relative flex-1">
                                                <Input
                                                    value={field.value ? format(field.value, "MMM do, yyyy") : ""}
                                                    placeholder="Select date"
                                                    readOnly
                                                    className={`pr-10 cursor-pointer bg-gray-50 border-gray-200 w-full ${errors.submissionDeadline && isSubmitted && showValidation ? 'border-red-500' : ''}`}
                                                />
                                                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date: Date | undefined) => field.onChange(date || new Date())}
                                                disabled={(date) => {
                                                    const today = new Date()
                                                    today.setHours(0, 0, 0, 0)
                                                    const selectedDate = new Date(date)
                                                    selectedDate.setHours(0, 0, 0, 0)
                                                    return selectedDate < today
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            <Controller
                                name="submissionTimeDeadline"
                                control={control}
                                rules={{
                                    required: "Submission time is required"
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="time"
                                        value={field.value || '09:00'}
                                        onChange={field.onChange}
                                        className="w-full sm:w-32 lg:w-36 bg-gray-50 border-gray-200 cursor-pointer"
                                        onFocus={(e) => {
                                            // Trigger the time picker when focused
                                            e.target.showPicker?.()
                                        }}
                                    />
                                )}
                            />
                        </div>
                        {errors.submissionDeadline && isSubmitted && showValidation && (
                            <span className="text-xs text-red-500">{errors.submissionDeadline.message}</span>
                        )}
                    </div>
                </div>

                {/* Publish Button */}
                <Button
                    className="bg-[#0F2598] mt-7 hover:bg-[#0F2598]/90 text-white w-full sm:w-auto cursor-pointer"
                    onClick={handlePublish}
                    disabled={publishButtonDisabled}
                >
                    {publishButtonText}
                </Button>
            </div>
        </div>
    )
}
