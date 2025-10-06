'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import CardData from './Payments/CardData'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import OverViewChart from './Payments/OverViewChart'
import FullyPaidTable from './Payments/FullyPaidTable'
import SponsoredTable from './Payments/SponsoredTable'
import FreeEnrolledTable from './Payments/FreeEnrolledTable'
import { useGetPaymentOverviewQuery } from '@/rtk/api/admin/reportApis'
 import { useAppSelector } from '@/rtk/hooks'

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
  // pagination states per section
  const [fullyPaidPage, setFullyPaidPage] = useState(1)
  const [fullyPaidLimit, setFullyPaidLimit] = useState(5)
  const [sponsoredPage, setSponsoredPage] = useState(1)
  const [sponsoredLimit, setSponsoredLimit] = useState(5)
  const [freePage, setFreePage] = useState(1)
  const [freeLimit, setFreeLimit] = useState(5)

  const params = {
    fully_paid_page: fullyPaidPage,
    fully_paid_limit: fullyPaidLimit,
    sponsored_page: sponsoredPage,
    sponsored_limit: sponsoredLimit,
    free_enrolled_page: freePage,
    free_enrolled_limit: freeLimit,
  }

  // trigger fetch with pagination params
  const { isFetching } = useGetPaymentOverviewQuery(params)
  const paymentOverview = useAppSelector((s) => s.report.paymentOverview)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  // Get the current tab from URL or default to 'overview'
  const currentTab = searchParams.get('paymentTab') || 'overview'
  const [activeTab, setActiveTab] = useState(currentTab)

  // Update local state when URL changes
  useEffect(() => {
    const tab = searchParams.get('paymentTab') || 'overview'
    setActiveTab(tab)
  }, [searchParams])

  // Handle tab change and update URL
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue)
    const params = new URLSearchParams(searchParams.toString())
    params.set('paymentTab', tabValue)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <CardData />
 
      <div className='bg-white rounded-xl p-6'>
        {/* Tab Navigation and Content */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                className="mt-6"
              >
                <Component 
                  // pass pagination controls to tables only
                  {...(tab.value === 'fully-paid' ? {
                    currentPage: fullyPaidPage,
                    totalPages: paymentOverview?.fully_paid?.pagination?.totalPages ?? 0,
                    totalItems: paymentOverview?.fully_paid?.pagination?.total ?? 0,
                    itemsPerPage: fullyPaidLimit,
                    onPageChange: setFullyPaidPage,
                    onItemsPerPageChange: setFullyPaidLimit,
                    isParentFetching: isFetching,
                  } : {})}
                  {...(tab.value === 'sponsored' ? {
                    currentPage: sponsoredPage,
                    totalPages: paymentOverview?.sponsored?.pagination?.totalPages ?? 0,
                    totalItems: paymentOverview?.sponsored?.pagination?.total ?? 0,
                    itemsPerPage: sponsoredLimit,
                    onPageChange: setSponsoredPage,
                    onItemsPerPageChange: setSponsoredLimit,
                    isParentFetching: isFetching,
                  } : {})}
                  {...(tab.value === 'free-enrolled' ? {
                    currentPage: freePage,
                    totalPages: paymentOverview?.free_enrolled?.pagination?.totalPages ?? 0,
                    totalItems: paymentOverview?.free_enrolled?.pagination?.total ?? 0,
                    itemsPerPage: freeLimit,
                    onPageChange: setFreePage,
                    onItemsPerPageChange: setFreeLimit,
                    isParentFetching: isFetching,
                  } : {})}
                />
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}
