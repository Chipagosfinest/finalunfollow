import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { FarcasterProvider } from '@/components/FarcasterProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Unfollow Tool - Farcaster Mini App',
  description: 'Analyze your Farcaster follows and identify who to unfollow. Find inactive users, spam accounts, and users who don\'t follow you back.',
  openGraph: {
    title: 'Unfollow Tool - Farcaster Mini App',
    description: 'Analyze your Farcaster follows and identify who to unfollow. Find inactive users, spam accounts, and users who don\'t follow you back.',
    url: 'https://unfollow-tool.vercel.app',
    siteName: 'Unfollow Tool',
    images: [
      {
        url: 'https://unfollow-tool.vercel.app/thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Unfollow Tool - Farcaster Mini App',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unfollow Tool - Farcaster Mini App',
    description: 'Analyze your Farcaster follows and identify who to unfollow. Find inactive users, spam accounts, and users who don\'t follow you back.',
    images: ['https://unfollow-tool.vercel.app/thumbnail.png'],
  },
  other: {
    // Mini App meta tags
    'fc:miniapp': 'https://unfollow-tool.vercel.app',
    'fc:miniapp:version': '1.0.0',
    'fc:miniapp:image': 'https://unfollow-tool.vercel.app/thumbnail.png',
    'fc:miniapp:button': 'Analyze Follows',
    'fc:miniapp:action': 'https://unfollow-tool.vercel.app/embed',
    // Embed meta tags for feed sharing
    'fc:frame': 'https://unfollow-tool.vercel.app',
    'fc:frame:image': 'https://unfollow-tool.vercel.app/thumbnail.png',
    'fc:frame:button:1': 'Analyze Follows',
    'fc:frame:post_url': 'https://unfollow-tool.vercel.app/embed',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FarcasterProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </FarcasterProvider>
      </body>
    </html>
  )
}
