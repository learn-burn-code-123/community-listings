import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession()

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    const { userId, type, title, message } = body

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
      },
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Error creating notification:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 