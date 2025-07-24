"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { PiCheckCircleLight, PiBookOpenTextFill } from "react-icons/pi";

function CourseSkeleton() {
    return (
        <div className="flex flex-col xl:flex-row gap-8 px-1 animate-pulse">
            {/* Left Side Skeleton */}
            <div className="flex-1 w-full xl:w-9/12">
                <div className="bg-white rounded-2xl shadow p-6">
                    <div className="h-7 w-2/3 bg-gray-200 rounded mb-4" />
                    <div className="w-full h-72 bg-gray-200 rounded-2xl mb-6" />
                    <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                    <div className="border-b border-gray-200 mb-4" />
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-5/6 bg-gray-200 rounded" />
                        <div className="h-4 w-2/3 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
            {/* Right Side Skeleton */}
            <div className="w-full xl:w-3/12 flex flex-col gap-6">
                <div className="bg-white rounded-2xl shadow p-6">
                    <div className="h-5 w-24 bg-gray-200 rounded mb-4" />
                    <div className="bg-gray-100 rounded-xl flex flex-col items-center py-6 mb-4">
                        <div className="h-8 w-8 bg-gray-200 rounded-full mb-2" />
                        <div className="h-5 w-12 bg-gray-200 rounded mb-1" />
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>
                    <div className="bg-gray-100 rounded-xl flex flex-col items-center py-6 mb-4">
                        <div className="h-8 w-8 bg-gray-200 rounded-full mb-2" />
                        <div className="h-5 w-12 bg-gray-200 rounded mb-1" />
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="h-4 w-12 bg-gray-200 rounded" />
                        <div className="h-5 w-16 bg-gray-200 rounded" />
                    </div>
                    <div className="h-10 w-full bg-gray-200 rounded-xl" />
                </div>
                <div className="bg-white rounded-2xl shadow p-6">
                    <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="h-4 w-6 bg-gray-200 rounded" />
                                <div className="h-4 w-32 bg-gray-200 rounded flex-1" />
                                <div className="h-4 w-4 bg-gray-200 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DiscoverCourses() {
    const [course, setCourse] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        fetch("/data/CourseData.json")
            .then((res) => res.json())
            .then((data) => setCourse(data.course));
    }, []);



    const paragraphs = course?.course_description
        .split(/(?=🙏|🌟)/g)
        .map((p: string) => p.trim());

    if (!course) {
        return <CourseSkeleton />;
    }

    // handle buy now button
    const handleBuyNow = () => {
        router.push(`/checkout/${course?.course_id}`);
    }

    return (
        <div className="flex flex-col xl:flex-row gap-8 px-1  ">
            {/* Left Side */}
            <div className="flex-1 w-full xl:w-9/12">
                <div className="bg-white rounded-2xl shadow p-6">
                    <h1 className="text-xl md:text-2xl font-medium mb-4">
                        Master Class: {course?.course_title}
                    </h1>
                    {course?.course_thumbnail && course?.course_title && (
                        <Image
                            src={course.course_thumbnail}
                            alt={course.course_title}
                            className="w-full  object-cover rounded-2xl mb-6"
                            width={1000}
                            height={1000}
                            priority
                        />
                    )}
                    <div className="mb-6">
                        <div className="text-[#F1C27D] font-semibold text-xl mb-2">
                            Course Overview
                        </div>
                        <div className="flex items-center">
                            <div className="h-0.5 bg-[#F1C27D] rounded-l-full w-40" />
                            <div className="h-0.5 bg-gray-200 rounded-r-full flex-1" />
                        </div>
                    </div>
                    <div className="space-y-4 text-gray-700 text-base">
                        {paragraphs?.map((p: string, idx: number) => (
                            <p key={idx}>{p}</p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full xl:w-3/12 flex flex-col gap-6">
                {/* Overview Card */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <div className="font-semibold text-lg mb-4">Overview</div>
                    <div className="bg-[#FEF9F2] rounded-xl flex flex-col items-center py-2 mb-4">
                        <PiBookOpenTextFill className="text-2xl text-[#F1C27D] mb-1" />
                        <div className="flex gap-1 items-center">
                            <span className="text-xl font-semibold">{course?.total_modules}</span>
                            <span className="text-gray-400 text-base mt-1">Modules</span>
                        </div>
                    </div>
                    <div className="bg-[#FEF9F2] rounded-xl flex flex-col items-center py-2 mb-4">
                        <FaPlayCircle className="text-2xl text-[#F1C27D] mb-1" />
                        <div className="flex gap-1 items-center">
                            <span className="text-xl font-semibold">{course?.total_videos}</span>
                            <span className="text-gray-400 text-base mt-1">Videos</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500">Price</span>
                        <span className="text-[#F1C27D] text-xl font-bold">${course?.course_price.toFixed(2)}</span>
                    </div>
                    <button onClick={handleBuyNow} className="w-full cursor-pointer bg-[#F1C27D] hover:bg-[#F1C27D]/80 text-white font-bold py-2 rounded-xl transition">
                        Buy Now
                    </button>
                </div>
                {/* Modules List */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <div className="font-semibold mb-4 text-lg">Course Modules</div>
                    <ul className="space-y-2">
                        {course?.modules.map((mod: any, idx: number) => (
                            <li key={mod?.module_id} className="flex items-center gap-2">
                                <span className="text-gray-400 font-mono w-6 text-right">{String(idx + 1).padStart(2, "0")}</span>
                                <span className="flex-1 text-gray-700">{mod?.module_title}</span>
                                <PiCheckCircleLight className="text-xl text-gray-400" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
