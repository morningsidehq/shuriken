'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSupabase } from '@/providers/SupabaseProvider'
import { useEffect, useState } from 'react'
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
import { FaUsers } from 'react-icons/fa'

interface UserData {
  user_role: number
}

function HeaderClient() {
  const { supabase } = useSupabase()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function loadUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', user.id)
          .single()

        setUserData(data)
        setIsAdmin(data?.user_role === 7)
      }
    }

    loadUserData()
  }, [supabase])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link
            href={userData ? '/dashboard' : '/'}
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

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {userData ? (
            <nav className="flex items-center">
              <div className="flex space-x-2">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href="/dashboard" legacyBehavior passHref>
                        <NavigationMenuLink className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                          Home
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href="/assistant/search" legacyBehavior passHref>
                        <NavigationMenuLink className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                          Search
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href="/upload" legacyBehavior passHref>
                        <NavigationMenuLink className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                          Upload
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href="/assistant/create" legacyBehavior passHref>
                        <NavigationMenuLink className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                          Create
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

                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href="/analytics" legacyBehavior passHref>
                        <NavigationMenuLink className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                          Analytics
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                {userData && isAdmin && (
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <Link href="/user-management" legacyBehavior passHref>
                          <NavigationMenuLink className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                            <FaUsers className="mr-2 h-4 w-4" />
                            User Management
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                )}
              </div>
            </nav>
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
      </div>
    </header>
  )
}

export default HeaderClient
