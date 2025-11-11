"use client"
import { Button } from "@/components/ui/button";
import { Loader2, Clock, Briefcase, Play, Music, FileText, Video, Search, Users, Calendar } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useGetSingleCourseListQuery } from '@/rtk/api/users/allCourseListApis';
import { useCheckoutMutation } from '@/rtk/api/users/paymentsApis';
import { useDispatch } from 'react-redux';
import { setCheckoutData, setLoading, setError } from '@/rtk/slices/users/paymentsSlice';


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

interface CourseData {
    id: string
    title: string
    description: string
    thumbnail_url: string
    total_price: string
    total_time: string
    course_type: string
    seats_left: number
    start_date: string
    end_date: string
    courses: Array<{
        title: string
        price: string
        lesson_files: Array<{
            id: string
            title: string
            kind: string
        }>
    }>
    counts: {
        courses: number
        videos: number
        audios: number
        docs: number
        lessons: number
    }
}

interface DiscoverCoursesProps {
    courseId?: string
    courseData?: CourseData
}

export default function DiscoverCourses({ courseId, courseData }: DiscoverCoursesProps) {
    const [course, setCourse] = useState<CourseData | null>(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [checkout, { isLoading: checkoutLoading }] = useCheckoutMutation();


    // Use API query if courseId is provided
    const { data: apiData, isLoading: apiLoading, error } = useGetSingleCourseListQuery(
        courseId || '',
        { skip: !courseId }
    );

    useEffect(() => {
        if (courseData) {
            // Use the passed course data
            setCourse(courseData);
        } else if (apiData?.success && apiData?.data) {
            // Use API data
            setCourse(apiData.data);
        } else if (error) {
            console.error("API Error:", error);
        }
    }, [courseData, apiData, courseId, error]);



    const paragraphs = course?.description
        ?.split(/(?=🙏|🌟)/g)
        ?.map((p: string) => p.trim()) || [course?.description || ''];

    if (apiLoading) {
        return <CourseSkeleton />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-600 mb-4">Course not found</h2>
                    <p className="text-gray-500 mb-6">The course you're looking for doesn't exist or has been removed.</p>
                    <Button onClick={() => router.push('/user/discover')}>
                        Back to Courses
                    </Button>
                </div>
            </div>
        );
    }

    if (!course) {
        return <CourseSkeleton />;
    }

    // handle buy now button - create checkout
    const handleBuyNow = async () => {
        if (!course?.id) {
            dispatch(setError('Course ID not found'));
            return;
        }

        setIsLoading(true);
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const result = await checkout({ series_id: course.id }).unwrap();

            if (result.success && result.data) {
                dispatch(setCheckoutData(result.data));
                router.push(`/user/checkout/${result.data.id}`);
            } else {
                dispatch(setError('Failed to create checkout'));
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            dispatch(setError(error?.data?.message || 'Failed to create checkout'));
        } finally {
            setIsLoading(false);
            dispatch(setLoading(false));
        }
    }


    return (
        <div className="flex flex-col xl:flex-row gap-8 px-1">
            {/* Left Side */}
            <div className="flex-1 w-full xl:w-9/12">
                <div className="bg-white rounded-2xl p-6">
                    <h1 className="text-xl md:text-2xl font-medium mb-4">
                        {course?.title}
                    </h1>
                    {course?.thumbnail_url && course?.title && (
                        <Image
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full object-cover rounded-2xl mb-6"
                            width={500}
                            height={500}
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
                <div className="bg-white rounded-2xl overflow-hidden py-4">
                    {/* Course Details */}
                    <div className="px-6">
                        <h4 className="font-medium text-[#070707] text-base lg:text-lg mb-4">What's in this course</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-[#1D1F2C]" />
                                <span className="text-[#1D1F2C] text-sm">Total Time: {course?.total_time || '6hr 10min'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Briefcase className="h-4 w-4 text-[#1D1F2C]" />
                                <span className="text-[#1D1F2C] text-sm">{course?.counts?.courses || 0} Courses</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Play className="h-4 w-4 text-[#1D1F2C]" />
                                <span className="text-[#1D1F2C] text-sm">{course?.counts?.videos || 0} Videos</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Music className="h-4 w-4 text-[#1D1F2C]" />
                                <span className="text-[#1D1F2C] text-sm">{course?.counts?.audios || 0} Audios</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-[#1D1F2C]" />
                                <span className="text-[#1D1F2C] text-sm">{course?.counts?.docs || 0} Documents</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Video className="h-4 w-4 text-[#1D1F2C]" />
                                <span className="text-[#1D1F2C] text-sm">{course?.counts?.lessons || 0} Lessons</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Search className="h-4 w-4 text-[#AD0AFD]" />
                                <span className="text-[#AD0AFD] text-sm">{course?.course_type?.charAt(0).toUpperCase() + course?.course_type?.slice(1)}</span>
                            </div>
                            {typeof course?.seats_left === 'number' && course.seats_left >= 0 && (
                                <div className="flex items-center gap-3">
                                    <Users className="h-4 w-4 text-[#1D1F2C]" />
                                    <span className="text-[#1D1F2C] text-sm">{course.seats_left} Seats Left</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-[#1D1F2C]" />
                                <span className="text-[#1D1F2C] text-sm">Start: {course?.start_date ? new Date(course.start_date).toLocaleDateString() : 'N/A'} | End: {course?.end_date ? new Date(course.end_date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Price and Enroll Button */}
                    <div className="px-4">
                        <div className="text-2xl font-medium mb-4 mt-4">
                            Price: <span className="font-medium text-[#070707]">${course?.total_price}</span>
                        </div>
                        <Button
                            disabled={isLoading || checkoutLoading}
                            onClick={handleBuyNow}
                            className="w-full cursor-pointer bg-[#0F2598] hover:bg-[#0F2598]/80 text-white font-bold py-5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {(isLoading || checkoutLoading) ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin h-5 w-5" />
                                    <span>Preparing Checkout...</span>
                                </div>
                            ) : (
                                "Enroll Now"
                            )}
                        </Button>
                    </div>

                    {/* Financial Hardship Section */}
                    <div className="px-6 mt-4">
                        <div className="bg-pink-50 rounded-lg p-4">
                            <p className="text-xs text-[#1D1F2C] mb-2 text-center">
                                If you're unable to enroll in any of the courses due to financial hardship, please email
                            </p>
                            <a
                                href="mailto:info@thewhiteeaglesacademy@gmail.com"
                                className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                                <span className="text-[#1D1F2C]">email:</span>
                                <span className="text-blue-600 ms-1 hover:text-blue-800 text-xs underline">thewhiteeaglesacademy@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
