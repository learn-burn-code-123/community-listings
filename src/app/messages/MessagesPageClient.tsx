'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { redirect } from 'next/navigation'
import MessageThread from '@/components/messages/MessageThread'
import { Thread } from '@/types/messages'

interface MessagesPageClientProps {
  threads: Thread[]
}

export default function MessagesPageClient({ threads }: MessagesPageClientProps) {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)

  useEffect(() => {
    if (searchParams.has('listingId') && searchParams.has('userId')) {
      const listingId = searchParams.get('listingId')
      const userId = searchParams.get('userId')
      const thread = threads.find(
        (t) => t.listing.id === listingId && t.otherUser.id === userId
      )
      if (thread) {
        setSelectedThread(thread)
      }
    } else if (threads.length > 0) {
      setSelectedThread(threads[0])
    }
  }, [searchParams, threads])

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Message Threads List */}
        <div className="md:col-span-1 bg-white rounded-lg shadow">
          <div className="divide-y divide-gray-200">
            {threads.map((thread) => (
              <div
                key={`${thread.listing.id}-${thread.otherUser.id}`}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedThread?.listing.id === thread.listing.id &&
                  selectedThread?.otherUser.id === thread.otherUser.id
                    ? 'bg-gray-50'
                    : ''
                }`}
                onClick={() => setSelectedThread(thread)}
              >
                <div className="flex items-center space-x-3">
                  {thread.otherUser.image ? (
                    <img
                      src={thread.otherUser.image}
                      alt={thread.otherUser.name || 'User'}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {thread.otherUser.name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {thread.listing.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Thread View */}
        <div className="md:col-span-2 bg-white rounded-lg shadow">
          {selectedThread ? (
            <MessageThread
              listingId={selectedThread.listing.id}
              recipientId={selectedThread.otherUser.id}
              recipientName={selectedThread.otherUser.name}
              recipientImage={selectedThread.otherUser.image}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 