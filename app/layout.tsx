import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { MiniKitProvider } from "@/components/minikit-provider"
import { UserProvider } from "@/contexts/user-context"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Forum - Human Verified Community",
  description: "The world's first human-verified forum platform for authentic community discussions",
  icons: {
    icon: [
      { url: "/world-forum-logo.png" },
      { url: "/favicon.png" },
    ],
    shortcut: "/favicon.png",
    apple: "/world-forum-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${dmSans.variable} antialiased`}>
        <MiniKitProvider>
          <UserProvider>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            <Analytics />
          </UserProvider>
        </MiniKitProvider>
      </body>
    </html>
  )
}
