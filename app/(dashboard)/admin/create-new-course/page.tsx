"use client"
import React, { useEffect, useMemo, useState } from 'react'
import CreateSeries from '../../../_components/Admin/CreaterNewCourse/CreateSeries'
import CourseModuesAdded from '../../../_components/Admin/CreaterNewCourse/CourseModuesAdded'
import AddLeesionCourse from '../../../_components/Admin/CreaterNewCourse/AddLeesionCourse'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'
import { getCookie } from '@/lib/tokenUtils'
import { useGetAllModulesQuery, useGetSingleSeriesQuery } from '@/redux/api/managementCourseApis'
import SetAvailability from '@/app/_components/Admin/CourseManagement/CreateCourse/SetAvailability'
import { DateRange } from 'react-day-picker'

type SeriesData = {
    title: string
    enrollCount: number
    courseType: string
    thumbnailFile: File | null
    description: string
    note?: string
}

export default function CreateNewCourse() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const stepFromUrl = useMemo(() => {
        const s = Number(searchParams.get('step') || '1')
        return (s === 2 || s === 3) ? s : 1
    }, [searchParams]) as 1 | 2 | 3

    const [step, setStep] = useState<1 | 2 | 3>(stepFromUrl)
    const [seriesData, setSeriesData] = useState<SeriesData | null>(null)
    const [modulesCompleted, setModulesCompleted] = useState<boolean>(false)
    const [lessonsAdded, setLessonsAdded] = useState<boolean>(false)
    // Preload completion from server if data already exists
    const seriesIdFromCookie = typeof document !== 'undefined' ? (getCookie('series_id') as string | null) : null
    const { data: serverModulesResp } = useGetAllModulesQuery(seriesIdFromCookie as string, { skip: !seriesIdFromCookie })
    const { data: serverSeriesResp } = useGetSingleSeriesQuery(seriesIdFromCookie as string, { skip: !seriesIdFromCookie })

    useEffect(() => {
        // Modules present → allow navigating Modules and onward
        const modules = (serverModulesResp as any)?.data?.courses
            || (serverModulesResp as any)?.data
            || []
        if (Array.isArray(modules) && modules.length > 0) {
            setModulesCompleted(true)
        }
    }, [serverModulesResp])

    useEffect(() => {
        // Lessons present (from series count) → allow navigating to Lessons
        const count = (serverSeriesResp as any)?.data?._count?.lesson_files
        if (typeof count === 'number' && count > 0) {
            setLessonsAdded(true)
        }
    }, [serverSeriesResp])
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    // Normalized steps config keeps UI and logic in sync
    const steps = useMemo(() => ([
        { id: 1 as const, label: 'Series', subtitle: 'Basic details' },
        { id: 2 as const, label: 'Modules', subtitle: 'Videos & pricing' },
        { id: 3 as const, label: 'Lessons', subtitle: 'Add lesson content' },
    ]), [])

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

    const handleLessonsAdded = () => {
        setLessonsAdded(true)
    }

    const handlePublishCourse = async () => {
        setIsSubmitting(true)
        // TODO: Implement actual course publishing logic
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log('Course published successfully!')
        setIsSubmitting(false)
    }
    useEffect(() => {
        if (step !== stepFromUrl) setStep(stepFromUrl)

    }, [stepFromUrl])

    // Update URL when step changes via UI
    useEffect(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        const currentStep = Number(current.get('step') || '1')
        if (currentStep !== step) {
            current.set('step', String(step))
            const query = current.toString()
            router.replace(`${pathname}?${query}`)
        }
    }, [step])

    return (
        <div className='space-y-6 '>
            {/* header */}
            <div>
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
                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${completed ? 'bg-[#0F2598] text-white' : step >= id ? 'bg-[#0F2598]/10 text-[#0F2598]' : 'bg-gray-200 text-gray-600'}`}>
                                        {completed ? <Check className='w-4 h-4' /> : id}
                                    </div>
                                    <div className='flex flex-col text-left'>
                                        <span className={`text-sm ${step === id ? 'text-[#0F2598] font-medium' : 'text-gray-700'}`}>{label}</span>
                                        <span className='text-xs text-gray-500'>{subtitle}</span>
                                    </div>
                                </button>
                                {!isLast && (
                                    <div className={`hidden sm:block flex-1 h-[2px] mx-3 ${step > id ? 'bg-[#0F2598]' : 'bg-gray-200'}`}></div>
                                )}
                                {!isLast && (
                                    <div className={`sm:hidden ml-[14px] h-4 w-[2px] ${step > id ? 'bg-[#0F2598]' : 'bg-gray-200'}`}></div>
                                )}
                            </div>
                        )
                    })}
                </nav>
                {/* <div className='h-1 bg-gray-200 rounded-full overflow-hidden mt-5'>
                    <div className='h-full bg-[#0F2598] transition-all' style={{ width: `${(steps.findIndex(s => s.id === step) + 1) / steps.length * 100}%` }} />
                </div> */}
            </div>

            <div className='flex flex-col lg:flex-row gap-6'>
                {/* left side */}
                <div className='w-full lg:w-8/12'>


                    {step === 1 && (
                        <CreateSeries
                            onNext={(data) => {
                                setSeriesData(data)
                                setStep(2)
                            }}
                        />
                    )}

                    {step === 2 && (
                        <CourseModuesAdded onNext={() => { setModulesCompleted(true); setStep(3) }} />
                    )}

                    {step === 3 && <AddLeesionCourse onLessonsAdded={handleLessonsAdded} />}
                </div>

                {/* Right Column - Set Availability */}
                <div className="w-full lg:w-4/12">
                    <SetAvailability
                        courseTitle={seriesData?.title || ''}
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                        isSubmitting={isSubmitting}
                        onSubmit={handlePublishCourse}
                        showErrors={false}
                        disabled={!lessonsAdded}
                    />
                </div>
            </div>
        </div>
    )
}
