import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function EmptyState() {
  return (
    <div className="p-5 py-24 flex flex-col items-center justify-center mt-10 border-2 border-dashed text-center">
    <h2>You dont have any short video for now</h2>
    <Link href={'/dashboard/create-new'}>
    <Button className="mt-4">Create New Short Video</Button>
    </Link>
</div>

  )
}

export default EmptyState