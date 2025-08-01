'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, MoreVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface PaymentMethod {
    id: string;
    type: 'mastercard' | 'visa';
    cardNumber: string;
    expiryDate: string;
    isSelected: boolean;
}

interface Invoice {
    id: string;
    date: string;
    amount: string;
}

export default function PaymentPage() {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card1');
    const [emailAddress, setEmailAddress] = useState('robertjohnson@gmail.com');
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        {
            id: 'card1',
            type: 'mastercard',
            cardNumber: '•••• •••• •••• 1573',
            expiryDate: 'Expiry 05/27',
            isSelected: true
        },
        {
            id: 'card2',
            type: 'visa',
            cardNumber: '•••• •••• •••• 7228',
            expiryDate: 'Expiry 10/26',
            isSelected: false
        }
    ]);

    const invoices: Invoice[] = [
        {
            id: '#018298',
            date: 'Jan 20, 2025',
            amount: '$79'
        },
        {
            id: '#015274',
            date: 'Feb 20, 2025',
            amount: '$29'
        }
    ];

    const handlePaymentMethodChange = (methodId: string) => {
        setSelectedPaymentMethod(methodId);
        setPaymentMethods(prev =>
            prev.map(method => ({
                ...method,
                isSelected: method.id === methodId
            }))
        );
    };

    const handleEmailChange = (email: string) => {
        setEmailAddress(email);
    };

    const handleDeletePaymentMethod = (methodId: string) => {
        setPaymentMethods(prev => prev.filter(method => method.id !== methodId));

        // If the deleted method was selected, select the first remaining method
        if (selectedPaymentMethod === methodId) {
            const remainingMethods = paymentMethods.filter(method => method.id !== methodId);
            if (remainingMethods.length > 0) {
                setSelectedPaymentMethod(remainingMethods[0].id);
            }
        }
    };

    return (
        <div className="space-y-6 lg:space-y-8 ">
            {/* Payment Section */}
            <Card className="border-0 shadow-sm p-4">
                <CardHeader className="">
                    <CardTitle className="text-lg font-semibold text-gray-900">Payment</CardTitle>
                    <CardDescription className="text-md text-gray-400 leading-relaxed">
                        Manage your payment methods securely. Add, update, or remove your credit/debit cards.
                    </CardDescription>
                </CardHeader>
                <CardContent className="">
                    <div className="space-y-3">
                        {paymentMethods.map((method) => (
                            <div key={method.id} className="border border-gray-200 rounded-lg p-3 lg:p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 lg:space-x-4">
                                        <Checkbox
                                            id={method.id}
                                            checked={selectedPaymentMethod === method.id}
                                            onCheckedChange={() => handlePaymentMethodChange(method.id)}
                                            className="data-[state=checked]:bg-[#F1C27D] data-[state=checked]:border-[#F1C27D] cursor-pointer"
                                        />
                                        <div className="flex items-center space-x-2 lg:space-x-3">
                                            <Image
                                                src={`/images/payments/${method.type}.png`}
                                                alt={method.type}
                                                width={40}
                                                height={25}
                                                className="object-contain w-8 lg:w-10"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{method.cardNumber}</p>
                                                <p className="text-xs font-medium text-gray-500">{method.expiryDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-32">
                                            <DropdownMenuItem
                                                onClick={() => handleDeletePaymentMethod(method.id)}
                                                className="text-red-600 focus:text-red-600 cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                {/* Billing Section */}
                <div className="border-t pt-4 border-gray-200">
                    <CardHeader className="mb-2">
                        <CardTitle className="text-lg font-semibold text-gray-900">Billing</CardTitle>
                        <CardDescription className="text-md text-gray-400 leading-relaxed">
                            Review and update your billing information to ensure accurate and timely payments.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-3 lg:px-4 py-3 border-b border-gray-200">
                                <div className="grid grid-cols-4 gap-2 lg:gap-4 text-sm font-medium text-gray-700">
                                    <div>Invoice #</div>
                                    <div>Date</div>
                                    <div>Amount</div>
                                    <div></div>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {invoices.map((invoice) => (
                                    <div key={invoice.id} className="px-3 lg:px-4 py-3">
                                        <div className="grid grid-cols-4 gap-2 lg:gap-4 items-center text-sm">
                                            <div className="font-medium text-gray-900">{invoice.id}</div>
                                            <div className="text-gray-600">{invoice.date}</div>
                                            <div className="font-medium text-gray-900">{invoice.amount}</div>
                                            <div className="flex justify-end">
                                                <Download className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </div>

                {/* Email Address Section */}
                <div className="border-t pt-4 border-gray-200">
                    <CardHeader className="mb-2">
                        <CardTitle className="text-lg font-semibold text-gray-900">Email address</CardTitle>
                        <CardDescription className="text-md text-gray-400 leading-relaxed">
                            Invoice will be sent to this email address.
                        </CardDescription>
                    </CardHeader>
                    <CardContent >
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={emailAddress}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                className="w-full max-w-md"
                                placeholder="Enter email address"
                            />
                        </div>
                    </CardContent>
                </div>
            </Card>

        </div>
    );
}
