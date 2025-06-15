import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    const { listingId, recipientId, content } = body

    if (!content || !listingId || !recipientId) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        listingId,
        senderId: session.user.id,
        recipientId,
        content,
      },
      include: {
        sender: {
          select: {
            name: true,
          },
        },
        listing: {
          select: {
            title: true,
          },
        },
      },
    })

    // Create notification for the recipient
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'message',
        title: 'New Message',
        message: `${message.sender.name} sent you a message about "${message.listing.title}"`,
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error creating message:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(request: Request) {
  const session = await getServerSession()
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listingId')
    const otherUserId = searchParams.get('userId')

    if (!listingId || !otherUserId) {
      return new NextResponse('Missing required parameters', { status: 400 })
    }

    const messages = await prisma.message.findMany({
      where: {
        listingId,
        OR: [
          {
            AND: [
              { senderId: session.user.id },
              { recipientId: otherUserId },
            ],
          },
          {
            AND: [
              { senderId: otherUserId },
              { recipientId: session.user.id },
            ],
          },
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
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 