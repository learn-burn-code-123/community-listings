import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    const { rating, comment, reviewedId, listingId } = body

    if (!rating || !reviewedId || !listingId) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Check if the listing exists and is sold
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        user: true,
      },
    })

    if (!listing) {
      return new NextResponse('Listing not found', { status: 404 })
    }

    if (listing.status !== 'sold') {
      return new NextResponse('Cannot review an unsold listing', { status: 400 })
    }

    // Check if the reviewer is either the buyer or seller
    if (session.user.id !== listing.userId && session.user.id !== reviewedId) {
      return new NextResponse('Unauthorized to review this listing', { status: 401 })
    }

    // Check if a review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        listingId,
        reviewerId: session.user.id,
      },
    })

    if (existingReview) {
      return new NextResponse('You have already reviewed this listing', { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        reviewerId: session.user.id,
        reviewedId,
        listingId,
      },
      include: {
        reviewer: {
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

    // Create notification for the reviewed user
    await prisma.notification.create({
      data: {
        userId: reviewedId,
        type: 'review',
        title: 'New Review',
        message: `${review.reviewer.name} left you a ${rating}-star review for "${review.listing.title}"`,
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error creating review:', error)
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
    const userId = searchParams.get('userId')
    const listingId = searchParams.get('listingId')

    if (!userId && !listingId) {
      return new NextResponse('Missing required parameters', { status: 400 })
    }

    const reviews = await prisma.review.findMany({
      where: {
        ...(userId ? { reviewedId: userId } : {}),
        ...(listingId ? { listingId } : {}),
      },
      include: {
        reviewer: {
          select: {
            name: true,
            image: true,
          },
        },
        listing: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 