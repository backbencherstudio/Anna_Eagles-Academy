'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGetCheckoutQuery } from '@/rtk/api/users/paymentsApis';

interface PaymentsSuccessProps {
    checkoutId: string;
    paymentIntent?: any;
}

export default function PaymentsSuccess({ checkoutId, paymentIntent }: PaymentsSuccessProps) {
    const { data: checkoutData, isLoading, error } = useGetCheckoutQuery(checkoutId);
    const currentCheckout = checkoutData?.data;

    // If we have payment intent data, we can show success even if checkout fails
    const hasPaymentIntent = paymentIntent && paymentIntent.status === 'succeeded';

    if (isLoading) {
        return (
            <div className="w-full bg-white rounded-2xl shadow p-8">
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F2598] mb-4"></div>
                    <p className="text-gray-500">Loading payment details...</p>
                </div>
            </div>
        );
    }

    // If no checkout data AND no payment intent, show error
    if ((error || !currentCheckout) && !hasPaymentIntent) {
        return (
            <div className="w-full bg-white rounded-2xl shadow p-8">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-semibold mb-2 text-red-600">Payment Information Not Found</h1>
                    <p className="text-md mb-6 text-gray-500">
                        We couldn't find the payment information. Please contact support if you need assistance.
                    </p>
                    <div className="text-xs text-gray-400 mb-4">
                        Checkout ID: {checkoutId}
                    </div>
                    <Link href="/user/dashboard" className="py-2 px-4 rounded-lg bg-[#0F2598] text-white font-medium hover:bg-[#0F2598]/80 transition">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow p-8">
            <div className="flex flex-col items-center justify-center">
                <div className="w-full flex flex-col items-center justify-center gap-4">
                    <h1 className="text-2xl font-semibold mb-2">Payment Successful! 🎉</h1>
                    <p className="text-md mb-6 w-full lg:max-w-6xl text-center text-[#9AA0A6]">
                        Congratulations! Your payment has been processed successfully. Thank you for choosing our courses. Your receipt has been sent to your email.
                    </p>
                </div>
                
                <div className="w-full flex items-center justify-center flex-col lg:flex-row gap-8">
                    {/* Payment Receipt */}
                    <div className="w-full lg:w-6/12">
                        <div className="border border-gray-100 rounded-xl p-6">
                            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-500 mb-4 font-semibold">
                                <div>Date</div>
                                <div className="text-right">{new Date().toLocaleDateString()}</div>
                                <div>Time</div>
                                <div className="text-right">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                <div>Payment Method</div>
                                <div className="text-right">Credit/Debit Card</div>
                                {currentCheckout && (
                                    <>
                                        <div>Checkout ID</div>
                                        <div className="text-right font-mono text-xs">{currentCheckout.id}</div>
                                    </>
                                )}
                                {paymentIntent && (
                                    <>
                                        <div>Payment ID</div>
                                        <div className="text-right font-mono text-xs">{paymentIntent.id}</div>
                                        <div>Status</div>
                                        <div className="text-right text-green-600 font-semibold">{paymentIntent.status}</div>
                                    </>
                                )}
                            </div>
                            
                            {/* Course Details - Show if available */}
                            {currentCheckout ? (
                                <>
                                    <div className="flex items-center gap-3 border-t pt-4 mb-4">
                                        <div className="w-28 h-16">
                                            <Image
                                                src={currentCheckout.series.thumbnail_url}
                                                alt={currentCheckout.series.title}
                                                width={500}
                                                height={100}
                                                className="rounded-lg object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-800 text-sm">{currentCheckout.series.title}</div>
                                            <div className="text-xs text-gray-500">{currentCheckout.series.courses?.length || 0} Courses</div>
                                        </div>
                                        <div className="font-semibold text-gray-800">${currentCheckout.total_price}</div>
                                    </div>
                                    
                                    <div className="border-t pt-4 text-sm font-semibold text-gray-500">
                                        <div className="flex justify-between mb-1">
                                            <span>Sub Total</span>
                                            <span>${currentCheckout.total_price}</span>
                                        </div>
                                        {currentCheckout.applied_code && (
                                            <div className="flex justify-between mb-1">
                                                <span>Discount ({currentCheckout.applied_code.code})</span>
                                                <span className="text-green-500">
                                                    -${(parseFloat(currentCheckout.total_price) - parseFloat(currentCheckout.applied_code.effective_total || currentCheckout.total_price)).toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between mt-2 font-semibold text-lg">
                                            <span>Total Paid</span>
                                            <span className="text-black font-semibold">
                                                ${currentCheckout.applied_code?.effective_total || currentCheckout.total_price}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* Fallback when no checkout data available */
                                <div className="border-t pt-4 text-sm font-semibold text-gray-500">
                                    <div className="flex justify-between mt-2 font-semibold text-lg">
                                        <span>Total Paid</span>
                                        <span className="text-black font-semibold">
                                            ${paymentIntent ? (paymentIntent.amount / 100).toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-2">
                                        Course details will be available in your dashboard
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Success Illustration */}
                    <div className="w-full lg:w-6/12 flex items-center justify-center">
                        <Image 
                            src="/images/payments/success.png" 
                            alt="payment-success" 
                            width={1200} 
                            height={1200} 
                            className="w-fit h-fit object-cover" 
                        />
                    </div>
                </div>
                
                <div className="flex gap-4 mt-6 max-w-lg mx-auto">
                    <Link 
                        href="/user/dashboard" 
                        className="text-center py-2 px-4 rounded-lg border border-[#F1C27D] text-[#F1C27D] font-medium hover:bg-[#F1C27D]/10 transition"
                    >
                        Back to Dashboard
                    </Link>
                    <Link 
                        href="/user/my-courses" 
                        className="text-center py-2 px-4 rounded-lg bg-[#0F2598] text-white font-medium hover:bg-[#0F2598]/80 transition"
                    >
                        Start Learning
                    </Link>
                </div>
            </div>
        </div>
    );
}

