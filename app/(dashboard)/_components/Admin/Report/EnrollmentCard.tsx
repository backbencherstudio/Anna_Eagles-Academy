'use client'

import React from 'react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { IoLogoWhatsapp } from 'react-icons/io'

type EnrollmentRow = {
  id: number
  studentName: string
  birthday: string
  email: string
  number: string
  hasWhatsapp?: boolean
  address: string
  course: string
  type: string
  registrationDate: string
  bootcampDates: string
  enrollment: string
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

// Demo data declared at top (replace with API when available)
const rows: EnrollmentRow[] = [
  {
    id: 1,
    studentName: 'Savannah Nguyen',
    birthday: 'Feb 9, 2015',
    email: 'kenzi.lawson@example.com',
    number: '+44 7946 123456',
    hasWhatsapp: true,
    address: '3891 Ranchview Dr. Richardson, California 62639',
    course: 'Foundations of Faith',
    type: 'Bootcamp',
    registrationDate: '2024-07-15',
    bootcampDates: 'Start: 2024-09-01, End: 2024-12-01',
    enrollment: 'Free Enrolled',
  },
  {
    id: 2,
    studentName: 'Robert Fox',
    birthday: 'May 6, 2012',
    email: 'sara.cruz@example.com',
    number: '+880 1712 345678',
    hasWhatsapp: false,
    address: '2715 Ash Dr. San Jose, South Dakota 83475',
    course: 'The Life and Teachings of Jesus',
    type: 'Regular',
    registrationDate: '2024-07-20',
    bootcampDates: 'N/A',
    enrollment: 'Fully Paid',
  },
  {
    id: 3,
    studentName: 'Cameron Williamson',
    birthday: 'September 9, 2013',
    email: 'georgia.young@example.com',
    number: '+86 1712 345678',
    hasWhatsapp: true,
    address: '4140 Parker Rd. Allentown, New Mexico 31134',
    course: 'Leadership & Service',
    type: 'Regular',
    registrationDate: '2024-08-01',
    bootcampDates: 'N/A',
    enrollment: 'Sponsored',
  },
  {
    id: 4,
    studentName: 'Wade Warren',
    birthday: 'November 28, 2015',
    email: 'nathan.roberts@example.com',
    number: '+91 1712 345678',
    hasWhatsapp: false,
    address: '8502 Preston Rd. Inglewood, Maine 98380',
    course: 'Meditation & Spiritual Practices',
    type: 'Regular',
    registrationDate: '2024-08-08',
    bootcampDates: 'Start: 2024-09-01, End: 2024-12-01',
    enrollment: 'Free Enrolled',
  },
]

export default function EnrollmentCard() {
  const [isLoading, setIsLoading] = React.useState(true)

  const buildWhatsappLink = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, '')
    return `https://wa.me/${digits}`
  }

  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="bg-white rounded-xl p-4">
      <div className='mb-6'>
        <h1 className='text-[#1D1F2C] text-xl font-semibold'>Student Data</h1>
      </div>
      <ReusableTable
        headers={headers}
        data={rows}
        itemsPerPage={8}
        itemsPerPageOptions={[5, 8, 10, 15]}
        showPagination
        isLoading={isLoading}
        skeletonRows={8}
        customCellRenderer={(item: EnrollmentRow, header) => {
          if (header.key === 'number') {
            if (item.hasWhatsapp) {
              const href = buildWhatsappLink(item.number)
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-green-600 hover:underline">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                  <IoLogoWhatsapp />
                  </span>
                  {item.number}
                </a>
              )
            }
            return item.number
          }
          if (header.key === 'enrollment') {
            const status = item.enrollment
            const color = status.includes('Fully') ? 'text-green-700 bg-green-50' : status.includes('Free') ? 'text-amber-700 bg-amber-50' : 'text-blue-700 bg-blue-50'
            return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>
          }
          if (header.key === 'type') {
            const type = item.type
            const color = type === 'Bootcamp' ? 'text-purple-700 bg-purple-50' : 'text-gray-700 bg-gray-100'
            return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{type}</span>
          }
          return (item as any)[header.key]
        }}
      />
    </div>
  )
}
