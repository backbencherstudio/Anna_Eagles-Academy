'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock } from 'lucide-react'

interface TimeSelectProps {
    value: string
    onChange: (value: string) => void
    options: string[]
    placeholder: string
    error?: string
}

export default function TimeSelect({ value, onChange, options, placeholder, error }: TimeSelectProps) {
    return (
        <Select onValueChange={onChange} value={value}>
            <SelectTrigger className={`cursor-pointer w-full ${error ? 'border-red-500' : ''}`}>
                <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                    <SelectValue placeholder={placeholder} />
                </div>
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
                <div className="grid grid-cols-2 gap-1 p-2">
                    {options.map((time) => (
                        <SelectItem key={time} value={time} className="text-sm">
                            {time}
                        </SelectItem>
                    ))}
                </div>
            </SelectContent>
        </Select>
    )
}


