"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import QuizPage from './Quiz_test/QuizPage'
import Easy_test from './Quiz_test/Easy_test'


export default function AssignmentPage() {
    const params = useParams()

    // If it's a quiz, render QuizPage component
    if (params.id && (params.id as string).startsWith('quiz_')) {
        return <QuizPage />
    }

    // If it's an essay test, render Easy_test component
    if (params.id && (params.id as string).startsWith('test_')) {
        return <Easy_test />
    }

    // Fallback for invalid IDs
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-600">Invalid assignment ID</p>
            </div>
        </div>
    )
}
