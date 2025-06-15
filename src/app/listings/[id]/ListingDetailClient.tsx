'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { useSession } from 'next-auth/react'
import ReviewForm from '@/components/reviews/ReviewForm'
import ReviewList from '@/components/reviews/ReviewList'

interface User {
  id: string
  name: string | null
  image: string | null
}

interface Category {
  name: string
}

interface Listing {
  id: string
  title: string
  description: string
  price: number
  condition: string
  images: string[]
  status: string
  createdAt: Date
  userId: string
  user: User
  category: Category
}

interface ListingDetailClientProps {
  listing: Listing
}

export default function ListingDetailClient({ listing }: ListingDetailClientProps) {
  const { data: session } = useSession()
  const isOwner = session?.user?.id === listing.userId
  const [showReviewForm, setShowReviewForm] = useState(false)

  const handleMarkAsSold = async () => {
    try {
      await fetch(`/api/listings/${listing.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'sold' }),
      })
      window.location.reload()
    } catch (error) {
      console.error('Error marking listing as sold:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative h-96 rounded-lg overflow-hidden">
            {listing.images[0] ? (
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          {listing.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {listing.images.slice(1).map((image: string, index: number) => (
                <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${listing.title} - Image ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
              {isOwner && (
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                    listing.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : listing.status === 'sold'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </span>
                  {listing.status === 'available' && (
                    <button
                      onClick={handleMarkAsSold}
                      className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Mark as Sold
                    </button>
                  )}
                </div>
              )}
            </div>
            <p className="text-lg text-gray-500 mt-1">{listing.category.name}</p>
          </div>

          <div className="flex items-center space-x-4">
            {listing.user.image ? (
              <Image
                src={listing.user.image}
                alt={listing.user.name || 'User'}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {listing.user.name || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-500">
                Posted {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900">Description</h2>
            <p className="mt-2 text-gray-600 whitespace-pre-wrap">{listing.description}</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900">Details</h2>
            <dl className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Price</dt>
                <dd className="mt-1 text-lg font-medium text-gray-900">
                  ${listing.price}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Condition</dt>
                <dd className="mt-1 text-lg font-medium text-gray-900 capitalize">
                  {listing.condition}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-4">
              {session && !isOwner && listing.status === 'available' && (
                <Link
                  href={`/messages?listingId=${listing.id}&userId=${listing.user.id}`}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Message Seller
                </Link>
              )}
              <Link
                href="/listings"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Listings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          {session && listing.status === 'sold' && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          )}
        </div>

        {showReviewForm && (
          <div className="mt-6">
            <ReviewForm
              listingId={listing.id}
              reviewedId={isOwner ? session?.user?.id! : listing.userId}
              onSubmit={() => {
                setShowReviewForm(false)
                window.location.reload()
              }}
            />
          </div>
        )}

        <div className="mt-6">
          <ReviewList listingId={listing.id} />
        </div>
      </div>
    </div>
  )
} 