"use client"

import { Button } from '@/components/ui/button'
import { Download, Upload, Pencil, Trash2, Loader2, Search } from 'lucide-react'
import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ReusableTable from '@/components/Resuable/ReusableTable'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'
import { toast } from 'react-hot-toast'
import UploadTeacherVideoModal from '@/app/_components/Admin/TeacherSection/UploadTeacherVideoModal'
import ButtonSpring from '@/components/Resuable/ButtonSpring'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetAllDataSectionsQuery } from '@/rtk/api/admin/teacherSectionApis'
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import {
  setTableData,
  setSearchQuery,
  setSelectedType,
  setCurrentPage,
  setLimit,
  TeacherSectionData
} from '@/rtk/slices/admin/teacherSectionSlice'
import { useDebounce } from '@/hooks/useDebounce'

export default function TeacherSectionPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Redux state
  const dispatch = useAppDispatch()
  const {
    data,
    totalCount,
    currentPage,
    totalPages,
    searchQuery,
    selectedType,
    limit
  } = useAppSelector((state) => state.teacherSection)

  // Local state for search input
  const [searchInput, setSearchInput] = React.useState('')

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchInput, 500)

  // Update Redux search query when debounced value changes
  React.useEffect(() => {
    dispatch(setSearchQuery(debouncedSearchQuery))
  }, [debouncedSearchQuery, dispatch])

  // API call with debounced search and filters
  const { data: apiData, isLoading, error, refetch } = useGetAllDataSectionsQuery({
    section_type: selectedType,
    search: searchQuery,
    limit,
    page: currentPage,
  })

  // Update Redux state when API data changes
  React.useEffect(() => {
    if (apiData?.data) {
      dispatch(setTableData({
        data: apiData.data.sections || [],
        totalCount: apiData.data.pagination?.total || 0,
        currentPage: apiData.data.pagination?.page || 1,
        totalPages: apiData.data.pagination?.totalPages || 0,
      }))
    }
  }, [apiData, dispatch])

  const headers = [
    { key: 'title', label: 'Video / Announcement', sortable: true, width: '30%' },
    { key: 'section_type', label: 'TYPE', sortable: true, width: '10%' },
    { key: 'duration', label: 'DURATION', sortable: true, width: '10%' },
    { key: 'release_date', label: 'RELEASE DATE', sortable: true, width: '15%' },
    { key: 'release_status', label: 'STATUS', sortable: true, width: '10%' },
    { key: 'view_count', label: 'VIEWS', sortable: true, width: '10%' },
    { key: 'actions', label: 'ACTION', width: '15%' },
  ]

  // Format date and time for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }


  const [dialog, setDialog] = React.useState<{ open: boolean; row?: TeacherSectionData }>({ open: false })
  const [uploadOpen, setUploadOpen] = React.useState(false)
  const [isOpeningModal, setIsOpeningModal] = React.useState(false)

  const renderCell = React.useCallback((item: TeacherSectionData, header: { key: string; label: string }) => {
    if (header.key === 'title') {
      return (
        <div className="flex flex-col w-full max-w-[280px] min-w-[150px]">
          <span
            className="font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors text-sm"
            title={item.title}
            onClick={() => {
              // Optional: Show full title in a tooltip or modal
              console.log('Full title:', item.title)
            }}
          >
            {item.title}
          </span>
          <span
            className="text-xs text-gray-500 line-clamp-1 mt-1"
            title={item.description || 'No description'}
          >
            {item.description || 'No description'}
          </span>
        </div>
      )
    }
    if (header.key === 'section_type') {
      const colors = {
        'ENCOURAGEMENT': 'text-blue-700 bg-blue-50',
        'SCRIPTURE': 'text-purple-700 bg-purple-50',
        'ANNOUNCEMENT': 'text-green-700 bg-green-50'
      }
      const color = colors[item.section_type as keyof typeof colors] || 'text-gray-700 bg-gray-50'
      return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{item.section_type}</span>
    }
    if (header.key === 'duration') {
      return (
        <span className="text-xs text-gray-600">
          {item.duration || 'N/A'}
        </span>
      )
    }
    if (header.key === 'release_date') {
      return (
        <span className="text-xs text-gray-600 truncate font-medium" title={item.release_date ? formatDate(item.release_date) : 'Not scheduled'}>
          {item.release_date ? formatDate(item.release_date) : 'Not scheduled'}
        </span>
      )
    }
    if (header.key === 'release_status') {
      return (
        <span className={`text-xs px-2 py-1 rounded-full inline-block w-fit ${item.release_status === 'PUBLISHED' ? 'text-green-700 bg-green-50' :
          item.release_status === 'SCHEDULED' ? 'text-amber-700 bg-amber-50' :
            'text-gray-700 bg-gray-50'
          }`}>
          {item.release_status}
        </span>
      )
    }
    if (header.key === 'view_count') {
      return (
        <span className="text-xs text-gray-600 font-medium">
          {item.view_count || 0}
        </span>
      )
    }
    if (header.key === 'actions') {
      return (
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            className="h-7 w-7 bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
            onClick={() => console.log('Edit', item.id)}
          >
            <Pencil className="h-3 w-3 text-white" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="h-7 w-7 cursor-pointer"
            onClick={() => setDialog({ open: true, row: item })}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )
    }
    return (item as any)[header.key]
  }, [setDialog])

  // Sync modal with URL (?videoModalOpen=true)
  React.useEffect(() => {
    const shouldOpen = searchParams.get('videoModalOpen') === 'true'
    setUploadOpen(shouldOpen)
    if (shouldOpen) setIsOpeningModal(false)
  }, [searchParams])

  const openUploadModal = () => {
    setIsOpeningModal(true)
    const params = new URLSearchParams(searchParams.toString())
    params.set('videoModalOpen', 'true')
    router.push(`${pathname}?${params.toString()}`)
  }

  const closeUploadModal = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('videoModalOpen')
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(nextUrl)
  }

  const handleConfirmDelete = () => {
    if (!dialog.row) return
    // TODO: Implement delete API call
    toast.success('Deleted successfully')
    refetch() // Refresh data after deletion
  }

  return (
    <div>
      {/* Header */}
      <div className='flex items-center flex-col xl:flex-row gap-4 justify-between mb-5'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-xl font-semibold text-[#1D1F2C]'>Teacher Section</h2>
          <p className='text-sm text-[#777980]'>Manage teacher videos, announcements, and student communications.</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search and Filter */}
          <div className='flex flex-col md:flex-row items-center gap-3'>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by title or description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="md:w-[280px] w-full pl-10"
              />
            </div>
            <Select value={selectedType || "all"} onValueChange={(value) => dispatch(setSelectedType(value === "all" ? "" : value))}>
              <SelectTrigger className="md:w-[200px] w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ENCOURAGEMENT">Encouragement</SelectItem>
                <SelectItem value="SCRIPTURE">Scripture</SelectItem>
                <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            className="border-gray-300 cursor-pointer py-4 bg-[#0F2598] hover:bg-[#0F2598]/90 text-white hover:text-white transition-all duration-300"
            onClick={openUploadModal}
            disabled={isOpeningModal}
          >
            {isOpeningModal ? (
              <>
                <ButtonSpring color="#fff" loading={isOpeningModal} />
                Opening...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Video
              </>
            )}
          </Button>
        </div>

      </div>

      <div className='bg-white rounded-xl p-4'>
        <div className="">
          <div className="">
            <ReusableTable
              headers={headers}
              data={data}
              itemsPerPage={limit}
              itemsPerPageOptions={[5, 10, 15, 20]}
              showPagination
              isLoading={isLoading}
              skeletonRows={4}
              customCellRenderer={renderCell}
            />
          </div>
        </div>

        {/* Custom Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {data.length} of {totalCount} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        <ConfirmDialog
          open={dialog.open}
          onOpenChange={(open) => setDialog(prev => ({ ...prev, open }))}
          title="Delete item?"
          description="This will permanently remove the item."
          confirmText="Delete"
          confirmVariant="destructive"
          onConfirm={handleConfirmDelete}
        />
        <UploadTeacherVideoModal
          open={uploadOpen}
          onOpenChange={(open) => {
            setUploadOpen(open)
            if (open) openUploadModal()
            else closeUploadModal()
          }}
          onPublish={() => {
            refetch() // Refresh data after successful upload
            toast.success('Teacher section uploaded successfully!')
          }}
        />
      </div>
    </div>
  )
}
