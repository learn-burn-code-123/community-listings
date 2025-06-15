import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ListingDetailClient from './ListingDetailClient'

interface PageProps {
  params: {
    id: string
  }
}

export default async function ListingPage({ params }: PageProps) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!listing) {
    notFound()
  }

  return <ListingDetailClient listing={listing} />
} 