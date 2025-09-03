import AssignmentEssay from '@/app/(dashboard)/_components/Admin/AssignmentEssay'
import AssignmentQuiz from '@/app/(dashboard)/_components/Admin/AssignmentQuiz'
import AwaitingEvaluation from '@/app/(dashboard)/_components/Admin/AwaitingEvaluation'
import React from 'react'


export default function CreateAssignmentsPage() {
    return (
        <div className='flex flex-col lg:flex-row gap-4 w-full'>
            {/*  */}
            <div className='w-full lg:w-8/12 mx-auto'>
                <div className='flex flex-col gap-4'>
                    <AssignmentQuiz />
                    <AwaitingEvaluation />
                </div>
            </div>
            <div className='w-full lg:w-4/12 mx-auto'>
                <AssignmentEssay />
            </div>
        </div>
    )
}
