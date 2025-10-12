'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useApplyCouponMutation, useGetCheckoutQuery } from '@/rtk/api/users/paymentsApis';
import { setAppliedCoupon, setCouponDiscount, setError } from '@/rtk/slices/users/paymentsSlice';
import { RootState } from '@/rtk';
import StripePaymentForm from '@/components/StripePaymentForm';
import toast from 'react-hot-toast';

interface Course {
    id: string;
    title: string;
    price: string;
    is_scholarship: boolean;
    display_price: string | number;
}

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [couponInput, setCouponInput] = useState('');
    const [couponError, setCouponError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [cardComplete, setCardComplete] = useState(false);
    const router = useRouter();

    // Redux state and actions
    const dispatch = useDispatch();
    const { appliedCoupon, couponDiscount } = useSelector((state: RootState) => state.payments);

    // API queries and mutations
    const { data: checkoutData, isLoading: checkoutLoading, error: checkoutError } = useGetCheckoutQuery(id);
    const [applyCoupon, { isLoading: couponLoading }] = useApplyCouponMutation();

    // Get the checkout data directly
    const currentCheckout = checkoutData?.data;


    const handleStripePaymentSuccess = (paymentIntent: any) => {
        router.push(`/user/payment-success/${currentCheckout?.id}`);
    };

    const handleStripePaymentError = (error: string) => {
        dispatch(setError(error));
    };

    const handleCoupon = async () => {
        if (!currentCheckout?.id) {
            dispatch(setError('Checkout data not found'));
            return;
        }

        if (!couponInput.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        try {
            const result = await applyCoupon({
                checkout_id: currentCheckout.id,
                code: couponInput.trim()
            }).unwrap();

            if (result.success) {
                dispatch(setAppliedCoupon(couponInput.trim()));
                // Calculate discount properly
                const originalPrice = parseFloat(currentCheckout.total_price);
                const effectiveTotal = parseFloat(result.data.effective_total || result.data.total || currentCheckout.total_price);
                const discount = originalPrice - effectiveTotal;
                dispatch(setCouponDiscount(Math.max(0, discount))); 
                
                // Show success toast
                toast.success(result.message || 'Coupon applied successfully!');
                setCouponInput(''); 
                setCouponError('');
            } else {
                const errorMessage = result.message?.message || result.message || 'Invalid coupon code';
                toast.error(errorMessage);
                setCouponError(errorMessage);
            }
        } catch (error: any) {
            const errorMessage = error?.data?.message?.message || error?.data?.message || error?.message || 'Invalid coupon code';
            toast.error(errorMessage);
            setCouponError(errorMessage);
        }
    }

    // Loading state
    // if (checkoutLoading) {
    //     return (
    //         <div className="flex items-center justify-center h-screen">
    //             <div className="text-center">
    //                 <Loader2 className="animate-spin w-8 h-8 mx-auto mb-4" />
    //                 <p>Loading checkout data...</p>
    //             </div>
    //         </div>
    //     );
    // }

    // Error state
    if (checkoutError || !currentCheckout) {
        return (
            <div className="flex items-center justify-center ">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-600 mb-4">Checkout not found</h2>
                    <p className="text-gray-500 mb-6">
                        {checkoutError ? 'Error loading checkout data' : 'The checkout you\'re looking for doesn\'t exist or has been removed.'}
                    </p>
                    <Button onClick={() => router.push('/user/discover')}>
                        Back to Courses
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full mx-auto">

            {/* Payment Methods */}
            <div className=" w-full lg:w-7/12">
                <h2 className="text-base font-semibold mb-3">Payment Method</h2>
                {/* Stripe Payment Form */}
                <div className="bg-white shadow rounded-xl p-5 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-base">Credit/Debit Card</span>
                        <div className='flex items-center gap-2'>
                            <Image src="/images/payments/mastercard.png" alt="card" width={200} height={100} className='w-10 h-auto' />
                            <Image src="/images/payments/visa.png" alt="card" width={200} height={100} className='w-10 h-auto' />
                        </div>
                    </div>

                    {currentCheckout && (
                        <StripePaymentForm
                            checkoutId={currentCheckout.id}
                            amount={parseFloat(currentCheckout.total_price) - (couponDiscount || 0)}
                            onPaymentSuccess={handleStripePaymentSuccess}
                            onPaymentError={handleStripePaymentError}
                            isLoading={false}
                            onProcessingChange={setIsProcessing}
                            onCardCompleteChange={setCardComplete}
                        />
                    )}
                </div>
            </div>

            {/* Order Details */}
            <div className="w-full lg:w-5/12 ">
                <h2 className="text-base font-semibold mb-3">Order Details</h2>
                <div>

                    {/* Course Series */}
                    <div className="bg-white shadow rounded-xl p-5 mb-4">
                        <div className="flex gap-4 items-center mb-4">
                            <Image
                                width={200}
                                height={200}
                                src={currentCheckout.series.thumbnail_url}
                                alt={currentCheckout.series.title}
                                className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div>
                                <div className="font-semibold">{currentCheckout.series.title}</div>
                                <div className="text-xs text-gray-500">Course Series</div>
                                <div className="font-bold text-lg mt-1">${currentCheckout.total_price}</div>
                            </div>
                        </div>

                        {/* Course List */}
                        <div className="mt-4">
                            <div className="text-sm text-gray-500 mb-3">Each course has a different price</div>
                            <div className="relative">
                                {/* Vertical line */}
                                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-blue-200 to-blue-100"></div>

                                <div className="space-y-4">
                                    {currentCheckout.series.courses.map((course: Course, index: number) => {
                                        const isScholarshipCourse = currentCheckout.applied_code?.courses?.some(
                                            (appliedCourse: { id: string; title: string }) => appliedCourse.id === course.id
                                        );
                                        const isFree = course.is_scholarship || isScholarshipCourse;

                                        return (
                                            <div key={course.id} className="relative flex items-center">
                                                <div className={`relative z-10 w-6 h-6 rounded-full border flex items-center justify-center ${isFree ? 'bg-gray-100 border-blue-400' : 'bg-gray-300 border-gray-500'
                                                    }`}>
                                                    <span className={`font-bold text-sm ${isFree ? 'text-blue-700 font-semibold' : 'text-gray-400'
                                                        }`}>{index + 1}</span>
                                                </div>

                                                <div className={`absolute left-3 top-1/2 w-4 h-0.5 transform -translate-y-1/2 ${isFree ? 'bg-blue-500' : 'bg-gray-500'
                                                    }`}></div>

                                                <div className="ml-8 flex-1 flex items-center justify-between">
                                                    <div className={`text-sm ${isFree ? 'text-gray-700 font-semibold' : 'text-gray-500'
                                                        }`}>
                                                        {course.title}
                                                    </div>
                                                    <div className={` ${isFree ? 'text-green-500' : 'text-gray-500'
                                                        }`}>
                                                        {isFree ? 'Free' : `$${course.price}`}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
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
                        {appliedCoupon || currentCheckout.applied_code ? (
                            <>
                                <div className="flex items-center justify-between bg-white shadow rounded-lg px-4 py-2 mb-1">
                                    <div className="flex items-center gap-2">
                                        {/* Coupon Icon */}
                                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6M15 10v4a2 2 0 002 2h4M9 10v4a2 2 0 01-2 2H3" />
                                        </svg>
                                        <span className="font-mono text-gray-700 text-base tracking-wider">
                                            {appliedCoupon || currentCheckout.applied_code?.code}
                                        </span>
                                    </div>
                                    <span className="bg-green-100 rounded-full p-1 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                </div>
                                <div className="text-xs text-yellow-500 mt-2 font-medium">
                                    Code Applied: {appliedCoupon || currentCheckout.applied_code?.code}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <form
                                    onSubmit={e => { e.preventDefault(); handleCoupon(); }}
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
                                        className="ml-2 px-3 cursor-pointer py-1 text-xs rounded bg-[#F1C27D] hover:bg-[#F1C27D]/80 text-white font-semibold shadow-sm transition-all duration-150"
                                        style={{ minWidth: '60px' }}
                                        disabled={!!appliedCoupon || couponLoading || couponInput.trim() === ""}
                                    >
                                        {couponLoading ? <div className='flex items-center gap-2'>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Applying...</span>
                                        </div> : 'Apply'}
                                    </Button>
                                </form>
                                {couponError && (
                                    <div className={`text-xs font-medium px-1 ${couponError.includes('success') || couponError.includes('applied')
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                        }`}>
                                        {couponError}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {/* sub total */}
                    <div className="flex flex-col gap-2 bg-white shadow rounded-xl p-5">
                        <div className="flex justify-between items-center text-gray-500 text-base mb-1">
                            <span>Sub Total</span>
                            <span>${currentCheckout.total_price}</span>
                        </div>
                        {appliedCoupon && (
                            <div className="flex justify-between items-center text-gray-500 text-base mb-1">
                                <span>Discount</span>
                                <span className="font-semibold text-green-500">${(couponDiscount || 0).toFixed(2)}</span>
                            </div>
                        )}
                        <hr className="my-2 border-gray-200" />
                        <div className="flex justify-between items-center mt-1">
                            <span className="font-semibold text-base">Total</span>
                            <span className="font-semibold text-xl text-black">
                                ${(parseFloat(currentCheckout.total_price) - (couponDiscount || 0)).toFixed(2)}
                            </span>
                        </div>
                    </div>
                    {/* terms and conditions */}
                    <div className="flex items-center gap-3 mt-6">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="w-4 h-4 cursor-pointer rounded border-2 border-[#F1C27D] text-[#F1C27D] focus:ring-[#F1C27D]  checked:bg-yellow-50 checked:border-[#F1C27D] checked:text-[#F1C27D] transition-all duration-150"
                            style={{ accentColor: '#F1C27D' }}
                        />
                        <label htmlFor="terms" className={`text-sm select-none transition-colors duration-200 ${termsAccepted ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                            By clicking this, you are agree to our
                            <Link href="#" className="font-semibold text-[#F1C27D] ml-1 hover:underline" style={{ textDecoration: 'none' }}>Terms of Services </Link>
                            and
                            <Link href="#" className="font-semibold text-[#F1C27D] ml-1 hover:underline" style={{ textDecoration: 'none' }}>Privacy Policy</Link>.
                        </label>
                    </div>
                    {/* Pay Button */}
                    <Button
                        className={`w-full cursor-pointer mt-6 text-sm uppercase font-semibold transition-all duration-300 ${!termsAccepted || !cardComplete
                                ? 'bg-gray-400 hover:bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-[#0F2598] hover:bg-[#0F2598]/80 text-white'
                            }`}
                        onClick={() => {
                            if (!termsAccepted || !cardComplete) return;
                            // Trigger Stripe form submission
                            const stripeForm = document.querySelector('form');
                            if (stripeForm) {
                                stripeForm.requestSubmit();
                            }
                        }}
                        disabled={!termsAccepted || !cardComplete || isProcessing}
                    >
                        {isProcessing ? (
                            <div className='flex items-center gap-2'>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Processing...</span>
                            </div>
                        ) : (
                            `Pay $${(parseFloat(currentCheckout.total_price) - (couponDiscount || 0)).toFixed(2)}`
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

