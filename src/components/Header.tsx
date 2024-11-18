import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import LogoutButton from './LogoutButton'

export default async function Header() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background shadow-sm transition-shadow duration-200 ease-in-out hover:shadow-md">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-semibold">
            Constance
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-foreground/80"
              >
                Dashboard
              </Link>
              <Link
                href="/records"
                className="text-sm font-medium hover:text-foreground/80"
              >
                Records
              </Link>
              <Link
                href="/search"
                className="text-sm font-medium hover:text-foreground/80"
              >
                Search
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium hover:text-foreground/80"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
