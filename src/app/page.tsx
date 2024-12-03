/**
 * Main landing page component for the Constance application.
 * For more details on the landing page structure, see Pages Structure section in app-documentation.md
 */

export const dynamic = 'force-dynamic'

// Add this middleware config to explicitly mark as public
export const middleware = {
  skipAuth: true,
}

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import Link from 'next/link'

/**
 * Index component that renders the landing page with login/signup options
 * @returns JSX.Element A page with header and centered card containing authentication options
 */
export default async function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Main content section with centered card */}
        <section className="container flex items-center justify-center py-10">
          <Card className="w-[400px]">
            {/* Card header with title and description */}
            <CardHeader className="space-y-1">
              <CardTitle className="text-center text-2xl font-semibold">
                Welcome to Constance
              </CardTitle>
              <CardDescription className="text-center">
                Your document management solution
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* Constance logo container */}
              <div className="flex justify-center">
                <Image
                  src="/ms_constance_icon.png"
                  alt="Constance Logo"
                  width={120}
                  height={120}
                  priority
                  className="h-auto w-auto"
                />
              </div>

              <div className="grid gap-4">
                {/* Sign in section */}
                <div className="flex flex-col space-y-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already a user?
                  </p>
                  <Button asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>

                {/* Divider with "Or" text */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>

                {/* Sign up section */}
                <div className="flex flex-col space-y-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    Looking to join Constance?
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/signup">Create an account</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
