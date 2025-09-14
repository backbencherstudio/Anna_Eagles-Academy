import AssignmentEssay from '@/app/(dashboard)/_components/Admin/Assignment/AssignmentEssay'
import AssignmentQuiz from '@/app/(dashboard)/_components/Admin/Assignment/AssignmentQuiz'
import React from 'react'


export default function CreateAssignmentsPage() {
    return (
        <div className='flex flex-col gap-5 w-full'>
            <AssignmentQuiz />
            <AssignmentEssay />
        </div>
    )
}
