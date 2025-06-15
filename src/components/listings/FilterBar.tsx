'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface FilterBarProps {
  categories: { id: string; name: string }[]
}

export default function FilterBar({ categories }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <select
        value={searchParams.get('category') || ''}
        onChange={(e) => handleFilterChange('category', e.target.value)}
        className="rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get('condition') || ''}
        onChange={(e) => handleFilterChange('condition', e.target.value)}
        className="rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
      >
        <option value="">All Conditions</option>
        <option value="new">New</option>
        <option value="like-new">Like New</option>
        <option value="good">Good</option>
        <option value="fair">Fair</option>
        <option value="poor">Poor</option>
      </select>

      <select
        value={searchParams.get('sort') || ''}
        onChange={(e) => handleFilterChange('sort', e.target.value)}
        className="rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
      >
        <option value="">Sort By</option>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>

      <button
        onClick={() => {
          const params = new URLSearchParams()
          router.push('/listings')
        }}
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        Clear Filters
      </button>
    </div>
  )
} 