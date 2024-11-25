import Header from '@/components/Header'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <Card className="mx-auto max-w-[850px]">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold">
                Welcome
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <Image
                src="/ms_constance_icon.png"
                alt="Constance Logo"
                width={200}
                height={200}
                priority
                className="h-auto w-auto"
              />

              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Welcome to Constance!
              </h2>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="text-muted-foreground">Already a user?</p>
                <Button asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="text-muted-foreground">
                  Looking to join Constance?
                </p>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
