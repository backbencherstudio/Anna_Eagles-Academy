'use client'

import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock, X, Users, User } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface AddEventModalProps {
    isOpen: boolean
    onClose: () => void
}

// Validation schemas
const individualSchema = {
    student: {
        required: "Please select a student",
    },
    eventName: {
        required: "Event name is required",
        minLength: {
            value: 3,
            message: "Event name must be at least 3 characters"
        },
        maxLength: {
            value: 100,
            message: "Event name must be less than 100 characters"
        }
    },
    date: {
        required: "Please select a date",
        validate: (value: Date | undefined) => {
            if (!value) return "Please select a date"
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            if (value < today) return "Date cannot be in the past"
            return true
        }
    },
    startTime: {
        required: "Please select start time",
    },
    endTime: {
        required: "Please select end time",
    },
    classLink: {
        required: "Class link is required",
        pattern: {
            value: /^https?:\/\/.+/,
            message: "Please enter a valid URL starting with http:// or https://"
        }
    },
    description: {
        maxLength: {
            value: 500,
            message: "Description must be less than 500 characters"
        }
    }
}

const combinedSchema = {
    eventName: {
        required: "Event name is required",
        minLength: {
            value: 3,
            message: "Event name must be at least 3 characters"
        },
        maxLength: {
            value: 100,
            message: "Event name must be less than 100 characters"
        }
    },
    date: {
        required: "Please select a date",
        validate: (value: Date | undefined) => {
            if (!value) return "Please select a date"
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            if (value < today) return "Date cannot be in the past"
            return true
        }
    },
    startTime: {
        required: "Please select start time",
    },
    endTime: {
        required: "Please select end time",
    },
    classLink: {
        required: "Class link is required",
        pattern: {
            value: /^https?:\/\/.+/,
            message: "Please enter a valid URL starting with http:// or https://"
        }
    },
    description: {
        maxLength: {
            value: 500,
            message: "Description must be less than 500 characters"
        }
    }
}

