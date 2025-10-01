import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import UploadVideo from './UploadVideo'
import LessonVideo from './LessonVideo'
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import {
    addModule,
    removeModule,
    updateModuleField,
    updateModulePrice,
    updateModuleIntroVideo,
    updateModuleEndVideo,
    updateModuleLessons,
    setShowModuleForm
} from '@/rtk/slices/admin/courseManagementSlice'
import type { Course, Lesson } from '@/rtk/slices/admin/courseManagementSlice'

export default function AddModules() {
    const dispatch = useAppDispatch()
    const {
        courseForm,
        showModuleForm,
        modulePrices,
        moduleIntroVideos,
        moduleEndVideos,
        moduleLessons
    } = useAppSelector(state => state.courseManagement)

    const [isAddingModule, setIsAddingModule] = useState(false)

    const createNewModule = (showForm = false) => {
        const newModule: Course = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: '',
            lessons_files: [],
            price: 0,
            introVideo: null,
            endVideo: null,
            videoFiles: [],
            docFiles: []
        }

        dispatch(addModule(newModule))
        if (showForm) dispatch(setShowModuleForm(true))
        return newModule
    }

    const addModuleHandler = () => {
        createNewModule(true)
    }

    const removeModuleHandler = (moduleId: string, index: number) => {
        dispatch(removeModule({ moduleId, index }))
    }

    const addMoreModuleHandler = () => {
        setIsAddingModule(true)
        createNewModule(false)
        setIsAddingModule(false)
    }

    const handleModulePriceChange = (moduleId: string, price: number) => {
        dispatch(updateModulePrice({ moduleId, price }))
    }

    return (
        <>
            {/* Initial Add Module Section */}
            {!showModuleForm && courseForm.courses.length === 0 && (
                <Card className='border pb-5'>
                    <CardHeader className="bg-[#FEF9F2] rounded-t-xl pt-2 py-5">
                        <CardTitle className="text-sm font-semibold text-[#F1C27D] uppercase">Upload Course Module</CardTitle>
                    </CardHeader>
                    <CardContent className="py-3">
                        <div className="border-2 border-dashed border-gray-300 group hover:border-[#0F2598] transition-all duration-300 rounded-lg py-1">
                            <Button
                                type="button"
                                onClick={addModuleHandler}
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
            {courseForm.courses.map((module, index) => (
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
                                onClick={() => removeModuleHandler(module.id, index)}
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
                                value={module.title}
                                onChange={(e) => dispatch(updateModuleField({ moduleId: module.id, field: 'title', value: e.target.value }))}
                                className="w-full"
                            />
                        </div>

                        {/* Video Uploads */}
                        <div className="grid grid-cols-1 lg:grid-cols-2  gap-5 2xl:gap-10 ">
                            {/* Upload Intro Video */}
                            <UploadVideo
                                label="Upload Intro Video"
                                uniqueId={`module-${module.id}-intro`}
                                enabled={moduleIntroVideos[module.id]?.enabled ?? false}
                                onToggle={(enabled) => {
                                    dispatch(updateModuleIntroVideo({ moduleId: module.id, enabled }))
                                }}
                                onFileSelect={(file) => {
                                    dispatch(updateModuleIntroVideo({ moduleId: module.id, file }))
                                }}
                                selectedFile={moduleIntroVideos[module.id]?.file || null}
                                onRemove={() => {
                                    dispatch(updateModuleIntroVideo({ moduleId: module.id, file: null }))
                                }}
                            />

                            {/* Upload End Video */}
                            <UploadVideo
                                label="Upload End Video"
                                uniqueId={`module-${module.id}-end`}
                                enabled={moduleEndVideos[module.id]?.enabled ?? true}
                                onToggle={(enabled) => {
                                    dispatch(updateModuleEndVideo({ moduleId: module.id, enabled }))
                                }}
                                onFileSelect={(file) => {
                                    dispatch(updateModuleEndVideo({ moduleId: module.id, file }))
                                }}
                                selectedFile={moduleEndVideos[module.id]?.file || null}
                                onRemove={() => {
                                    dispatch(updateModuleEndVideo({ moduleId: module.id, file: null }))
                                }}
                            />
                        </div>

                        {/* Course Price */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Course Price <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={modulePrices[module.id] || ''}
                                    onChange={(e) => handleModulePriceChange(module.id, parseFloat(e.target.value) || 0)}
                                    className="w-full pl-8 border-gray-300 focus:border-[#0F2598] focus:ring-[#0F2598]"
                                />
                            </div>
                        </div>

                        {/* Lesson Videos */}
                        <LessonVideo
                            lessons={moduleLessons[module.id] || []}
                            onLessonsChange={(lessons) => {
                                dispatch(updateModuleLessons({ moduleId: module.id, lessons }))
                            }}
                        />
                    </CardContent>
                </Card>
            ))}

            {/* Add More Module Button */}
            {courseForm.courses.length > 0 && (
                <div className="flex justify-center">
                    <Button
                        type="button"
                        onClick={addMoreModuleHandler}
                        disabled={isAddingModule}
                        variant="outline"
                        className="flex cursor-pointer items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAddingModule ? (
                            <>
                                <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                Adding Module...
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                Add More Module
                                <span className="ml-1 px-2 py-1 bg-[#F1C27D] text-white text-xs rounded-full font-semibold">
                                    {courseForm.courses.length}
                                </span>
                            </>
                        )}
                    </Button>
                </div>
            )}
        </>
    )
}
