'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { StarIcon } from '@heroicons/react/24/solid'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  reviewer: {
    name: string | null
    image: string | null
  }
  listing: {
    title: string
  }
}

interface ReviewListProps {
  userId?: string
  listingId?: string
}

export default function ReviewList({ userId, listingId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const params = new URLSearchParams()
        if (userId) params.append('userId', userId)
        if (listingId) params.append('listingId', listingId)

        const response = await fetch(`/api/reviews?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch reviews')
        }

        const data = await response.json()
        setReviews(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [userId, listingId])

  if (isLoading) {
    return <div>Loading reviews...</div>
  }

  if (error) {
    return <div className="text-red-600">{error}</div>
  }

  if (reviews.length === 0) {
    return <div>No reviews yet</div>
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-4">
            {review.reviewer.image ? (
              <Image
                src={review.reviewer.image}
                alt={review.reviewer.name || 'User'}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {review.reviewer.name || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <StarIcon
                  key={value}
                  className={`h-5 w-5 ${
                    value <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            {review.comment && (
              <p className="mt-2 text-gray-600">{review.comment}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              For: {review.listing.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
} 