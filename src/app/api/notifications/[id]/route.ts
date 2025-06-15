import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    const { read } = body

    const notification = await prisma.notification.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        read,
      },
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Error updating notification:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 