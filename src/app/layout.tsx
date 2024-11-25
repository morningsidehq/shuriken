import { GeistSans } from 'geist/font/sans'
import ThemeProvider from '@/providers/ThemeProvider'
import NextTopLoader from 'nextjs-toploader'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import Footer from '@/components/Footer'
import SupabaseProvider from '@/providers/SupabaseProvider'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'

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

  return (
    <html
      lang="en"
      className={GeistSans.className}
      style={{ colorScheme: 'dark' }}
    >
      <body className="bg-[hsl(var(--page-background))] text-foreground">
        <NextTopLoader showSpinner={false} height={2} color="#2acf80" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider session={session}>
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
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
