import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Check, ArrowLeft } from 'lucide-react'

interface EssayQuestion {
    question_id: string
    question_text: string
}

interface EssayData {
    test_id: string
    test_title: string
    subtitle: string
    test_description: string
    quiz_type: string
    quiz_duration: string
    quiz_duration_type: string
    total_marks: string
    test_questions: EssayQuestion[]
}

export default function Easy_test() {
    const params = useParams()
    const router = useRouter()
    const [testData, setTestData] = useState<EssayData | null>(null)
    const [answers, setAnswers] = useState<{ [key: string]: string }>({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const testId = params.id as string

                // Extract the actual test ID (e.g., "test_1" -> "1")
                const actualTestId = testId.replace('test_', '')
                const essayResponse = await fetch('/data/EassyTest.json')
                const essayData = await essayResponse.json()

                const essay = essayData.find((e: EssayData) => e.test_id === actualTestId)
                if (essay) {
                    setTestData(essay)
                }

                setLoading(false)
            } catch (error) {
                console.error('Error fetching test data:', error)
                setLoading(false)
            }
        }

        fetchTestData()
    }, [params.id])

    const handleEssayAnswer = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }))
    }

    const handleSubmit = () => {
        // For essay tests, just mark as submitted
        setIsSubmitted(true)
        // Show success message without results
        setTimeout(() => {
            router.push('/assignments')
        }, 2000)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading test...</p>
                </div>
            </div>
        )
    }

    if (!testData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Test not found</p>
                    <Button
                        onClick={() => router.push('/assignments')}
                        className="mt-4 bg-orange-500 hover:bg-orange-600"
                    >
                        Back to Assignments
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/assignments')}
                            className="text-gray-600 cursor-pointer hover:text-gray-900 p-2"
                        >
                            <ArrowLeft className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Back</span>
                        </Button>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                                {testData.subtitle} (Essay)
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600">
                                Duration: {testData.quiz_duration} {testData.quiz_duration_type}
                            </p>
                        </div>
                    </div>
                    <div className="text-center sm:text-right">
                        <p className="text-xs sm:text-sm text-gray-600">Total Marks: {testData.total_marks}</p>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h2 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base">Instructions</h2>
                    <p className="text-orange-700 text-xs sm:text-sm leading-relaxed">
                        Time for your assessment test. This will help you reflect on fundamentals.
                        Keep answers straightforward and focus on main topics. Good luck!
                    </p>
                </div>

                {/* Essay Questions */}
                <div className="space-y-6 sm:space-y-8">
                    {testData.test_questions.map((question, index) => (
                        <div key={question.question_id} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base leading-relaxed">
                                    {index + 1}. {question.question_text}
                                </h3>
                            </div>

                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Answer:</p>
                                <textarea
                                    value={answers[question.question_id] || ''}
                                    onChange={(e) => handleEssayAnswer(question.question_id, e.target.value)}
                                    placeholder="You are have talented, love your work!"
                                    className="w-full h-24 sm:h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs sm:text-sm"
                                    disabled={isSubmitted}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitted}
                        className="w-full cursor-pointer bg-[#F1C27D] hover:bg-[#F1C27D]/80 text-white py-2.5 sm:py-5.5 text-sm sm:text-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Submit Your Answers
                    </Button>
                </div>
            </div>

            {/* Success Message for Essay */}
            {isSubmitted && (
                <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 sm:p-8 max-w-sm sm:max-w-md w-full mx-auto">
                        <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                Assessment Submitted Successfully
                            </h2>
                            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                                Your essay answers have been submitted. You will be notified when your results are ready.
                            </p>
                            <Button
                                onClick={() => router.push('/assignments')}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base py-2 sm:py-2.5"
                            >
                                Back to Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
