import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Check, X, ArrowLeft } from 'lucide-react'

interface QuizQuestion {
    question_id: string
    question_type: string
    question_marks: string
    question_text: string
    options?: Array<{
        option_id: string
        option_text: string
        is_correct: boolean
    }>
}

interface QuizData {
    quiz_id: string
    quiz_title: string
    subtitle: string
    quiz_type: string
    quiz_duration: string
    quiz_duration_type: string
    total_marks: string
    quiz_description: string
    quiz_questions: QuizQuestion[]
}

export default function QuizPage() {
    const params = useParams()
    const router = useRouter()
    const [quizData, setQuizData] = useState<QuizData | null>(null)
    const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>({})
    const [showResults, setShowResults] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [score, setScore] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const quizId = params.id as string
                
                // Extract the actual quiz ID (e.g., "quiz_1" -> "1")
                const actualQuizId = quizId.replace('quiz_', '')
                const quizResponse = await fetch('/data/Quiz.json')
                const quizDataArray = await quizResponse.json()

                const quiz = quizDataArray.find((q: QuizData) => q.quiz_id === actualQuizId)
                if (quiz) {
                    setQuizData(quiz)
                }

                setLoading(false)
            } catch (error) {
                console.error('Error fetching quiz data:', error)
                setLoading(false)
            }
        }

        fetchQuizData()
    }, [params.id])

    const handleOptionSelect = (questionId: string, optionId: string, isMultipleChoice: boolean = false) => {
        setAnswers(prev => {
            if (isMultipleChoice) {
                const currentAnswers = prev[questionId] as string[] || []
                const newAnswers = currentAnswers.includes(optionId)
                    ? currentAnswers.filter(id => id !== optionId)
                    : [...currentAnswers, optionId]
                return { ...prev, [questionId]: newAnswers }
            } else {
                return { ...prev, [questionId]: optionId }
            }
        })
    }

    const calculateScore = () => {
        if (!quizData) return 0

        let totalScore = 0

        quizData.quiz_questions.forEach(question => {
            const userAnswer = answers[question.question_id]
            if (question.question_type === 'multiple_choice') {
                const userAnswers = userAnswer as string[] || []
                const correctOptions = question.options?.filter(opt => opt.is_correct).map(opt => opt.option_id) || []

                // Check if all correct options are selected and no incorrect ones
                const allCorrectSelected = correctOptions.every(opt => userAnswers.includes(opt))
                const noIncorrectSelected = userAnswers.every(opt => correctOptions.includes(opt))

                if (allCorrectSelected && noIncorrectSelected) {
                    totalScore += parseInt(question.question_marks)
                }
            } else {
                const userAnswer = answers[question.question_id] as string
                const correctOption = question.options?.find(opt => opt.is_correct)
                if (userAnswer === correctOption?.option_id) {
                    totalScore += parseInt(question.question_marks)
                }
            }
        })

        return totalScore
    }

    const handleSubmit = () => {
        const finalScore = calculateScore()
        setScore(finalScore)
        setShowResults(true)
        setShowModal(true)
    }

    const isOptionSelected = (questionId: string, optionId: string, isMultipleChoice: boolean = false) => {
        const userAnswer = answers[questionId]
        if (isMultipleChoice) {
            return (userAnswer as string[] || []).includes(optionId)
        }
        return userAnswer === optionId
    }

    const isCorrectAnswer = (questionId: string, optionId: string) => {
        const question = quizData?.quiz_questions.find(q => q.question_id === questionId)
        return question?.options?.find(opt => opt.option_id === optionId)?.is_correct || false
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading quiz...</p>
                </div>
            </div>
        )
    }

    if (!quizData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Quiz not found</p>
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
                                {quizData.subtitle} (Quiz)
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600">
                                Duration: {quizData.quiz_duration} {quizData.quiz_duration_type}
                            </p>
                        </div>
                    </div>
                    <div className="text-center sm:text-right">
                        <p className="text-xs sm:text-sm text-gray-600">Total Marks: {quizData.total_marks}</p>
                        {showResults && (
                            <p className="text-xs sm:text-sm font-semibold text-green-600">
                                Your Score: {score}/{quizData.total_marks}
                            </p>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                {!showResults && (
                    <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h2 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base">Instructions</h2>
                        <p className="text-orange-700 text-xs sm:text-sm leading-relaxed">
                            Time for your quiz assessment. This will help you reflect on fundamentals.
                            Keep answers straightforward and focus on main topics. Good luck!
                        </p>
                    </div>
                )}

                {/* Quiz Questions */}
                <div className="space-y-6 sm:space-y-8">
                    {quizData.quiz_questions.map((question, index) => (
                        <div key={question.question_id} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base leading-relaxed">
                                    {index + 1}. {question.question_text}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600">Marks: {question.question_marks}</p>
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Answer:</p>
                                {question.options?.map((option) => (
                                    <label
                                        key={option.option_id}
                                        className={`flex items-start p-2 sm:p-3 border rounded-lg cursor-pointer transition-colors ${
                                            isOptionSelected(question.question_id, option.option_id, question.question_type === 'multiple_choice')
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        } ${
                                            showResults && isCorrectAnswer(question.question_id, option.option_id)
                                                ? 'border-green-500 bg-green-50'
                                                : ''
                                        } ${
                                            showResults && 
                                            isOptionSelected(question.question_id, option.option_id, question.question_type === 'multiple_choice') && 
                                            !isCorrectAnswer(question.question_id, option.option_id)
                                                ? 'border-red-500 bg-red-50'
                                                : ''
                                        }`}
                                    >
                                        <input
                                            type={question.question_type === 'multiple_choice' ? 'checkbox' : 'radio'}
                                            name={question.question_id}
                                            value={option.option_id}
                                            checked={isOptionSelected(question.question_id, option.option_id, question.question_type === 'multiple_choice')}
                                            onChange={() => handleOptionSelect(question.question_id, option.option_id, question.question_type === 'multiple_choice')}
                                            disabled={showResults}
                                            className="mr-2 sm:mr-3 mt-0.5 flex-shrink-0"
                                        />
                                        <span className="flex-1 text-xs sm:text-sm leading-relaxed">{option.option_text}</span>
                                        {showResults && (
                                            <div className="ml-2 flex-shrink-0">
                                                {isCorrectAnswer(question.question_id, option.option_id) ? (
                                                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                                ) : isOptionSelected(question.question_id, option.option_id, question.question_type === 'multiple_choice') && !isCorrectAnswer(question.question_id, option.option_id) ? (
                                                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                                ) : null}
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                    <Button
                        onClick={handleSubmit}
                        disabled={showResults}
                        className="w-full cursor-pointer bg-[#F1C27D] hover:bg-[#F1C27D]/80 text-white py-2.5 sm:py-5.5 text-sm sm:text-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {showResults ? 'Quiz Completed' : 'Submit Your Answers'}
                    </Button>
                </div>
            </div>

            {/* Results Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 sm:p-8 max-w-sm sm:max-w-md w-full mx-auto">
                        <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                Quiz Submitted Successfully
                            </h2>
                            <div className="mb-4 sm:mb-6">
                                <p className="text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Your Grade</p>
                                <p className="text-3xl sm:text-4xl font-bold text-green-600">{score}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <Button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 cursor-pointer border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-600 text-sm sm:text-base py-2 sm:py-2.5"
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={() => router.push('/assignments')}
                                    className="flex-1 cursor-pointer bg-[#F1C27D] hover:bg-[#F1C27D]/80 text-white text-sm sm:text-base py-2 sm:py-2.5"
                                >
                                    Back to Dashboard
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
