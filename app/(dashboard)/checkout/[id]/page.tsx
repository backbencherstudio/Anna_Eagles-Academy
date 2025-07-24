'use client'
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

interface Course {
    course_id: string;
    course_title: string;
    course_description: string;
    course_price: number;
    total_modules: number;
    total_videos: number;
    course_thumbnail: string;
}

const paymentMethods = [
    { key: 'card', label: 'Credit/Debit Card' },
    { key: 'paypal', label: 'Paypal', icon: '/images/payments/paypal.png' },
    { key: 'gopay', label: 'Gopay', icon: '/images/payments/gopay.png' },
    { key: 'ovo', label: 'OVO', icon: '/images/payments/ovo.png' },
    { key: 'mandiri', label: 'Mandiri', icon: '/images/payments/mandiri.png' },
    { key: 'linkaja', label: 'Link Aja', icon: '/images/payments/linkaja.png' },
];

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [course, setCourse] = useState<Course | null>(null);
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState('');
    const [couponError, setCouponError] = useState('');

    useEffect(() => {
        fetch('/data/CourseData.json')
            .then((res) => res.json())
            .then((data) => {
                if (data.course && data.course.course_id === id) {
                    setCourse(data.course);
                }
            });
    }, [id]);

    const { register } = useForm();

    return (
        <div className="flex flex-col md:flex-row gap-8 w-full  mx-auto ">
            {/* Payment Methods */}
            <div className=" w-full lg:w-7/12">
                <h2 className="text-base font-semibold mb-3">Payment Method</h2>
                {/* Card Method - always visible, not clickable, no border highlight */}
                <div className=" bg-white shadow rounded-xl p-5 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-base">Credit/Debit Card</span>
                        <div className='flex items-center gap-2'>
                            <Image src="/images/payments/mastercard.png" alt="card" width={200} height={100} className='w-10 h-auto' />
                            <Image src="/images/payments/visa.png" alt="card" width={200} height={100} className='w-10 h-auto' />

                        </div>
                    </div>
                    <div className="space-y-5">
                        <div >
                            <label className=" text-sm font-medium mb-1 flex justify-between">Name on Card <span className="text-gray-300 ml-1">*Required</span></label>
                            <Input className="bg-[#F1F3F4] rounded-md border-none" placeholder="Peter Parker" {...register('name')} />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 flex justify-between">Card Number <span className="text-gray-300 ml-1">*Required</span></label>
                            <Input className="bg-[#F1F3F4] rounded-md border-none" placeholder="1234 5678 9012 1345" {...register('cardNumber')} />
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-sm font-medium mb-1 flex justify-between">Expiry Date <span className="text-gray-300 ml-1">*Required</span></label>
                                <Input className="bg-[#F1F3F4] rounded-md border-none" placeholder="08/29" {...register('expiry')} />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm font-medium mb-1 flex justify-between">CVC/CVV <span className="text-gray-300 ml-1">*Required</span></label>
                                <Input className="bg-[#F1F3F4] rounded-md border-none" placeholder="123" {...register('cvc')} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other Methods */}
                {paymentMethods.slice(1).map((method) => (
                    <div
                        key={method.key}
                        className={`flex items-center justify-between bg-white shadow rounded-xl px-5 py-4 mb-3 cursor-pointer border ${selectedMethod === method.key ? 'border-yellow-400' : 'border-transparent'}`}
                        onClick={() => setSelectedMethod(method.key)}
                    >
                        <span className="font-medium text-base">{method.label}</span>
                        {/* Replace with real icons */}
                        <Image width={200} height={200} src={method.icon || ''} alt={method.label} className="w-10 h-10 object-contain" />
                    </div>
                ))}
            </div>

            {/* Order Details (unchanged) */}
            <div className="w-full lg:w-5/12 ">
                <h2 className="text-base font-semibold mb-3">Order Details</h2>
                {course ? (
                    <div className=''>
                        <div className="flex gap-4 items-center mb-4 bg-white shadow rounded-xl p-5">
                            <Image width={200} height={200} src={course.course_thumbnail} alt="thumbnail" className="w-20 h-20 rounded-lg object-cover" />
                            <div>
                                <div className="font-semibold">{course.course_title}</div>
                                <div className="text-xs text-gray-500">{course.total_modules} Modules • {course.total_videos} Videos</div>
                                <div className="font-bold text-lg mt-1">${course.course_price}</div>
                            </div>
                        </div>
                        <div className="bg-white shadow rounded-xl p-5 mb-4">
                            <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                                {/* Coupon Icon */}
                                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6M15 10v4a2 2 0 002 2h4M9 10v4a2 2 0 01-2 2H3" />
                                </svg>
                                Coupon
                            </div>
                            {appliedCoupon ? (
                                <>
                                    <div className="flex items-center justify-between bg-white shadow rounded-lg px-4 py-2 mb-1">
                                        <div className="flex items-center gap-2">
                                            {/* Coupon Icon */}
                                            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6M15 10v4a2 2 0 002 2h4M9 10v4a2 2 0 01-2 2H3" />
                                            </svg>
                                            <span className="font-mono text-gray-700 text-base tracking-wider">{appliedCoupon}</span>
                                        </div>
                                        <span className="bg-green-100 rounded-full p-1 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="text-xs text-yellow-500 mt-2 font-medium">You saved 60% on this purchase, Hoorayy!</div>
                                </>
                            ) : (
                                <form
                                    onSubmit={e => {
                                        e.preventDefault();
                                        if (couponInput.trim().toUpperCase() === 'SUNDAY60URSE%') {
                                            setAppliedCoupon('SUNDAY60URSE%');
                                            setCouponError('');
                                        } else {
                                            setCouponError('Invalid coupon code');
                                        }
                                    }}
                                    className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-yellow-400 transition-all"
                                >
                                    <Input
                                        className="bg-transparent px-2 py-1 rounded w-full border-none focus:ring-0 text-sm"
                                        placeholder="Enter coupon"
                                        value={couponInput}
                                        onChange={e => setCouponInput(e.target.value)}
                                        disabled={!!appliedCoupon}
                                    />
                                    <Button
                                        type="submit"
                                        className="ml-2 px-3 py-1 text-xs rounded bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-sm transition-all duration-150"
                                        style={{ minWidth: '60px' }}
                                        disabled={!!appliedCoupon}
                                    >
                                        Apply
                                    </Button>
                                    {couponError && <span className="text-xs text-red-500 ml-2 font-medium">{couponError}</span>}
                                </form>
                            )}
                        </div>
                        {/* sub total */}
                        <div className="flex flex-col gap-2 bg-white shadow rounded-xl p-5">
                            <div className="flex justify-between items-center text-gray-500 text-base mb-1">
                                <span>Sub Total</span>
                                <span>${course.course_price}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between items-center text-gray-500 text-base mb-1">
                                    <span>Discount (60%)</span>
                                    <span className="font-semibold text-green-500">${(course.course_price * 0.6).toFixed(2)}</span>
                                </div>
                            )}
                            <hr className="my-2 border-gray-200" />
                            <div className="flex justify-between items-center mt-1">
                                <span className="font-semibold text-base">Total</span>
                                <span className="font-semibold text-xl text-black">${(appliedCoupon ? (course.course_price * 0.4) : course.course_price).toFixed(0)}</span>
                            </div>
                        </div>
                        {/* terms and conditions */}
                        <div className="flex items-center gap-3 mt-6">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 cursor-pointer rounded border-2 border-[#F1C27D] text-[#F1C27D] focus:ring-[#F1C27D] focus:ring-2 checked:bg-yellow-50 checked:border-[#F1C27D] checked:text-[#F1C27D] transition-all duration-150"
                                style={{ accentColor: '#F1C27D' }}
                            />
                            <label htmlFor="terms" className="text-base text-gray-500 select-none">
                                By clicking this, you are agree to our
                                <Link href="#" className="font-semibold text-[#F1C27D] ml-1 hover:underline" style={{ textDecoration: 'none' }}>Terms of Services</Link>
                                and
                                <Link href="#" className="font-semibold text-[#F1C27D] ml-1 hover:underline" style={{ textDecoration: 'none' }}>Privacy Policy</Link>.
                            </label>
                        </div>
                        <Button className="w-full cursor-pointer mt-6 py-6 bg-[#F1C27D] hover:bg-[#F1C27D]/80 text-white font-semibold text-lg">Pay</Button>
                    </div>
                ) : (
                    <div className="animate-pulse space-y-6">
                        {/* Course Card Skeleton */}
                        <div className="flex gap-4 items-center mb-4 bg-white shadow rounded-xl p-5">
                            <div className="w-20 h-20 rounded-lg bg-gray-200" />
                            <div className="flex-1 space-y-2">
                                <div className="h-5 w-2/3 bg-gray-200 rounded" />
                                <div className="h-3 w-1/2 bg-gray-200 rounded" />
                                <div className="h-6 w-20 bg-gray-200 rounded mt-2" />
                            </div>
                        </div>
                        {/* Coupon Skeleton */}
                        <div className="bg-white shadow rounded-xl p-5 mb-4 flex items-center gap-3">
                            <div className="w-5 h-5 bg-gray-200 rounded" />
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                        </div>
                        {/* Subtotal Skeleton */}
                        <div className="flex flex-col gap-2 bg-white shadow rounded-xl p-5">
                            <div className="flex justify-between items-center mb-1">
                                <div className="h-4 w-24 bg-gray-200 rounded" />
                                <div className="h-4 w-12 bg-gray-200 rounded" />
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <div className="h-4 w-24 bg-gray-200 rounded" />
                                <div className="h-4 w-12 bg-gray-200 rounded" />
                            </div>
                            <hr className="my-2 border-gray-200" />
                            <div className="flex justify-between items-center mt-1">
                                <div className="h-5 w-16 bg-gray-200 rounded" />
                                <div className="h-6 w-16 bg-gray-200 rounded" />
                            </div>
                        </div>
                        {/* Terms and Pay Button Skeleton */}
                        <div className="flex items-center gap-3 mt-6">
                            <div className="w-4 h-4 bg-gray-200 rounded" />
                            <div className="h-4 w-48 bg-gray-200 rounded" />
                        </div>
                        <div className="w-full h-12 bg-gray-200 rounded-lg mt-6" />
                    </div>
                )}
            </div>
        </div>
    );
}
