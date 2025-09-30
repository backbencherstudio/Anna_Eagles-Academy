'use client'

import React, { useState, useEffect } from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Loader2 } from 'lucide-react'
import { useGetSeriesWithCoursesQuery } from '@/rtk/api/admin/courseFilterApis'
import { useGetAllAssignmentEvaluationsQuery } from '@/rtk/api/admin/assignmentEvaluationApis'
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import { setSearch as setSearchAction, setSeriesId, setCourseId } from '@/rtk/slices/assignmentEssayEvaluationSlice'
import { useDebounce } from '@/hooks/useDebounce'

// Data type definition
interface EvaluationItem {
    id: string
    studentName: string
    courseName: string
    seriesName: string
    submissionDate: string
    gradeNumber: string
    status: string
    studentEmail?: string
    isGraded?: boolean
}


// Table headers configuration
const tableHeaders = [
    {
        key: 'studentName',
        label: 'STUDENT NAME',
        sortable: true
    },
    {
        key: 'seriesName',
        label: 'SERIES',
        sortable: true
    },
    {
        key: 'courseName',
        label: 'COURSE NAME',
        sortable: true
    },
    {
        key: 'submissionDate',
        label: 'SUBMISSION DATE',
        sortable: true
    },
    {
        key: 'gradeNumber',
        label: 'GRADE',
        sortable: true
    },
    {
        key: 'status',
        label: 'ACTION',
        sortable: false
    }
]

