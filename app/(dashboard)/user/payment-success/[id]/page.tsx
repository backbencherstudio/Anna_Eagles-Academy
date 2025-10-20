'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import PaymentsSuccess from '@/app/_components/Student/PaymentsSuccess'

export default function PaymentSuccess({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const searchParams = useSearchParams();

    // Get payment intent data from URL parameters
    const paymentIntentData = React.useMemo(() => {
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');
        const amount = searchParams.get('amount');
        const currency = searchParams.get('currency');
        const created = searchParams.get('created');

        if (paymentId && status && amount && currency && created) {
            return {
                id: paymentId,
                status: status,
                amount: parseInt(amount),
                currency: currency,
                created: parseInt(created)
            };
        }

        return null;
    }, [searchParams]);

    return (
        <PaymentsSuccess checkoutId={id} paymentIntent={paymentIntentData} />
    )
}
