'use client'

import React from 'react'
import { Control, Controller, FieldErrors, UseFormGetValues, UseFormSetValue, UseFormTrigger } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2 } from 'lucide-react'

interface QuizFormData {
    selectedSeries: string
    selectedCourses: string
    question: string
    options: string[]
    correctAnswer: string
    points: number
    quizTitle?: string
    quizInstructions?: string
}

interface CorrectAnswerProps {
    control: Control<QuizFormData>
    errors: FieldErrors<QuizFormData>
    isSubmitted: boolean
    watchedOptions: string[]
    watchedQuestion: string
    getValues: UseFormGetValues<QuizFormData>
    setValue: UseFormSetValue<QuizFormData>
    trigger: UseFormTrigger<QuizFormData>
    onAddQuiz: () => void
}

// Option management functions
export const addOption = (getValues: UseFormGetValues<QuizFormData>, setValue: UseFormSetValue<QuizFormData>) => {
    const currentOptions = getValues('options')
    setValue('options', [...currentOptions, ''])
}

export const updateOption = (
    index: number, 
    value: string, 
    getValues: UseFormGetValues<QuizFormData>, 
    setValue: UseFormSetValue<QuizFormData>,
    trigger: UseFormTrigger<QuizFormData>,
    watchedQuestion: string
) => {
    const currentOptions = getValues('options')
    const updatedOptions = currentOptions.map((option, i) => i === index ? value : option)
    setValue('options', updatedOptions)
    
    // Trigger validation for options
    if (watchedQuestion.trim()) {
        trigger('options')
    }
}

export const removeOption = (
    index: number, 
    getValues: UseFormGetValues<QuizFormData>, 
    setValue: UseFormSetValue<QuizFormData>
) => {
    const currentOptions = getValues('options')
    if (currentOptions.length > 2) {
        const updatedOptions = currentOptions.filter((_, i) => i !== index)
        setValue('options', updatedOptions)
       
        const currentCorrectAnswer = getValues('correctAnswer')
        if (currentCorrectAnswer === String.fromCharCode(65 + index)) {
            setValue('correctAnswer', '')
        }
    }
}

export default function CorrectAnswer({
    control,
    errors,
    isSubmitted,
    watchedOptions,
    watchedQuestion,
    getValues,
    setValue,
    trigger,
    onAddQuiz
}: CorrectAnswerProps) {
    const getOptionLabel = (index: number) => {
        return String.fromCharCode(65 + index)
    }

    return (
        <div className="space-y-4 sm:space-y-6 mt-5">
            {/* Answer Options Section */}
            <div className='bg-white rounded-xl border'>
                <h3 className="text-sm font-semibold text-center text-gray-400 mb-4 px-4 py-4 rounded-t-xl bg-[#FEF9F2]">ANSWER</h3>
                <div className='p-4'>
                    <div className="space-y-3">
                        {watchedOptions.map((option, index) => (
                            <div key={index} className="relative">
                                <div className="relative">
                                    <Input
                                        placeholder="Enter your option"
                                        value={option}
                                        onChange={(e) => updateOption(index, e.target.value, getValues, setValue, trigger, watchedQuestion)}
                                                    className={`pl-12 pr-10 py-6 border-gray-200 ${!option.trim() && isSubmitted && watchedQuestion.trim() ? 'border-red-500' : ''}`}
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-md w-6 h-6 flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-700">
                                            {getOptionLabel(index)}
                                        </span>
                                    </div>
                                    {watchedOptions.length > 2 && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 h-6 w-6 p-0"
                                                        onClick={() => removeOption(index, getValues, setValue)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                                {!option.trim() && isSubmitted && watchedQuestion.trim() && (
                                    <span className="text-xs text-red-500 mt-1 block">Option {getOptionLabel(index)} is required</span>
                                )}
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            onClick={() => addOption(getValues, setValue)}
                            className="mt-2 w-full px-10 sm:w-auto cursor-pointer"
                        >
                            + Add Option
                        </Button>
                        {watchedOptions.length < 2 && isSubmitted && watchedQuestion.trim() && (
                            <span className="text-xs text-red-500 block">At least 2 options are required</span>
                        )}
                        {errors.options && isSubmitted && watchedQuestion.trim() && (
                            <span className="text-xs text-red-500 block">{errors.options.message}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Correct Answer Section */}
            <div className='bg-white rounded-xl border'>
                <h3 className="text-sm font-semibold text-center text-gray-400 mb-4 px-4 py-4 rounded-t-xl bg-[#FEF9F2]">CORRECT ANSWER</h3>
                <div className="flex flex-col gap-3 lg:flex-row items-center justify-between bg-[#F9F9F9] p-3 mx-5">
                    <div>
                        <span className="text-sm font-medium text-gray-700">Select correct answer</span>
                    </div>
                    <div className='flex items-center flex-col sm:flex-row gap-3'>
                        <Controller
                            name="correctAnswer"
                            control={control}
                            rules={{
                                required: "Please select a correct answer",
                                validate: (value) => {
                                    if (!value) return "Please select a correct answer"
                                    const optionIndex = value.charCodeAt(0) - 65
                                    const selectedOption = watchedOptions[optionIndex]
                                    if (!selectedOption || !selectedOption.trim()) {
                                        return "Selected option is empty"
                                    }
                                    return true
                                }
                            }}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className={`w-full sm:w-48 ${errors.correctAnswer && isSubmitted && watchedQuestion.trim() ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Correct answer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {watchedOptions.map((option, index) => (
                                            <SelectItem key={index} value={getOptionLabel(index)}>
                                                {getOptionLabel(index)}: {option || `Option ${getOptionLabel(index)}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="points" className="text-sm">Point</Label>
                            <Controller
                                name="points"
                                control={control}
                                rules={{
                                    required: "Points are required",
                                    min: { value: 1, message: "Points must be at least 1" },
                                    max: { value: 100, message: "Points cannot exceed 100" }
                                }}
                                render={({ field }) => (
                                    <Input
                                        id="points"
                                        type="number"
                                        value={field.value}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                        className="w-20"
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
                {errors.correctAnswer && isSubmitted && watchedQuestion.trim() && (
                    <div className="px-5">
                        <span className="text-xs text-red-500">{errors.correctAnswer.message}</span>
                    </div>
                )}
                {errors.points && isSubmitted && watchedQuestion.trim() && (
                    <div className="px-5">
                        <span className="text-xs text-red-500">{errors.points.message}</span>
                    </div>
                )}

                {/* Add Quiz Button */}
                <div className="flex justify-end p-4">
                    <Button
                        onClick={onAddQuiz}
                        className="bg-[#0F2598] cursor-pointer hover:bg-[#0F2598]/90 text-white w-full sm:w-auto"
                        disabled={false}
                        type="button"
                    >
                        + Add Quiz
                    </Button>
                </div>
            </div>
        </div>
    )
}