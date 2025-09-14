import React from 'react'
import AwaitingEvaluation from '../../_components/Admin/Assignment/AwaitingEvaluation'
import AssignmentGradeList from '../../_components/Admin/Assignment/AssignmentGradeList'

export default function AssignmentEvaluation() {
    return (
        <div className='flex flex-col gap-7'>
            <AwaitingEvaluation />
            <AssignmentGradeList />
        </div>
    )
}
