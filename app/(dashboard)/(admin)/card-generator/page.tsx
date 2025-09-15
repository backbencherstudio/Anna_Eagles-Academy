"use client"
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { TabsTrigger } from '@/components/ui/tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CardGenerator from '@/app/(dashboard)/_components/Admin/CardGenerator'
import CardHistory from '../../_components/Admin/CardHistory'

export default function CardGeneratorPage() {
  const [activeTab, setActiveTab] = useState('createCard')
  const router = useRouter()
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', value)
    router.push(`?${params.toString()}`, { scroll: false })
  }
  // get the url params
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')
  useEffect(() => {
    if (tab) {
      setActiveTab(tab)
    }
  }, [tab])
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#1D1F2C]">Card Generator</h1>
        <p className="text-[#777980] mt-1">Create personalized printable cards for students, staff, and community.</p>
      </div>

      {/* tabs buttons */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full justify-start overflow-x-auto rounded-xl bg-white py-2 px-2">
          <TabsTrigger value="createCard" className="cursor-pointer w-fit sm:w-1/2 text-muted-foreground py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm">Create Card</TabsTrigger>
          <TabsTrigger value="cardHistory" className="text-muted-foreground cursor-pointer w-fit sm:w-1/2 py-3 data-[state=active]:text-[#0F2598] data-[state=active]:bg-[rgba(15,37,152,0.05)] text-sm">Card History</TabsTrigger>
        </TabsList>
        {/* tabs content */}
        <TabsContent value="createCard" className="mt-6">
          <CardGenerator />
        </TabsContent>
        <TabsContent value="cardHistory" className="mt-6">
          <CardHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
