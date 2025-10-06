'use client'

import React from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { IoLogoWhatsapp } from 'react-icons/io'
import { useGetEnrollmentDataQuery } from '@/rtk/api/admin/reportApis'
import { useAppSelector } from '@/rtk/hooks'
import Image from 'next/image'

type EnrollmentRow = {
  id: string
  studentName: string
  birthday: string
  email: string
  number: string
  phoneNumber?: string
  whatsappNumber?: string
  hasWhatsapp?: boolean
  address: string
  course: string
  type: string
  registrationDate: string
  bootcampDates: string
  enrollment: string
  avatarUrl?: string
}

const headers = [
  { key: 'studentName', label: 'Student Name', sortable: true },
  { key: 'birthday', label: 'Birthday', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'number', label: 'Number', sortable: true },
  { key: 'address', label: 'Address', sortable: true },
  { key: 'course', label: 'Course', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'registrationDate', label: 'Registration', sortable: true },
  { key: 'bootcampDates', label: 'Bootcamp Dates', sortable: false },
  { key: 'enrollment', label: 'Enrollment', sortable: true },
]

// Fetch + Slice wiring
export default function EnrollmentCard() {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(5)
  const params = { page, limit }
  const { isFetching } = useGetEnrollmentDataQuery(params)
  const enrollmentData = useAppSelector((s) => s.report.enrollmentData)

  const [isLoading, setIsLoading] = React.useState(!enrollmentData)

  const buildWhatsappLink = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, '')
    return `https://wa.me/${digits}`
  }

  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(t)
  }, [enrollmentData])

  const rows: EnrollmentRow[] = (enrollmentData?.items ?? []).map((item: any) => ({
    id: item?.id ?? String(Math.random()),
    studentName: item?.user?.name ?? 'N/A',
    birthday: item?.user?.date_of_birth ?? 'N/A',
    email: item?.user?.email ?? 'N/A',
    number: item?.user?.phone_number || item?.user?.phone || item?.user?.number || 'N/A',
    phoneNumber: item?.user?.phone_number || item?.user?.phone || item?.user?.number || undefined,
    whatsappNumber: item?.user?.whatsapp_number || undefined,
    hasWhatsapp: !!(item?.user?.whatsapp_number),
    address: item?.user?.address || 'N/A',
    course: item?.series?.title ?? 'N/A',
    type: item?.series?.course_type || item?.type || item?.enroll_type || 'N/A',
    registrationDate: (item?.registered_at || item?.created_at || item?.updated_at)
      ? new Date(item?.registered_at || item?.created_at || item?.updated_at).toISOString().slice(0, 10)
      : 'N/A',
    bootcampDates:
      (item?.series?.course_type || '').toLowerCase() === 'bootcamp' && item?.series?.start_date && item?.series?.end_date
        ? `Start: ${new Date(item.series.start_date).toISOString().slice(0, 10)}\nEnd: ${new Date(item.series.end_date).toISOString().slice(0, 10)}`
        : 'N/A',
      enrollment: item?.enroll_type || 'N/A',
    avatarUrl: item?.user?.avatar_url || undefined,
  }))

  const transformedStudentData = rows.map(item => ({
    ...item,
    bootcampDates: (
      <span className="whitespace-pre-line">{item.bootcampDates}</span>
    ),
    studentName: (
      <div className="flex items-center gap-3">
        {item.avatarUrl ? (
          <Image
            width={40}
            height={40}
            src={item.avatarUrl}
            alt={item.studentName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
            {item.studentName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-medium capitalize">{item.studentName}</span>
          <span className="text-xs text-gray-500">{item.email}</span>
        </div>
      </div>
    ),
    number: (() => {
      const pieces: React.ReactNode[] = []
      if (item.whatsappNumber) {
        pieces.push(
          <a
            key="wa"
            href={buildWhatsappLink(item.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 hover:underline hover:text-green-700 transition-colors duration-200"
            title="Click to open WhatsApp"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors duration-200">
              <IoLogoWhatsapp className="text-green-600 text-sm" />
            </span>
            {item.whatsappNumber}
          </a>
        )
      }
      if (item.phoneNumber) {
        pieces.push(
          <span key="ph" className="text-gray-900">{item.phoneNumber}</span>
        )
      }
      if (pieces.length === 0) {
        return <span className="text-gray-500">N/A</span>
      }
      return (
        <div className="flex flex-col gap-1">
          {pieces.map((p, idx) => (
            <div key={idx}>{p}</div>
          ))}
        </div>
      )
    })(),
    enrollment: (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.enrollment.includes('Fully') ? 'text-green-700 bg-green-50' :
        item.enrollment.includes('Free') ? 'text-amber-700 bg-amber-50' :
          'text-blue-700 bg-blue-50'
        }`}>
        {item.enrollment}
      </span>
    ),
    type: (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${(item.type || '').toLowerCase() === 'bootcamp'
            ? 'text-[#AD0AFD] bg-[#EFCEFF]'
            : 'text-gray-700 bg-gray-100'
          }`}
      >
        {item.type}
      </span>
    )
  }))

  return (
    <div className="bg-white rounded-xl p-4">
      <div className='mb-6'>
        <h1 className='text-[#1D1F2C] text-xl font-semibold'>Student Data</h1>
      </div>
      <ReusableTable
        headers={headers}
        data={transformedStudentData}
        itemsPerPageOptions={[5, 8, 10, 15]}
        showPagination
        serverControlled={true}
        currentPage={enrollmentData?.pagination?.page ?? page}
        totalPages={enrollmentData?.pagination?.totalPages ?? 0}
        totalItems={enrollmentData?.pagination?.total ?? 0}
        itemsPerPage={enrollmentData?.pagination?.limit ?? limit}
        onPageChange={setPage}
        onItemsPerPageChange={setLimit}
        isLoading={isLoading || isFetching}
      />
    </div>
  )
}
