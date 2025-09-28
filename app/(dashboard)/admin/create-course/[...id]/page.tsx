"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import CreateSeries from '@/app/_components/Admin/CreaterNewCourse/CreateSeries'
import CourseModuesAdded from '@/app/_components/Admin/CreaterNewCourse/CourseModuesAdded'
import AddLeesionCourse from '@/app/_components/Admin/CreaterNewCourse/AddLeesionCourse'
import SetAvailability from '@/app/_components/Admin/CourseManagement/CreateCourse/SetAvailability'
import { useGetAllModulesQuery, useGetSingleSeriesQuery } from '@/redux/api/managementCourseApis'

type SeriesData = {
    title: string
    enrollCount: number
    courseType: string
    thumbnailFile: File | null
    description: string
    note?: string
}

interface PageProps {
    params: Promise<{
        id: string[]
    }>
}

export default function CreateNewCourse({ params }: PageProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // ==================== ROUTE PARAMS ====================
    const resolvedParams = React.use(params)
    const seriesId = resolvedParams.id?.[0] === 'new' ? null : resolvedParams.id?.[0]

    // ==================== STATE MANAGEMENT ====================
    const stepFromUrl = useMemo(() => {
        const step = Number(searchParams.get('step') || '1')
        return (step === 2 || step === 3) ? step : 1
    }, [searchParams]) as 1 | 2 | 3

    const [step, setStep] = useState<1 | 2 | 3>(stepFromUrl)
    const [seriesData, setSeriesData] = useState<SeriesData | null>(null)
    const [modulesCompleted, setModulesCompleted] = useState<boolean>(false)
    const [lessonsAdded, setLessonsAdded] = useState<boolean>(false)
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

    // ==================== API HOOKS ====================
    const { data: serverModulesResp } = useGetAllModulesQuery(seriesId as string, { skip: !seriesId })
    const { data: serverSeriesResp } = useGetSingleSeriesQuery(seriesId as string, { skip: !seriesId })

    // ==================== EFFECTS ====================
    useEffect(() => {
        const modules = (serverModulesResp as any)?.data?.courses || (serverModulesResp as any)?.data || []
        if (Array.isArray(modules) && modules.length > 0) {
            setModulesCompleted(true)
        }
    }, [serverModulesResp])

    useEffect(() => {
        const lessonCount = (serverSeriesResp as any)?.data?._count?.lesson_files
        if (typeof lessonCount === 'number' && lessonCount > 0) {
            setLessonsAdded(true)
        }
    }, [serverSeriesResp])

    // ==================== STEP CONFIGURATION ====================
    const steps = useMemo(() => [
        { id: 1 as const, label: 'Series', subtitle: 'Basic details' },
        { id: 2 as const, label: 'Modules', subtitle: 'Videos & pricing' },
        { id: 3 as const, label: 'Lessons', subtitle: 'Add lesson content' },
    ], [])

    // ==================== STEP LOGIC ====================
    const isCompleted = (id: 1 | 2 | 3) => {
        if (id === 1) return !!seriesData || !!(serverSeriesResp as any)?.data?.id
        if (id === 2) return modulesCompleted
        return lessonsAdded
    }

    const canNavigateTo = (id: 1 | 2 | 3) => {
        if (id === 1) return true
        if (id === 2) return !!seriesData || !!(serverSeriesResp as any)?.data?.id || modulesCompleted
        if (id === 3) return modulesCompleted && (lessonsAdded || step === 3)
        return false
    }

    const gotoStep = (next: 1 | 2 | 3) => {
        if (canNavigateTo(next)) setStep(next)
    }

    const handleLessonsAdded = () => setLessonsAdded(true)

    // ==================== URL SYNC ====================
    useEffect(() => {
        if (step !== stepFromUrl) setStep(stepFromUrl)
    }, [stepFromUrl])

    useEffect(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        const currentStep = Number(current.get('step') || '1')
        if (currentStep !== step) {
            current.set('step', String(step))
            router.replace(`${pathname}?${current.toString()}`)
        }
    }, [step, pathname, router, searchParams])

    return (
        <div className='space-y-6'>
            {/* Progress Steps */}
            <nav className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4' aria-label='Progress'>
                {steps.map(({ id, label, subtitle }) => {
                    const completed = isCompleted(id)
                    const allowed = canNavigateTo(id)
                    const isLast = id === steps[steps.length - 1].id
                    
                    return (
                        <div key={id} className='flex-1 flex flex-col sm:flex-row sm:items-center'>
                            <button
                                type='button'
                                aria-current={step === id ? 'step' : undefined}
                                onClick={() => gotoStep(id)}
                                className={`flex items-start sm:items-center gap-2 group ${allowed ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                disabled={!allowed}
                            >
                                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                                    completed ? 'bg-[#0F2598] text-white' : 
                                    step >= id ? 'bg-[#0F2598]/10 text-[#0F2598]' : 
                                    'bg-gray-200 text-gray-600'
                                }`}>
                                    {completed ? <Check className='w-4 h-4' /> : id}
                                </div>
                                <div className='flex flex-col text-left'>
                                    <span className={`text-sm ${step === id ? 'text-[#0F2598] font-medium' : 'text-gray-700'}`}>
                                        {label}
                                    </span>
                                    <span className='text-xs text-gray-500'>{subtitle}</span>
                                </div>
                            </button>
                            {!isLast && (
                                <>
                                    <div className={`hidden sm:block flex-1 h-[2px] mx-3 ${step > id ? 'bg-[#0F2598]' : 'bg-gray-200'}`} />
                                    <div className={`sm:hidden ml-[14px] h-4 w-[2px] ${step > id ? 'bg-[#0F2598]' : 'bg-gray-200'}`} />
                                </>
                            )}
                        </div>
                    )
                })}
            </nav>

            {/* Main Content */}
            <div className='flex flex-col lg:flex-row gap-6'>
                <div className='w-full lg:w-8/12'>
                    {step === 1 && (
                        <CreateSeries
                            seriesId={seriesId}
                            onNext={(data) => {
                                setSeriesData(data)
                                setStep(2)
                            }}
                        />
                    )}

                    {step === 2 && (
                        <CourseModuesAdded 
                            seriesId={seriesId}
                            onNext={() => { 
                                setModulesCompleted(true)
                                setStep(3) 
                            }} 
                        />
                    )}

                    {step === 3 && (
                        <AddLeesionCourse 
                            seriesId={seriesId}
                            onLessonsAdded={handleLessonsAdded} 
                        />
                    )}
                </div>

                <div className="w-full lg:w-4/12">
                    <SetAvailability
                        seriesId={seriesId}
                        courseTitle={seriesData?.title || ''}
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                        showErrors={false}
                        disabled={!lessonsAdded}
                        onSuccess={() => router.push('/admin/course-management')}
                    />
                </div>
            </div>
        </div>
    )
}