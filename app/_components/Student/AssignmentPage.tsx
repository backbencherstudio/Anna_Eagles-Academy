"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import QuizPage from './Quiz_test/QuizPage'
import Easy_test from './Quiz_test/Easy_test'


export default function TestPage() {
    const params = useParams()

    if (params.id && (params.id as string).startsWith('quiz_')) {
        return <QuizPage />
    }

    if (params.id && (params.id as string).startsWith('test_')) {
        return <Easy_test />
    }

    return (
        <div className="max-h-[80vh] h-full bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-600">Invalid assignment ID: {params.id}</p>
                {/* <p className="text-gray-500 text-sm mt-2">Expected format: quiz_[id] or test_[id]</p> */}
            </div>
        </div>
    )
}