export default function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
    const [eventType, setEventType] = useState<'individual' | 'combined'>('individual')

    // Individual form
    const individualForm = useForm({
        defaultValues: {
            student: '',
            eventName: '',
            date: undefined as Date | undefined,
            startTime: '',
            endTime: '',
            classLink: '',
            description: ''
        }
    })

    // Combined form
    const combinedForm = useForm({
        defaultValues: {
            eventName: '',
            date: undefined as Date | undefined,
            startTime: '',
            endTime: '',
            classLink: '',
            description: ''
        }
    })

    // Smart time options with better organization
    const generateTimeOptions = () => {
        const times = []
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = new Date()
                time.setHours(hour, minute, 0, 0)
                times.push(time.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }))
            }
        }
        return times
    }

    const timeOptions = generateTimeOptions()

    // Smart time validation
    const validateTimeRange = (startTime: string, endTime: string) => {
        if (!startTime || !endTime) return true

        const parseTime = (timeStr: string) => {
            const [time, period] = timeStr.split(' ')
            const [hours, minutes] = time.split(':').map(Number)
            let hour = hours
            if (period === 'PM' && hours !== 12) hour += 12
            if (period === 'AM' && hours === 12) hour = 0
            return hour * 60 + minutes
        }

        const startMinutes = parseTime(startTime)
        const endMinutes = parseTime(endTime)

        return endMinutes > startMinutes
    }

    // Get suggested end time based on start time
    const getSuggestedEndTime = (startTime: string) => {
        if (!startTime) return ''

        const parseTime = (timeStr: string) => {
            const [time, period] = timeStr.split(' ')
            const [hours, minutes] = time.split(':').map(Number)
            let hour = hours
            if (period === 'PM' && hours !== 12) hour += 12
            if (period === 'AM' && hours === 12) hour = 0
            return { hour, minute: minutes }
        }

        const { hour, minute } = parseTime(startTime)
        const endTime = new Date()
        endTime.setHours(hour + 1, minute, 0, 0)

        return endTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    const handleSubmit = () => {
        if (eventType === 'individual') {
            individualForm.handleSubmit((data) => {
                console.log('Individual Event submitted:', data)
                individualForm.reset()
                onClose()
            })()
        } else {
            combinedForm.handleSubmit((data) => {
                console.log('Combined Event submitted:', data)
                combinedForm.reset()
                onClose()
            })()
        }
    }

    // Reset forms when modal closes
    const handleModalClose = () => {
        individualForm.reset()
        combinedForm.reset()
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleModalClose}>
            <DialogContent className="sm:max-w-[700px] p-6" showCloseButton={false}>
                <DialogHeader className="relative flex flex-row items-center justify-center">
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                        Add New Event
                    </DialogTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleModalClose}
                        className="absolute cursor-pointer right-0 h-8 w-8 p-0 hover:bg-gray-100"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                {/* Event Type Selection */}
                <div className="flex gap-2 mb-6 justify-center">
                    <Button
                        variant={eventType === 'individual' ? 'default' : 'outline'}
                        onClick={() => setEventType('individual')}
                        className={`rounded-full cursor-pointer px-6 py-2 flex items-center gap-2 ${eventType === 'individual'
                                ? 'bg-[#F1C27D] text-white hover:bg-[#F1C27D]/80'
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        <User className="h-4 w-4" />
                        Individual
                    </Button>
                    <Button
                        variant={eventType === 'combined' ? 'default' : 'outline'}
                        onClick={() => setEventType('combined')}
                        className={`rounded-full cursor-pointer px-6 py-2 flex items-center gap-2 ${eventType === 'combined'
                                ? 'bg-[#F1C27D] text-white hover:bg-[#F1C27D]/80'
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        <Users className="h-4 w-4" />
                        Combined
                    </Button>
                </div>

                {/* Individual Event Form */}
                {eventType === 'individual' && (
                    <form
                        id="individual-form"
                        onSubmit={individualForm.handleSubmit((data) => {
                            console.log('Individual Event submitted:', data)
                            individualForm.reset()
                            onClose()
                        })}
                        className="space-y-4"
                    >
                        {/* Select Student */}
                        <div className="space-y-2">
                            <Label htmlFor="student" className="text-sm font-medium text-gray-700">
                                Select Student
                            </Label>
                            <Controller
                                name="student"
                                control={individualForm.control}
                                rules={individualSchema.student}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={`w-full ${fieldState.error ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder="Select a student" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="alex-adams">Alex Adams</SelectItem>
                                                <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                                                <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && (
                                            <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {/* Event Name and Select Date Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Event Name */}
                            <div className="space-y-2">
                                <Label htmlFor="eventName" className="text-sm font-medium text-gray-700">
                                    Event Name
                                </Label>
                                <Controller
                                    name="eventName"
                                    control={individualForm.control}
                                    rules={individualSchema.eventName}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Input
                                                {...field}
                                                placeholder="Complete Task 15"
                                                className={`w-full ${fieldState.error ? 'border-red-500' : ''}`}
                                            />
                                            {fieldState.error && (
                                                <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Select Date */}
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                                    Select Date
                                </Label>
                                <Controller
                                    name="date"
                                    control={individualForm.control}
                                    rules={individualSchema.date}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full cursor-pointer justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground",
                                                            fieldState.error ? 'border-red-500' : ''
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {fieldState.error && (
                                                <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Start Time and End Time Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Start Time */}
                            <div className="space-y-2">
                                <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                                    Start Time
                                </Label>
                                <Controller
                                    name="startTime"
                                    control={individualForm.control}
                                    rules={individualSchema.startTime}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select
                                                
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    // Auto-suggest end time if not set
                                                    const endTime = individualForm.getValues('endTime')
                                                    if (!endTime) {
                                                        const suggestedEnd = getSuggestedEndTime(value)
                                                        individualForm.setValue('endTime', suggestedEnd)
                                                    }
                                                }}
                                                value={field.value}
                                            >
                                                <SelectTrigger className={`w-full cursor-pointer ${fieldState.error ? 'border-red-500' : ''}`}>
                                                    <div className="flex items-center">
                                                        <Clock className="mr-2 h-4 w-4 text-gray-400" />
                                                        <SelectValue placeholder="Select start time" />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[200px]">
                                                    <div className="grid grid-cols-2 gap-1 p-2">
                                                        {timeOptions.map((time) => (
                                                            <SelectItem
                                                                key={time}
                                                                value={time}
                                                                className="text-sm"
                                                            >
                                                                {time}
                                                            </SelectItem>
                                                        ))}
                                                    </div>
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && (
                                                <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            {/* End Time */}
                            <div className="space-y-2">
                                <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">
                                    End Time
                                </Label>
                                <Controller
                                    name="endTime"
                                    control={individualForm.control}
                                    rules={individualSchema.endTime}
                                    render={({ field, fieldState }) => {
                                        const startTime = individualForm.watch('startTime')
                                        const isInvalidTimeRange = startTime && field.value && !validateTimeRange(startTime, field.value)

                                        return (
                                            <>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger className={`cursor-pointer w-full ${fieldState.error || isInvalidTimeRange ? 'border-red-500' : ''
                                                        }`}>
                                                        <div className="flex items-center">
                                                            <Clock className="mr-2 h-4 w-4 text-gray-400" />
                                                            <SelectValue placeholder="Select end time" />
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-[200px]">
                                                        <div className="grid grid-cols-2 gap-1 p-2">
                                                            {timeOptions.map((time) => (
                                                                <SelectItem
                                                                    key={time}
                                                                    value={time}
                                                                    className="text-sm"
                                                                >
                                                                    {time}
                                                                </SelectItem>
                                                            ))}
                                                        </div>
                                                    </SelectContent>
                                                </Select>
                                                {(fieldState.error || isInvalidTimeRange) && (
                                                    <p className="text-xs text-red-500 mt-1">
                                                        {fieldState.error?.message || "End time must be after start time"}
                                                    </p>
                                                )}
                                            </>
                                        )
                                    }}
                                />
                            </div>
                        </div>

                        {/* Class Link */}
                        <div className="space-y-2">
                            <Label htmlFor="classLink" className="text-sm font-medium text-gray-700">
                                Class Link
                            </Label>
                            <Controller
                                name="classLink"
                                control={individualForm.control}
                                rules={individualSchema.classLink}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Input
                                            {...field}
                                            placeholder="https://www.zoom.com"
                                            className={`w-full ${fieldState.error ? 'border-red-500' : ''}`}
                                        />
                                        {fieldState.error && (
                                            <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {/* Event Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Event Description
                            </Label>
                            <Controller
                                name="description"
                                control={individualForm.control}
                                rules={individualSchema.description}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Textarea
                                            {...field}
                                            placeholder="Write your description here.."
                                            className={`w-full min-h-[100px] resize-none ${fieldState.error ? 'border-red-500' : ''}`}
                                        />
                                        {fieldState.error && (
                                            <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </form>
                )}

                {/* Combined Event Form */}
                {eventType === 'combined' && (
                    <form
                        id="combined-form"
                        onSubmit={combinedForm.handleSubmit((data) => {
                            console.log('Combined Event submitted:', data)
                            combinedForm.reset()
                            onClose()
                        })}
                        className="space-y-4"
                    >
                        {/* Event Name and Select Date Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Event Name */}
                            <div className="space-y-2">
                                <Label htmlFor="eventName" className="text-sm font-medium text-gray-700">
                                    Event Name
                                </Label>
                                <Controller
                                    name="eventName"
                                    control={combinedForm.control}
                                    rules={combinedSchema.eventName}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Input
                                                {...field}
                                                placeholder="Complete Task 15"
                                                className={`w-full ${fieldState.error ? 'border-red-500' : ''}`}
                                            />
                                            {fieldState.error && (
                                                <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Select Date */}
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                                    Select Date
                                </Label>
                                <Controller
                                    name="date"
                                    control={combinedForm.control}
                                    rules={combinedSchema.date}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full cursor-pointer justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground",
                                                            fieldState.error ? 'border-red-500' : ''
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {fieldState.error && (
                                                <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Start Time and End Time Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Start Time */}
                            <div className="space-y-2">
                                <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                                    Start Time
                                </Label>
                                <Controller
                                    name="startTime"
                                    control={combinedForm.control}
                                    rules={combinedSchema.startTime}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    // Auto-suggest end time if not set
                                                    const endTime = combinedForm.getValues('endTime')
                                                    if (!endTime) {
                                                        const suggestedEnd = getSuggestedEndTime(value)
                                                        combinedForm.setValue('endTime', suggestedEnd)
                                                    }
                                                }}
                                                value={field.value}
                                            >
                                                <SelectTrigger className={`cursor-pointer w-full ${fieldState.error ? 'border-red-500' : ''}`}>
                                                    <div className="flex items-center">
                                                        <Clock className="mr-2 h-4 w-4 text-gray-400" />
                                                        <SelectValue placeholder="Select start time" />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[200px]">
                                                    <div className="grid grid-cols-2 gap-1 p-2">
                                                        {timeOptions.map((time) => (
                                                            <SelectItem
                                                                key={time}
                                                                value={time}
                                                                className="text-sm"
                                                            >
                                                                {time}
                                                            </SelectItem>
                                                        ))}
                                                    </div>
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && (
                                                <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            {/* End Time */}
                            <div className="space-y-2">
                                <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">
                                    End Time
                                </Label>
                                <Controller
                                    name="endTime"
                                    control={combinedForm.control}
                                    rules={combinedSchema.endTime}
                                    render={({ field, fieldState }) => {
                                        const startTime = combinedForm.watch('startTime')
                                        const isInvalidTimeRange = startTime && field.value && !validateTimeRange(startTime, field.value)

                                        return (
                                            <>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger className={`cursor-pointer w-full ${fieldState.error || isInvalidTimeRange ? 'border-red-500' : ''
                                                        }`}>
                                                        <div className="flex items-center">
                                                            <Clock className="mr-2 h-4 w-4 text-gray-400" />
                                                            <SelectValue placeholder="Select end time" />
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-[200px]">
                                                        <div className="grid grid-cols-2 gap-1 p-2">
                                                            {timeOptions.map((time) => (
                                                                <SelectItem
                                                                    key={time}
                                                                    value={time}
                                                                    className="text-sm"
                                                                >
                                                                    {time}
                                                                </SelectItem>
                                                            ))}
                                                        </div>
                                                    </SelectContent>
                                                </Select>
                                                {(fieldState.error || isInvalidTimeRange) && (
                                                    <p className="text-xs text-red-500 mt-1">
                                                        {fieldState.error?.message || "End time must be after start time"}
                                                    </p>
                                                )}
                                            </>
                                        )
                                    }}
                                />
                            </div>
                        </div>

                        {/* Class Link */}
                        <div className="space-y-2">
                            <Label htmlFor="classLink" className="text-sm font-medium text-gray-700">
                                Class Link
                            </Label>
                            <Controller
                                name="classLink"
                                control={combinedForm.control}
                                rules={combinedSchema.classLink}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Input
                                            {...field}
                                            placeholder="https://www.zoom.com"
                                            className={`w-full ${fieldState.error ? 'border-red-500' : ''}`}
                                        />
                                        {fieldState.error && (
                                            <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {/* Event Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Event Description
                            </Label>
                            <Controller
                                name="description"
                                control={combinedForm.control}
                                rules={combinedSchema.description}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Textarea
                                            {...field}
                                            placeholder="Write your description here.."
                                            className={`w-full min-h-[100px] resize-none ${fieldState.error ? 'border-red-500' : ''}`}
                                        />
                                        {fieldState.error && (
                                            <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </form>
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                    <Button
                        type="submit"
                        form={eventType === 'individual' ? 'individual-form' : 'combined-form'}
                        className="w-full bg-[#F1C27D] cursor-pointer text-white hover:bg-[#F1C27D]/80 py-3 text-base font-medium"
                    >
                        Add Event
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
