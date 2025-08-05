import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function Header() {
  return (
    <div className='p-3 flex justify-between items-center shadow-md'>
        <div className='flex gap-3 items-center'>
        <Image src="/logo.svg" alt="logo" width={40} height={40} />
        <h2 className='font-bold text-xl'>Ai Short Video</h2>
        </div>
        <div className='flex gap-3 items-center'>
            <Button className='mr-4'>Dashboard</Button>
            <UserButton  />
        </div>
    </div>
  )
}

export default Header