import React from 'react'
import { CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { FaGraduationCap, FaPlay, FaClipboardList } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'

// Types for the data structure
interface Assignment {
    id: string;
    title: string;
    due_at: string;
    published_at: string;
    is_published: boolean;
    created_at: string;
    total_marks: number;
    series_id: string;
    series: {
        id: string;
        title: string;
    };
    course: {
        id: string;
        title: string;
    };
    _count: {
        submissions: number;
    };
    submissions: Array<{
        id: string;
        status: string;
        total_grade: number;
        overall_feedback?: string;
        graded_at?: string;
        graded_by_id?: string;
        graded_by?: any;
    }>;
    submission_count: number;
    total_students: number;
}

interface Quiz {
    id: string;
    title: string;
    due_at: string;
    published_at: string;
    is_published: boolean;
    created_at: string;
    total_marks: number;
    series_id: string;
    series: {
        id: string;
        title: string;
    };
    course: {
        id: string;
        title: string;
    };
    _count: {
        submissions: number;
    };
    submissions: Array<{
        id: string;
        status: string;
        total_grade: number;
        percentage: number;
        submitted_at: string;
    }>;
    submission_count: number;
    total_students: number;
}

interface AssignmentOverviewDashaboardProps {
    assignments?: Assignment[];
    quizzes?: Quiz[];
    isLoading?: boolean;
}

export default function AssignmentOverviewDashaboard({
    assignments = [],
    quizzes = [],
    isLoading = false
}: AssignmentOverviewDashaboardProps) {
    // Helper function to calculate progress percentage
    const calculateProgress = (submissionCount: number, totalStudents: number) => {
        if (totalStudents === 0) return 0;
        return Math.round((submissionCount / totalStudents) * 100);
    };

    // Helper function to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Helper function to get status badge
    const getStatusBadge = (submissionCount: number, totalStudents: number) => {
        const progress = calculateProgress(submissionCount, totalStudents);
        if (progress === 100) {
            return <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">Completed!</span>;
        } else if (progress > 0) {
            return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">In Progress</span>;
        } else {
            return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">Not Started</span>;
        }
    };

    return (
        <div className="space-y-6 lg:space-y-8">
            {/* Assignment Section */}
            <div className='bg-white rounded-lg p-4 sm:p-6'>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-600">Assignments</h2>
                    <Link href="/admin/assignment-management?tab=essay">
                        <Button variant="outline" className="text-xs sm:text-sm cursor-pointer">
                            View all
                        </Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        <div className="bg-gray-100 animate-pulse rounded-lg h-32"></div>
                        <div className="bg-gray-100 animate-pulse rounded-lg h-32"></div>
                    </div>
                ) : assignments.length > 0 ? (
                    <div className="grid gap-4 sm:gap-6">
                        {assignments.map((assignment, index) => {
                            const progress = calculateProgress(assignment.submission_count, assignment.total_students);
                            return (
                                <div key={assignment.id} className="bg-[#F8FAFB] rounded-lg">
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                {/* Header */}
                                                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                                    <FaGraduationCap className="text-gray-400 text-xs sm:text-sm flex-shrink-0" />
                                                    <span className="text-xs sm:text-sm font-semibold text-gray-500">
                                                        Assignment {index + 1}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-base sm:text-lg font-bold text-gray-600 mb-2 sm:mb-3 leading-tight">
                                                    {assignment.title}
                                                </h3>

                                                {/* Course and Series Info */}
                                                <div className="text-sm text-gray-500 mb-3">
                                                    <span className="font-medium">{assignment.course.title}</span> • {assignment.series.title}
                                                </div>

                                                {/* Due Date */}
                                                <div className="text-xs text-gray-500 mb-3">
                                                    Due: {formatDate(assignment.due_at)}
                                                </div>

                                                {/* Student Progress */}
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                                                    <div>
                                                        {/* Student Count */}
                                                        <span className="text-xs sm:text-sm text-gray-900">
                                                            {assignment.submission_count}/{assignment.total_students} Students Submitted
                                                        </span>
                                                    </div>

                                                    {/* Status Badge */}
                                                    {getStatusBadge(assignment.submission_count, assignment.total_students)}
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mt-3">
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                                                        <div
                                                            className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {progress}% Complete
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No assignments found
                    </div>
                )}

                {/* Quiz Section */}
                <div className='mt-8 sm:mt-10'>
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-600">Quizzes</h2>
                        <Link href="/admin/assignment-management?tab=quiz">
                            <Button variant="outline" className="text-xs sm:text-sm cursor-pointer">
                                View all
                            </Button>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="space-y-4">
                            <div className="bg-gray-100 animate-pulse rounded-lg h-32"></div>
                        </div>
                    ) : quizzes.length > 0 ? (
                        <div className="grid gap-4 sm:gap-6">
                            {quizzes.map((quiz, index) => {
                                const progress = calculateProgress(quiz.submission_count, quiz.total_students);
                                return (
                                    <div key={quiz.id} className="bg-[#F8FAFB] rounded-lg">
                                        <CardContent className="p-4 sm:p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    {/* Header */}
                                                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                                        <FaClipboardList className="text-gray-400 text-xs sm:text-sm flex-shrink-0" />
                                                        <span className="text-xs sm:text-sm font-semibold text-gray-500">
                                                            Quiz {index + 1}
                                                        </span>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="text-base sm:text-lg font-bold text-gray-600 mb-2 sm:mb-3 leading-tight">
                                                        {quiz.title}
                                                    </h3>

                                                    {/* Course and Series Info */}
                                                    <div className="text-sm text-gray-500 mb-3">
                                                        <span className="font-medium">{quiz.course.title}</span> • {quiz.series.title}
                                                    </div>

                                                    {/* Due Date */}
                                                    <div className="text-xs text-gray-500 mb-3">
                                                        Due: {formatDate(quiz.due_at)}
                                                    </div>

                                                    {/* Student Progress */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                                                        <div>
                                                            {/* Student Count */}
                                                            <span className="text-xs sm:text-sm text-gray-900">
                                                                {quiz.submission_count}/{quiz.total_students} Students Submitted
                                                            </span>
                                                        </div>

                                                        {/* Status Badge */}
                                                        {getStatusBadge(quiz.submission_count, quiz.total_students)}
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="mt-3">
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                                                            <div
                                                                className="bg-green-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {progress}% Complete
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No quizzes found
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
