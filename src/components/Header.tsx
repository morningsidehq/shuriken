import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import LogoutButton from './LogoutButton'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

export default async function Header() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background shadow-sm transition-shadow duration-200 ease-in-out hover:shadow-md">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/ms_constance_icon.png"
              alt="Constance Logo"
              width={24}
              height={24}
            />
            <span className="text-xl font-semibold">Constance</span>
          </Link>
        </div>

        <nav className="flex flex-1 items-center justify-center gap-8">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-foreground/80"
              >
                Home
              </Link>
              <div className="group relative">
                <button
                  className="flex items-center gap-1 py-2 text-sm font-medium hover:text-foreground/80"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Records
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div
                  className="invisible absolute left-0 top-full w-48 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="rounded-md bg-white py-2 shadow-lg">
                    <Link
                      href="/records"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Public Records
                    </Link>
                    <Link
                      href="/records/agencyrecords"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Agency Records
                    </Link>
                  </div>
                </div>
              </div>
              <Link
                href="/search"
                className="text-sm font-medium hover:text-foreground/80"
              >
                Search
              </Link>
              <div className="group relative">
                <button
                  className="flex items-center gap-1 py-2 text-sm font-medium hover:text-foreground/80"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Upload
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div
                  className="invisible absolute left-0 top-full w-48 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="rounded-md bg-white py-2 shadow-lg">
                    <Link
                      href="/upload"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Quick Intake
                    </Link>
                    <Link
                      href="/upload/adv_record_creation"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Record Creation
                    </Link>
                  </div>
                </div>
              </div>
              <div className="group relative">
                <button
                  className="flex items-center gap-1 py-2 text-sm font-medium hover:text-foreground/80"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Actions
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div
                  className="invisible absolute left-0 top-full w-48 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="rounded-md bg-white py-2 shadow-lg">
                    <Link
                      href="/actions"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      View Actions
                    </Link>
                    <Link
                      href="/actions?new=true"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Create New Action
                    </Link>
                  </div>
                </div>
              </div>
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

        {session && (
          <div className="flex items-center">
            <LogoutButton />
          </div>
        )}
      </div>
    </header>
  )
}
