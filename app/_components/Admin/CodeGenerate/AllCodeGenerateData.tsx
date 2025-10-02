"use client"

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Copy, Check, Search, ArrowRightIcon } from 'lucide-react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { useGetAllDataScholarshipCodeQuery } from '@/rtk/api/admin/scholarshipCodeGenerateApis'
import { RootState } from '@/rtk'
import {
  setAllCodesData,
  setCurrentPage,
  setItemsPerPage,
  setSearchQuery,
  setCopiedCode,
  clearCopiedCode,
  setPaginationData
} from '@/rtk/slices/admin/scholarshipCodeGenerateSlice'
import { useDebounce } from '@/hooks/useDebounce'
import CodeGenerateModal from './CodeGenerateModal'

// Types
interface ScholarshipCode {
  id: string
  code: string
  code_type: string
  name: string | null
  description: string | null
  scholarship_type: string
  status: number
  created_at: string
  updated_at: string
  student: {
    id: string
    name: string
    email: string
  }
  series: {
    id: string
    title: string
    slug: string
  }
  courses: Array<{
    id: string
    title: string
  }>
}



export default function AllCodeGenerateData() {
  const dispatch = useDispatch()
  const [searchInput, setSearchInput] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get state from Redux store
  const {
    allCodesData,
    currentPage,
    itemsPerPage,
    searchQuery,
    copiedCode,
    totalItems,
    totalPages
  } = useSelector((state: RootState) => state.scholarshipCodeGenerate)

  // Debounced search
  const debouncedSearch = useDebounce(searchInput, 400)

  // API call with pagination and search
  const {
    data: apiData,
    isLoading,
    error,
  } = useGetAllDataScholarshipCodeQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery
  })

  // Update Redux state when API data changes
  useEffect(() => {
    if (apiData?.data) {
      dispatch(setAllCodesData(apiData.data.scholarship_codes))
      dispatch(setPaginationData({
        totalItems: apiData.data.pagination.total,
        totalPages: apiData.data.pagination.totalPages
      }))
    }
  }, [apiData, dispatch])

  // Debounce search and dispatch to slice
  useEffect(() => {
    const next = debouncedSearch.trim()
    if (next !== searchQuery) {
      dispatch(setSearchQuery(next))
      dispatch(setCurrentPage(1))
    }
  }, [debouncedSearch, searchQuery, dispatch])


  useEffect(() => {
    setSearchInput(searchQuery)
  }, [searchQuery])

  // Copy to clipboard function
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      dispatch(setCopiedCode(code))
      setTimeout(() => dispatch(clearCopiedCode()), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  // Table headers
  const tableHeaders = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'student', label: 'Student', sortable: true },
    { key: 'series', label: 'Series', sortable: true },
    { key: 'courses', label: 'Courses', sortable: false },
    { key: 'scholarship_type', label: 'Type', sortable: true },
    { key: 'created_at', label: 'Created Date', sortable: true }
  ]

  // Custom cell renderer
  const customCellRenderer = (item: ScholarshipCode, header: any) => {
    switch (header.key) {
      case 'code':
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-blue-600">
              {item.code}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(item.code)}
              className="h-6 w-6 p-0 cursor-pointer"
            >
              {copiedCode === item.code ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        )

      case 'student':
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{item.student.name}</span>
            <span className="text-sm text-gray-500">{item.student.email}</span>
          </div>
        )

      case 'series':
        return (
          <span className="text-gray-700">{item.series.title}</span>
        )

      case 'courses':
        return (
          <div className="flex flex-wrap gap-1">
            {item.courses.map((course, index) => (
              <div key={index} className="text-xs">
                {course.title}
              </div>
            ))}
          </div>
        )

      case 'scholarship_type':
        const typeColors = {
          'scholarship': 'bg-purple-100 text-purple-800',
          'free': 'bg-green-100 text-green-800',
          'paid': 'bg-blue-100 text-blue-800'
        }
        return (
          <div className={`px-2 py-1 rounded-md text-xs font-medium w-fit capitalize ${typeColors[item.scholarship_type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800'}`}>
            {item.scholarship_type}
          </div>
        )

      case 'created_at':
        return (
          <span className="text-sm text-gray-600">
            {new Date(item.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        )

      default:
        return null
    }
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    dispatch(setItemsPerPage(newItemsPerPage))
    dispatch(setCurrentPage(1))
  }

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchInput(value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Code Generator</h1>
        <p className="text-sm text-gray-500 mt-1">Generate scholarship codes for students</p>
      </div>


      {/* Search and Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by code, student name, or email..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 lg:w-80 w-full"
                />
              </div>
            </div>


            {/* Code Generate Modal Button */}
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0F2598] hover:bg-[#0F2598]/90 cursor-pointer"
            >
              Code Generate
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>

            {/* Modal */}
            <CodeGenerateModal
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
            />
          </div>

          {/* Table */}
          <ReusableTable
            headers={tableHeaders}
            data={allCodesData}
            customCellRenderer={customCellRenderer}
            isLoading={isLoading}
            emptyStateMessage="No scholarship codes found"
            serverControlled={true}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={[5, 10, 20, 50]}
          />
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-red-800">
              <h3 className="font-semibold">Error loading data</h3>
              <p className="text-sm mt-1">Please try refreshing the page or contact support if the problem persists.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}