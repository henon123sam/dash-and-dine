import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dine and Dash',
  description: 'Food Delivery Web App',
  verification: {
    google: 'xtGcIBTWc5ZO630pzd367tkr212d0i9aFXDJh8tahVY',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}