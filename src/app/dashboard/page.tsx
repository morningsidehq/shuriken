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

  // Handle errors or no user
  if (error || !user) {
    redirect('/login')
  }

  return (
    <>
      <Header />
      <div className="morningside-container py-8">
        <div className="morningside-card duration-400 text-center animate-in fade-in">
          <h1 className="mb-4 text-2xl font-semibold">
            Welcome to the Constance Dashboard
          </h1>
          <p className="mb-4 text-muted-foreground">
            Logged in as: {user.email}
          </p>
          <Image
            src="/ms_constance_icon.png"
            alt="Constance Logo"
            width={250}
            height={250}
            priority
            className="mx-auto"
          />
        </div>

        <p className="my-8 text-center text-xl">What would you like to do?</p>

        <div className="morningside-card duration-400 animate-in fade-in">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Link href="/records" className="dashboard-action-card">
              <FaFolder className="mb-3 text-4xl text-primary" />
              <h3 className="text-xl font-semibold">View Records</h3>
            </Link>

            <Link href="/search" className="dashboard-action-card">
              <FaSearch className="mb-3 text-4xl text-primary" />
              <h3 className="text-xl font-semibold">Search Records</h3>
            </Link>

            <Link href="/actions" className="dashboard-action-card">
              <FaPlay className="mb-3 text-4xl text-primary" />
              <h3 className="text-xl font-semibold">My Actions</h3>
            </Link>

            <Link href="/upload" className="dashboard-action-card">
              <FaFastForward className="mb-3 text-4xl text-primary" />
              <h3 className="text-xl font-semibold">Upload a Quick Record</h3>
            </Link>

            <Link
              href="/upload/adv_record_creation"
              className="dashboard-action-card"
            >
              <FaFileUpload className="mb-3 text-4xl text-primary" />
              <h3 className="text-xl font-semibold">
                Upload an Advanced Record
              </h3>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
