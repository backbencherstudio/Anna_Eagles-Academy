"use client"

import React, { useMemo, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PhoneInput from 'react-phone-number-input'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import toast from 'react-hot-toast'

import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import ButtonSpring from '@/components/Resuable/ButtonSpring'

import { RootState } from '@/rtk'
import {
  updateFormField,
  setSubmitting,
  resetForm,
  populateWithUserData
} from '@/rtk/slices/users/contactTeacherSlice'
import { useContactTeacherMutation } from '@/rtk/api/users/contactTeacherApis'


import 'react-phone-number-input/style.css'

// Constants
const CONTACT_REASONS = [
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

const PHONE_INPUT_STYLES = 'PhoneInput shadcn-input flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
const PHONE_NUMBER_INPUT_PROPS = { className: 'grow bg-transparent outline-none pl-2' }


export default function ContactTeacherPage() {
  const dispatch = useDispatch()
  const { form, isSubmitting } = useSelector((state: RootState) => state.contactTeacher)
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [contactTeacher] = useContactTeacherMutation()

  // Get user's timezone
  const userTimeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, [])

  // Utility functions
  const isValidDate = useCallback((dateString: string): boolean => {
    if (!dateString) return false
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  }, [])

  const getDefaultDateTime = useCallback((): Date => {
    const today = new Date()
    today.setHours(14, 0, 0, 0) // Default to 2:00 PM
    return today
  }, [])

  const formatDisplayDate = useCallback((dateString: string): string => {
    return isValidDate(dateString)
      ? format(new Date(dateString), "PPP")
      : format(new Date(), "PPP")
  }, [isValidDate])

  const formatDisplayTime = useCallback((dateString: string): string => {
    return isValidDate(dateString)
      ? format(new Date(dateString), "HH:mm")
      : format(new Date(), "HH:mm")
  }, [isValidDate])

  const getSelectedDate = useCallback((): Date => {
    return isValidDate(form.bestTime) ? new Date(form.bestTime) : new Date()
  }, [form.bestTime, isValidDate])

  // Effects
  useEffect(() => {
    if (isAuthenticated && user && !form.email) {
      // Normalize phone number to E.164 format for react-phone-number-input
      const normalizedPhone = user.phone_number 
        ? (user.phone_number.startsWith('+') ? user.phone_number : `+${user.phone_number}`)
        : ''
      
      dispatch(populateWithUserData({
        name: user.name,
        email: user.email,
        phone: normalizedPhone
      }))
    }
  }, [isAuthenticated, user, form.email, dispatch])

  useEffect(() => {
    if (!form.bestTime) {
      dispatch(updateFormField({
        field: 'bestTime',
        value: getDefaultDateTime().toISOString()
      }))
    }
  }, [form.bestTime, dispatch, getDefaultDateTime])

  // Form validation
  const isFormValid = useMemo(() => {
    return form.name.trim().length > 0 &&
      form.email.trim().length > 3 &&
      form.reason &&
      form.message.trim().length > 0
  }, [form.name, form.email, form.reason, form.message])

  // Event handlers
  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (!date) return

    const currentTime = isValidDate(form.bestTime) ? new Date(form.bestTime) : new Date()
    const newDateTime = new Date(date)
    newDateTime.setHours(currentTime.getHours())
    newDateTime.setMinutes(currentTime.getMinutes())

    dispatch(updateFormField({
      field: 'bestTime',
      value: newDateTime.toISOString()
    }))
  }, [form.bestTime, isValidDate, dispatch])

  const handleTimeSelect = useCallback((time: string) => {
    if (!time || !/^\d{1,2}:\d{2}$/.test(time)) return

    const [hours, minutes] = time.split(':').map(Number)
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return

    const baseDate = isValidDate(form.bestTime) ? new Date(form.bestTime) : new Date()
    baseDate.setHours(hours, minutes, 0, 0)

    dispatch(updateFormField({
      field: 'bestTime',
      value: baseDate.toISOString()
    }))
  }, [form.bestTime, isValidDate, dispatch])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitting(true))

    try {
      const [firstName, ...lastNameParts] = form.name.split(' ')

      const response = await contactTeacher({
        first_name: firstName || '',
        last_name: lastNameParts.join(' ') || '',
        email: form.email,
        phone_number: form.phone,
        whatsapp_number: form.whatsapp || "0",
        reason: form.reason,
        message: form.message,
        date: form.bestTime,
      }).unwrap()

      // Show success toast
      toast.success(response.message || "Contact request submitted successfully!")

      dispatch(resetForm())
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      dispatch(setSubmitting(false))
    }
  }, [dispatch, contactTeacher, form])

  // Generate time options (15-minute intervals)
  const timeOptions = useMemo(() => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const time12 = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
        options.push({ value: timeString, label: time12 })
      }
    }
    return options
  }, [])

  return (
    <div className='px-3 max-w-5xl mx-auto'>
      <Card className='p-5 md:p-8 lg:p-10'>
        <h2 className='text-sm md:text-lg font-semibold text-[#1D1F2C] mb-6'>
          Contact Teacher or School
        </h2>

        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* Name Field */}
          <div className='space-y-2'>
            <Label className='text-sm text-[#1D1F2C]'>Your Name</Label>
            <Input
              placeholder='Enter your full name'
              value={form.name}
              onChange={(e) => dispatch(updateFormField({ field: 'name', value: e.target.value }))}
            />
          </div>

          {/* Email Field */}
          <div className='space-y-2'>
            <Label className='text-sm text-[#1D1F2C]'>Your Email Address</Label>
            <Input
              placeholder='example@email.com'
              type='email'
              value={form.email}
              onChange={(e) => dispatch(updateFormField({ field: 'email', value: e.target.value }))}
            />
          </div>

          {/* Phone Field */}
          <div className='space-y-2'>
            <Label className='text-sm text-[#1D1F2C]'>Phone Number</Label>
            <PhoneInput
              international
              defaultCountry='US'
              value={form.phone}
              onChange={(value) => dispatch(updateFormField({ field: 'phone', value: value || '' }))}
              className={PHONE_INPUT_STYLES}
              numberInputProps={PHONE_NUMBER_INPUT_PROPS}
            />
          </div>

          {/* Date and Time Selection */}
          <div className='space-y-2'>
            <Label className='text-sm text-[#1D1F2C]'>
              Best Time to Contact (your time zone: {userTimeZone})
            </Label>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDisplayDate(form.bestTime)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={getSelectedDate()}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Time Picker */}
              <Select
                value={formatDisplayTime(form.bestTime)}
                onValueChange={handleTimeSelect}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* WhatsApp Field */}
          <div className='space-y-2'>
            <Label className='text-sm text-[#1D1F2C]'>WhatsApp Number (for international students)</Label>
            <PhoneInput
              international
              value={form.whatsapp}
              onChange={(value) => dispatch(updateFormField({ field: 'whatsapp', value: value || '' }))}
              className={PHONE_INPUT_STYLES}
              numberInputProps={PHONE_NUMBER_INPUT_PROPS}
            />
            <p className='text-xs text-muted-foreground'>
              Include country code for international WhatsApp communication
            </p>
          </div>

          {/* Reason Field */}
          <div className='space-y-2'>
            <Label className='text-sm text-[#1D1F2C]'>Reason for Contacting</Label>
            <Select value={form.reason} onValueChange={(v) => dispatch(updateFormField({ field: 'reason', value: v }))}>
              <SelectTrigger className='w-full cursor-pointer'>
                <SelectValue placeholder='Choose a reason' />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_REASONS.map((reason) => (
                  <SelectItem
                    className='cursor-pointer font-medium data-[state=checked]:bg-[#0F2598] data-[state=checked]:text-white focus:bg-gray-100 focus:text-black'
                    key={reason}
                    value={reason}
                  >
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message Field */}
          <div className='space-y-2'>
            <Label className='text-sm text-[#1D1F2C]'>Your Message</Label>
            <Textarea
              rows={6}
              placeholder='Write your message here...'
              value={form.message}
              onChange={(e) => dispatch(updateFormField({ field: 'message', value: e.target.value }))}
            />
          </div>

          {/* Submit Button */}
          <div className='pt-2'>
            <Button
              type='submit'
              disabled={!isFormValid || isSubmitting}
              className={`w-full cursor-pointer py-5 ${isFormValid && !isSubmitting ? 'bg-[#0F2598] hover:bg-[#0F2598]/90' : ''}`}
              aria-busy={isSubmitting}
            >
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

        </form>
      </Card>
    </div>
  )
}