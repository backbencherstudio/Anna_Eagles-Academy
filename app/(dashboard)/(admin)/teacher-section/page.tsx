"use client"

import { Button } from '@/components/ui/button'
import { Download, Upload, Pencil, Trash2, Loader2 } from 'lucide-react'
import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ReusableTable from '@/components/Resuable/ReusableTable'
import ConfirmDialog from '@/components/Resuable/ConfirmDialog'
import { toast } from 'react-hot-toast'
import UploadTeacherVideoModal from '@/app/(dashboard)/_components/Admin/TeacherSection/UploadTeacherVideoModal'
import ButtonSpring from '@/components/Resuable/ButtonSpring'

export default function TeacherSection() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [rows, setRows] = React.useState<AnnouncementRow[]>([])
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  type AnnouncementRow = {
    id: number
    title: string
    subtitle: string
    frequency: string
    duration: string
    releaseDate: string
    status: 'Published' | 'Scheduled' | 'Draft'
    views: number
  }

  const headers = [
    { key: 'title', label: 'Video / Announcement', sortable: true },
    { key: 'frequency', label: 'FREQUENCY', sortable: true },
    { key: 'duration', label: 'DURATION', sortable: true },
    { key: 'releaseDate', label: 'RELEASE DATE', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'views', label: 'Views', sortable: true },
    { key: 'actions', label: 'ACTION' },
  ]

  // local seed shown immediately (top declared data)
  const seedData: AnnouncementRow[] = [
    { id: 1, title: 'Welcome Message for New Students', subtitle: 'A warm welcome message for students starting their journey', frequency: 'Scripture', duration: 'N/A', releaseDate: '2024-01-16', status: 'Published', views: 120 },
    { id: 2, title: 'Study Tips for Final Exams', subtitle: 'Essential study strategies to help students prepare for their final examinations', frequency: 'Announcement', duration: '3:45', releaseDate: '2024-01-14', status: 'Scheduled', views: 0 },
    { id: 3, title: 'Course Updates and New Features', subtitle: 'Essential study strategies to help students prepare for their final examinations', frequency: 'Encouragement', duration: 'N/A', releaseDate: '2024-01-16', status: 'Published', views: 164 },
    { id: 4, title: 'Motivational Message - You Can Do It!', subtitle: 'An inspiring message to encourage students during challenging times', frequency: 'Announcement', duration: '3:45', releaseDate: '2024-01-16', status: 'Published', views: 15 },
  ]

  React.useEffect(() => {
    // immediately show skeleton for a bit
    setIsLoading(true)
    // simulate fetching and then setting data
    const t = setTimeout(() => {
      setRows(seedData)
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(t)
  }, [])


  const [dialog, setDialog] = React.useState<{ open: boolean; row?: AnnouncementRow }>({ open: false })
  const [uploadOpen, setUploadOpen] = React.useState(false)
  const [isOpeningModal, setIsOpeningModal] = React.useState(false)

  const renderCell = React.useCallback((item: AnnouncementRow, header: { key: string; label: string }) => {
    if (header.key === 'title') {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{item.title}</span>
          <span className="text-xs text-gray-500">{item.subtitle}</span>
        </div>
      )
    }
    if (header.key === 'status') {
      const color = item.status === 'Published' ? 'text-green-700 bg-green-50' : item.status === 'Scheduled' ? 'text-amber-700 bg-amber-50' : 'text-gray-700 bg-gray-100'
      return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{item.status}</span>
    }
    if (header.key === 'actions') {
      return (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
            onClick={() => console.log('Edit', item.id)}
          >
            <Pencil className="h-4 w-4 text-white" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="h-8 w-8 cursor-pointer"
            onClick={() => setDialog({ open: true, row: item })}
          >
            <Trash2 className="h-4 w-4" />
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
    setRows(prev => prev.filter(r => r.id !== dialog.row!.id))
    toast.success('Deleted successfully')
  }

  return (
    <div>
      {/* Header */}
      <div className='flex items-center flex-col md:flex-row gap-4 justify-between mb-5'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-xl font-semibold text-[#1D1F2C]'>Teacher Section</h2>
          <p className='text-sm text-[#777980]'>Manage teacher videos, announcements, and student communications.</p>
        </div>
        <Button
          variant="outline"
          className="border-gray-300 cursor-pointer py-5 bg-[#0F2598] hover:bg-[#0F2598]/90 text-white hover:text-white transition-all duration-300"
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

      <div className='bg-white rounded-xl p-4'>
        <ReusableTable
          headers={headers}
          data={rows}
          itemsPerPage={8}
          itemsPerPageOptions={[5, 8, 10, 15]}
          showPagination
          isLoading={isLoading}
          skeletonRows={4}
          customCellRenderer={renderCell}
        />
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
        />
      </div>
    </div>
  )
}
