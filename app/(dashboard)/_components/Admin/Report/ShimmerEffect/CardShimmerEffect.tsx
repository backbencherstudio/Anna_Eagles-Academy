import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

export default function CardShimmerEffect() {
    return (
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-center mb-4">
                    <div className="p-2 rounded-lg bg-gray-200 animate-pulse mr-3">
                        <div className="h-5 w-5 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                </div>
                <div className="mb-3">
                    <div className="h-9 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </CardContent>
        </Card>
    )
}
