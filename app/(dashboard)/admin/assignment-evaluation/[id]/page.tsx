
import AssignmentEvaluationPage from '@/app/_components/Admin/Assignment/Evaluation/AssignmentEvaluationPage'
import { Suspense } from 'react'

export default function AssignmentEvaluation() {
    return (
        <div className="">
            <Suspense fallback={<div>Loading...</div>}>
                <AssignmentEvaluationPage />
            </Suspense>
        </div>
    )
}
