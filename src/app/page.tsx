import Header from '@/components/Header'
import Image from 'next/image'
import Link from 'next/link'

export default async function Index() {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
      <Header />

      <div className="flex max-w-4xl flex-1 flex-col gap-20 px-3">
        <main className="flex flex-1 flex-col items-center gap-6">
          <h1 className="mb-4 text-center text-4xl font-bold">Welcome</h1>

          <Image
            src="/ms_constance_icon.png"
            alt="Constance Logo"
            width={300}
            height={300}
            priority
          />

          <h2 className="mt-8 text-2xl font-semibold">Welcome to Constance!</h2>

          <div className="flex items-center gap-4">
            <p className="text-lg">Already a user? Sign in!</p>
            <Link
              href="/login"
              className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Sign In
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-lg">Looking to join Constance? Sign up!</p>
            <Link
              href="/signup"
              className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Sign Up
            </Link>
          </div>
        </main>
      </div>

      <footer className="w-full justify-center border-t border-t-foreground/10 p-8 text-center text-xs"></footer>
    </div>
  )
}
