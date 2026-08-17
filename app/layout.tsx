import './globals.css'

export const metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: {
    default: 'Dine & Dash | Food & Ride Services in Addis Ababa',
    template: '%s | Dine & Dash',
  },
  description: 'Order your favorite food and book rides instantly with Dine & Dash. Fast delivery and reliable transport all in one app.',
  keywords: ['food delivery Addis Ababa', 'ride hailing Addis Ababa', 'Dine and Dash app', 'order food online'],
  authors: [{ name: 'Henon Samuel' }],
  creator: 'Henon Samuel',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    title: 'Dine & Dash | Food & Ride Services',
    description: 'Order food and book rides instantly in Addis Ababa.',
    siteName: 'Dine & Dash',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dine & Dash Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dine & Dash',
    description: 'Food ordering and ride-hailing app.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="PASTE_YOUR_CODE_HERE" />
      </head>
      <body>{children}</body>
    </html>
  )
}