/**
 * Dashboard page component that displays the main navigation interface.
 * For more details on dashboard functionality, see Dashboard section in app-documentation.md
 */

import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  FaFolder,
  FaSearch,
  FaFileUpload,
  FaPlay,
  FaGlobe,
  FaBuilding,
  FaChartBar,
  FaUsers,
  FaEdit,
} from 'react-icons/fa'
import Image from 'next/image'

export const metadata = {
  title: 'Constance - Dashboard',
}

/**
 * Main dashboard page component that handles user authentication and displays navigation options
 * @returns JSX.Element The dashboard interface with navigation cards
 */
export default async function DashboardPage() {
  // Initialize Supabase client with cookies
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get authenticated user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // Redirect to login if no authenticated user
  if (error || !user) {
    redirect('/login')
  }

  // Fetch user profile data including group membership
  const { data: userData } = await supabase
    .from('profiles')
    .select('user_group, user_role')
    .eq('id', user.id)
    .single()

  const isAdmin = userData?.user_role === 7

  return (
    <div className="container py-10">
      {/* User information section */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Image
            src="/ms_constance_icon.png"
            alt="Constance Logo"
            width={40}
            height={40}
            priority
            className="h-10 w-10"
          />
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>

        <p className="text-muted-foreground">
          {user.email && (
            <>
              Signed in as {user.email}
              {userData?.user_group && (
                <span className="font-medium">
                  {' '}
                  • {userData.user_group.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              )}
            </>
          )}
        </p>
      </div>

      {/* Navigation cards grid */}
      <div className="mt-8 flex flex-col items-center">
        <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {/* Search card */}
          <Link
            href="/assistant/search"
            className="flex h-[120px] w-[200px] flex-col items-center justify-center rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <FaSearch className="mb-2 h-6 w-6" />
            <h3 className="text-sm font-semibold">Search</h3>
          </Link>

          {/* Upload card */}
          <Link
            href="/upload"
            className="flex h-[120px] w-[200px] flex-col items-center justify-center rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <FaFileUpload className="mb-2 h-6 w-6" />
            <h3 className="text-sm font-semibold">Upload</h3>
          </Link>

          {/* Create card */}
          <Link
            href="/assistant/create"
            className="flex h-[120px] w-[200px] flex-col items-center justify-center rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <FaEdit className="mb-2 h-6 w-6" />
            <h3 className="text-sm font-semibold">Create</h3>
          </Link>

          {/* View Records card with internal options */}
          <div className="group relative h-[120px] w-[200px] border-border">
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm transition-all duration-300 group-hover:opacity-0">
              <FaFolder className="mb-2 h-6 w-6" />
              <h3 className="text-sm font-semibold">View Records</h3>
            </div>
            <div className="absolute inset-0 flex gap-1 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <Link
                href="/records"
                className="flex w-1/2 flex-col items-center justify-center rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <FaGlobe className="mb-2 h-6 w-6" />
                <h3 className="text-sm font-semibold">Public</h3>
              </Link>
              <Link
                href="/records/agencyrecords"
                className="flex w-1/2 flex-col items-center justify-center rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <FaBuilding className="mb-2 h-6 w-6" />
                <h3 className="text-sm font-semibold">Agency</h3>
              </Link>
            </div>
          </div>

          {/* My Actions card */}
          <Link
            href="/actions"
            className="flex h-[120px] w-[200px] flex-col items-center justify-center rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <FaPlay className="mb-2 h-6 w-6" />
            <h3 className="text-sm font-semibold">My Actions</h3>
          </Link>

          {/* Analytics card */}
          <Link
            href="/analytics"
            className="flex h-[120px] w-[200px] flex-col items-center justify-center rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <FaChartBar className="mb-2 h-6 w-6" />
            <h3 className="text-sm font-semibold">Analytics</h3>
          </Link>

          {/* User Management card - centered and conditional */}
          {isAdmin && (
            <div className="col-span-full flex justify-center md:col-span-3">
              <Link
                href="/user-management"
                className="flex h-[120px] w-[200px] flex-col items-center justify-center rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <FaUsers className="mb-2 h-6 w-6" />
                <h3 className="text-sm font-semibold">User Management</h3>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
