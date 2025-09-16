'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PaymentsSuccess() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="w-full bg-white rounded-2xl shadow p-8 animate-pulse">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-2/3 h-8 bg-gray-200 rounded mb-4" />
                    <div className="w-full h-4 bg-gray-200 rounded mb-6" />
                    <div className="w-full flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-6/12">
                            <div className="border border-gray-100 rounded-xl p-6 mb-6">
                                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2" />
                                <div className="h-4 bg-gray-200 rounded mb-2 w-1/3" />
                                <div className="h-4 bg-gray-200 rounded mb-2 w-2/3" />
                                <div className="h-4 bg-gray-200 rounded mb-2 w-1/4" />
                                <div className="h-16 bg-gray-200 rounded mb-2" />
                                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2" />
                                <div className="h-4 bg-gray-200 rounded mb-2 w-1/3" />
                                <div className="h-4 bg-gray-200 rounded mb-2 w-1/4" />
                            </div>
                        </div>
                        <div className="w-full lg:w-6/12 flex items-center justify-center">
                            <div className="w-64 h-64 bg-gray-200 rounded" />
                        </div>
                    </div>
                    <div className="flex gap-4 mt-4 max-w-md mx-auto w-full">
                        <div className="flex-1 h-10 bg-gray-200 rounded" />
                        <div className="flex-1 h-10 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="  w-full bg-white rounded-2xl shadow p-8">
            <div className='flex flex-col items-center justify-center '>
                <div className='w-full flex flex-col items-center justify-center gap-4'>
                    <h1 className="text-2xl font-semibold mb-2">Your payment has succeed!</h1>
                    <p className=" text-md mb-6 w-full lg:max-w-6xl text-[#9AA0A6]">
                        Congratulations! 🎉 Your payment has succeeded! Thank you for choosing our courses. Your receipt has been sent to your email for your records. Get ready for a fulfilling learning experience. Happy studying, and feel free to reach out if you need any assistance along the way!
                    </p>
                </div>
                <div className="w-full flex items-center justify-center flex-col lg:flex-row gap-8 ">
                    {/* Left: Receipt */}
                    <div className=" w-full lg:w-6/12 flex flex-col justify-between">
                        <div className="border border-gray-100 rounded-xl p-6 mb-6">
                            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-500 mb-4 font-semibold">
                                <div>Date</div>
                                <div className="text-right">{new Date().toLocaleDateString()}</div>
                                <div>Time</div>
                                <div className="text-right">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                <div>Payment with</div>
                                <div className="text-right">Credit/Debit Card</div>
                                <div>Card number</div>
                                <div className="text-right">1234 **** **** 1345</div>
                            </div>
                            <div className="flex items-center gap-3 border-t pt-4 mb-2">
                                <div className='w-28 h-16'>
                                    <Image src="/images/courses/img.png" alt="course" width={500} height={100} className="rounded-lg object-cover w-full h-full" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-800 text-sm">Master Class: Biblical Studies and Faith Application</div>
                                    <div className="text-xs text-gray-500">16 Modules ・ 41 Videos</div>
                                </div>
                                <div className="font-semibold text-gray-800">$59.5</div>
                            </div>
                            <div className="border-t pt-4 text-sm font-semibold text-gray-500">
                                <div className="flex justify-between mb-1">
                                    <span>Sub Total</span>
                                    <span>$119</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span>Discount (60%)</span>
                                    <span className="text-green-500">$71.4</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span>Service Fee (3%)</span>
                                    <span>$1.4</span>
                                </div>
                                <div className="flex justify-between mt-2 font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-black font-semibold">$49</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right: Illustration */}
                    <div className=" w-full lg:w-6/12 flex items-center justify-center">
                        <Image src="/images/payments/success.png" alt="payment-success" width={1200} height={1200} className='w-fit h-fit object-cover' />
                    </div>
                </div>
                <div className="flex gap-4 mt-4 max-w-lg mx-auto">
                    <Link href="/dashboard" className=" text-center py-2 px-4 rounded-lg border border-[#F1C27D] text-[#F1C27D] font-medium hover:bg-[#F1C27D]/10 transition">Back to Dashboard</Link>
                    <Link href="/my-courses" className=" text-center py-2 px-4 rounded-lg bg-[#F1C27D] text-white font-medium hover:bg-[#F1C27D]/80 transition">Start Learning</Link>
                </div>
            </div>
        </div>
    );
}

