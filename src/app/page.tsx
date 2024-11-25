import Header from '@/components/Header'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function Index() {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
      <Header />

      <div className="flex max-w-4xl flex-1 flex-col gap-20 px-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-4xl">Welcome</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <Image
              src="/ms_constance_icon.png"
              alt="Constance Logo"
              width={300}
              height={300}
              priority
            />

            <h2 className="mt-8 text-2xl font-semibold">
              Welcome to Constance!
            </h2>

            <div className="flex items-center gap-4">
              <p className="text-lg">Already a user? Sign in!</p>
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-lg">Looking to join Constance? Sign up!</p>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
