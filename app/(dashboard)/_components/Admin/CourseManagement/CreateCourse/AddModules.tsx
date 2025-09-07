import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Plus, Paperclip, Trash2, FileText } from 'lucide-react'
import { UseFieldArrayReturn, FieldErrors, UseFormRegister, Control, useFieldArray } from 'react-hook-form'
import UploadVideo from './UploadVideo'
import LessonVideo from './LessonVideo'

interface Module {
    id: string
    title: string
    files: File[]
}

interface Lesson {
    id: string
    title: string
    videoFile: File | null
    documentFiles: File[]
}

interface CourseFormData {
    title: string
    codeType: string
    studentEnroll: string
    courseType: string
    description: string
    notes: string
    price: string
    thumbnail: File | null
    modules: Module[]
    dateRange: any
}

interface AddModulesProps {
    control: Control<CourseFormData>
    register: UseFormRegister<CourseFormData>
    errors: FieldErrors<CourseFormData>
}

export default function AddModules({
    control,
    register,
    errors
}: AddModulesProps) {
    const [moduleFiles, setModuleFiles] = useState<{ [key: string]: File[] }>({})
    const [showModuleForm, setShowModuleForm] = useState(false)
    const [introVideoEnabled, setIntroVideoEnabled] = useState(false)
    const [endVideoEnabled, setEndVideoEnabled] = useState(true)
    const [introVideoFile, setIntroVideoFile] = useState<File | null>(null)
    const [endVideoFile, setEndVideoFile] = useState<File | null>(null)
    const [lessons, setLessons] = useState<Lesson[]>([])

    const { fields, append, remove } = useFieldArray({
        control,
        name: "modules"
    })

    const handleFileUpload = (moduleId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        setModuleFiles(prev => ({
            ...prev,
            [moduleId]: [...(prev[moduleId] || []), ...files]
        }))
    }

    const removeFile = (moduleId: string, fileIndex: number) => {
        setModuleFiles(prev => ({
            ...prev,
            [moduleId]: prev[moduleId]?.filter((_, index) => index !== fileIndex) || []
        }))
    }

    const addModule = () => {
        const newModule = {
            id: Date.now().toString(),
            title: '',
            files: []
        }
        append(newModule)
        setShowModuleForm(true)
    }

    const removeModule = (moduleId: string, index: number) => {
        remove(index)
        // Remove files for this module
        const newModuleFiles = { ...moduleFiles }
        delete newModuleFiles[moduleId]
        setModuleFiles(newModuleFiles)

        // If no modules left, hide the form
        if (fields.length === 1) {
            setShowModuleForm(false)
        }
    }

    const addMoreModule = () => {
        const newModule = {
            id: Date.now().toString(),
            title: '',
            files: []
        }
        append(newModule)
    }

    return (
        <>
            {/* Initial Add Module Section */}
            {!showModuleForm && fields.length === 0 && (
                <Card className='border pb-5'>
                    <CardHeader className="bg-[#FEF9F2] rounded-t-xl pt-2 py-5">
                        <CardTitle className="text-sm font-semibold text-[#F1C27D] uppercase">Upload Course Module</CardTitle>
                    </CardHeader>
                    <CardContent className="py-3">
                        <div className="border-2 border-dashed border-gray-300 group hover:border-[#0F2598] transition-all duration-300 rounded-lg py-1">
                            <Button
                                type="button"
                                onClick={addModule}
                                variant="ghost"
                                className="w-full  cursor-pointer flex items-center justify-center gap-2 text-[#1D1F2C] group-hover:text-[#0F2598] transition-all duration-300"
                            >
                                <Plus className="h-5 w-5" />
                                Add Module
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Module Forms */}
            {fields.map((module, index) => (
                <Card key={module.id} className='border pb-5'>
                    <CardHeader className="bg-[#FEF9F2] rounded-t-xl pt-2 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#F1C27D] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                    {index + 1}
                                </div>
                                <CardTitle className="text-sm font-semibold text-[#F1C27D] uppercase">Upload Course Module</CardTitle>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeModule(module.id, index)}
                                className="text-red-600 cursor-pointer hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {/* Title Course */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Title Course <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="Title Course"
                                {...register(`modules.${index}.title` as const, {
                                    required: `Module ${index + 1} title is required`
                                })}
                                className={`w-full ${errors.modules?.[index]?.title ? 'border-red-500' : ''}`}
                            />
                            {errors.modules?.[index]?.title && (
                                <p className="text-sm text-red-500">{errors.modules[index]?.title?.message}</p>
                            )}
                        </div>

                        {/* Video Uploads */}
                        <div className="grid grid-cols-1 lg:grid-cols-2  gap-5 2xl:gap-10 ">
                            {/* Upload Intro Video */}
                            <UploadVideo
                                label="Upload Intro Video"
                                enabled={introVideoEnabled}
                                onToggle={setIntroVideoEnabled}
                                onFileSelect={setIntroVideoFile}
                                selectedFile={introVideoFile}
                                onRemove={() => setIntroVideoFile(null)}
                            />

                            {/* Upload End Video */}
                            <UploadVideo
                                label="Upload End Video"
                                enabled={endVideoEnabled}
                                onToggle={setEndVideoEnabled}
                                onFileSelect={setEndVideoFile}
                                selectedFile={endVideoFile}
                                onRemove={() => setEndVideoFile(null)}
                            />
                        </div>

                        {/* Course Price */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Course</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <Input
                                    placeholder="00.00"
                                    className="w-full pl-8"
                                />
                            </div>
                        </div>

                        {/* Lesson Videos */}
                        <LessonVideo
                            lessons={lessons}
                            onLessonsChange={setLessons}
                        />

                  
                    </CardContent>
                </Card>
            ))}

            {/* Add More Module Button */}
            {fields.length > 0 && (
                <div className="flex justify-center">
                    <Button
                        type="button"
                        onClick={addMoreModule}
                        variant="outline"
                        className="flex cursor-pointer items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 transition-all duration-200"
                    >
                        <Plus className="h-4 w-4" />
                        Add More Module
                        <span className="ml-1 px-2 py-1 bg-[#F1C27D] text-white text-xs rounded-full font-semibold">
                            {fields.length}
                        </span>
                    </Button>
                </div>
            )}
        </>
    )
}
