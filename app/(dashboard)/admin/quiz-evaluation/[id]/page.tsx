import QuizEvaluationPage from '@/app/_components/Admin/Assignment/Evaluation/QuizEvaluationPage'
import { Suspense } from 'react'

export default function QuizEvaluation() {
    return (
        <div className="">
            <Suspense fallback={<div>Loading...</div>}>
                <QuizEvaluationPage />
            </Suspense>
        </div>
    )
}
