import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import LogoutButton from './LogoutButton'
import Image from 'next/image'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './ThemeToggle'

export default async function Header() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link
            href={user ? '/dashboard' : '/'}
            className="mr-6 flex items-center space-x-2"
          >
            <Image
              src="/ms_constance_icon.png"
              alt="Constance Logo"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <span className="hidden font-bold sm:inline-block">Constance</span>
          </Link>
        </div>

        {user ? (
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center">
              <div className="flex space-x-2">
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
                        <ul className="min-w-[200px] rounded-md border border-border bg-popover p-2 shadow-md">
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

                <NavigationMenu className="mr-2">
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href="/analytics" legacyBehavior passHref>
                        <NavigationMenuLink className="hover:scale-103 text-sm font-medium transition-transform duration-200 hover:text-foreground/80">
                          Analytics
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
                        <ul className="min-w-[200px] rounded-md border border-border bg-popover p-2 shadow-md">
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
                        <ul className="min-w-[200px] rounded-md border border-border bg-popover p-2 shadow-md">
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
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LogoutButton className="px-4" />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-end gap-2 md:flex">
            <ThemeToggle />
            <Link
              href="/login"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
              )}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
