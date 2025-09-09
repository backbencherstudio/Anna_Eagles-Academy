import React, { useState, useMemo } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ChevronUp, ChevronDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import ResuablePagination from "./ResuablePagination"

interface TableHeader {
    key: string
    label: string
    sortable?: boolean
}

interface TableAction {
    label: string
    icon: React.ReactNode
    onClick: (item: any) => void
    variant?: "default" | "destructive"
}

interface ReusableTableProps {
    headers: TableHeader[]
    data: any[]
    actions?: TableAction[]
    itemsPerPage?: number
    itemsPerPageOptions?: number[]
    showPagination?: boolean
    showCheckbox?: boolean
    selectedItems?: any[]
    onSelectionChange?: (selectedItems: any[]) => void
    customCellRenderer?: (item: any, header: TableHeader) => React.ReactNode
    isLoading?: boolean
    skeletonRows?: number
}

export default function ReusableTable({
    headers,
    data,
    actions,
    itemsPerPage: initialItemsPerPage = 10,
    itemsPerPageOptions = [5, 10, 15, 20],
    showPagination = true,
    showCheckbox = false,
    selectedItems = [],
    onSelectionChange,
    customCellRenderer,
    isLoading = false,
    skeletonRows
}: ReusableTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)
    const [sortKey, setSortKey] = useState('')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    // Use data directly since filtering will be done by parent component
    const filteredData = data

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData

        return [...filteredData].sort((a, b) => {
            let aValue = a[sortKey]
            let bValue = b[sortKey]

            // Handle date sorting
            if (sortKey === 'date' || sortKey.includes('date')) {
                aValue = new Date(aValue).getTime()
                bValue = new Date(bValue).getTime()
            }

            // Handle amount sorting (remove $ and convert to number)
            if (sortKey === 'amount' || sortKey.includes('amount')) {
                aValue = parseFloat(aValue.toString().replace(/[$,]/g, ''))
                bValue = parseFloat(bValue.toString().replace(/[$,]/g, ''))
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
            return 0
        })
    }, [filteredData, sortKey, sortDirection])

    // Calculate pagination values
    const totalItems = filteredData.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    // Paginate data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return sortedData.slice(startIndex, endIndex)
    }, [sortedData, currentPage, itemsPerPage])

    // Precompute skeleton widths for consistent shimmer per render
    const numberOfSkeletonRows = skeletonRows ?? itemsPerPage
    const skeletonMatrix = useMemo(() => {
        if (!isLoading) return [] as number[][]
        const rows: number[][] = []
        for (let r = 0; r < numberOfSkeletonRows; r++) {
            const cols: number[] = []
            for (let c = 0; c < headers.length; c++) {
                const min = 35
                const max = 85
                const width = Math.floor(Math.random() * (max - min + 1)) + min
                cols.push(width)
            }
            rows.push(cols)
        }
        return rows
    }, [isLoading, numberOfSkeletonRows, headers.length])

    // Handle sorting
    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortDirection('asc')
        }
        setCurrentPage(1) // Reset to first page when sorting
    }

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // Handle items per page change
    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1) // Reset to first page when changing items per page
    }

    // Handle checkbox selection
    const handleItemSelect = (item: any) => {
        if (!onSelectionChange) return

        const isSelected = selectedItems.some(selected => selected.id === item.id)
        let newSelectedItems: any[]

        if (isSelected) {
            newSelectedItems = selectedItems.filter(selected => selected.id !== item.id)
        } else {
            newSelectedItems = [...selectedItems, item]
        }

        onSelectionChange(newSelectedItems)
    }

    // Handle select all
    const handleSelectAll = () => {
        if (!onSelectionChange) return

        const allSelected = paginatedData.every(item =>
            selectedItems.some(selected => selected.id === item.id)
        )

        if (allSelected) {
            // Deselect all current page items
            const newSelectedItems = selectedItems.filter(selected =>
                !paginatedData.some(pageItem => pageItem.id === selected.id)
            )
            onSelectionChange(newSelectedItems)
        } else {
            // Select all current page items
            const currentPageIds = paginatedData.map(item => item.id)
            const newSelectedItems = selectedItems.filter(selected =>
                !currentPageIds.includes(selected.id)
            )
            onSelectionChange([...newSelectedItems, ...paginatedData])
        }
    }

    // Check if all items on current page are selected
    const isAllSelected = paginatedData.length > 0 && paginatedData.every(item =>
        selectedItems.some(selected => selected.id === item.id)
    )

    // Check if some items on current page are selected
    const isIndeterminate = paginatedData.some(item =>
        selectedItems.some(selected => selected.id === item.id)
    ) && !isAllSelected



    const renderCellContent = (item: any, header: TableHeader) => {
        // Use custom cell renderer if provided
        if (customCellRenderer) {
            return customCellRenderer(item, header)
        }

        switch (header.key) {
            case 'fullName':
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={item.avatar} alt={item.fullName} />
                            <AvatarFallback>{item.fullName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{item.fullName}</span>
                    </div>
                )
            case 'completionStatus':
                return (
                    <span className="text-sm font-medium">
                        {item.completionStatus}% Finished
                    </span>
                )
            case 'enrollmentStatus':
                return (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-orange-600">{item.enrollmentStatus}</span>
                        {actions && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {actions.map((action, index) => (
                                        <DropdownMenuItem
                                            key={index}
                                            onClick={() => action.onClick(item)}
                                            className={action.variant === "destructive" ? "text-red-600 cursor-pointer" : "cursor-pointer"}
                                        >
                                            {action.icon}
                                            {action.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                )
            case 'status':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium  text-green-800">
                        {item.status}
                    </span>
                )
            case 'actions':
                return actions ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {actions.map((action, index) => (
                                <DropdownMenuItem
                                    key={index}
                                    onClick={() => action.onClick(item)}
                                    className={action.variant === "destructive" ? "text-red-600 cursor-pointer" : "cursor-pointer"}
                                >
                                    {action.icon}
                                    {action.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : null
            default:
                return item[header.key]
        }
    }

    const renderSortIcon = (header: TableHeader) => {
        if (!header.sortable) return null

        if (sortKey === header.key) {
            return sortDirection === 'asc' ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
            )
        }
        return (
            <div className="flex flex-col">
                <ChevronUp className="h-3 w-3 text-gray-300" />
                <ChevronDown className="h-3 w-3 text-gray-300" />
            </div>
        )
    }

    return (
        <div className="w-full">
            {/* Table */}
            <div className="rounded-md border sm:overflow-visible overflow-x-auto">
                <Table className="min-w-max">
                    <TableHeader className='bg-gray-100'>
                        <TableRow className='border-none'>
                            {showCheckbox && (
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={isLoading ? false : isAllSelected}
                                        onCheckedChange={isLoading ? undefined : handleSelectAll}
                                    />
                                </TableHead>
                            )}
                            {headers.map((header) => (
                                <TableHead
                                    key={header.key}
                                    className={header.sortable && !isLoading ? "cursor-pointer hover:bg-muted/50" : ""}
                                    onClick={() => header.sortable && !isLoading && handleSort(header.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        {header.label}
                                        {!isLoading && renderSortIcon(header)}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            skeletonMatrix.map((row, rIdx) => (
                                <TableRow key={`skeleton-${rIdx}`}>
                                    {showCheckbox && (
                                        <TableCell className="w-12">
                                            <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                                        </TableCell>
                                    )}
                                    {row.map((width, cIdx) => (
                                        <TableCell key={`s-cell-${cIdx}`}>
                                            <div className="h-4 rounded bg-gray-200 animate-pulse" style={{ width: `${width}%` }} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            paginatedData.map((item, index) => (
                                <TableRow key={item.id || index}>
                                    {showCheckbox && (
                                        <TableCell className="w-12">
                                            <Checkbox
                                                checked={selectedItems.some(selected => selected.id === item.id)}
                                                onCheckedChange={() => handleItemSelect(item)}
                                            />
                                        </TableCell>
                                    )}
                                    {headers.map((header) => (
                                        <TableCell key={header.key}>
                                            {renderCellContent(item, header)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {showPagination && !isLoading && totalItems > 0 && (
                <div className="mt-4">
                    <ResuablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        itemsPerPageOptions={itemsPerPageOptions}
                    />
                </div>
            )}
        </div>
    )
}
