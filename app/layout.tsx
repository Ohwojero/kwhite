import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  applicationName: 'ClickToChat',
  title: 'ClickToChat — Where good stuff happens',
  description: 'Connect with ClickToChat across TikTok, WhatsApp, Facebook, and Instagram. Big ideas, honest conversations, always in motion.',
  keywords: ['ClickToChat', 'social media', 'TikTok', 'Instagram', 'WhatsApp', 'Facebook', 'community'],
  authors: [{ name: 'ClickToChat' }],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ClickToChat',
  },
  openGraph: {
    title: 'ClickToChat — Where good stuff happens',
    description: 'Connect with ClickToChat across all your favourite platforms.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'ClickToChat',
    description: 'Connect with ClickToChat across all your favourite platforms.',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-light-32x32.png', sizes: '32x32', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', sizes: '32x32', media: '(prefers-color-scheme: dark)' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180' },
    shortcut: '/icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#2c3e50',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js').catch(function () {
                    // Service worker registration is optional; continue normally if it fails.
                  })
                })
              }
            `,
          }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
