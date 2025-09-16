import AssignmentGradeList from '@/app/_components/Admin/Assignment/AssignmentGradeList'
import AwaitingEvaluation from '@/app/_components/Admin/Assignment/AwaitingEvaluation'
import React from 'react'


export default function AssignmentEvaluation() {
    return (
        <div className='flex flex-col gap-7'>
            <AwaitingEvaluation />
            <AssignmentGradeList />
        </div>
    )
}
