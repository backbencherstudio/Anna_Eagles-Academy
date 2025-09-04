'use client'
import React from 'react'
import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Download } from 'lucide-react'
import ReusableTable from '@/components/Resuable/ReusableTable'

type CourseRow = {
  id: string
  seriesName: string
  courseName: string
  startDate: string
  completionDate?: string
  status: 'COMPLETED' | 'PENDING'
}


// Helpers: render table cells
const renderStatusPill = (status: CourseRow['status']) => (
  <span
    className={
      'inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium ' +
      (status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')
    }
  >
    {status}
  </span>
)

const renderDownloadButton = (
  row: CourseRow,
  onClick: (r: CourseRow) => void
) => (
  <Button
    size="sm"
    className="bg-[#0F2598] py-5 cursor-pointer hover:bg-[#0F2598]/90 text-white"
    onClick={() => onClick(row)}
  >
    <Download className="size-4" />
    Download Certificate
  </Button>
)


const headers = [
  { key: 'seriesName', label: 'Series Name', sortable: true, },
  { key: 'courseName', label: 'Course Name', sortable: true },
  { key: 'startDate', label: 'Start date', sortable: true },
  { key: 'completionDate', label: 'Completion Date', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'download', label: 'Download' },
]


const rows: CourseRow[] = [
  {
    id: '1',
    seriesName: 'Foundations of Faith',
    courseName: 'The Kingdom of God is all about Spirit',
    startDate: '01 Mar 2023',
    completionDate: '03 Mar 2023',
    status: 'COMPLETED',
  },
  {
    id: '2',
    seriesName: 'Foundations of Faith',
    courseName: 'The Kingdom of God is all about Character',
    startDate: '01 Mar 2023',
    completionDate: '-',
    status: 'PENDING',
  },
  {
    id: '3',
    seriesName: 'Foundations of Faith',
    courseName: 'The Kingdom of God is about Psalm 133',
    startDate: '01 Mar 2023',
    completionDate: '-',
    status: 'PENDING',
  },
]



export default function Diploma() {


  const handleDownloadDiploma = (item: CourseRow) => {
    console.log('Download diploma clicked')
  }

  return (

    <>
      <div className="space-y-8 bg-white p-4 rounded-lg">
        <div>
          <h1 className="text-xl font-semibold">Course Completion Certificate</h1>
        </div>

        <ReusableTable
          showPagination={false}
          headers={headers}
          data={rows.map((r) => ({
            ...r,
            status: renderStatusPill(r.status),
            download: renderDownloadButton(r, handleDownloadDiploma),
          }))}
        // itemsPerPage={5}
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
              <Button onClick={() => handleDownloadDiploma(rows[0])} className="w-full bg-[#0F2598] hover:bg-[#0F2598]/90 py-5 cursor-pointer text-white">
                <Download className="size-4" />
                Download Diploma
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>

  )
}
