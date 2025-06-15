# Community Listings

A modern marketplace application built with Next.js, Prisma, and Tailwind CSS.

## Features

- 🔐 Authentication with NextAuth.js
- 📱 Responsive design with Tailwind CSS
- 💬 Real-time messaging system
- 🔔 Notification system
- ⭐ Review system for completed transactions
- 🔍 Advanced search and filtering
- 📸 Image upload support
- 📱 Mobile-first design

## Tech Stack

- **Framework:** Next.js 14
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **UI Components:** Headless UI
- **Icons:** Heroicons
- **Date Formatting:** date-fns

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/learn-burn-code-123/community-listings.git
   cd community-listings
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/community_listings"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
community-listings/
├── prisma/              # Database schema and migrations
├── public/             # Static assets
├── src/
│   ├── app/           # Next.js app directory
│   │   ├── api/       # API routes
│   │   ├── auth/      # Authentication pages
│   │   ├── listings/  # Listing pages
│   │   └── messages/  # Messaging pages
│   ├── components/    # React components
│   ├── lib/          # Utility functions
│   └── types/        # TypeScript type definitions
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
