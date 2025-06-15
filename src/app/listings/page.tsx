import { prisma } from '@/lib/prisma'
import ListingCard from '@/components/listings/ListingCard'
import SearchBar from '@/components/listings/SearchBar'
import FilterBar from '@/components/listings/FilterBar'
import { Listing, User, Category } from '@prisma/client'

interface PageProps {
  searchParams: {
    q?: string
    category?: string
    condition?: string
    sort?: string
  }
}

type ListingWithRelations = Listing & {
  category: Pick<Category, 'name'>
  user: Pick<User, 'name' | 'image'>
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const { q: query, category, condition, sort } = searchParams

  const where = {
    status: 'active',
    expiresAt: {
      gt: new Date(),
    },
    ...(query && {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    }),
    ...(category && { categoryId: category }),
    ...(condition && { condition }),
  }

  const orderBy = {
    ...(sort === 'oldest' && { createdAt: 'asc' }),
    ...(sort === 'price-low' && { price: 'asc' }),
    ...(sort === 'price-high' && { price: 'desc' }),
    ...(sort === 'newest' || !sort ? { createdAt: 'desc' } : {}),
  }

  const [listings, categories] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    }) as Promise<ListingWithRelations[]>,
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    }),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Listings</h1>
        <a
          href="/listings/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Post a Listing
        </a>
      </div>

      <div className="mb-8 space-y-4">
        <SearchBar />
        <FilterBar categories={categories} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            description={listing.description}
            price={listing.price || undefined}
            images={listing.images}
            createdAt={listing.createdAt}
            category={listing.category}
            user={listing.user}
          />
        ))}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No listings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {query
              ? 'Try adjusting your search or filters'
              : 'Be the first to post a listing in your community!'}
          </p>
        </div>
      )}
    </div>
  )
} 