"use client"
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DonationCategory = {
  key: string
  title: string
  description: string
}

const CATEGORIES: DonationCategory[] = [
  {
    key: 'sponsor-student',
    title: 'Sponsor a Student',
    description:
      'Offers financial aid to students in need for quality education.',
  },
  {
    key: 'ministry-needs',
    title: 'Ministry Needs',
    description:
      'Supports the improvement of our campus facilities and classrooms.',
  },
  {
    key: 'project-funds',
    title: 'Project Funds',
    description: 'Choose your own amount to support the area of your choice.',
  },
  {
    key: 'personal-donation',
    title: 'Personal Donation',
    description:
      'Supports the improvement of our campus facilities and classrooms.',
  },
]

export default function Donations() {
  const [selected, setSelected] = React.useState<string>('ministry-needs')

  return (
    <div className="mx-auto w-full bg-white p-4 rounded-lg space-y-8 py-8">
      <div className="text-center space-y-2 mb-14">
        <h1 className="text-xl font-semibold tracking-tight">
          Make a Difference Through Your Giving
        </h1>
        <p className="text-muted-foreground lg:max-w-xl mx-auto text-sm font-medium">
          Your donation supports Christian education, ministry, and mission. Please
          select a category below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CATEGORIES.map((item) => {
          const isActive = selected === item.key
          return (
            <button
              key={item.key}
              onClick={() => setSelected(item.key)}
              className="text-left cursor-pointer"
            >
              <Card
                className={cn(
                  'h-full rounded-2xl border bg-background transition-colors',
                  isActive
                    ? 'border-[#0F2598] bg-[#0F2598]/5'
                    : 'border-muted hover:bg-muted/20'
                )}
              >
                <CardContent className="p-6 text-center">
                  <div className="font-semibold">{item.title}</div>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col items-center gap-3 pt-2">
        <Button size="lg" className="px-8 cursor-pointer bg-[#0F2598] hover:bg-[#0F2598]/90 text-white">
          Continue to Donation Page
        </Button>
        <p className="text-[#A5A5AB] text-sm mt-2">
          You will be redirected to The Father&apos;s Dwelling Place secure donation portal.
        </p>
      </div>
    </div>
  )
}
