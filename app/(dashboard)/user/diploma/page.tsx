'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Download, Loader2 } from 'lucide-react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { useGetAllCompletedCourseCertificateQuery, useLazyGetSingleCompletedCourseCertificateQuery } from '@/rtk/api/users/diplomaCeritificateApis'
import type { CourseCertificate, SingleCertificateResponse } from '@/rtk/api/users/diplomaCeritificateApis'
import CourseCompletionCertificate from '@/app/_components/Certificate/CourseCompletionCertificate'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetSeriesWithCoursesQuery } from '@/rtk/api/users/filterSeriesList'
import ResuablePagination from '@/components/Resuable/ResuablePagination'
import { DEFAULT_PAGINATION, PAGINATION_LIMITS } from '@/lib/paginationTypes'

type CourseRow = {
  id: string
  seriesName: string
  courseName: string
  startDate: string
  completionDate?: string
  status: 'COMPLETED' | 'PENDING'
  certificateId: string
}


// Helpers: render table cells
const renderStatusPill = (status: CourseRow['status']) => (
  <span
    className={
      'inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium ' +
      (status === 'COMPLETED' ? 'bg-[#E7F7EF] text-[#0CAF60]' : 'bg-[#FFF6D3] text-[#E6BB20]')
    }
  >
    {status}
  </span>
)

const renderDownloadButton = (
  row: CourseRow,
  onClick: (r: CourseRow) => void,
  downloadingId?: string,
  isLoading?: boolean
) => {
  const isCompleted = row.status === 'COMPLETED'
  const isButtonLoading = downloadingId === row.id || isLoading
  return (
    <Button
      size="sm"
      disabled={!isCompleted || isButtonLoading}
      className={
        (isCompleted && !isButtonLoading
          ? 'bg-[#0F2598] hover:bg-[#0F2598]/90 text-white cursor-pointer '
          : 'bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200 ') + 'py-5'
      }
      onClick={isCompleted ? () => onClick(row) : undefined}
    >
      {isButtonLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="size-4" />
          Download Certificate
        </>
      )}
    </Button>
  )
}


const headers = [
  { key: 'seriesName', label: 'Series Name', sortable: true, },
  { key: 'courseName', label: 'Course Name', sortable: true },
  { key: 'startDate', label: 'Start date', sortable: true },
  { key: 'completionDate', label: 'Completion Date', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'download', label: 'Download' },
]

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
};

// Transform API data to CourseRow format
const transformCourseData = (courses: CourseCertificate[]): CourseRow[] => {
  return courses.map((course) => ({
    id: course.course_id,
    seriesName: course.series?.title || 'N/A',
    courseName: course.course_title,
    startDate: formatDate(course.course_start_date),
    certificateId: course.certificate_id || 'N/A',
    completionDate: course.is_completed && course.course_completion_date
      ? formatDate(course.course_completion_date)
      : '-',
    status: course.is_completed ? 'COMPLETED' : 'PENDING',
  }));
};



