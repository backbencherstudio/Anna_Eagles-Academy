import { DateRange } from 'react-day-picker'

export interface Lesson {
    id: string
    title: string
    videoFile: File | null
    documentFiles: File[]
}

export interface Course {
    id: string
    title: string
    lessons_files: {
        title: string
    }[]
    price: number
    introVideo: File | null
    endVideo: File | null
    videoFiles: File[]
    docFiles: File[]
}

export interface CourseFormData {
    title: string
    codeType: string
    available_site: number
    course_type: string
    description: string
    note: string
    price: number
    thumbnail: File | null
    start_date: string
    end_date: string
    courses: Course[]
    dateRange: DateRange | undefined
}
