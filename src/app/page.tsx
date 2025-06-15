import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Network School Community Listings
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured Categories */}
          <Link href="/listings/gigs" className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Gigs</h2>
            <p className="text-gray-600">Find or post local opportunities</p>
          </Link>
          
          <Link href="/listings/gadgets" className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Gadgets</h2>
            <p className="text-gray-600">Buy and sell tech equipment</p>
          </Link>
          
          <Link href="/listings/clothing" className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Clothing</h2>
            <p className="text-gray-600">Fashion and accessories</p>
          </Link>
          
          <Link href="/listings/food" className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Food & Drink</h2>
            <p className="text-gray-600">Local food and beverages</p>
          </Link>
          
          <Link href="/listings/books" className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Books</h2>
            <p className="text-gray-600">Textbooks and literature</p>
          </Link>
          
          <Link href="/listings/sports" className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Sports</h2>
            <p className="text-gray-600">Equipment and activities</p>
          </Link>
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/listings/new" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Post a New Listing
          </Link>
        </div>
      </div>
    </main>
  )
}
