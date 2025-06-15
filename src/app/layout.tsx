import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import Navigation from '@/components/layout/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Network School Community Listings',
  description: 'A modern marketplace for the Network School community',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
