# Network School Community Listings

A modern marketplace application for the Network School community, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User Authentication with Google Sign-in
- Create, edit, and delete listings
- Multiple categories (Gigs, Gadgets, Clothing, Food & Drink, Books, Sports, and Community)
- Rich text editor for descriptions
- Multiple image upload
- Real-time messaging system
- Advanced search and filtering
- User profiles and ratings
- Safety and moderation features

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Upload**: UploadThing
- **Maps**: Mapbox
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials
- Mapbox API key
- UploadThing account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/community_listings"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# UploadThing
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=""
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/community-listings.git
   cd community-listings
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Deployment

The application can be deployed to platforms like Vercel, Netlify, or Render. Make sure to:

1. Set up all required environment variables
2. Configure the database connection
3. Set up OAuth credentials
4. Configure file upload service
5. Set up Mapbox integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
