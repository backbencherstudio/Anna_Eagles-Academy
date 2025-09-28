import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

interface QuizCreateDateProps {
    onPublish?: (values: DeadlineFormData) => void
    publishButtonText?: string
    publishButtonDisabled?: boolean
    showValidation?: boolean
    className?: string
    initialDates?: DeadlineFormData | null
}

export interface DeadlineFormData {
    startDateDeadline: Date
    startTimeDeadline: string
    submissionDeadline: Date
    submissionTimeDeadline: string
}

// Helpers: keep logic small and reusable
function normalizeDate(date: Date): Date {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

function isBeforeToday(date: Date): boolean {
    const today = normalizeDate(new Date())
    const target = normalizeDate(date)
    return target < today
}

function isBefore(first: Date, second: Date): boolean {
    return normalizeDate(first) < normalizeDate(second)
}

function areSameDate(first: Date, second: Date): boolean {
    return normalizeDate(first).getTime() === normalizeDate(second).getTime()
}

function timeToMinutes(hhmm: string): number {
    const [hourStr, minuteStr] = hhmm.split(':')
    const hour = Number(hourStr)
    const minute = Number(minuteStr)
    return hour * 60 + minute
}

export default function QuizCreateDate({
    onPublish,
    publishButtonText = "+ Publish",
    publishButtonDisabled = false,
    showValidation = true,
    className = "",
    initialDates = null
}: QuizCreateDateProps) {
    const {
        control,
        formState: { errors, isSubmitted },
        getValues,
        watch,
        trigger,
        reset
    } = useForm<DeadlineFormData>({
        defaultValues: initialDates || {
            startDateDeadline: new Date(),
            startTimeDeadline: '09:00',
            submissionDeadline: new Date(),
            submissionTimeDeadline: '09:00'
        },
        mode: 'onSubmit'
    })

    // Reset form when initialDates change
    useEffect(() => {
        if (initialDates) {
            reset(initialDates)
        }
    }, [initialDates, reset])

    // Watch for changes in start time to trigger submission time validation
    const startTime = watch('startTimeDeadline')
    const startDate = watch('startDateDeadline')
    const submissionDate = watch('submissionDeadline')

    // Trigger validation when start time or dates change
    React.useEffect(() => {
        if (startTime && submissionDate) {
            trigger('submissionTimeDeadline')
        }
    }, [startTime, startDate, submissionDate, trigger])

    const handlePublish = () => {
        if (onPublish) {
            onPublish(getValues())
        }
    }

    return (
        <div className={`mb-5 ${className}`}>
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {/* Start Date Deadline */}
                    <div className="flex flex-col space-y-2">
                        <span className="text-sm font-medium text-gray-700">Start date & time <span className='text-red-500'>*</span></span>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Controller
                                name="startDateDeadline"
                                control={control}
                                rules={{
                                    required: "Start date & time is required",
                                    validate: (value) => {
                                        if (!value) return "Start date & time is required"
                                        if (isBeforeToday(value)) {
                                            return "Start date & time cannot be in the past"
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
                                                    return isBeforeToday(date)
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
                        <span className="text-sm font-medium text-gray-700">Submission date & time <span className='text-red-500'>*</span></span>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Controller
                                name="submissionDeadline"
                                control={control}
                                rules={{
                                    required: "Submission date & time is required",
                                    validate: (value) => {
                                        if (!value) return "Submission date & time is required"
                                        if (isBeforeToday(value)) {
                                            return "Submission date & time cannot be in the past"
                                        }

                                        // Check if submission date is after start date
                                        const startDate = getValues('startDateDeadline')
                                        if (startDate) {
                                            if (isBefore(value, startDate)) {
                                                return "Submission date must be after start date"
                                            }
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
                                                    if (isBeforeToday(date)) return true
                                                    const startDate = getValues('startDateDeadline')
                                                    if (startDate) {
                                                        return isBefore(date, startDate)
                                                    }
                                                    return false
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
                                    required: "Submission time is required",
                                    validate: (value) => {
                                        if (!value) return "Submission time is required"
                                        
                                        // Check if submission time is after start time when dates are the same
                                        const startDate = getValues('startDateDeadline')
                                        const submissionDate = getValues('submissionDeadline')
                                        const startTime = getValues('startTimeDeadline')
                                        
                                        if (startDate && submissionDate && startTime) {
                                            if (areSameDate(startDate, submissionDate)) {
                                                const startTimeMinutes = timeToMinutes(startTime)
                                                const submissionTimeMinutes = timeToMinutes(value)
                                                if (submissionTimeMinutes <= startTimeMinutes) {
                                                    return "Submission time must be after start time when dates are the same"
                                                }
                                            }
                                        }
                                        
                                        return true
                                    }
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="time"
                                        value={field.value || '09:00'}
                                        onChange={field.onChange}
                                        className={`w-full sm:w-32 lg:w-36 bg-gray-50 border-gray-200 cursor-pointer ${errors.submissionTimeDeadline && isSubmitted && showValidation ? 'border-red-500' : ''}`}
                                        onFocus={(e) => {
                                            e.target.showPicker?.()
                                        }}
                                    />
                                )}
                            />
                        </div>
                        {errors.submissionDeadline && isSubmitted && showValidation && (
                            <span className="text-xs text-red-500">{errors.submissionDeadline.message}</span>
                        )}
                        {errors.submissionTimeDeadline && isSubmitted && showValidation && (
                            <span className="text-xs text-red-500">{errors.submissionTimeDeadline.message}</span>
                        )}
                    </div>
                </div>

                {/* Publish Button */}
                <Button
                    className="bg-[#0F2598] mt-7 hover:bg-[#0F2598]/90 text-white w-full sm:w-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlePublish}
                    disabled={publishButtonDisabled}
                >
                    {publishButtonText}
                </Button>
            </div>
        </div>
    )
}
