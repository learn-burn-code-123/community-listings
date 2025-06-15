'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Message } from '@/types/messages'

interface MessageThreadProps {
  listingId: string
  recipientId: string
  recipientName: string | null
  recipientImage: string | null
}

export default function MessageThread({
  listingId,
  recipientId,
  recipientName,
  recipientImage,
}: MessageThreadProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/messages?listingId=${listingId}&userId=${recipientId}`
        )
        if (!response.ok) throw new Error('Failed to fetch messages')
        const data = await response.json()
        setMessages(data)
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [listingId, recipientId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !session) return

    setIsSending(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          listingId,
          recipientId,
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const message = await response.json()
      setMessages((prev) => [...prev, message])
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to send messages</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading messages...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex items-center space-x-3 p-4 border-b">
        {recipientImage ? (
          <Image
            src={recipientImage}
            alt={recipientName || 'User'}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        )}
        <div>
          <h3 className="font-medium text-gray-900">{recipientName || 'Anonymous'}</h3>
          <p className="text-sm text-gray-500">Active now</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender.id === session.user.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.sender.id === session.user.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
} 