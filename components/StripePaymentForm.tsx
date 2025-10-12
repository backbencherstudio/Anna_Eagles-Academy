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
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
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
        };

        const handleCardExpiryChange = (event: any) => {
            setCardError('');
            setCardExpiryComplete(event.complete);
        };

        const handleCardCvcChange = (event: any) => {
            setCardError('');
            setCardCvcComplete(event.complete);
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
                // Store payment intent data for success page
                localStorage.setItem('lastPaymentIntent', JSON.stringify(paymentIntent));
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

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                backgroundColor: '#F1F3F4',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
            },
            invalid: {
                color: '#9e2146',
            },
        },
        hidePostalCode: true,
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="text-sm font-medium mb-1 flex justify-between">
                    Card Information <span className="text-gray-300 ml-1">*Required</span>
                </label>
                
                {/* Card Number */}
                <div className="mb-4">
                    <label className="text-xs text-gray-600 mb-1 block">Card Number</label>
                    <div className="bg-[#F1F3F4] rounded-md border-none p-3">
                        <CardNumberElement options={cardElementOptions} />
                    </div>
                </div>

                {/* Expiry Date and CVV */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-600 mb-1 block">Expiry Date</label>
                        <div className="bg-[#F1F3F4] rounded-md border-none p-3">
                            <CardExpiryElement options={cardElementOptions} />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-600 mb-1 block">CVV</label>
                        <div className="bg-[#F1F3F4] rounded-md border-none p-3">
                            <CardCvcElement options={cardElementOptions} />
                        </div>
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
