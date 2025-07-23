import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const data = [
    {
        id: 1,
        image: '/images/courses/img.png',
        title: 'Divine Reactions: Unveiling the Kinetics of Creation and the Thermodynamics of Life',
        description: 'Description 1',
        type: 'Christian Theology',
        status: 'Active',
        startDate: '2024-09-01',
        endDate: '2025-01-01',
        progress: 50,
        author: [
            {
                name: 'Jordan Lee',
                designation: 'Scholar of Sacred Sciences',
                description: 'Spiritual Guide',
                image: 'https://picsum.photos/200/300',
            }
        ]
    }
]

export default function MyCourseCard() {
    const course = data[0];
    const author = course.author[0];
    return (
        <div className="w-full bg-white rounded-2xl shadow p-4">
            <Link href="/my-courses">
                {/* Banner Image with Logo */}
                <div className="relative rounded-xl overflow-hidden h-fit mb-4">
                    <Image src={course.image} alt="Course Banner" className="object-cover w-full h-full" width={500} height={500} />
                </div>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">{course.type}</span>

                <div className="font-medium text-[#1D1F2C]/90 text-lg my-2 leading-snug">{course.title}</div>

                <div className="text-gray-400 text-sm mb-3">Started: {new Date(course.startDate).
                    toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>


                <hr className="my-3 border-dotted border-gray-300" />
                <div className="flex items-center gap-3 mt-2">
                    <Image src={author.image} alt={author.name} className="w-10 h-10 rounded-full object-cover border" width={50} height={50} />
                    <div>
                        <div className="font-medium text-sm">{author.name}, {author.designation}</div>
                        <div className="text-xs text-gray-500">{author.description}</div>
                    </div>
                </div>
            </Link>
        </div>
    )
}
