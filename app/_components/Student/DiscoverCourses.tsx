"use client"
import { Button } from "@/components/ui/button";
import { Loader2, Clock, Briefcase, Play, Music, FileText, Video, Search, Users, Calendar } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


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
    const [isLoading, setIsLoading] = useState(false);
    const [discountCode, setDiscountCode] = useState("");

    useEffect(() => {
        fetch("/data/CourseData.json")
            .then((res) => res.json())
            .then((data) => {
                if (data && data.course) {
                    setCourse(data.course);
                }
            })
            .catch((error) => {
                console.error("Error fetching course data:", error);
            });
    }, []);



    const paragraphs = course?.course_description
        .split(/(?=🙏|🌟)/g)
        .map((p: string) => p.trim());

    if (!course) {
        return <CourseSkeleton />;
    }

    // handle buy now button time out
    const handleBuyNow = () => {
        setIsLoading(true);

        setTimeout(() => {
            router.push(`/user/checkout/${course.course_id}`);
            setIsLoading(false);
        }, 1000);
    }

    // handle discount code apply
    const handleApplyCode = () => {
        // Add your discount code logic here
        console.log("Applying discount code:", discountCode);
    }

    return (
        <div className="flex flex-col xl:flex-row gap-8 px-1  ">
            {/* Left Side */}
            <div className="flex-1 w-full xl:w-9/12">
                <div className="bg-white rounded-2xl p-6">
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
                {/* Course Card */}
                <div className="bg-white rounded-2xl  overflow-hidden ">
                    {/* Course Image with Title Overlay */}
                    <div className=" aspect-video p-4">
                        {course?.course_thumbnail && (
                            <Image
                                src={course.course_thumbnail}
                                alt={course.course_title || "Course"}
                                className="w-full h-full object-cover rounded-2xl"
                                width={400}
                                height={192}
                                priority
                            />
                        )}

                    </div>

                    {/* Price and Enroll Button */}
                    <div className="px-4 mt-2">
                        <div className="text-3xl font-bold text-gray-900 mb-4">
                            ${course?.course_price.toFixed(1)}
                        </div>
                        <Button
                            disabled={isLoading}
                            onClick={handleBuyNow}
                            className="w-full cursor-pointer bg-[#0F2598] hover:bg-[#0F2598]/80 text-white font-bold py-5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin h-5 w-5" />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                "Enroll Now"
                            )}
                        </Button>
                    </div>

                    {/* Course Details */}
                    <div className="px-6 py-4">
                        <h4 className="font-medium text-[#070707] text-base lg:text-lg mb-4">What's in this course</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-[#1D1F2C]" />
                                <span className="text-[#1D1F2C] text-sm">Total Time 6hr 10min 2sec</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Briefcase className="h-4 w-4 text-[#1D1F2C]" />
                                <span className="text-[#1D1F2C] text-sm">3 Course</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Play className="h-4 w-4 text-[#1D1F2C]" />
                                <span className="text-[#1D1F2C] text-sm">24 Videos</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Music className="h-4 w-4 text-[#1D1F2C]" />
                                <span className="text-[#1D1F2C] text-sm">4 Audios</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-[#1D1F2C]" />
                                <span className="text-[#1D1F2C] text-sm">8 Doc File</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Video className="h-4 w-4 text-[#1D1F2C]" />
                                <span className="text-[#1D1F2C] text-sm">Video-only version available</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Search className="h-4 w-4 text-[#AD0AFD]" />
                                <span className="text-[#AD0AFD] text-sm">Bootcamp Type Course</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="h-4 w-4 text-[#1D1F2C]" />
                                <span className="text-[#1D1F2C] text-sm">12 Seat Left</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-[#1D1F2C]" />
                                <span className="text-[#1D1F2C] text-sm">Start: 2024-09-01 | End: 2024-12-01</span>
                            </div>
                        </div>
                    </div>

                    {/* Discount Code Section */}
                    <div className="px-6 pb-6">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Apply Code"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                className="flex-1 border border-dashed border-[#D2D2D5] px-3 py-2  bg-[#F6F8FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2598] focus:border-transparent"
                            />
                            <Button
                                onClick={handleApplyCode}
                                className="px-4 cursor-pointer py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>

                    {/* Financial Hardship Section */}
                    <div className="px-6 pb-6">
                        <div className="bg-pink-50 rounded-lg p-4">
                            <p className="text-sm text-[#1D1F2C] mb-2 text-center">
                                If you're unable to enroll in any of the courses due to financial hardship, please email
                            </p>
                            <a
                                href="mailto:info@thewhiteeaglesacademy@gmail.com"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                <span className="text-[#1D1F2C]">info</span> @thewhiteeaglesacademy@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
