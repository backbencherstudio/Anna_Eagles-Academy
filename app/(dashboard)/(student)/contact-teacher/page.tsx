"use client"
import React, { useMemo, useState } from 'react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ButtonSpring from '@/components/Resuable/ButtonSpring'
import { FaCheckCircle } from 'react-icons/fa'

const REASONS = [
  'Class Registration',
  'School Fees',
  'Class Schedule',
  'Refund',
  'Class Question',
  '1:1 Meeting',
  'Workshop',
  'Conference',
  'Roundtable',
  'Prayer Request',
  'Other',
] as const

export default function ContactTeacher() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState<string | undefined>('')
  const userTimeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, [])
  const [bestTime, setBestTime] = useState('')
  const [whatsapp, setWhatsapp] = useState<string | undefined>('')
  const [reason, setReason] = useState<typeof REASONS[number]>('Class Schedule')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValid = useMemo(() => {
    return email.trim().length > 3 && reason && message.trim().length > 0
  }, [email, reason, message])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate request; replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Clear fields after successful submit
    setEmail('')
    setPhone('')
    setBestTime('')
    setWhatsapp('')
    setReason('Class Schedule')
    setMessage('')

    setSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <div className='px-3 max-w-5xl mx-auto'>
      <Card className='p-5 md:p-8 lg:p-10'>
        <h2 className='text-sm md:text-lg font-semibold text-[#1D1F2C] mb-6'>Contact Teacher or School</h2>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-2'>
            <Label className=' text-sm text-[#1D1F2C]'>Your Email Address</Label>
            <Input placeholder='example@email.com' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className='space-y-2'>
            <Label className=' text-sm text-[#1D1F2C]'>Phone Number</Label>
            <PhoneInput
              international
              defaultCountry='US'
              value={phone}
              onChange={setPhone}
              className='PhoneInput shadcn-input flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
              numberInputProps={{ className: 'grow bg-transparent outline-none pl-2' }}
            />
          </div>

          <div className='space-y-2'>
            <Label className=' text-sm text-[#1D1F2C]'>Best Time to Contact (your time zone: {userTimeZone})</Label>
            <Input
              placeholder='e.g., 3 PM - 5 PM weekdays, 10 AM - 2 PM weekends'
              value={bestTime}
              onChange={(e) => setBestTime(e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label className=' text-sm text-[#1D1F2C]'>WhatsApp Number (for international students)</Label>
            <PhoneInput
              international
              value={whatsapp}
              onChange={setWhatsapp}
              className='PhoneInput shadcn-input flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
              numberInputProps={{ className: 'grow bg-transparent outline-none pl-2' }}
            />
            <p className='text-xs text-muted-foreground'>Include country code for international WhatsApp communication</p>
          </div>

          <div className='space-y-2'>
            <Label className=' text-sm text-[#1D1F2C]'>Reason for Contacting</Label>
            <Select value={reason} onValueChange={(v) => setReason(v as typeof REASONS[number])}>
              <SelectTrigger className='w-full cursor-pointer'>
                <SelectValue placeholder='Choose a reason' />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((item) => (
                  <SelectItem
                    className='cursor-pointer font-medium data-[state=checked]:bg-[#0F2598] data-[state=checked]:text-white focus:bg-gray-100 focus:text-black'
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label className=' text-sm text-[#1D1F2C]'>Your Message</Label>
            <Textarea rows={6} placeholder='Write your message here...' value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>

          <div className='pt-2'>
            <Button type='submit' disabled={!isValid || isSubmitting} className={`w-full cursor-pointer py-5 ${isValid && !isSubmitting ? 'bg-[#0F2598] hover:bg-[#0F2598]/90' : ''}`} aria-busy={isSubmitting}>
              {isSubmitting ? (
                <span className='inline-flex items-center gap-2'>
                  <ButtonSpring loading={isSubmitting} />
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </Button>
          </div>

          {submitted && (
            <div className='text-[#12B76A] text-sm lg:text-base font-semibold  flex items-center gap-2 justify-center'>
              <FaCheckCircle className='w-6 h-6' />
              <span>Your message has been sent. We will get back to you soon.</span>
            </div>
          )}
        </form>
      </Card>
    </div>
  )
}
