import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Link from 'next/link'
import {
  FaFolder,
  FaSearch,
  FaFastForward,
  FaFileUpload,
  FaPlay,
  FaGlobe,
  FaBuilding,
} from 'react-icons/fa'
import Image from 'next/image'

export const metadata = {
  title: 'Constance - Dashboard',
}

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('user_group')
    .eq('id', user.id)
    .single()

  return (
    <>
      <Header />
      <div className="container py-10">
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

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="group relative">
            <div className="invisible absolute bottom-full left-0 z-10 flex w-full gap-4 pb-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
              <Link
                href="/records"
                className="flex w-full flex-col items-center justify-center rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <FaGlobe className="mb-3 h-8 w-8" />
                <h3 className="font-semibold">Public Records</h3>
              </Link>
              <Link
                href="/records/agencyrecords"
                className="flex w-full flex-col items-center justify-center rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <FaBuilding className="mb-3 h-8 w-8" />
                <h3 className="font-semibold">Agency Records</h3>
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
              <FaFolder className="mb-3 h-8 w-8" />
              <h3 className="font-semibold">View Records</h3>
            </div>
          </div>

          <Link
            href="/search"
            className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <FaSearch className="mb-3 h-8 w-8" />
            <h3 className="font-semibold">Search Records</h3>
          </Link>

          <Link
            href="/actions"
            className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <FaPlay className="mb-3 h-8 w-8" />
            <h3 className="font-semibold">My Actions</h3>
          </Link>

          <Link
            href="/upload"
            className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <FaFastForward className="mb-3 h-8 w-8" />
            <h3 className="font-semibold">Quick Record</h3>
          </Link>

          <Link
            href="/upload/adv_record_creation"
            className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <FaFileUpload className="mb-3 h-8 w-8" />
            <h3 className="font-semibold">Advanced Record</h3>
          </Link>
        </div>
      </div>
    </>
  )
}
