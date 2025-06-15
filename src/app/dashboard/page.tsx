'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* Your dashboard content */}
      </div>
    </ProtectedRoute>
  )
} 