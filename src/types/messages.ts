export interface User {
  id: string
  name: string | null
  image: string | null
}

export interface Listing {
  id: string
  title: string
  images: string[]
}

export interface Message {
  id: string
  listingId: string
  senderId: string
  recipientId: string
  sender: User
  recipient: User
  listing: Listing
  content: string
  createdAt: Date
}

export interface Thread {
  listing: Listing
  otherUser: User
  lastMessage: Message
} 