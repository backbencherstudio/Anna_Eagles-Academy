'use client'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import CalanderAdmin from '@/app/_components/Admin/CalanderAdmin'
import AddEvent from '@/app/_components/Admin/AddEvent'
import AddEventModal from '@/app/_components/Admin/Calendar/AddEventModal'
import ButtonSpring from '@/components/Resuable/ButtonSpring'



export default function Calendar() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [opening, setOpening] = useState(false)

    const handleOpenModal = () => {

        setOpening(true)
        setTimeout(() => {
            setIsModalOpen(true)
            setOpening(false)
        }, 100)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div className='w-full  flex flex-col gap-10 lg:flex-row '>
            <div className=' w-full lg:w-7/12'>
                <CalanderAdmin />
            </div>
            <div className=' w-full lg:w-5/12 '>
                <Button 
                    className='w-full py-5 cursor-pointer bg-[#0F2598] hover:bg-[#0F2598]/80 disabled:opacity-70 disabled:cursor-not-allowed'
                    onClick={handleOpenModal}
                    disabled={opening}
                >
                    {opening ? (
                        <span className='flex items-center gap-2 w-full justify-center'>
                            <ButtonSpring size={18} color='#ffffff' />
                            <span>loading...</span>
                        </span>
                    ) : (
                        <>
                            <span className='bg-white/30 rounded-full p-1'>
                                <Plus />
                            </span>
                            Add Event
                        </>
                    )}
                </Button>
                
                <div className='mt-4'>
                    <AddEvent />
                </div>
                
                {/* Modal */}
                <AddEventModal 
                    isOpen={isModalOpen} 
                    onClose={handleCloseModal} 
                />
            </div>
        </div>
    )
}
