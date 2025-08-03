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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Ensure Farcaster SDK is properly initialized
              (function() {
                if (typeof window !== 'undefined') {
                  // Check if we're in a Farcaster environment
                  const isFarcasterEnv = window.location.hostname.includes('warpcast') || 
                                        window.location.hostname.includes('farcaster') ||
                                        window.location.hostname.includes('localhost');
                  
                  if (isFarcasterEnv) {
                    console.log('Farcaster environment detected');
                    
                    // Try to call ready() as soon as SDK is available
                    const tryReady = () => {
                      if (window.farcaster && window.farcaster.actions && window.farcaster.actions.ready) {
                        window.farcaster.actions.ready().then(() => {
                          console.log('Farcaster SDK ready() called from head script');
                        }).catch((err) => {
                          console.error('Error calling Farcaster SDK ready() from head script:', err);
                        });
                        return true;
                      }
                      return false;
                    };
                    
                    // Try immediately
                    if (!tryReady()) {
                      // Poll for SDK availability
                      let attempts = 0;
                      const maxAttempts = 100; // 5 seconds at 50ms intervals
                      
                      const pollForSDK = () => {
                        attempts++;
                        if (tryReady() || attempts >= maxAttempts) {
                          return;
                        }
                        setTimeout(pollForSDK, 50);
                      };
                      
                      pollForSDK();
                    }
                  }
                }
              })();
            `,
          }}
        />
      </head>
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
