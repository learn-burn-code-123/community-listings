import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { Listing } from '@prisma/client'

interface UserWithListings {
  id: string
  name: string | null
  email: string | null
  image: string | null
  createdAt: Date
  listings: Listing[]
}

export default async function ProfilePage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      listings: {
        where: {
          status: 'active',
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  }) as UserWithListings | null

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center space-x-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'Profile'}
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">My Active Listings</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {user.listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                          <h3 className="truncate text-sm font-medium text-gray-900">
                            {listing.title}
                          </h3>
                        </div>
                        <p className="mt-1 truncate text-sm text-gray-500">
                          {listing.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/listings/${listing.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        View listing
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {user.listings.length === 0 && (
                <p className="mt-4 text-sm text-gray-500">No active listings</p>
              )}
            </div>

            <div className="mt-8">
              <Link
                href="/listings/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create New Listing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 