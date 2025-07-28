import React from 'react'
import { CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { FaGraduationCap, FaPlay } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'

// Mock data for assignments
const assignments = [
    {
        id: 1,
        number: 3,
        title: "Stoichiometry and Chemical Quantities",
        description: "This task explores the relationships between reactants and products in chemical reactions. Students will use balanced equations to calculate quantities in moles, mass, and volume.",
        students: [
            { name: "Rahul", color: "bg-yellow-400" },
            { name: "Kavya", color: "bg-pink-400" },
            { name: "Gaurav", color: "bg-blue-600" }
        ],
        completedCount: 20,
        totalCount: 34,
        progress: 60,
        status: "in-progress"
    },
    {
        id: 2,
        number: 2,
        title: "Acids, Bases, and pH Relationships",
        description: "This task explores the properties of acids, bases, and their pH levels. Students will classify substances and examine how pH influences reactions.",
        students: [
            { name: "Divya", color: "bg-blue-600" },
            { name: "Esha", color: "bg-pink-400" },
            { name: "Lakshmi", color: "bg-amber-600" }
        ],
        completedCount: 34,
        totalCount: 34,
        progress: 100,
        status: "completed"
    }
]

// Mock data for ongoing course
const ongoingCourse = {
    id: 1,
    title: "Divine Reactions: Unveiling the Kinetics of Creation and the Thermodynamics of Life",
    startDate: "1 September 2024",
    thumbnail: "/images/courses/img2.png",
    videoTitle: "The Barrier of Bitterness",
    videoType: "SERMON"
}



export default function AssignmentOverviewDashaboard() {
    return (
        <div className="space-y-6 lg:space-y-8">
            {/* Assignment Section */}
            <div className='bg-white rounded-lg p-4 sm:p-6'>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-600">Assignment</h2>
                    <Link href="/create-assignments">
                        <Button variant="outline" className="text-xs sm:text-sm cursor-pointer">
                            View all
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 sm:gap-6">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className="bg-[#F8FAFB] rounded-lg">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        {/* Header */}
                                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                            <FaGraduationCap className="text-gray-400 text-xs sm:text-sm flex-shrink-0" />
                                            <span className="text-xs sm:text-sm font-semibold text-gray-500">Assignment {assignment.number}</span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-base sm:text-lg font-bold text-gray-600 mb-2 sm:mb-3 leading-tight">
                                            {assignment.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-500 mb-3 sm:mb-4 leading-relaxed">
                                            {assignment.description}
                                        </p>

                                        {/* Student Progress */}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                                            <div>
                                                {/* Student Avatars */}
                                                <div className="flex -space-x-2">
                                                    {assignment.students.map((student, index) => (
                                                        <Avatar key={index} className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white">
                                                            <AvatarFallback className={`${student.color} text-white text-xs sm:text-sm font-medium`}>
                                                                {student.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                </div>

                                                {/* Student Count */}
                                                <span className="text-xs sm:text-sm text-gray-900">
                                                    {assignment.completedCount}/{assignment.totalCount} Students
                                                </span>
                                            </div>

                                            {/* Completed Badge */}
                                            {assignment.status === "completed" && (
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full self-start sm:self-auto">
                                                    Completed!
                                                </span>
                                            )}
                                        </div>

                                        {/* Progress Bar */}
                                        {assignment.status === "in-progress" && (
                                            <div className="mt-3">
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                                                    <div
                                                        className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${assignment.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    ))}
                </div>

                {/* Ongoing Course Section */}
                <div className='mt-8 sm:mt-10'>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-600 mb-3 sm:mb-4">Ongoing Course</h2>

                    <div className="bg-[#F8FAFB] rounded-xl p-4 sm:p-6 border border-gray-200">

                        <div >
                            <Image
                                src={ongoingCourse.thumbnail}
                                alt="Course thumbnail"
                                width={500}
                                height={300}
                                className="object-cover w-full h-auto rounded-lg"
                            />
                        </div>

                        {/* Course Info */}
                        <div className="mt-4">
                            <h3 className="text-sm sm:text-md lg:text-lg font-semibold text-gray-600 mb-2 leading-tight">
                                {ongoingCourse.title}
                            </h3>
                            <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Started: {ongoingCourse.startDate}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
