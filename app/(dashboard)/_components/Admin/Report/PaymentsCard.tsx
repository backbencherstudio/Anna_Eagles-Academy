'use client'
import React from 'react'
import CardData from './Payments/CardData'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import OverViewChart from './Payments/OverViewChart'
import FullyPaidTable from './Payments/FullyPaidTable'
import SponsoredTable from './Payments/SponsoredTable'
import FreeEnrolledTable from './Payments/FreeEnrolledTable'

// Tab configuration data
const tabData = [
  {
    value: 'overview',
    label: 'OVERVIEW',
    component: OverViewChart,
    activeColor: '#0F2598'
  },
  {
    value: 'fully-paid',
    label: 'FULLY PAID',
    component: FullyPaidTable,
    activeColor: '#0F2598'
  },
  {
    value: 'sponsored',
    label: 'SPONSORED',
    component: SponsoredTable,
    activeColor: '#0F2598'
  },
  {
    value: 'free-enrolled',
    label: 'FREE ENROLLED',
    component: FreeEnrolledTable,
    activeColor: '#0F2598'
  }
]

export default function PaymentsCard() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <CardData />
 
      <div className='bg-white rounded-xl p-6'>
        {/* Tab Navigation and Content */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="border-b border-gray-200">
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 scroll-smooth">
              <TabsList className="flex bg-transparent p-0 h-auto gap-6 md:gap-0 whitespace-nowrap w-max min-w-max md:w-full md:min-w-0 md:justify-between">
              {tabData.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-transparent cursor-pointer data-[state=active]:shadow-none data-[state=active]:text-[#0F2598] data-[state=active]:border-b-2 data-[state=active]:border-[#0F2598] data-[state=inactive]:text-[#777980] font-medium uppercase text-sm py-4 px-0 rounded-none border-b-2 border-transparent hover:text-gray-700 transition-all duration-300 ease-in-out flex-shrink-0 md:flex-1 md:text-center"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
              </TabsList>
            </div>
          </div>

          {tabData.map((tab) => {
            const Component = tab.component
            return (
              <TabsContent 
                key={tab.value} 
                value={tab.value} 
                className="mt-6 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-top-2 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:slide-out-to-top-2 transition-all duration-300 ease-in-out"
              >
                <Component />
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}
