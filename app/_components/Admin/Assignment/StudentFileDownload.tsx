'use client'

import { useEffect, useMemo, useState } from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import { setSearch, setSeriesId, setCourseId } from '@/rtk/slices/studentFileDownloadSlice'
import { useGetAllStudentFileDownloadsQuery } from '@/rtk/api/admin/studentFileDownloadApis'
import SeriesFilterReuseable from '@/components/Resuable/SeriesFilter/SeriesFilterReuseable'
import { useDebounce } from '@/hooks/useDebounce'
import Image from 'next/image'
import ButtonSpring from '@/components/Resuable/ButtonSpring'

// Table headers configuration
const tableHeaders = [
    { key: 'studentName', label: 'STUDENT NAME', sortable: true },
    { key: 'seriesName', label: 'SERIES NAME', sortable: true },
    { key: 'courseName', label: 'COURSE NAME', sortable: true },
    { key: 'submissionDate', label: 'SUBMISSION DATE', sortable: true },
    { key: 'status', label: 'ACTION', sortable: false },
]

export default function StudentFileDownload() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { section_type, search, page, limit, series_id, course_id } = useAppSelector((s) => s.studentFileDownload)
    const [searchInput, setSearchInput] = useState<string>(search)
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
    const debouncedSearch = useDebounce(searchInput, 300)

    const { data, isFetching } = useGetAllStudentFileDownloadsQuery({ section_type, search, page, limit, series_id, course_id })

    const items = data?.data?.students ?? []

    // apply debounced search to store
    useEffect(() => {
        if (debouncedSearch !== search) {
            dispatch(setSearch(debouncedSearch))
        }
    }, [debouncedSearch, search, dispatch])


    const handleViewDetails = (item: any) => {
        if (loadingStates[item.id]) return

        setLoadingStates(prev => ({ ...prev, [item.id]: true }))

        setTimeout(() => {
            router.push(`/admin/student-file-download/${item.id}`)
        }, 100)
    }

    const formatDateTime = (value: string) => {
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

    const transformedData = useMemo(() => {
        return items.map((item: any) => {
            const studentName = item?.name || 'Unknown'
            const initial = studentName.charAt(0).toUpperCase()
            const files = item?.student_files || []
            const firstFile = files[0] || {}
            const seriesTitle = firstFile?.series?.title || '-'
            const courseTitle = firstFile?.course?.title || '-'
            const avatarUrl = item?.avatar_url
            const isLoading = loadingStates[item.id]

            return {
                id: item.id,
                studentName: (
                    <div className="flex items-center gap-3">
                        {avatarUrl ? (
                            <Image width={48} height={48} src={avatarUrl} alt={studentName} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {initial}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="font-medium">{studentName}</span>
                            {item?.email && <span className="text-xs text-gray-500">{item.email}</span>}
                        </div>
                    </div>
                ),
                seriesName: seriesTitle,
                courseName: courseTitle,
                submissionDate: formatDateTime(item?.created_at || ''),
                status: isLoading ? (
                    <ButtonSpring
                        loading
                        variant="spinner"
                        size={16}
                        color="#ffffff"
                        label="Loading..."
                        className="bg-[#0F2598] text-white px-4 py-2 text-sm rounded-md font-medium opacity-50 cursor-not-allowed"
                    />
                ) : (
                    <Button
                        onClick={() => handleViewDetails(item)}
                        className="bg-[#0F2598] hover:bg-[#0F2598]/80 text-white px-4 py-2 text-sm rounded-md font-medium cursor-pointer"
                    >
                        View Details
                    </Button>
                )
            }
        })
    }, [items, loadingStates])

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-100">
            <div className="mb-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Student Files List</h2>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Input
                            placeholder="Search by student"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-[220px]"
                        />

                        <SeriesFilterReuseable
                            className="flex items-end"
                            seriesPlaceholder="Select series"
                            coursePlaceholder="Select course"
                            onSeriesChange={(id) => dispatch(setSeriesId(id ?? ''))}
                            onCourseChange={(id) => dispatch(setCourseId(id ?? ''))}
                        />
                    </div>
                </div>
            </div>

            <ReusableTable
                headers={tableHeaders}
                data={transformedData}
                showPagination
                itemsPerPage={limit}
                itemsPerPageOptions={[5, 10, 15, 20]}
                isLoading={isFetching}
            />

        </div>
    )
}
