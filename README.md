This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database Setup

This project uses **Neon PostgreSQL** for data storage with **Drizzle ORM**.

### Database Schema

- **Users Table**: Stores user information from Clerk authentication
- **Scripts Table**: Stores AI-generated video scripts and audio metadata

### Database Operations

```bash
# Push schema changes to database
npm run db:push

# Open database studio (GUI)
npm run db:studio
```

## Audio File Storage

### File System Storage
- Audio files are saved to: `public/audio/`
- Accessible via: `http://localhost:3000/audio/filename.mp3`

### Database Metadata Storage
- Script content and metadata stored in Neon database
- Audio file URLs and voice settings tracked
- User association for script ownership

## Environment Variables

Create a `.env.local` file with:

```env
# Database
NEXT_PUBLIC_DATABASE_URL=your_neon_database_url

# AI Services
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Text-to-Speech (Optional)
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
