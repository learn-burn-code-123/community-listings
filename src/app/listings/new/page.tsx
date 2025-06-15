import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ListingForm from '@/components/listings/ListingForm'

export default async function NewListingPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/auth/signin')
  }

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Listing</h1>
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ListingForm
              categories={categories}
              onSubmit={async (data) => {
                'use server'
                await prisma.listing.create({
                  data: {
                    ...data,
                    userId: session.user.id,
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                  },
                })
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 