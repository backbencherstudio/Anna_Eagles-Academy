'use client'

import React, { useEffect, useState } from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import { setCourseId,  setSearch as setSearchAction, setSeriesId } from '@/rtk/slices/assignmentQuizEvaluationSlice'
import { useDebounce } from '@/hooks/useDebounce'
import { useGetSeriesWithCoursesQuery } from '@/rtk/api/admin/courseFilterApis'
import { useGetAllQuizAssignmentEvaluationsQuery } from '@/rtk/api/admin/assignmentEvaluationApis'

interface QuizRowItem {
  id: string
  studentName: string
  courseName: string
  quizTitle: string
  submissionDate: string
  totalGrade: string
  studentEmail?: string
}

const tableHeaders = [
  { key: 'studentName', label: 'STUDENT NAME', sortable: true },
  { key: 'courseName', label: 'COURSE NAME', sortable: true },
  { key: 'quizTitle', label: 'QUIZ', sortable: true },
  { key: 'submissionDate', label: 'SUBMISSION DATE', sortable: true },
  { key: 'totalGrade', label: 'SCORE', sortable: true },
  { key: 'status', label: 'ACTION', sortable: false },
]

export default function AssignmentQuizGrade() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { page, limit, search, seriesId, courseId } = useAppSelector(s => s.assignmentQuizEvaluation)
  const [searchInput, setSearchInput] = useState<string>(search)
  const debouncedSearch = useDebounce(searchInput, 400)
  const [rows, setRows] = useState<QuizRowItem[]>([])
  const [loading, setLoading] = useState(true)

  const { data: seriesResponse, isLoading: isSeriesLoading } = useGetSeriesWithCoursesQuery()
  const seriesList = seriesResponse?.data ?? []
  const coursesForSelectedSeries = seriesId === 'all' ? [] : (seriesList.find(s => s.id === seriesId)?.courses ?? [])

  const { data: quizResp, isFetching } = useGetAllQuizAssignmentEvaluationsQuery({
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
      year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true,
    })
  }

  useEffect(() => {
    const raw: any[] = (
      quizResp?.data?.submissions ??
      quizResp?.submissions ??
      []
    ) as any[]

    const items: QuizRowItem[] = raw.map(it => ({
      id: String(it.id ?? it._id ?? ''),
      studentName: it.student?.name ?? 'Unknown',
      courseName: it.quiz?.course?.title ?? 'Unknown',
      quizTitle: it.quiz?.title ?? 'Quiz',
      submissionDate: formatSubmissionDate(it.submitted_at ?? it.created_at ?? ''),
      totalGrade: typeof it.total_grade === 'number' ? String(it.total_grade) : '-',
      studentEmail: it.student?.email ?? undefined,
    }))

    setRows(items)
    setLoading(false)
  }, [quizResp])

  useEffect(() => {
    const next = debouncedSearch.trim()
    if (next !== search) dispatch(setSearchAction(next))
  }, [debouncedSearch, search, dispatch])

  useEffect(() => { setSearchInput(search) }, [search])
  useEffect(() => { dispatch(setCourseId('all')) }, [seriesId, dispatch])

  const handleView = (row: QuizRowItem) => {
    router.push(`/admin/assignment-evaluation/${row.id}?mode=view&type=quiz`)
  }

  const data = rows.map(item => ({
    ...item,
    studentName: (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {item.studentName.split(',')[0].charAt(0)}
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{item.studentName}</span>
          {item.studentEmail && <span className="text-xs text-gray-500">{item.studentEmail}</span>}
        </div>
      </div>
    ),
    quizTitle: (
      <span className="text-sm">{item.quizTitle}</span>
    ),
    totalGrade: (
      <span className="text-sm font-medium">{item.totalGrade}</span>
    ),
    status: (
      <div className="w-full flex items-center justify-center">
        <Button onClick={() => handleView(item)} className="h-8 px-3 py-1 text-xs rounded-md font-medium text-white bg-gray-600 hover:bg-gray-600/90 cursor-pointer">View</Button>
      </div>
    )
  }))

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Assignment (Quiz)</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search Student" className="pl-10 w-48" />
          </div>
          <Select value={seriesId} onValueChange={(v) => dispatch(setSeriesId(v))}>
            <SelectTrigger className="w-52"><SelectValue placeholder="Select Series" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Series</SelectItem>
              {seriesList.map(s => <SelectItem className='cursor-pointer' key={s.id} value={s.id}>{s.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={courseId} onValueChange={(v) => dispatch(setCourseId(v))} disabled={seriesId === 'all'}>
            <SelectTrigger className="w-52"><SelectValue placeholder={seriesId === 'all' ? 'Select a series first' : 'Select Course'} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {coursesForSelectedSeries.map(c => <SelectItem className='cursor-pointer' key={c.id} value={c.id}>{c.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <ReusableTable
          headers={tableHeaders}
          data={data}
          showPagination={true}
          itemsPerPage={limit}
          itemsPerPageOptions={[5, 8, 10, 15, 20]}
          isLoading={loading || isSeriesLoading || isFetching}
        />
      </div>
    </div>
  )
}
