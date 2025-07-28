import React from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ResuablePaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
    onItemsPerPageChange: (itemsPerPage: number) => void
    itemsPerPageOptions?: number[]
}

export default function ResuablePagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    itemsPerPageOptions = [8, 16, 24, 32]
}: ResuablePaginationProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            }
        }

        return pages
    }

    return (
        <div className="flex flex-col lg:flex-row items-center justify-between px-2 py-4 gap-3">
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0 cursor-pointer rounded-md border-gray-300 bg-gray-50 hover:bg-gray-100"
                >
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                </Button>

                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="px-2 text-sm text-gray-600">...</span>
                        ) : (
                            <Button
                                variant={currentPage === page ? "default" : "ghost"}
                                size="sm"
                                onClick={() => onPageChange(page as number)}
                                className={`h-8 cursor-pointer w-8 p-0 rounded-md ${currentPage === page
                                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                {page}
                            </Button>
                        )}
                    </React.Fragment>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0 cursor-pointer rounded-md border-gray-300 bg-gray-50 hover:bg-gray-100"
                >
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-x-2 text-sm text-gray-600 gap-2">
                <span>
                    Showing {startItem} to {endItem} of {totalItems} records
                </span>
                <div className="flex items-center space-x-2">
                    <span>Display</span>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
                    >
                        <SelectTrigger className="h-8 cursor-pointer rounded-md border-gray-300 bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {itemsPerPageOptions.map((option) => (
                                <SelectItem key={option} value={option.toString()}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
