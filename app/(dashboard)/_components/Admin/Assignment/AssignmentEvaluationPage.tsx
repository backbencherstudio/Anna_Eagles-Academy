'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

// Data type definitions
interface Question {
    id: string
    question: string
    answer: string
    maxPoints: number
    grade?: number
}

interface AssignmentSubmission {
    id: string
    questions: Question[]
    student: string
    submissionDate: string
    totalMaxPoints: number
}

// Sample data for demonstration
const sampleSubmissionData: AssignmentSubmission[] = [
    {
        id: '1',
        questions: [
            {
                id: '1-1',
                question: 'What is the origin of the Bible?',
                answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                maxPoints: 10
            },
            {
                id: '1-2',
                question: 'Explain the historical context of biblical texts.',
                answer: 'The historical context of biblical texts involves understanding the cultural, political, and social environment in which these texts were written. This includes the time period, geographical location, and the specific circumstances that influenced the authors.',
                maxPoints: 15
            },
            {
                id: '1-3',
                question: 'What are the main themes in the Old Testament?',
                answer: 'The main themes in the Old Testament include covenant, law, prophecy, wisdom, and the relationship between God and humanity. These themes are developed through various literary forms including narrative, poetry, and legal texts.',
                maxPoints: 12
            },
            {
                id: '1-4',
                question: 'How do different religious traditions interpret biblical texts?',
                answer: 'Different religious traditions interpret biblical texts through various hermeneutical approaches, including literal, allegorical, moral, and anagogical interpretations. Each tradition brings its own theological framework and historical context to the interpretation process.',
                maxPoints: 13
            },
            {
                id: '1-5',
                question: 'What is the significance of biblical archaeology?',
                answer: 'Biblical archaeology provides material evidence that helps verify historical events, understand cultural contexts, and illuminate the world in which biblical texts were written. It bridges the gap between ancient texts and modern understanding.',
                maxPoints: 10
            }
        ],
        student: 'Matthew Thomas',
        submissionDate: '20/09/2024',
        totalMaxPoints: 60
    },
    {
        id: '2',
        questions: [
            {
                id: '2-1',
                question: 'Explain the concept of chemical bonding in detail.',
                answer: 'Chemical bonding is the attraction between atoms, ions, or molecules that enables the formation of chemical compounds. The bond may result from the electrostatic force of attraction between oppositely charged ions as in ionic bonds, or through the sharing of electrons as in covalent bonds.',
                maxPoints: 15
            },
            {
                id: '2-2',
                question: 'What are the different types of chemical bonds?',
                answer: 'The main types of chemical bonds are ionic bonds, covalent bonds, and metallic bonds. Ionic bonds form between oppositely charged ions, covalent bonds involve electron sharing, and metallic bonds occur in metals with delocalized electrons.',
                maxPoints: 12
            },
            {
                id: '2-3',
                question: 'How do intermolecular forces affect chemical properties?',
                answer: 'Intermolecular forces, such as hydrogen bonding, dipole-dipole interactions, and London dispersion forces, affect properties like boiling point, melting point, solubility, and viscosity of substances.',
                maxPoints: 10
            }
        ],
        student: 'Isabella Hall',
        submissionDate: '21/09/2024',
        totalMaxPoints: 37
    },
    {
        id: '3',
        questions: [
            {
                id: '3-1',
                question: 'Describe the process of photosynthesis and its importance.',
                answer: 'Photosynthesis is the process by which plants, algae, and some bacteria convert light energy, usually from the sun, into chemical energy stored in glucose and other organic compounds.',
                maxPoints: 20
            },
            {
                id: '3-2',
                question: 'What are the main stages of photosynthesis?',
                answer: 'The main stages of photosynthesis are the light-dependent reactions and the Calvin cycle. The light-dependent reactions capture light energy and convert it to chemical energy, while the Calvin cycle uses this energy to fix carbon dioxide into organic molecules.',
                maxPoints: 15
            }
        ],
        student: 'Ella Harris',
        submissionDate: '22/09/2024',
        totalMaxPoints: 35
    }
]