export default function Diploma() {
  const [selectedCourse, setSelectedCourse] = React.useState<CourseCertificate | SingleCertificateResponse['data'] | null>(null)
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null)
  const { data: seriesResponse, isLoading: isSeriesLoading } = useGetSeriesWithCoursesQuery()
  const [selectedSeriesId, setSelectedSeriesId] = React.useState<string>('all')
  const [currentPage, setCurrentPage] = React.useState<number>(DEFAULT_PAGINATION.page)
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(DEFAULT_PAGINATION.limit)

  // Fetch all completed courses
  const { data, isLoading, error } = useGetAllCompletedCourseCertificateQuery({
    page: currentPage,
    limit: itemsPerPage,
    series_id: selectedSeriesId !== 'all' ? selectedSeriesId : undefined,
  });

  // Lazy fetch for individual certificate data
  const [getCertificateData, { isLoading: isFetchingCertificate }] = useLazyGetSingleCompletedCourseCertificateQuery();

  // Transform API data to table rows
  const rows: CourseRow[] = data?.data?.courses
    ? transformCourseData(data.data.courses)
    : [];

  // Derive total items/pages robustly
  const totalItems = (data as any)?.data?.pagination?.total
    || (data as any)?.data?.total
    || (data as any)?.data?.total_courses
    || rows.length
    || 0

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))

  // Ensure current page stays in bounds when dependencies change
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const handleDownloadDiploma = async (item: CourseRow) => {
    try {
      setDownloadingId(item.id);

      // Fetch individual certificate data to get certificate_id
      const certificateResult = await getCertificateData(item.id).unwrap();

      if (certificateResult?.data) {
        setSelectedCourse(certificateResult.data);
      } else {
        setDownloadingId(null);
      }
    } catch (err) {
      console.error('Error fetching certificate:', err);
      setDownloadingId(null);
    }
  }

  // Auto-download certificate when selected
  React.useEffect(() => {
    if (selectedCourse) {
      const timer = setTimeout(() => {
        setSelectedCourse(null);
        setDownloadingId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [selectedCourse]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-8 bg-white p-4 rounded-lg">
        <div>
          <h1 className="text-xl font-semibold">Course Completion Certificate</h1>
        </div>
        <div className="text-center py-10 text-gray-500">Loading...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-8 bg-white p-4 rounded-lg">
        <div>
          <h1 className="text-xl font-semibold">Course Completion Certificate</h1>
        </div>
        <div className="text-center py-10 text-red-500">
          Error loading certificates. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{
        position: 'fixed',
        left: '0',
        top: '0',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        opacity: '0',
        pointerEvents: 'none',
        zIndex: '-9999'
      }}>
        {selectedCourse && (
          <CourseCompletionCertificate key={selectedCourse.course_id} course={selectedCourse} />
        )}
      </div>

      <div className="space-y-8 bg-white p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
          <h1 className="text-xl font-semibold">Course Completion Certificate</h1>
          <Select
            value={selectedSeriesId}
            onValueChange={(val) => {
              setSelectedSeriesId(val)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Select Series" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Series</SelectItem>
              {isSeriesLoading ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                seriesResponse?.data?.map((series) => (
                  <SelectItem className='cursor-pointer' key={series.id} value={series.id}>{series.title}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>


        </div>

        <ReusableTable
          showPagination={false}
          headers={headers}
          data={rows.map((r) => ({
            ...r,
            status: renderStatusPill(r.status),
            download: renderDownloadButton(r, handleDownloadDiploma, downloadingId || undefined, isFetchingCertificate),
            certificateId: r.certificateId,
          }))}
        // itemsPerPage={5}
        />
        <ResuablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={(p) => setCurrentPage(p)}
          onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
          itemsPerPageOptions={PAGINATION_LIMITS}
        />
      </div>

      {/* Diploma Card */}
      <Card className="mt-5 max-w-4xl mx-auto rounded-2xl py-10  ">
        <CardHeader className="">
          <CardTitle className="text-center text-lg xl:text-2xl  font-semibold">Academy Diploma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Top info banner */}
            <div className="rounded-lg border border-[#F1C27D] bg-amber-50 text-[#4A4C56] p-4 text-center text-sm font-medium">
              Complete all Series and Courses in the Academy
              <br />
              (excluding the Special BootCamp Crash Course) to earn your official diploma.
            </div>

            {/* Status row */}
            <div className="text-sm">
              <div className="mb-2 font-medium text-[#4A4C56]">Status:</div>
              <div className="flex items-center justify-between">
                <div className="text-[#12B76A] dark:text-[#12B76A] font-medium">
                  All standard courses completed
                </div>
                <CheckCircle2 className="size-5 text-[#12B76A]" />
              </div>
            </div>

            {/* Note box */}
            <div className="rounded-lg border bg-muted/40 p-4 text-sm leading-6">
              <div className="mb-1 font-semibold text-[#EB3D4D]">Note:</div>
              <p className="text-muted-foreground italic font-medium">
                A diploma will only be generated after completing all available Series
                and Courses in the Academy (excluding the Special BootCamp Crash Course).
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200" />

            {/* Download button */}
            <div className="pt-2">
              <Button


                className="w-full bg-[#0F2598] hover:bg-[#0F2598]/90 py-5 cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >


                Download Diploma
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>

  )
}
