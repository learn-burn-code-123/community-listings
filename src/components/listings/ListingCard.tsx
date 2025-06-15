'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface ListingCardProps {
  id: string
  title: string
  description: string
  price: number
  condition: string
  images: string[]
  createdAt: Date
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

export default function ListingCard({
  id,
  title,
  description,
  price,
  condition,
  images,
  createdAt,
  user,
}: ListingCardProps) {
  const { data: session } = useSession()

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="relative h-48">
        {images[0] ? (
          <Image
            src={images[0]}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200" />
          )}
          <span className="text-sm text-gray-500">{user.name || 'Anonymous'}</span>
        </div>
        <Link href={`/listings/${id}`} className="block">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
        </Link>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium text-gray-900">${price}</p>
            <p className="text-sm text-gray-500 capitalize">{condition}</p>
          </div>
          <div className="flex items-center space-x-2">
            {session && session.user.id !== user.id && (
              <Link
                href={`/messages?listingId=${id}&userId=${user.id}`}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Message
              </Link>
            )}
            <Link
              href={`/listings/${id}`}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Details
            </Link>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Posted {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  )
} 