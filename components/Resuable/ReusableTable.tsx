import React from 'react'
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
import { MoreHorizontal, Download, Trash2, ChevronUp, ChevronDown } from "lucide-react"

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
    onSort?: (key: string) => void
    sortKey?: string
    sortDirection?: 'asc' | 'desc'
}

export default function ReusableTable({
    headers,
    data,
    actions,
    onSort,
    sortKey,
    sortDirection
}: ReusableTableProps) {
    const renderCellContent = (item: any, header: TableHeader) => {
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

        <Table>
            <TableHeader className='bg-gray-100 '>
                <TableRow className='border-none'>
                    {headers.map((header) => (
                        <TableHead
                            key={header.key}
                            className={header.sortable ? "cursor-pointer hover:bg-muted/50" : ""}
                            onClick={() => header.sortable && onSort?.(header.key)}
                        >
                            <div className="flex items-center gap-2">
                                {header.label}
                                {renderSortIcon(header)}
                            </div>
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={item.id || index}>
                        {headers.map((header) => (
                            <TableCell key={header.key}>
                                {renderCellContent(item, header)}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>

    )
}
