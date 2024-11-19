import { GeistSans } from 'geist/font/sans'
import ThemeProvider from '@/providers/ThemeProvider'
import NextTopLoader from 'nextjs-toploader'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import Footer from '@/components/Footer'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export async function generateMetadata() {
  return {
    metadataBase: new URL(defaultUrl),
    title: 'Constance',
    description: 'A Morningside HQ App',
    icons: {
      icon: '/ms_constance_icon.png',
    },
  }
}

export const dynamic = 'force-dynamic'

export const runtime = 'edge'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={GeistSans.className}
      style={{ colorScheme: 'dark' }}
    >
      <head>
        <link
          rel="preload"
          href="https://rsms.me/inter/inter.css"
          as="style"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://rsms.me/inter/inter.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-background text-foreground">
        <NextTopLoader showSpinner={false} height={2} color="#2acf80" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <main className="flex min-h-screen flex-col items-center">
              {children}
              <Analytics />
              <Footer />
            </main>
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
