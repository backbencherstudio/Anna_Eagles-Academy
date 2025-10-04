"use client"

import React, { useMemo } from 'react'
import { Download, Search } from 'lucide-react'
import ReusableTable from '@/components/Resuable/ReusableTable'
import { Input } from '@/components/ui/input'
import { useGetAllGiftCardsQuery } from '@/rtk/api/admin/giftCardGenerateApis'
import { useAppDispatch, useAppSelector } from '@/rtk/hooks'
import { setPage, setLimit, setSearch } from '@/rtk/slices/admin/giftCardGenerateSlice'
import { useDebounce } from '@/hooks/useDebounce'

// Table headers for card history
const tableHeaders = [
    { key: 'type', label: 'Type', sortable: true },
    { key: 'recipient', label: 'Recipient', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'createdDate', label: 'Created Date', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
]

export default function CardHistory() {
    const dispatch = useAppDispatch()
    const { page, limit, search } = useAppSelector((s) => s.giftCardGenerate)
    const debouncedSearch = useDebounce(search, 300)

    const { data, isFetching } = useGetAllGiftCardsQuery({ page, limit, search: debouncedSearch })

    const rows = useMemo(() => {
        const cardGenerators = data?.data?.cardGenerators ?? []
        return cardGenerators.map((item: any) => ({
            id: item.id,
            type: item.title || 'N/A',
            recipient: item.student?.name || item.recipient_name || 'N/A',
            email: item.student?.email || item.recipient_email || 'N/A',
            createdDate: new Date(item.created_at).toLocaleDateString(),
            image_url: item.image_url,
        }))
    }, [data])

    const totalItems = data?.data?.pagination?.total ?? 0
    const totalPages = data?.data?.pagination?.totalPages ?? 1

    // Define table actions
    const tableActions = [
        {
            label: 'Download',
            icon: <Download className="h-4 w-4 mr-2" />,
            onClick: (item: any) => {
                if (item.image_url) {
                    const a = document.createElement('a')
                    a.href = item.image_url
                    a.download = `${item.type || 'card'}.png`
                    a.target = '_blank'
                    a.click()
                }
            }
        }
    ]

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Generated Cards</h2>
                    <p className="text-gray-600 text-sm ">History of all generated cards</p>
                </div>

                {/* search input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Search Student"
                        value={search}
                        onChange={(e) => dispatch(setSearch(e.target.value))}
                        className="pl-10 w-48"
                    />
                </div>
            </div>

            <ReusableTable
                headers={tableHeaders}
                data={rows}
                actions={tableActions}
                showPagination={true}
                serverControlled={true}
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={limit}
                itemsPerPageOptions={[5, 10, 15, 20]}
                onPageChange={(p) => dispatch(setPage(p))}
                onItemsPerPageChange={(l) => dispatch(setLimit(l))}
                isLoading={isFetching}
            />
        </div>
    )
}
