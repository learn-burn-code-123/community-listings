import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import MessagesPageClient from './MessagesPageClient'
import { Message, Thread } from '@/types/messages'

interface PageProps {
  searchParams: {
    listingId?: string
    userId?: string
  }
}

export default async function MessagesPage({ searchParams }: PageProps) {
  const session = await getServerSession()
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Fetch all message threads for the current user
  const threads = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id },
        { recipientId: session.user.id },
      ],
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      recipient: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      listing: {
        select: {
          id: true,
          title: true,
          images: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    distinct: ['listingId', 'senderId', 'recipientId'],
  })

  // Group messages by thread
  const groupedThreads = threads.reduce((acc: Record<string, Thread>, message: Message) => {
    const key = `${message.listingId}-${message.senderId}-${message.recipientId}`
    if (!acc[key]) {
      acc[key] = {
        listing: message.listing,
        otherUser: message.senderId === session.user.id ? message.recipient : message.sender,
        lastMessage: message,
      }
    }
    return acc
  }, {})

  // If URL parameters are provided, create a new thread
  if (searchParams.listingId && searchParams.userId) {
    const listing = await prisma.listing.findUnique({
      where: { id: searchParams.listingId },
      select: {
        id: true,
        title: true,
        images: true,
      },
    })

    const otherUser = await prisma.user.findUnique({
      where: { id: searchParams.userId },
      select: {
        id: true,
        name: true,
        image: true,
      },
    })

    if (listing && otherUser) {
      const key = `${listing.id}-${session.user.id}-${otherUser.id}`
      if (!groupedThreads[key]) {
        groupedThreads[key] = {
          listing,
          otherUser,
          lastMessage: {
            id: '',
            listingId: listing.id,
            senderId: session.user.id,
            recipientId: otherUser.id,
            content: '',
            createdAt: new Date(),
            sender: {
              id: session.user.id,
              name: session.user.name,
              image: session.user.image,
            },
            recipient: otherUser,
            listing,
          },
        }
      }
    }
  }

  return <MessagesPageClient threads={Object.values(groupedThreads)} />
} 