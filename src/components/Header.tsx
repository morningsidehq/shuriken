import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import LogoutButton from './LogoutButton'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

export default async function Header() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background shadow-sm transition-shadow duration-200 ease-in-out hover:shadow-md">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2">
          <Link
            href={user ? '/dashboard' : '/'}
            className="hover:scale-103 flex items-center gap-2 transition-transform duration-200"
          >
            <Image
              src="/ms_constance_icon.png"
              alt="Constance Logo"
              width={24}
              height={24}
            />
            <span className="text-xl font-semibold">Constance</span>
          </Link>
        </div>

        {user ? (
          <div className="flex flex-1 items-center justify-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/dashboard" legacyBehavior passHref>
                    <NavigationMenuLink className="hover:scale-103 text-sm font-medium transition-transform duration-200 hover:text-foreground/80">
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:scale-103 text-sm font-medium">
                    Records
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-48 rounded-md bg-popover p-2 shadow-md">
                      <li>
                        <Link
                          href="/records"
                          className="block rounded-md px-4 py-2 text-sm text-foreground hover:bg-accent"
                        >
                          Public Records
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/records/agencyrecords"
                          className="block rounded-md px-4 py-2 text-sm text-foreground hover:bg-accent"
                        >
                          Agency Records
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/search" legacyBehavior passHref>
                    <NavigationMenuLink className="hover:scale-103 text-sm font-medium transition-transform duration-200 hover:text-foreground/80">
                      Search
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:scale-103 text-sm font-medium">
                    Upload
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-48 rounded-md bg-popover p-2 shadow-md">
                      <li>
                        <Link
                          href="/upload"
                          className="block rounded-md px-4 py-2 text-sm text-foreground hover:bg-accent"
                        >
                          Quick Intake
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/upload/adv_record_creation"
                          className="block rounded-md px-4 py-2 text-sm text-foreground hover:bg-accent"
                        >
                          Record Creation
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:scale-103 text-sm font-medium">
                    Actions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-48 rounded-md bg-popover p-2 shadow-md">
                      <li>
                        <Link
                          href="/actions"
                          className="block rounded-md px-4 py-2 text-sm text-foreground hover:bg-accent"
                        >
                          View Actions
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/actions?new=true"
                          className="block rounded-md px-4 py-2 text-sm text-foreground hover:bg-accent"
                        >
                          Create New Action
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        ) : (
          <nav className="flex flex-1 items-center justify-center">
            <Link
              href="/login"
              className="hover:scale-103 text-sm font-medium transition-transform duration-200 hover:text-foreground/80"
            >
              Login
            </Link>
          </nav>
        )}

        {user && (
          <div className="flex items-center">
            <LogoutButton />
          </div>
        )}
      </div>
    </header>
  )
}
