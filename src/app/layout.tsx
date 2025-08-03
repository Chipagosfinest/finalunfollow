import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { FarcasterProvider } from "@/components/FarcasterProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unfollow Tool",
  description: "Unfollow on Farcaster - Analyze your follows and identify who to unfollow",
  openGraph: {
    title: "Unfollow Tool",
    description: "Unfollow on Farcaster - Analyze your follows and identify who to unfollow",
    url: "https://unfollow.vercel.app",
    siteName: "Unfollow Tool",
    images: [
      {
        url: "https://unfollow.vercel.app/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Unfollow Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unfollow Tool",
    description: "Unfollow on Farcaster - Analyze your follows and identify who to unfollow",
    images: ["https://unfollow.vercel.app/thumbnail.png"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://unfollow.vercel.app/embed-thumbnail.png",
    "fc:frame:button:1": "Try Unfollow Tool",
    "fc:frame:post_url": "https://unfollow.vercel.app/embed",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FarcasterProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </FarcasterProvider>
      </body>
    </html>
  );
}
