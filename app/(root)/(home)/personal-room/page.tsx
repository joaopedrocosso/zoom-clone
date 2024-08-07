'use client'

import { Button } from '@/components/ui/button';
import { toast, useToast } from '@/components/ui/use-toast';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React from 'react'

const Table = ({ title, description }: { title: string; description: string }) => (
  <div className='flex flex-col '>
    <h1>{title}</h1>
    <h1>{description}</h1>
  </div>
)

const Personal = () => {
  const { user } = useUser()
  const meetingId = user?.id
  const meetingLink = `${process.env.NEXT_PUBIC_BASE_URL}/meeting/${meetingId}?peronal=true`
  const { toast } = useToast()
  const { call } = useGetCallById(meetingId!)
  const client = useStreamVideoClient()
  const router = useRouter()

  const startRoom = async () => {
    if(!client || !user) return

    const newCall = client.call('default', meetingId!)
    
    if(!call){  
      await newCall.getOrCreate({
          data: {
              starts_at: new Date().toISOString(),
          }
      })
    }

    router.push(`/meeting/${meetingId}?personal=true`)
  }

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold '>
        Personal Room
      </h1>

      <div className='flex w-full flex-col gap-8 xl:max-w-[900px]'>
        <Table title='Topic' description={`${user?.username}'s Meeting Room`}/>
        <Table title='Meeting ID' description={meetingId!}/>
        <Table title='Invite Link' description={meetingLink}/>
      </div>

      <div className='flex gap-5'>
        <Button className='bg-blue-1' onClick={startRoom}>
          
        </Button>

        <Button className='bg-dark-3' onClick={() => {
          navigator.clipboard.writeText(meetingLink);
          toast({
            title: "Link Copied",
          });
        }}>
          Copy Invitation
        </Button>
      </div>
    </section>
  )
}

export default Personal