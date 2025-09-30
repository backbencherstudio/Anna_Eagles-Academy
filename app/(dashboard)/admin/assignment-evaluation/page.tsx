import AssignmentEssayGrade from '@/app/_components/Admin/Assignment/Evaluation/AssignmentEssayGrade'
import AssignmentQuizGrade from '@/app/_components/Admin/Assignment/Evaluation/AssignmentQuizGrade'


import React from 'react'


export default function AssignmentEvaluation() {
    return (
        <div className='flex flex-col gap-7'>
            <AssignmentEssayGrade />
            <AssignmentQuizGrade />
        </div>
    )
}
