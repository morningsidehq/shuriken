import { GeistSans } from 'geist/font/sans'
import ThemeProvider from '@/providers/ThemeProvider'
import NextTopLoader from 'nextjs-toploader'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import Footer from '@/components/Footer'
import SupabaseProvider from '@/providers/SupabaseProvider'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { cn } from '@/lib/utils'
import BackToTop from '@/components/BackToTop'
import Header from '@/components/Header'
import { headers } from 'next/headers'
import { Toaster } from '@/components/ui/toaster'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Constance',
  description: 'A Morningside HQ App',
  icons: {
    icon: '/ms_constance_icon.png',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Simplify header visibility logic - only hide on auth pages
  const headersList = await headers()
  const pathname = headersList.get('next-url') || '/'
  const hideHeaderPaths = ['/login', '/signup', '/reset-password']
  const shouldShowHeader = !hideHeaderPaths.some((path) =>
    pathname.startsWith(path),
  )

  return (
    <html
      lang="en"
      className={cn(GeistSans.className, 'antialiased')}
      suppressHydrationWarning
    >
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          'transition-colors duration-200',
        )}
      >
        <NextTopLoader showSpinner={false} height={2} color="#2acf80" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SupabaseProvider session={session}>
            <ReactQueryProvider>
              <div className="relative flex min-h-screen flex-col">
                {shouldShowHeader && <Header />}
                <main className="flex-1">{children}</main>
                <Analytics />
                <Footer />
                <BackToTop />
              </div>
            </ReactQueryProvider>
          </SupabaseProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
