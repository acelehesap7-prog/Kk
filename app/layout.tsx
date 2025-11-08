import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Providers } from './providers'
import Navbar from '@/components/layout/navbar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'KK Exchange',
  description: 'Tüm finansal piyasalar tek platformda',
  keywords: ['trading', 'crypto', 'forex', 'stocks', 'market data', 'real-time'],
  authors: [{ name: 'Your Name' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${inter.variable} font-sans h-full antialiased`} suppressHydrationWarning>
      <body className="h-full bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}