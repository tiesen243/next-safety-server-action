import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/server/auth'
import { Button } from '@/components/ui/button'

const AuthLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
  const { user } = await auth()
  if (user) redirect('/')

  return (
    <main className="grid min-h-[80dvh] place-items-center">
      <div className="container flex max-w-screen-md flex-col gap-4 rounded-lg border p-6 shadow-lg">
        {children}

        <div className="-mt-2 flex w-full items-center justify-center gap-2">
          <div className="h-0.5 w-full bg-border" /> or <div className="h-0.5 w-full bg-border" />
        </div>

        <Button variant="outline" asChild>
          <Link href="/api/auth/discord">Continue with Discord</Link>
        </Button>
      </div>
    </main>
  )
}

export default AuthLayout
