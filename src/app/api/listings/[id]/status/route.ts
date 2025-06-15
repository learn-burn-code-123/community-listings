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
    const { status } = body

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!listing) {
      return new NextResponse('Listing not found', { status: 404 })
    }

    if (listing.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: { status },
    })

    // Create notification for the seller
    if (status === 'sold') {
      await prisma.notification.create({
        data: {
          userId: listing.userId,
          type: 'listing_sold',
          title: 'Listing Sold',
          message: `Your listing "${listing.title}" has been marked as sold.`,
        },
      })
    }

    return NextResponse.json(updatedListing)
  } catch (error) {
    console.error('Error updating listing status:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 