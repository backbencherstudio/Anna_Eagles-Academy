'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';

import { usePayNowMutation } from '@/rtk/api/users/paymentsApis';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
    checkoutId: string;
    amount: number;
    onPaymentSuccess: (paymentIntent: any) => void;
    onPaymentError: (error: string) => void;
    isLoading?: boolean;
    onProcessingChange?: (processing: boolean) => void;
    onCardCompleteChange?: (complete: boolean) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
    checkoutId,
    amount,
    onPaymentSuccess,
    onPaymentError,
    isLoading = false,
    onProcessingChange,
    onCardCompleteChange
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [cardError, setCardError] = useState<string>('');
    const [cardNumberComplete, setCardNumberComplete] = useState(false);
    const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
    const [cardCvcComplete, setCardCvcComplete] = useState(false);
    const [cardNumberError, setCardNumberError] = useState<string>('');
    const [expiryError, setExpiryError] = useState<string>('');
    const [cvcError, setCvcError] = useState<string>('');
    const [isCardNumberValid, setIsCardNumberValid] = useState<boolean | null>(null);
    const [isExpiryValid, setIsExpiryValid] = useState<boolean | null>(null);
    const [isCvcValid, setIsCvcValid] = useState<boolean | null>(null);

    const [payNow] = usePayNowMutation();

    // Notify parent about processing state changes
    React.useEffect(() => {
        if (onProcessingChange) {
            onProcessingChange(processing);
        }
    }, [processing, onProcessingChange]);

    // Listen for card element changes
    React.useEffect(() => {
        const cardNumberElement = elements?.getElement(CardNumberElement);
        const cardExpiryElement = elements?.getElement(CardExpiryElement);
        const cardCvcElement = elements?.getElement(CardCvcElement);

        const handleCardNumberChange = (event: any) => {
            setCardError('');
            setCardNumberComplete(event.complete);
            
            // Handle card number validation
            if (event.error) {
                setCardNumberError(event.error.message);
                setIsCardNumberValid(false);
            } else if (event.complete) {
                setCardNumberError('');
                setIsCardNumberValid(true);
            } else {
                setCardNumberError('');
                setIsCardNumberValid(null);
            }
        };

        const handleCardExpiryChange = (event: any) => {
            setCardError('');
            setCardExpiryComplete(event.complete);
            
            if (event.error) {
                setExpiryError(event.error.message);
                setIsExpiryValid(false);
            } else if (event.complete) {
                setExpiryError('');
                setIsExpiryValid(true);
            } else {
                setExpiryError('');
                setIsExpiryValid(null);
            }
        };

        const handleCardCvcChange = (event: any) => {
            setCardError('');
            setCardCvcComplete(event.complete);
            
            if (event.error) {
                setCvcError(event.error.message);
                setIsCvcValid(false);
            } else if (event.complete) {
                setCvcError('');
                setIsCvcValid(true);
            } else {
                setCvcError('');
                setIsCvcValid(null);
            }
        };

        if (cardNumberElement) {
            cardNumberElement.on('change', handleCardNumberChange);
        }
        if (cardExpiryElement) {
            cardExpiryElement.on('change', handleCardExpiryChange);
        }
        if (cardCvcElement) {
            cardCvcElement.on('change', handleCardCvcChange);
        }

        return () => {
            if (cardNumberElement) {
                cardNumberElement.off('change', handleCardNumberChange);
            }
            if (cardExpiryElement) {
                cardExpiryElement.off('change', handleCardExpiryChange);
            }
            if (cardCvcElement) {
                cardCvcElement.off('change', handleCardCvcChange);
            }
        };
    }, [elements]);

    // Update parent component when all card fields are complete
    React.useEffect(() => {
        const allComplete = cardNumberComplete && cardExpiryComplete && cardCvcComplete;
        if (onCardCompleteChange) {
            onCardCompleteChange(allComplete);
        }
    }, [cardNumberComplete, cardExpiryComplete, cardCvcComplete, onCardCompleteChange]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        // Check if all card fields are complete
        if (!cardNumberComplete || !cardExpiryComplete || !cardCvcComplete) {
            setCardError('Please enter complete card details');
            return;
        }

        setProcessing(true);
        setCardError(''); // Clear previous errors

        try {
            // First, create payment intent via your backend
            const result = await payNow(checkoutId).unwrap();

            if (!result.success || !result.data?.client_secret) {
                setCardError(result.message || 'Failed to create payment intent');
                return;
            }

            const clientSecret = result.data.client_secret;

            // Confirm payment with Stripe using the client secret
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement)!,
                }
            });

            if (error) {
                setCardError(error.message || 'Payment failed');
            } else if (paymentIntent.status === 'succeeded') {
                // Pass payment intent data to success callback
                onPaymentSuccess(paymentIntent);
            } else {
                setCardError('Payment was not completed');
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            const errorMessage = error?.data?.message || error?.message || 'An unexpected error occurred';
            setCardError(typeof errorMessage === 'string' ? errorMessage : 'Payment failed');
        } finally {
            setProcessing(false);
        }
    };

    const getCardElementOptions = (isValid: boolean | null) => ({
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                backgroundColor: isValid === true ? '#F0FDF4' : isValid === false ? '#FEF2F2' : '#F1F3F4',
                padding: '12px',
                borderRadius: '8px',
                border: isValid === true ? '1px solid #16A34A' : isValid === false ? '1px solid #DC2626' : 'none',
            },
            invalid: {
                color: '#DC2626',
                backgroundColor: '#FEF2F2',
                border: '1px solid #DC2626',
            },
        },
        hidePostalCode: true,
        showIcon: true, // Enable Stripe's native card brand icons
    });

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="text-sm font-medium mb-1 flex justify-between">
                    Card Information <span className="text-gray-300 ml-1">*Required</span>
                </label>
                
                {/* Card Number */}
                <div className="mb-4">
                    <label className="text-xs text-gray-600 mb-1 block">Card Number</label>
                    <div className={`rounded-md border-none p-3 relative ${
                        isCardNumberValid === true 
                            ? 'bg-green-50 border border-green-300' 
                            : isCardNumberValid === false
                            ? 'bg-red-50 border border-red-300'
                            : 'bg-[#F1F3F4]'
                    }`}>
                        <CardNumberElement options={getCardElementOptions(isCardNumberValid)} />
                        {isCardNumberValid === true && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>
                    {cardNumberError && (
                        <div className="mt-1 text-xs text-red-600 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {cardNumberError}
                        </div>
                    )}
                    {isCardNumberValid === true && (
                        <div className="mt-1 text-xs text-green-600 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Card number is valid
                        </div>
                    )}
                </div>

                {/* Expiry Date and CVV */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-600 mb-1 block">Expiry Date</label>
                        <div className={`rounded-md border-none p-3 relative ${
                            isExpiryValid === true 
                                ? 'bg-green-50 border border-green-300' 
                                : isExpiryValid === false
                                ? 'bg-red-50 border border-red-300'
                                : 'bg-[#F1F3F4]'
                        }`}>
                            <CardExpiryElement options={getCardElementOptions(isExpiryValid)} />
                            {isExpiryValid === true && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        {expiryError && (
                            <div className="mt-1 text-xs text-red-600 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {expiryError}
                            </div>
                        )}
                        {isExpiryValid === true && (
                            <div className="mt-1 text-xs text-green-600 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Expiry date is valid
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="text-xs text-gray-600 mb-1 block">CVV</label>
                        <div className={`rounded-md border-none p-3 relative ${
                            isCvcValid === true 
                                ? 'bg-green-50 border border-green-300' 
                                : isCvcValid === false
                                ? 'bg-red-50 border border-red-300'
                                : 'bg-[#F1F3F4]'
                        }`}>
                            <CardCvcElement options={getCardElementOptions(isCvcValid)} />
                            {isCvcValid === true && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        {cvcError && (
                            <div className="mt-1 text-xs text-red-600 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {cvcError}
                            </div>
                        )}
                        {isCvcValid === true && (
                            <div className="mt-1 text-xs text-green-600 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                CVV is valid
                            </div>
                        )}
                    </div>
                </div>

                {/* Error message display */}
                {cardError && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                        {cardError}
                    </div>
                )}
            </div>
        </form>
    );
};

const StripePaymentForm: React.FC<PaymentFormProps> = (props) => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm {...props} />
        </Elements>
    );
};

export default StripePaymentForm;
