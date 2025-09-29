import AssignmentEssayGrade from '@/app/_components/Admin/Assignment/AssignmentEssayGrade'
import AssignmentGradeList from '@/app/_components/Admin/Assignment/AssignmentGradeList'

import React from 'react'


export default function AssignmentEvaluation() {
    return (
        <div className='flex flex-col gap-7'>
            <AssignmentEssayGrade />
            <AssignmentGradeList />
        </div>
    )
}