export default function AssignmentEssayGrade() {
    const dispatch = useAppDispatch()
    const { page, limit, search, seriesId, courseId } = useAppSelector(s => s.assignmentEssayEvaluation)
    const [searchInput, setSearchInput] = useState<string>(search)
    const debouncedSearch = useDebounce(searchInput, 400)
    const [evaluationData, setEvaluationData] = useState<EvaluationItem[]>([])
    const [filteredData, setFilteredData] = useState<EvaluationItem[]>([])
    const [loading, setLoading] = useState(true)
    const [viewingId, setViewingId] = useState<string | null>(null)
    const [gradingId, setGradingId] = useState<string | null>(null)
    const router = useRouter()
    const { data: seriesResponse, isLoading: isSeriesLoading } = useGetSeriesWithCoursesQuery()
    const seriesList = seriesResponse?.data ?? []
    const coursesForSelectedSeries = seriesId === 'all'
        ? []
        : (seriesList.find(s => s.id === seriesId)?.courses ?? [])

    const { data: assignmentsResp, isFetching: isAssignmentsFetching } = useGetAllAssignmentEvaluationsQuery({
        page,
        limit,
        search,
        series_id: seriesId === 'all' ? '' : seriesId,
        course_id: courseId === 'all' ? '' : courseId,
    })

    const formatSubmissionDate = (value: string) => {
        if (!value) return ''
        const d = new Date(value)
        if (isNaN(d.getTime())) return value
        return d.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })
    }
    useEffect(() => {
        // Map API data to table rows shape
        const rawItems: any[] = (
            assignmentsResp?.data?.submissions ??
            assignmentsResp?.submissions ??
            []
        ) as any[]

        const items: EvaluationItem[] = rawItems.map((it: any) => ({
            id: String(it.id ?? it._id ?? ''),
            studentName: it.student?.name ?? 'Unknown',
            courseName: it.assignment?.course?.title ?? 'Unknown',
            seriesName: it.assignment?.series?.title ?? 'Unknown',
            submissionDate: formatSubmissionDate(it.submitted_at ?? it.created_at ?? ''),
            gradeNumber: it.graded_at
                ? `${it.total_grade ?? 0}/${it.assignment?.total_marks ?? 0}`
                : '-',
            status: 'Grade',
            studentEmail: it.student?.email ?? undefined,
            isGraded: Boolean(it.graded_at)
        }))

        setEvaluationData(items)
        setFilteredData(items)
        setLoading(false)
    }, [assignmentsResp])

    // Debounce search and dispatch to slice
    useEffect(() => {
        const next = debouncedSearch.trim()
        if (next !== search) {
            dispatch(setSearchAction(next))
        }
    }, [debouncedSearch, search, dispatch])

    // Keep local input in sync with global search (e.g., after external resets)
    useEffect(() => {
        setSearchInput(search)
    }, [search])

    useEffect(() => {
        // When series changes, reset course selection
        dispatch(setCourseId('all'))
    }, [seriesId, dispatch])



    const handleGrade = (item: EvaluationItem) => {
        router.push(`/admin/assignment-evaluation/${item.id}`)
    }

    const handleView = (item: EvaluationItem) => {
        setViewingId(item.id)
        router.push(`/admin/assignment-evaluation/${item.id}?mode=view`)
    }

    const transformedData = filteredData.map(item => ({
        ...item,
        studentName: (
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {item.studentName.split(',')[0].charAt(0)}
                </div>
                <div className="flex flex-col">
                    <span className="font-medium capitalize">{item.studentName}</span>
                    {item.studentEmail && (
                        <span className="text-xs text-gray-500">{item.studentEmail}</span>
                    )}
                </div>
            </div>
        ),
        seriesName: (
            <span className="text-sm font-medium text-gray-700 capitalize ">{item.seriesName}</span>
        ),
        courseName: (
            <span className="text-sm capitalize ">{item.courseName}</span>
        ),
        gradeNumber: (
            <span className="text-sm font-medium bg-gray-100 rounded-md px-2 py-1 ">{item.gradeNumber}</span>
        ),
        status: (
            <div className="w-full flex items-center justify-center gap-2">
                <Button
                    onClick={() => handleView(item)}
                    disabled={viewingId === item.id}
                    className="h-8 px-3 py-1 text-xs rounded-md font-medium text-white bg-[#0F2598] hover:bg-[#0F2598]/90 cursor-pointer"
                >
                    {viewingId === item.id ? (
                        <span className="inline-flex items-center gap-1">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Viewing
                        </span>
                    ) : 'View'}
                </Button>
                <Button
                    onClick={() => { setGradingId(item.id); handleGrade(item) }}
                    disabled={item.isGraded || gradingId === item.id}
                    className={`h-8 px-3 py-1 text-xs rounded-md font-medium text-white ${gradingId === item.id ? 'bg-gray-400 cursor-not-allowed' : item.isGraded ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0F2598] hover:bg-[#0F2598]/80 cursor-pointer'}`}
                >
                    {gradingId === item.id ? (
                        <span className="inline-flex items-center gap-1">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Grading
                        </span>
                    ) : item.isGraded ? 'Graded' : 'Grade'}
                </Button>
            </div>
        )
    }))



    return (
        <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Assignment (Essay)
                </h2>

                <div className="flex items-center gap-2">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search Student"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10 w-48"
                        />
                    </div>

                    {/* Series Filter (from API) */}
                    <Select value={seriesId} onValueChange={(v) => dispatch(setSeriesId(v))}>
                        <SelectTrigger className="w-52">
                            <SelectValue placeholder="Select Series" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Series</SelectItem>
                            {seriesList.map(series => (
                                <SelectItem className='cursor-pointer' key={series.id} value={series.id}>
                                    {series.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Course Filter (depends on selected series) */}
                    <Select value={courseId} onValueChange={(v) => dispatch(setCourseId(v))} disabled={seriesId === 'all'}>
                        <SelectTrigger className="w-52">
                            <SelectValue placeholder={seriesId === 'all' ? 'Select a series first' : 'Select Course'} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Courses</SelectItem>
                            {coursesForSelectedSeries.map(course => (
                                <SelectItem className='cursor-pointer' key={course.id} value={course.id}>
                                    {course.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <ReusableTable
                    headers={tableHeaders}
                    data={transformedData}
                    showPagination={true}
                    itemsPerPage={limit}
                    itemsPerPageOptions={[5, 8, 10, 15, 20]}
                    isLoading={loading || isSeriesLoading || isAssignmentsFetching}                // onSort={handleSort}
                // sortKey={sortKey}
                // sortDirection={sortDirection}
                />
            </div>

            {/* Empty state */}
            {filteredData.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No assignments awaiting evaluation</p>
                </div>
            )}
        </div>
    )
}
