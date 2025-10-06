'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetAllStudentListQuery } from '@/rtk/api/admin/filterStudentListApis'

interface StudentSelectProps {
    value: string
    onChange: (value: string) => void
    error?: string
}

export default function StudentSelect({ value, onChange, error }: StudentSelectProps) {
    const { data: studentList, isLoading, isError } = useGetAllStudentListQuery(undefined)

    return (
        <Select onValueChange={onChange} value={value}>
            <SelectTrigger className={`w-full ${error ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
                {isLoading && (
                    <SelectItem value="loading" disabled>
                        Loading...
                    </SelectItem>
                )}
                {isError && (
                    <SelectItem value="error" disabled>
                        Failed to load students
                    </SelectItem>
                )}
                {!isLoading && !isError && Array.isArray(studentList) && studentList.length === 0 && (
                    <SelectItem value="empty" disabled>
                        No students found
                    </SelectItem>
                )}
                {!isLoading && !isError && Array.isArray(studentList) && studentList.map((student: any) => (
                    <SelectItem key={student.id} value={student.id} className="text-sm">
                        <span className="inline-flex items-center gap-2 truncate" title={`${student.name}, ${student.email}`}>
                            <span className="font-medium">{student.name}</span>
                            <span className="text-muted-foreground text-xs">, {student.email}</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}


