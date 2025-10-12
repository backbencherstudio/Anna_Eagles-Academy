'use client'
import React from 'react'
import PaymentsSuccess from '@/app/_components/Student/PaymentsSuccess'

export default function PaymentSuccess({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    
    // Get payment intent data from URL params or localStorage
    const [paymentIntentData, setPaymentIntentData] = React.useState<any>(null);
    
    React.useEffect(() => {
        // Try to get payment intent from localStorage
        const storedPaymentIntent = localStorage.getItem('lastPaymentIntent');
        if (storedPaymentIntent) {
            setPaymentIntentData(JSON.parse(storedPaymentIntent));
        }
    }, []);
    
    return (
        <PaymentsSuccess checkoutId={id} paymentIntent={paymentIntentData} />
    )
}
