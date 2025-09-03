'use client'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import CalanderAdmin from '@/app/(dashboard)/_components/Admin/CalanderAdmin'
import AddEvent from '@/app/(dashboard)/_components/Admin/AddEvent'
import AddEventModal from '@/app/(dashboard)/_components/Admin/AddEventModal'


export default function Calendar() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleOpenModal = () => {
        setIsModalOpen(true)
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
                    className='w-full cursor-pointer bg-[#F1C27D] hover:bg-[#F1C27D]/80'
                    onClick={handleOpenModal}
                >
                    <span className='bg-white/30 rounded-full p-1'>
                        <Plus />
                    </span>
                    Add Event
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