export default function AssignmentEvaluationPage() {
    const [submission, setSubmission] = useState<AssignmentSubmission | null>(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
    const [grades, setGrades] = useState<{ [key: string]: number }>({})
    const [loading, setLoading] = useState(true)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submittedGrades, setSubmittedGrades] = useState<{ [key: string]: number }>({})
    const router = useRouter()
    const params = useParams()

    useEffect(() => {
        const fetchSubmissionData = async () => {
            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000))

                // Get submission ID from URL params
                const submissionId = params.id as string

                // Find the submission data
                const foundSubmission = sampleSubmissionData.find(sub => sub.id === submissionId)

                if (foundSubmission) {
                    setSubmission(foundSubmission)
                    // Initialize grades with max points for each question
                    const initialGrades: { [key: string]: number } = {}
                    foundSubmission.questions.forEach(q => {
                        initialGrades[q.id] = q.maxPoints
                    })
                    setGrades(initialGrades)
                } else {
                    // Handle not found
                    console.error('Submission not found')
                }
            } catch (error) {
                console.error('Error fetching submission data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSubmissionData()
    }, [params.id])

    const handleConfirmGrade = () => {
        // Handle grade confirmation logic here
        console.log('Grade confirmed for submission:', submission?.id, 'Grades:', grades)

        // You can add API call here to save the grades
        // await saveGrades(submission?.id, grades)

        // Show success state
        setSubmittedGrades(grades)
        setIsSubmitted(true)
    }

    const handleNextQuestion = () => {
        if (submission && currentQuestionIndex < submission.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
    }

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1)
        }
    }

    const handleGradeChange = (questionId: string, value: number) => {
        setGrades(prev => ({
            ...prev,
            [questionId]: value
        }))
    }

    const handleBack = () => {
        router.push('/assignment-evaluation')
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-100 ">
                <div className="animate-pulse">
                    <div className="bg-gray-100 h-8 rounded mb-4"></div>
                    <div className="bg-gray-100 h-6 rounded mb-2"></div>
                    <div className="bg-gray-100 h-32 rounded mb-4"></div>
                    <div className="bg-gray-100 h-6 rounded mb-2"></div>
                    <div className="bg-gray-100 h-48 rounded mb-6"></div>
                    <div className="flex justify-end space-x-4">
                        <div className="bg-gray-100 h-10 w-20 rounded"></div>
                        <div className="bg-gray-100 h-10 w-24 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!submission) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-100 ">
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Submission not found</p>
                    <Button onClick={handleBack} className="mt-4 cursor-pointer">
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-100 ">
            {/* Header with back button */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Assignment Evaluation</h1>
                        <p className="text-sm text-gray-500">
                            Student: {submission.student} | Submitted: {submission.submissionDate}
                        </p>
                    </div>
                </div>
            </div>

            {/* Total Points Display */}
            {submission && (
                <div className="mb-4 flex justify-end">
                    <div className="text-sm text-gray-500">
                        Total Points: {submission.totalMaxPoints}
                    </div>
                </div>
            )}

            {/* Success Message */}
            {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-green-800">
                                All Grades Submitted Successfully!
                            </h3>
                            <p className="text-sm text-green-700 mt-1">
                                Total Grade: <span className="font-semibold">
                                    {Object.values(submittedGrades).reduce((sum, grade) => sum + grade, 0)}/{submission.totalMaxPoints}
                                </span> points
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* All Questions and Answers */}
            {submission && submission.questions.map((question, index) => (
                <Card key={question.id} className="mb-6">
                    <CardContent className="p-2">
                        {/* Question Section */}
                        <div className="mb-6">
                            <Label className="text-sm font-medium text-gray-500 mb-2 block">
                                Question {index + 1}
                            </Label>
                            <p className="text-lg font-semibold text-gray-900">
                                {question.question}
                            </p>
                        </div>

                        {/* Answer Section */}
                        <div className="mb-6">
                            <Label className="text-sm font-medium text-gray-500 mb-2 block">
                                Answer
                            </Label>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                                    {question.answer}
                                </p>
                            </div>
                        </div>

                        {/* Grading Section */}
                        {!isSubmitted && (
                            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                                <div className="flex items-center space-x-3">
                                    <Label htmlFor={`grade-${question.id}`} className="text-sm font-medium text-gray-700">
                                        Select Grade
                                    </Label>
                                    <Input
                                        id={`grade-${question.id}`}
                                        type="number"
                                        min="0"
                                        max={question.maxPoints}
                                        value={grades[question.id] || 0}
                                        onChange={(e) => handleGradeChange(question.id, parseInt(e.target.value) || 0)}
                                        className="w-20 text-center"
                                    />
                                    <span className="text-sm text-gray-500">
                                        / {question.maxPoints}
                                    </span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}

            {/* Confirm All Grades Button */}
            {submission && !isSubmitted && (
                <div className="flex justify-end mb-6">
                    <Button
                        onClick={handleConfirmGrade}
                        className="bg-[#F1C27D] cursor-pointer hover:bg-[#F1C27D]/90 text-white px-6 py-2"
                    >
                        Confirm All Grades
                    </Button>
                </div>
            )}

            {/* Back to List Button */}
            {isSubmitted && (
                <div className="flex justify-end">
                    <Button
                        onClick={handleBack}
                        className="bg-gray-500 cursor-pointer hover:bg-gray-600 text-white px-6 py-2"
                    >
                        Back to List
                    </Button>
                </div>
            )}
        </div>
    )
}
